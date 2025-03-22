# faq_service.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from config import client
import json

router = APIRouter()


class FAQRequest(BaseModel):
    change_type: str  # technology, process, organizational, policy, structural
    audience: str  # specific roles, departments, levels
    tech_proficiency: str  # low, medium, high
    key_points: List[str]
    purpose: str  # inform, instruct, inspire, reassure, prepare


class FAQItem(BaseModel):
    question: str
    answer: str


class FAQResponse(BaseModel):
    faqs: List[FAQItem]


@router.post("/generate_faqs", response_model=FAQResponse)
async def generate_faqs(request: FAQRequest):
    """Generate FAQs to address common concerns about a change"""
    try:
        # Format key points for better prompting
        key_points_formatted = "\n".join(
            ["- " + str(point) for point in request.key_points])

        # Construct prompt for GPT-4o-mini
        prompt = f"""
        Generate a comprehensive set of FAQs (Frequently Asked Questions) that address common concerns, fears, and questions 
        employees might have about an upcoming change at MSD.
        
        ## CHANGE DETAILS
        Type of change: {request.change_type}
        Target audience: {request.audience} with {request.tech_proficiency} technical proficiency
        Primary purpose: {request.purpose}
        
        ## KEY INFORMATION
        Key points about the change:
        {key_points_formatted}
        
        ## FAQ REQUIREMENTS
        1. Create 8-10 FAQs that specifically address:
           - Emotional resistance to change
           - Fear of job displacement or redundancy
           - Concerns about skill obsolescence 
           - Worries about learning new systems/processes
           - Timeline and transition concerns
           - Support and training availability
           - How daily work will be affected
           - Long-term implications
        
        2. For each FAQ:
           - Write questions from the employee's perspective (using "I" or "we")
           - Provide empathetic, honest, and reassuring answers
           - Keep answers informative but concise (3-5 sentences)
           - Address both emotional and practical concerns
           - Include specific resources or support channels when relevant
           - Use clear, non-technical language appropriate for the audience's proficiency level
        
        3. Format requirements:
           - Make sure answers acknowledge concerns while providing factual reassurance
           - Avoid generic corporate speak or dismissive tones
           - Ensure each FAQ is unique and addresses different aspects of change anxiety
        
        Return your response in the following JSON format:
{{
  "faqs": [
    {{
      "question": "Question from an employee's perspective?",
      "answer": "Empathetic and helpful answer."
    }},
    {{
      "question": "Another employee concern?",
      "answer": "Clear, reassuring response."
    }}
  ]
}}
        """

        # Call GPT-4o-mini
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert in change management and employee communications. You specialize in creating empathetic, honest, and reassuring content that addresses employee concerns about organizational changes, especially technological ones."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        # Parse the JSON response
        result = response.choices[0].message.content
        result_dict = json.loads(result)

        # Extract FAQs from the response
        if "faqs" in result_dict:
            faqs = result_dict["faqs"]
        else:
            # Try to find any key that might contain the FAQs
            for key, value in result_dict.items():
                if isinstance(value, list) and len(value) > 0:
                    if isinstance(value[0], dict) and "question" in value[0] and "answer" in value[0]:
                        faqs = value
                        break
            else:
                # If no FAQs found, create a default set
                faqs = [
                    {
                        "question": "Will I lose my job because of this change?",
                        "answer": "This change is not intended to reduce headcount. It's designed to make our work more efficient and improve our capabilities. The organization is committed to supporting all team members through this transition."
                    },
                    {
                        "question": "How will I learn the new system? I'm worried about keeping up.",
                        "answer": "We understand this concern and have developed a comprehensive training program tailored to different learning styles and technical proficiency levels. You'll have access to hands-on workshops, documentation, and ongoing support throughout the transition."
                    }
                ]

        # Convert to FAQItem objects
        faq_items = [FAQItem(question=item["question"],
                             answer=item["answer"]) for item in faqs]

        return FAQResponse(faqs=faq_items)

    except Exception as e:
        print(f"Error generating FAQs: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error generating FAQs: {str(e)}")
