from pydantic import BaseModel
from typing import List, Optional
from typing import List

class FeedbackRequest(BaseModel):
    original_prompt: str
    feedback: str

class StrategyRequest(BaseModel):
    technology: str
    framework: str
    feedback: str = None  # Optional

class EmailRequest(BaseModel):
    subject: str
    message: str
    recipients: List[str]


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