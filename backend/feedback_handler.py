import os
import uuid
import pandas as pd
from datetime import datetime
from services import refine_prompt_with_feedback, generate_adoption_guide

IMMEDIATE_FILE = "immediate_feedback.xlsx"
TRAINING_FILE = "training_feedback.xlsx"


# === Immediate Feedback Logic ===
def process_immediate_feedback(original_prompt: str, feedback: str):
    # Save feedback to immediate_feedback.xlsx
    try:
        df = pd.read_excel(IMMEDIATE_FILE)
    except FileNotFoundError:
        df = pd.DataFrame(columns=["ID", "Timestamp", "Prompt", "Feedback"])
    
    entry = {
        "ID": str(uuid.uuid4()),
        "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Prompt": original_prompt,
        "Feedback": feedback
    }
    df = pd.concat([df, pd.DataFrame([entry])], ignore_index=True)
    df.to_excel(IMMEDIATE_FILE, index=False)

    # Process immediately
    improved_prompt = refine_prompt_with_feedback(original_prompt, feedback)
    improved_guide = generate_adoption_guide(improved_prompt)

    return improved_prompt, improved_guide


# === Training Feedback Logic ===
def process_training_feedback(original_prompt: str, feedback: str):
    # Save feedback to training_feedback.xlsx
    try:
        df = pd.read_excel(TRAINING_FILE)
    except FileNotFoundError:
        df = pd.DataFrame(columns=["ID", "Timestamp", "Prompt", "Feedback", "Status"])
    
    entry = {
        "ID": str(uuid.uuid4()),
        "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Prompt": original_prompt,
        "Feedback": feedback,
        "Status": "new"
    }
    df = pd.concat([df, pd.DataFrame([entry])], ignore_index=True)

    # Check for 5 or more new feedbacks
    new_feedbacks = df[df["Status"] == "new"]
    improved_prompt = improved_guide = None

    if len(new_feedbacks) >= 5:
        combined_feedback = "\n".join([f"- {row['Feedback']}" for _, row in new_feedbacks.iterrows()])
        improved_prompt = refine_prompt_with_feedback(original_prompt, combined_feedback)
        improved_guide = generate_adoption_guide(improved_prompt)

        # Mark feedbacks as processed
        df.loc[df["Status"] == "new", "Status"] = "processed"
        # Save updated prompt if needed
        with open("latest_prompt.txt", "w") as f:
            f.write(improved_prompt)

    df.to_excel(TRAINING_FILE, index=False)
    return improved_prompt, improved_guide
