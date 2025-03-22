import os
from typing import List, Dict, Any
import numpy as np

from langchain_community.document_loaders import(
    PyPDFLoader, 
    TextLoader
   
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai.llms import OpenAI
from langchain_openai.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory

class ChangeManagementRAG:
    """RAG system for change management frameworks and case studies"""
    
    def __init__(self, docs_dir: str = "backend/docs", model: str = "gpt-4o-mini"):
        """
        Initialize the RAG system
        
        Args:
            docs_dir: Directory containing framework documents and case studies
            api_key: OpenAI API key
            model: LLM model to use
        """
        
        self.docs_dir = docs_dir
        self.model_name = model
        self.vectorstore = None
        self.qa = None
    
    def load_documents(self) -> List:
        """Load documents from directory"""
        print(f"Loading documents from {self.docs_dir}...")
        print("Available document types:")
        available_docs = os.listdir(self.docs_dir)
        print(available_docs)
        docs = []
        
        # Load PDF files directly from the main directory
        pdf_files = [f for f in available_docs if f.endswith('.pdf')]
        for pdf_file in pdf_files:
            pdf_path = os.path.join(self.docs_dir, pdf_file)
            loader = PyPDFLoader(pdf_path)
            docs.extend(loader.load())
        
        # Add similar code for other document types if needed
        txt_files = [f for f in available_docs if f.endswith('.txt')]
        for txt_file in txt_files:
            txt_path = os.path.join(self.docs_dir, txt_file)
            loader = TextLoader(txt_path)
            docs.extend(loader.load())
        
        # Load any other file types you need
        
        print(f"Loaded {len(docs)} documents")
        return docs
 
    
    def process_documents(self, chunk_size: int = 1000, chunk_overlap: int = 200) -> List:
        """Process documents and split into chunks"""
        docs = self.load_documents()
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ".", " ", ""]
        )
        
        texts = text_splitter.split_documents(docs)
        print(f"Split into {len(texts)} chunks")
        return texts
    
    def build_vectorstore(self, texts: List = None) -> None:
        """Build vector store from document chunks"""
        if texts is None:
            texts = self.process_documents()
        
        # Create embeddings
        embeddings = OpenAIEmbeddings()
        
        # Create vector store
        self.vectorstore = Chroma.from_documents(
            documents=texts,
            embedding=embeddings,
            persist_directory=os.path.join(self.docs_dir, "chroma_db")
        )
        print("Vector store built successfully")
    
    def setup_qa_system(self, custom_prompt: str = None) -> None:
        """Set up the QA system"""
        if self.vectorstore is None:
            self.build_vectorstore()
        
        # Define prompt template
        if custom_prompt is None:
            custom_prompt = """
            You are an AI assistant specializing in organizational change management.
            You have expertise in various frameworks like ADKAR, Lewin's Change Model, Kotter's 8-Step Process, 
            and others. You also have knowledge of numerous case studies across industries.
            
            Use the following context to answer the question. If you don't know the answer, say you don't know.
            Don't try to make up an answer. If the question is not related to change management,
            politely inform the user that you're specialized in change management.
            
            When comparing frameworks, be specific about their differences, strengths, and weaknesses.
            When discussing case studies, highlight the key learnings and how they apply to similar situations.
            
            Context: {context}
            
            Question: {question}
            
            Answer:
            """
        
        PROMPT = PromptTemplate(
            template=custom_prompt,
            input_variables=["context", "question"]
        )
        
    
       
        # Create QA chain
        llm = ChatOpenAI(temperature=0.7, model_name=self.model_name)
        
        self.qa = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(
                search_type="similarity",  # Maximum Marginal Relevance
                search_kwargs={"k": 10}  # Fetch 10 docs, return 5 most relevant
            ),
            chain_type_kwargs={"prompt": PROMPT},
            return_source_documents=True
        )

        print("QA system set up successfully")
    
    def query(self, question: str) -> Dict[str, Any]:
        """Query the system"""
        if self.qa is None:
            self.setup_qa_system()
        
        result = self.qa.invoke({"query": question})
        print("==Raw result==")
        print(result)
        print("=======")
        return result
    
    def compare_frameworks(self, framework1: str, framework2: str) -> Dict[str, Any]:
        """Compare two change management frameworks"""
        comparison_prompt = f"Compare {framework1} and {framework2} in detail. Cover their approach, steps, strengths, weaknesses, and best use cases. Format the answer as a structured comparison."
        return self.query(comparison_prompt)

    
    def find_case_studies(self, industry: str = None, challenge: str = None) -> Dict[str, Any]:
        """Find relevant case studies and return sources"""
        case_study_prompt = "Find relevant change management case studies"
        
        if industry:
            case_study_prompt += f" in the {industry} industry"
        
        if challenge:
            case_study_prompt += f" addressing the challenge of {challenge}"
        
        case_study_prompt += ". Provide a summary of each case study, including situation, approach, results, and key learnings."
        
        result = self.query(case_study_prompt)
        
        # Format the response to include sources
        response = {
            "answer": result["result"],
            "case_studies": []
        }
        
        # Extract source information from source documents
        if "source_documents" in result:
            for doc in result["source_documents"]:
                source_info = {
                    "content": doc.page_content,
                    "source": doc.metadata.get("source", "Unknown source"),
                    "page": doc.metadata.get("page", None)
                }
                response["case_studies"].append(source_info)
        
        return response
    
    def what_if_analysis(self, current_framework: str, alternative_framework: str, scenario: str) -> Dict[str, Any]:
        """Perform what-if analysis for changing frameworks"""
        what_if_prompt = f"""
        Perform a what-if analysis: We are currently using {current_framework} for our change management approach.
        What would happen if we switched to {alternative_framework} in the following scenario: {scenario}
        
        Compare the likely outcomes, risks, benefits, and implementation considerations.
        """
        return self.query(what_if_prompt)