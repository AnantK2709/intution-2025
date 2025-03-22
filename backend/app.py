from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import shutil
from models import CommunicationRequest, DraftReviewRequest, ScoredDraft
from services import create_draft_service, review_draft_service
from rag import ChangeManagementRAG  # Import your ChangeManagementRAG class

# Initialize FastAPI
app = FastAPI(title="MSD Change Management Communication Assistant")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the RAG system
rag = ChangeManagementRAG(docs_dir="docs")

# Pydantic models for RAG request validation
class QueryRequest(BaseModel):
    question: str = Field(..., description="Question about change management")

class FrameworkComparisonRequest(BaseModel):
    framework1: str = Field(..., description="First framework to compare")
    framework2: str = Field(..., description="Second framework to compare")

class TemplateRequest(BaseModel):
    audience: str = Field(..., description="Target audience for the communication")
    change_type: str = Field(..., description="Type of change being implemented")
    phase: str = Field(..., description="Phase of the change process")
    tone: Optional[str] = Field("balanced", description="Tone of the communication")

class CaseStudyRequest(BaseModel):
    industry: Optional[str] = Field(None, description="Industry for case studies")
    challenge: Optional[str] = Field(None, description="Challenge addressed in case studies")

class WhatIfRequest(BaseModel):
    current_framework: str = Field(..., description="Currently used framework")
    alternative_framework: str = Field(..., description="Framework being considered")
    scenario: str = Field(..., description="Scenario for the analysis")

class Source(BaseModel):
    content: str
    source: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[Source] = []

class ComparisonResponse(BaseModel):
    comparison: str
    framework1: str
    framework2: str

class TemplateResponse(BaseModel):
    template: str
    metadata: Dict[str, str]

class CaseStudyResponse(BaseModel):
    case_studies: str
    filters: Dict[str, Optional[str]]
    sources: List[Source] = []

class WhatIfResponse(BaseModel):
    analysis: str
    scenario: Dict[str, str]

class UploadResponse(BaseModel):
    message: str
    file: str
    type: str

class HealthResponse(BaseModel):
    status: str
    rag_initialized: bool

# Initialize RAG on startup
@app.on_event("startup")
async def initialize_rag():
    try:
        rag.build_vectorstore()
        rag.setup_qa_system()
        print("RAG system initialized successfully")
    except Exception as e:
        print(f"Error initializing RAG system: {str(e)}")

# Background task for rebuilding vector store
def rebuild_vectorstore():
    try:
        rag.build_vectorstore()
        print("Vector store rebuilt successfully")
    except Exception as e:
        print(f"Error rebuilding vector store: {str(e)}")

# Existing routes
@app.post("/create_draft", response_model=dict)
async def create_draft(request: CommunicationRequest):
    try:
        return create_draft_service(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/review_draft", response_model=ScoredDraft)
async def review_draft(request: DraftReviewRequest):
    try:
        return review_draft_service(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New RAG-specific routes
@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    try:
        result = rag.query(request.question)
        # Debug the structure of the result
        print(f"Result keys: {result.keys()}")
    
        # Get the answer from the result dict
        answer = result.get('result', 'No answer found')
        
        source_documents = result.get('source_documents', [])
      # Convert source documents to the Source model
        sources = []
        for doc in source_documents:
            sources.append(Source(
                content=doc.page_content,
                source=doc.metadata.get('source', 'Unknown')
            ))
        
        return QueryResponse(answer=answer, sources=sources) 
    
    except Exception as e:
        print(f"Error in query endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/api/compare-frameworks", response_model=ComparisonResponse)
async def compare_frameworks(request: FrameworkComparisonRequest):
    try:
        result = rag.compare_frameworks(request.framework1, request.framework2)
        
        return ComparisonResponse(
            comparison=result['result'],
            framework1=request.framework1,
            framework2=request.framework2
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/case-studies", response_model=CaseStudyResponse)
async def find_case_studies(request: CaseStudyRequest):
    try:
        result = rag.find_case_studies(
            industry=request.industry,
            challenge=request.challenge
        )
        
        # Structure has changed - now result contains 'answer' and 'case_studies'
        return CaseStudyResponse(
            case_studies=result['answer'],
            filters={
                "industry": request.industry,
                "challenge": request.challenge
            },
            sources=[Source(content=cs['content'], source=cs['source']) 
                    for cs in result['case_studies']]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/what-if-analysis", response_model=WhatIfResponse)
async def what_if_analysis(request: WhatIfRequest):
    try:
        result = rag.what_if_analysis(
            current_framework=request.current_framework,
            alternative_framework=request.alternative_framework,
            scenario=request.scenario
        )
        
        return WhatIfResponse(
            analysis=result['result'],
            scenario={
                "current_framework": request.current_framework,
                "alternative_framework": request.alternative_framework,
                "scenario": request.scenario
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-document", response_model=UploadResponse)
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")
    
    # Get file type
    file_extension = file.filename.split('.')[-1].lower()

    # Create directory if it doesn't exist
    os.makedirs(os.path.join(rag.docs_dir), exist_ok=True)
    
    # Save the file
    file_path = os.path.join(rag.docs_dir, file.filename)
    
    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Schedule rebuilding the vector store as a background task
        background_tasks.add_task(rebuild_vectorstore)
        
        return UploadResponse(
            message="Document uploaded and indexing scheduled",
            file=file.filename,
            type=file_extension
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        rag_initialized=hasattr(rag, 'vectorstore') and rag.vectorstore is not None
    )

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)