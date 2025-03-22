from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Enhanced data models
class CommunicationRequest(BaseModel):
    change_type: str  # technology, process, organizational, policy, structural
    audience: str  # specific roles, departments, levels
    tech_proficiency: str  # low, medium, high
    urgency: str  # low, medium, high
    purpose: str  # inform, instruct, inspire, reassure, prepare
    key_points: List[str]
    timeline: Optional[str] = None
    stakeholders: Optional[List[str]] = None
    expected_resistance: Optional[str] = None
    desired_outcome: Optional[str] = None
    previous_communications: Optional[str] = None
    special_considerations: Optional[str] = None
    include_scholarly_references: Optional[bool] = False
    reference_topics: Optional[List[str]] = None

class DraftReviewRequest(BaseModel):
    content: str
    change_type: str
    audience: str
    purpose: str
    key_points: List[str]
    reference_topics: Optional[List[str]] = None

class ScholarlyReference(BaseModel):
    title: str
    authors: str
    year: str
    url: str
    relevance_note: str

class ScoredDraft(BaseModel):
    clarity_score: float
    completeness_score: float
    tone_score: float
    action_clarity_score: float
    relevance_score: float
    empathy_score: float
    resistance_mitigation_score: float
    overall_score: float
    strengths: List[str]
    improvement_areas: List[str]
    specific_suggestions: List[str]
    improved_draft: str

class GamificationRequest(BaseModel):
    change_type: str  # technology, process, organizational
    audience: str  # role, department
    tech_proficiency: str  # low, medium, high
    change_name: str  # name of the change being implemented
    change_description: str  # brief description of the change
    adkar_stage: str  # awareness, desire, knowledge, ability, reinforcement
    game_type: str  # mcq, quiz, challenge, simulation, etc.
    key_points: List[str]  # important points to be included in the game

class GameContent(BaseModel):
    game_id: str
    game_type: str
    title: str
    description: str
    instructions: str
    content: Dict[str, Any]  # Flexible structure based on game type
    points: int
    badges: Optional[List[str]] = None
    adkar_stage: str

class UserProgress(BaseModel):
    user_id: str
    points: int
    badges: List[str]
    completed_games: List[str]
    adkar_progress: Dict[str, float]  # Progress percentage for each ADKAR stage

# Additional models needed for the API
class GameCompletionRequest(BaseModel):
    user_id: str
    game_id: str
    score: int  # Score achieved by user
    time_taken: int  # Time taken in seconds
    
class UserProgressResponse(BaseModel):
    user_id: str
    points: int
    badges: List[str]
    completed_games: List[str]
    adkar_progress: Dict[str, float]
    level: int
    next_level_points: int

class GameListResponse(BaseModel):
    games: List[GameContent]
    
class GameRecommendationResponse(BaseModel):
    recommended_games: List[GameContent]
    reason: str