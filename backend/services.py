import json
from openai import OpenAI
from models import CommunicationRequest, DraftReviewRequest, ScoredDraft
from utils import get_scholarly_references
from config import client

def create_draft_service(request: CommunicationRequest):
    # Construct enhanced prompt
    prompt = f"""
    Create a comprehensive, clear and effective change management communication draft for MSD.
    
    ## CHANGE DETAILS
    Type of change: {request.change_type}
    Target audience: {request.audience} with {request.tech_proficiency} technical proficiency
    Urgency level: {request.urgency}
    Primary purpose: {request.purpose}
    
    ## KEY INFORMATION TO INCLUDE
    Key points that must be covered:
    {chr(10).join(['- ' + point for point in request.key_points])}
    
    Timeline information: {request.timeline or "Include a general timeline"}
    Key stakeholders: {', '.join(request.stakeholders) if request.stakeholders else "Include relevant stakeholders"}
    
    ## POTENTIAL RESISTANCE AND DESIRED OUTCOMES
    Anticipated resistance: {request.expected_resistance or "Consider possible resistance points"}
    Desired outcome: {request.desired_outcome or "Clearly articulate what success looks like"}
    
    ## CONTEXT
    Previous communications: {request.previous_communications or "N/A"}
    Special considerations: {request.special_considerations or "N/A"}
    
    ## COMMUNICATION STRUCTURE
    Structure the message to include all of these components in a logical flow:
    1. Strong, clear opener that captures attention and establishes relevance
    2. Compelling "why" explanation that addresses organizational and personal benefits
    3. Specific details about what is changing, with concrete examples
    4. Explicit description of how this affects the recipients (with empathy for disruption)
    5. Clear timeline with key milestones and dates
    6. Resources available for support (people, tools, training)
    7. Specific, actionable next steps that recipients need to take
    8. Contact information for questions or concerns
    
    ## TONE AND STYLE GUIDANCE
    - Use language appropriate for a {request.tech_proficiency} technical proficiency audience
    - Balance professional tone with approachability and empathy
    - Prioritize clarity over technical jargon
    - Be direct about changes while acknowledging concerns
    - Use active voice and concrete examples
    - For {request.urgency} urgency, use appropriate emphasis techniques
    - When addressing potential resistance, be transparent but positive
    - Include specific, measurable calls to action
    - Keep paragraphs short and use formatting to aid readability
    - Use MSD's preferred communication style
    
    Create a draft that reads as a complete, ready-to-send communication that will drive successful change adoption. Feel free to change the language to a more professional tone if needed. For example biz can be changed to business
    """
    
    # Get scholarly references if requested
    scholarly_references = []
    if request.include_scholarly_references and request.reference_topics:
        scholarly_references = get_scholarly_references(request.reference_topics)
    
    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are MSD's expert change management communication specialist with decades of experience crafting highly effective communications that drive successful change adoption. Your communications are known for being clear, compelling, empathetic, and action-oriented."},
            {"role": "user", "content": prompt}
        ]
    )
    
    draft = response.choices[0].message.content
    
    # If scholarly references were requested, append them to the result
    result = {
        "draft": draft,
        "scholarly_references": scholarly_references if request.include_scholarly_references else None
    }
    
    return result

def review_draft_service(request: DraftReviewRequest):
    # Construct enhanced review prompt
    prompt = f"""
    ## COMPREHENSIVE REVIEW OF CHANGE MANAGEMENT COMMUNICATION
    
    Analyze this draft communication for a {request.change_type} change at MSD:
    
    ---BEGIN DRAFT---
    {request.content}
    ---END DRAFT---
    
    ## AUDIENCE AND PURPOSE CONTEXT
    Target audience: {request.audience}
    Primary purpose: {request.purpose}
    
    Key points that should be covered:
    {chr(10).join(['- ' + point for point in request.key_points])}
    
    ## EVALUATION CRITERIA
    Analyze and score this draft on a scale of 0.0-10.0 for each of these critical dimensions:
    
    1. Clarity (0-10):
       - Is information presented in a clear, logical sequence?
       - Is technical language appropriate for the audience?
       - Are complex concepts explained with simple examples?
       - Is the message free of unnecessary jargon and ambiguity?
    
    2. Completeness (0-10):
       - Does it address all key points requested?
       - Does it cover the why, what, how, when, who, and next steps?
       - Are there any significant information gaps?
       - Does it anticipate and address likely questions?
    
    3. Tone (0-10):
       - Is it empathetic while remaining confident?
       - Does it acknowledge the impact of change on recipients?
       - Does it strike the right balance between authority and understanding?
       - Is the tone appropriate for the urgency level?
    
    4. Action Clarity (0-10):
       - Are next steps clearly defined?
       - Are actions specific, measurable, and time-bound?
       - Is it clear who needs to do what and by when?
       - Are resources for support clearly identified?
    
    5. Relevance (0-10):
       - Is content tailored to the specific audience's needs and concerns?
       - Does it clearly explain why this change matters to them specifically?
       - Does it address WIIFM (What's In It For Me)?
    
    6. Empathy (0-10):
       - Does it acknowledge disruption and potential difficulties?
       - Does it demonstrate understanding of the audience's perspective?
       - Does it provide appropriate support and resources?
    
    7. Resistance Mitigation (0-10):
       - Does it proactively address likely resistance points?
       - Does it provide compelling rationale for the change?
       - Does it balance honesty about challenges with positive outcomes?
    
    ## IMPROVEMENT GUIDANCE
    Based on your analysis, provide:
    1. 3-5 clear strengths of the current draft
    2. 3-5 specific areas needing improvement
    3. 5-7 actionable suggestions for enhancing effectiveness
    4. A completely revised and improved version of the draft that addresses all issues
    
    Format your response as JSON with keys: clarity_score, completeness_score, tone_score, action_clarity_score, relevance_score, empathy_score, resistance_mitigation_score, overall_score, strengths, improvement_areas, specific_suggestions, improved_draft
    
    The overall_score should be a weighted average with clarity, completeness, and action_clarity weighted more heavily.
    """
    
    # Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are MSD's senior change management communication specialist with extensive experience evaluating and improving high-impact communications. You provide detailed, actionable feedback and exceptional rewrites. Respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    # Parse the JSON response
    result = response.choices[0].message.content
    try:
        result_dict = json.loads(result)  # Try to parse the result as JSON
    except json.JSONDecodeError:
        raise Exception("Failed to parse response from OpenAI.")
    
    return ScoredDraft(**result_dict)
def refine_prompt_with_feedback(original_prompt: str, combined_feedback: str) -> str:
    improvement_request = f"""
You are a prompt engineer. Here's a prompt that was used with GPT:

---
{original_prompt}
---

The user was not satisfied with the result and gave the following feedback:
{combined_feedback}

Please improve the original prompt based on this feedback. Only output the improved prompt, nothing else.
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": improvement_request}
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()


def generate_adoption_guide(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
    )
    return response.choices[0].message.content.strip()
