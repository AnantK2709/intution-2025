import pandas as pd
import uuid
from datetime import datetime
from services import refine_prompt_with_feedback, generate_adoption_guide

EXCEL_FILE = "feedback_data.xlsx"

# Save feedback to Excel
def save_feedback(original_prompt: str, feedback: str):
    try:
        df = pd.read_excel(EXCEL_FILE)
    except FileNotFoundError:
        df = pd.DataFrame(columns=["ID", "Timestamp", "Original Prompt", "Feedback", "Status"])

    entry = {
        "ID": str(uuid.uuid4()),
        "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Original Prompt": original_prompt,
        "Feedback": feedback,
        "Status": "new"
    }

    df = pd.concat([df, pd.DataFrame([entry])], ignore_index=True)
    df.to_excel(EXCEL_FILE, index=False)
    print("📝 Feedback saved to Excel.")

# Count how many feedbacks are pending
def count_pending_feedback():
    try:
        df = pd.read_excel(EXCEL_FILE)
        return len(df[df["Status"] == "new"])
    except FileNotFoundError:
        return 0

# Process 5 feedbacks and return improved prompt + draft
def process_feedback_batch():
    try:
        df = pd.read_excel(EXCEL_FILE)
        new_feedbacks = df[df["Status"] == "new"].head(5)
    except FileNotFoundError:
        return None, None

    if len(new_feedbacks) < 5:
        return None, None

    combined_feedback = "\n".join([f"- {row['Feedback']}" for _, row in new_feedbacks.iterrows()])
    original_prompt = new_feedbacks.iloc[0]["Original Prompt"]

    improved_prompt = refine_prompt_with_feedback(original_prompt, combined_feedback)
    improved_draft = generate_adoption_guide(improved_prompt)

    # Mark these 5 feedbacks as processed
    for idx in new_feedbacks.index:
        df.at[idx, "Status"] = "processed"

    df.to_excel(EXCEL_FILE, index=False)
    return improved_prompt, improved_draft
