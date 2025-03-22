from fastapi import FastAPI, HTTPException
from models import CommunicationRequest, DraftReviewRequest, ScoredDraft, FeedbackRequest, EmailRequest, StrategyRequest
from services import create_draft_service, review_draft_service
from feedback import save_feedback, count_pending_feedback, process_feedback_batch
from strategies import generate_prompt, save_feedback_to_excel, get_feedback_batch, refine_prompt_with_feedback, generate_adoption_guide, mark_feedback_as_processed, run_strategy_workflow
from email_utils import send_email_to_employees
from fastapi.middleware.cors import CORSMiddleware
from models import (CommunicationRequest, DraftReviewRequest, GameCompletionRequest,
                   GameListResponse, GameRecommendationResponse, GamificationRequest,
                   GameContent, ScoredDraft, UserProgressResponse)
from services import (create_draft_service, review_draft_service, create_game_service,
                     complete_game_service, get_games_service, get_user_progress_service,
                     recommend_games_service)


# Initialize FastAPI
app = FastAPI(title="MSD Change Management Communication Assistant")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # You can also specify ["POST"]
    allow_headers=["*"],
)

@app.post("/feedback_strategies")
def submit_feedback(request: FeedbackRequest):
    try:
        # Save new feedback
        save_feedback_to_excel(request.original_prompt, request.feedback)

        # If 5+ new feedbacks, improve prompt
        batch = get_feedback_batch()
        if len(batch) >= 5:
            combined_feedback = "\n".join([f"- {entry[2]}" for entry in batch])
            improved_prompt = refine_prompt_with_feedback(request.original_prompt, combined_feedback)
            improved_guide = generate_adoption_guide(improved_prompt)
            mark_feedback_as_processed([entry[0] for entry in batch])

            return {
                "message": "Thanks for your feedback! We've used it to improve the prompt.",
                "improved_prompt": improved_prompt,
                "improved_guide": improved_guide
            }

        return {"message": "Thanks for your feedback! We'll use it to improve future responses."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
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
    
@app.post("/feedback_strategies")
def submit_feedback(request: FeedbackRequest):
    try:
        # Save new feedback
        save_feedback_to_excel(request.original_prompt, request.feedback)

        # If 5+ new feedbacks, improve prompt
        batch = get_feedback_batch()
        if len(batch) >= 5:
            combined_feedback = "\n".join([f"- {entry[2]}" for entry in batch])
            improved_prompt = refine_prompt_with_feedback(request.original_prompt, combined_feedback)
            improved_guide = generate_adoption_guide(improved_prompt)
            mark_feedback_as_processed([entry[0] for entry in batch])

            return {
                "message": "Thanks for your feedback! We've used it to improve the prompt.",
                "improved_prompt": improved_prompt,
                "improved_guide": improved_guide
            }

        return {"message": "Thanks for your feedback! We'll use it to improve future responses."}

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
# Routes
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
@app.post("/submit_feedback")
async def submit_feedback(request: FeedbackRequest):
    try:
        save_feedback(request.original_prompt, request.feedback)
        feedback_count = count_pending_feedback()
        
        if feedback_count >= 5:
            improved_prompt, improved_draft = process_feedback_batch()
            return {
                "message": "Feedback processed and improved prompt generated.",
                "improved_prompt": improved_prompt,
                "improved_draft": improved_draft
            }
        
        return {"message": f"Feedback saved. Waiting for {5 - feedback_count} more to process."}
    
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
    
# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)