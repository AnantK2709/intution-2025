from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import shutil
from strategies import generate_prompt, save_feedback_to_excel, get_feedback_batch, refine_prompt_with_feedback, generate_adoption_guide, mark_feedback_as_processed, run_strategy_workflow
from email_utils import send_email_to_employees
from models import (CommunicationRequest, DraftReviewRequest, GameCompletionRequest,
                   GameListResponse, GameRecommendationResponse, GamificationRequest,
                   GameContent, ScoredDraft, UserProgressResponse)
from services import (create_draft_service, review_draft_service, create_game_service,
                     complete_game_service, get_games_service, get_user_progress_service,
                     recommend_games_service)

from rag import ChangeManagementRAG  # Import your ChangeManagementRAG class

# Initialize FastAPI
app = FastAPI(title="MSD Change Management Communication Assistant")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # You can also specify ["POST"]
    allow_headers=["*"],
)


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


@app.post("/strategies")
def get_strategy(request: StrategyRequest):
    try:
        result = run_strategy_workflow(
            technology=request.technology,
            framework=request.framework,
            feedback=request.feedback
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/send_approved_draft")
async def send_approved_draft(request: EmailRequest):
    try:
        result = send_email_to_employees(
            subject=request.subject,
            message=request.message,
            recipient_list=request.recipients
        )

        if result["status"] == "success":
            return {
                "message": "Emails sent successfully.",
                "sent_to": result["sent_to"]
            }
        else:
            raise HTTPException(status_code=500, detail=result["message"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
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

    
@app.post("/create_game", response_model=GameContent)
async def create_game(request: GamificationRequest):
    """Create a new game based on change management requirements"""
    try:
        return create_game_service(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/complete_game", response_model=UserProgressResponse)
async def complete_game(request: GameCompletionRequest):
    """Record a user's game completion and update their progress"""
    try:
        return complete_game_service(request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/games", response_model=GameListResponse)
async def get_games(adkar_stage: str = None, change_type: str = None):
    """Get all games, optionally filtered by ADKAR stage or change type"""
    try:
        return get_games_service(adkar_stage, change_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/user_progress/{user_id}", response_model=UserProgressResponse)
async def get_user_progress(user_id: str):
    """Get a user's progress"""
    try:
        return get_user_progress_service(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommend_games/{user_id}", response_model=GameRecommendationResponse)
async def recommend_games(user_id: str, limit: int = 3):
    """Recommend games for a user based on their progress"""
    try:
        return recommend_games_service(user_id, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from feedback_handler import process_immediate_feedback, process_training_feedback
from models import FeedbackRequest

@app.post("/feedback_immediate")
def feedback_immediate(request: FeedbackRequest):
    try:
        improved_prompt, improved_guide = process_immediate_feedback(
            request.original_prompt, request.feedback
        )
        return {
            "message": "Guide updated based on your feedback.",
            "improved_prompt": improved_prompt,
            "improved_guide": improved_guide
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback_training")
def feedback_training(request: FeedbackRequest):
    try:
        improved_prompt, improved_guide = process_training_feedback(
            request.original_prompt, request.feedback
        )

        if improved_prompt:
            return {
                "message": "Batch of 5 feedbacks processed. New guide generated.",
                "improved_prompt": improved_prompt,
                "improved_guide": improved_guide
            }
        else:
            return {"message": "Feedback saved. Waiting for more to process."}
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
    
    # Determine target directory
    if file_extension == 'pdf':
        target_dir = 'pdf'
    elif file_extension == 'txt':
        target_dir = 'text'
    elif file_extension in ['doc', 'docx']:
        target_dir = 'word'
    elif file_extension == 'csv':
        target_dir = 'csv'
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_extension}")
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.join(rag.docs_dir, target_dir), exist_ok=True)
    
    # Save the file
    file_path = os.path.join(rag.docs_dir, target_dir, file.filename)
    
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