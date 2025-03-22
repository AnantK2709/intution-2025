from fastapi import FastAPI, HTTPException
from models import CommunicationRequest, DraftReviewRequest, ScoredDraft
from services import create_draft_service, review_draft_service

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

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)