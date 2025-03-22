from fastapi import FastAPI, HTTPException
from models import (CommunicationRequest, DraftReviewRequest, GameCompletionRequest,
                   GameListResponse, GameRecommendationResponse, GamificationRequest,
                   GameContent, ScoredDraft, UserProgressResponse)
from services import (create_draft_service, review_draft_service, create_game_service,
                     complete_game_service, get_games_service, get_user_progress_service,
                     recommend_games_service)

# Initialize FastAPI
app = FastAPI(title="MSD Change Management Communication Assistant")

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