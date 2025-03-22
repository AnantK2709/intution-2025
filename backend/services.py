import json
from openai import OpenAI
from models import CommunicationRequest, DraftReviewRequest, ScoredDraft, GameCompletionRequest, GameContent, GameListResponse, GameRecommendationResponse, GamificationRequest,UserProgress, UserProgressResponse
from utils import get_scholarly_references
from config import client
import csv
import json
import os
import uuid
from datetime import datetime
from typing import List


GAMES_CSV = "data/games.csv"
USER_PROGRESS_CSV = "data/user_progress.csv"

# Ensure data directory exists
os.makedirs("data", exist_ok=True)

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
    
    Create a draft that reads as a complete, ready-to-send communication that will drive successful change adoption.
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


# Initialize CSV files if they don't exist
def init_csv_files():
    if not os.path.exists(GAMES_CSV):
        with open(GAMES_CSV, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'game_id', 'game_type', 'title', 'description', 'instructions', 
                'content', 'points', 'badges', 'adkar_stage', 'change_type', 
                'audience', 'tech_proficiency', 'created_at'
            ])
    
    if not os.path.exists(USER_PROGRESS_CSV):
        with open(USER_PROGRESS_CSV, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                'user_id', 'points', 'badges', 'completed_games', 
                'adkar_progress', 'last_updated'
            ])

init_csv_files()

# Helper functions for CSV operations
def read_games() -> List[GameContent]:
    games = []
    try:
        with open(GAMES_CSV, 'r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Convert string representations back to Python objects
                row['content'] = json.loads(row['content'])
                row['badges'] = json.loads(row['badges']) if row['badges'] else None
                games.append(GameContent(**row))
    except Exception as e:
        print(f"Error reading games: {e}")
    return games

def read_user_progress(user_id: str) -> UserProgress:
    try:
        with open(USER_PROGRESS_CSV, 'r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['user_id'] == user_id:
                    # Convert string representations back to Python objects
                    row['badges'] = json.loads(row['badges'])
                    row['completed_games'] = json.loads(row['completed_games'])
                    row['adkar_progress'] = json.loads(row['adkar_progress'])
                    return UserProgress(**row)
    except Exception as e:
        print(f"Error reading user progress: {e}")
    
    # If no user found, create new progress record
    default_progress = UserProgress(
        user_id=user_id,
        points=0,
        badges=[],
        completed_games=[],
        adkar_progress={
            "awareness": 0.0,
            "desire": 0.0,
            "knowledge": 0.0,
            "ability": 0.0,
            "reinforcement": 0.0
        }
    )
    
    # Save the new user
    save_user_progress(default_progress)
    return default_progress

def save_game(game: GameContent, request: GamificationRequest):
    games = read_games()
    
    # Check if the game_id already exists
    for existing_game in games:
        if existing_game.game_id == game.game_id:
            # Update existing game
            games.remove(existing_game)
            break
    
    # Add the new game
    games.append(game)
    
    # Write all games back to CSV
    with open(GAMES_CSV, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            'game_id', 'game_type', 'title', 'description', 'instructions', 
            'content', 'points', 'badges', 'adkar_stage', 'change_type', 
            'audience', 'tech_proficiency', 'created_at'
        ])
        
        for g in games:
            writer.writerow([
                g.game_id,
                g.game_type,
                g.title,
                g.description,
                g.instructions,
                json.dumps(g.content),
                g.points,
                json.dumps(g.badges),
                g.adkar_stage,
                request.change_type if g.game_id == game.game_id else '',
                request.audience if g.game_id == game.game_id else '',
                request.tech_proficiency if g.game_id == game.game_id else '',
                datetime.now().isoformat() if g.game_id == game.game_id else ''
            ])

def save_user_progress(progress: UserProgress):
    all_progress = []
    found = False
    
    # Read existing progress
    try:
        with open(USER_PROGRESS_CSV, 'r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['user_id'] == progress.user_id:
                    found = True
                    continue  # Skip the old record
                all_progress.append(row)
    except Exception as e:
        print(f"Error reading progress for update: {e}")
    
    # Add the updated progress
    all_progress.append({
        'user_id': progress.user_id,
        'points': progress.points,
        'badges': json.dumps(progress.badges),
        'completed_games': json.dumps(progress.completed_games),
        'adkar_progress': json.dumps(progress.adkar_progress),
        'last_updated': datetime.now().isoformat()
    })
    
    # Write all progress back to CSV
    with open(USER_PROGRESS_CSV, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=[
            'user_id', 'points', 'badges', 'completed_games', 
            'adkar_progress', 'last_updated'
        ])
        writer.writeheader()
        writer.writerows(all_progress)

# Main service functions
def create_game_service(request: GamificationRequest) -> GameContent:
    """Generate a game based on the change management requirements"""
    
    # Generate a unique game ID
    game_id = f"game_{uuid.uuid4().hex[:8]}"
    
    # Define game content based on game type
    content = {}
    
    if request.game_type == "mcq":
        # Create multiple choice questions based on key points
        questions = []
        for i, point in enumerate(request.key_points):
            # Generate a question based on the key point
            question = {
                "id": f"q{i+1}",
                "text": f"Which of the following best describes {point}?",
                "options": [
                    {"id": "a", "text": generate_correct_answer(point)},
                    {"id": "b", "text": generate_wrong_answer(point, 1)},
                    {"id": "c", "text": generate_wrong_answer(point, 2)},
                    {"id": "d", "text": generate_wrong_answer(point, 3)}
                ],
                "correct_answer": "a"
            }
            questions.append(question)
        content = {"questions": questions}
        
    elif request.game_type == "quiz":
        # Create quiz questions (true/false, fill in blanks, etc.)
        questions = []
        for i, point in enumerate(request.key_points):
            question_type = "true_false" if i % 2 == 0 else "fill_blank"
            
            if question_type == "true_false":
                question = {
                    "id": f"q{i+1}",
                    "type": "true_false",
                    "text": generate_true_false_statement(point, i % 3 == 0),
                    "correct_answer": "true" if i % 3 == 0 else "false"
                }
            else:
                text, blank = generate_fill_blank_statement(point)
                question = {
                    "id": f"q{i+1}",
                    "type": "fill_blank",
                    "text": text,
                    "blank": blank,
                    "correct_answer": blank
                }
            questions.append(question)
        content = {"questions": questions}
        
    elif request.game_type == "challenge":
        # Create timed challenges
        stages = []
        for i, point in enumerate(request.key_points):
            stage = {
                "id": f"stage{i+1}",
                "name": f"Stage {i+1}: {point[:30]}...",
                "description": f"Apply your knowledge about {point}",
                "task": generate_challenge_task(point, request.adkar_stage),
                "time_limit": 120,  # 2 minutes per stage
                "success_criteria": generate_success_criteria(point)
            }
            stages.append(stage)
        content = {"stages": stages}
        
    elif request.game_type == "simulation":
        # Create a scenario-based simulation
        scenarios = []
        for i, point in enumerate(request.key_points):
            decisions = generate_simulation_decisions(point)
            scenario = {
                "id": f"scenario{i+1}",
                "title": f"Scenario {i+1}: Implementing {point[:30]}...",
                "description": generate_scenario_description(point, request.change_type),
                "decisions": decisions,
                "outcomes": generate_outcomes(decisions)
            }
            scenarios.append(scenario)
        content = {"scenarios": scenarios}
    
    # Default to a simple knowledge check if game type is not recognized
    else:
        content = {
            "introduction": f"Let's test your knowledge of {request.change_name}",
            "questions": [{"text": f"What do you know about {kp}?"} for kp in request.key_points]
        }
    
    # Create badges based on ADKAR stage
    badges = create_badges_for_adkar(request.adkar_stage)
    
    # Calculate points based on game complexity and ADKAR stage
    points = calculate_points(request.game_type, len(request.key_points), request.adkar_stage)
    
    # Create the game object
    game = GameContent(
        game_id=game_id,
        game_type=request.game_type,
        title=generate_game_title(request.change_name, request.game_type, request.adkar_stage),
        description=generate_game_description(request.change_description, request.adkar_stage),
        instructions=generate_instructions(request.game_type),
        content=content,
        points=points,
        badges=badges,
        adkar_stage=request.adkar_stage
    )
    
    # Save the game to CSV
    save_game(game, request)
    
    return game

def complete_game_service(request: GameCompletionRequest) -> UserProgressResponse:
    """Record user's game completion and update their progress"""
    
    # Get the game details
    games = read_games()
    game = next((g for g in games if g.game_id == request.game_id), None)
    
    if not game:
        raise ValueError(f"Game with ID {request.game_id} not found")
    
    # Get user's current progress
    progress = read_user_progress(request.user_id)
    
    # Check if game already completed
    if request.game_id in progress.completed_games:
        # Only update if new score is higher
        previous_score = 0  # Would need to track previous scores in a real implementation
        if request.score <= previous_score:
            return create_user_progress_response(progress)
    
    # Add game to completed games
    if request.game_id not in progress.completed_games:
        progress.completed_games.append(request.game_id)
    
    # Award points (adjusted by score percentage)
    score_percentage = min(1.0, max(0.1, request.score / 100))
    points_earned = int(game.points * score_percentage)
    progress.points += points_earned
    
    # Award badges if not already earned
    if game.badges:
        for badge in game.badges:
            if badge not in progress.badges:
                progress.badges.append(badge)
    
    # Update ADKAR progress
    adkar_stage = game.adkar_stage.lower()
    if adkar_stage in progress.adkar_progress:
        # Calculate progress based on score
        current = progress.adkar_progress[adkar_stage]
        increment = (1.0 - current) * score_percentage * 0.2  # Max 20% increase per game
        progress.adkar_progress[adkar_stage] = min(1.0, current + increment)
    
    # Save updated progress
    save_user_progress(progress)
    
    # Return response with user's updated progress
    return create_user_progress_response(progress)

def get_games_service(adkar_stage: str = None, change_type: str = None) -> GameListResponse:
    """Get all games, optionally filtered by ADKAR stage or change type"""
    
    games = read_games()
    
    # Apply filters if provided
    if adkar_stage:
        games = [g for g in games if g.adkar_stage.lower() == adkar_stage.lower()]
    
    if change_type:
        games = [g for g in games if hasattr(g, 'change_type') and g.change_type.lower() == change_type.lower()]
    
    return GameListResponse(games=games)

def get_user_progress_service(user_id: str) -> UserProgressResponse:
    """Get a user's progress"""
    
    progress = read_user_progress(user_id)
    return create_user_progress_response(progress)

def recommend_games_service(user_id: str, limit: int = 3) -> GameRecommendationResponse:
    """Recommend games for a user based on their progress"""
    
    # Get user progress
    progress = read_user_progress(user_id)
    
    # Get all games
    all_games = read_games()
    
    # Filter out completed games
    available_games = [g for g in all_games if g.game_id not in progress.completed_games]
    
    if not available_games:
        return GameRecommendationResponse(
            recommended_games=[],
            reason="You've completed all available games!"
        )
    
    # Find weakest ADKAR stage
    weakest_stage = min(progress.adkar_progress.items(), key=lambda x: x[1])[0]
    
    # Prioritize games for weakest ADKAR stage
    stage_games = [g for g in available_games if g.adkar_stage.lower() == weakest_stage]
    
    if not stage_games:
        # If no games for weakest stage, recommend games for other stages
        recommended = available_games[:limit]
        reason = "These games will help you continue your change journey."
    else:
        recommended = stage_games[:limit]
        reason = f"These games will strengthen your '{weakest_stage.capitalize()}' skills, which need the most improvement."
    
    return GameRecommendationResponse(
        recommended_games=recommended,
        reason=reason
    )

# Helper functions to generate content
def generate_game_title(change_name, game_type, adkar_stage):
    titles = {
        "mcq": ["Multiple Choice Challenge", "Quick Knowledge Check", "Core Concepts Quiz"],
        "quiz": ["Pop Quiz", "Knowledge Test", "Quick Assessment"],
        "challenge": ["Timed Challenge", "Skill Builder", "Practical Application"],
        "simulation": ["Real-world Simulation", "Scenario Explorer", "Decision Maker"]
    }
    
    adkar_themes = {
        "awareness": "Understanding",
        "desire": "Motivation",
        "knowledge": "Learning",
        "ability": "Skill Development",
        "reinforcement": "Mastery"
    }
    
    game_type_options = titles.get(game_type.lower(), ["Assessment"])
    theme = adkar_themes.get(adkar_stage.lower(), "Change")
    
    return f"{change_name} {theme} - {game_type_options[0]}"

def generate_game_description(change_description, adkar_stage):
    adkar_intros = {
        "awareness": "Build your understanding of why this change is happening.",
        "desire": "Discover your role in making this change successful.",
        "knowledge": "Learn the essential skills needed for this change.",
        "ability": "Practice applying your knowledge in realistic scenarios.",
        "reinforcement": "Strengthen your skills and embed the new ways of working."
    }
    
    intro = adkar_intros.get(adkar_stage.lower(), "Engage with this change initiative.")
    return f"{intro} {change_description}"

def generate_instructions(game_type):
    instructions = {
        "mcq": "Choose the correct answer for each question. You'll earn points for each correct response.",
        "quiz": "Answer each question carefully. Different types of questions will test your knowledge.",
        "challenge": "Complete each challenge within the time limit. You'll be scored on accuracy and speed.",
        "simulation": "Make decisions in realistic scenarios and see the consequences. Choose wisely!"
    }
    
    return instructions.get(game_type.lower(), "Follow the prompts and respond as accurately as possible.")

def generate_correct_answer(key_point):
    """Generate a correct answer based on a key point"""
    return f"It is the process of {key_point.lower()}"

def generate_wrong_answer(key_point, variant):
    """Generate incorrect answers that are plausible but wrong"""
    variants = [
        f"It is unrelated to {key_point.lower()}",
        f"It opposes the concept of {key_point.lower()}",
        f"It only applies when {key_point.lower()} is not relevant",
        f"It replaces the need for {key_point.lower()}"
    ]
    return variants[variant % len(variants)]

def generate_true_false_statement(key_point, is_true):
    """Generate a true/false statement based on a key point"""
    if is_true:
        return f"The change will require {key_point.lower()}"
    else:
        return f"The change will eliminate the need for {key_point.lower()}"

def generate_fill_blank_statement(key_point):
    """Generate a fill-in-the-blank statement based on a key point"""
    words = key_point.split()
    if len(words) < 3:
        text = f"The change will improve _____"
        blank = key_point
    else:
        blank_index = len(words) // 2
        blank = words[blank_index]
        words[blank_index] = "_____"
        text = " ".join(words)
    
    return text, blank

def generate_challenge_task(key_point, adkar_stage):
    """Generate a task for a challenge game"""
    adkar_tasks = {
        "awareness": f"Explain why {key_point} matters to the organization",
        "desire": f"Identify personal benefits from adopting {key_point}",
        "knowledge": f"List three key components of {key_point}",
        "ability": f"Demonstrate how to implement {key_point} in your role",
        "reinforcement": f"Create a plan to help colleagues adopt {key_point}"
    }
    
    return adkar_tasks.get(adkar_stage.lower(), f"Explain your understanding of {key_point}")

def generate_success_criteria(key_point):
    """Generate success criteria for a challenge"""
    return f"Clearly articulates understanding of {key_point}"

def generate_simulation_decisions(key_point):
    """Generate decisions for a simulation scenario"""
    return [
        {
            "id": "d1",
            "text": f"Implement {key_point} immediately",
            "outcome_id": "o1"
        },
        {
            "id": "d2",
            "text": f"Conduct a pilot of {key_point} with a small team",
            "outcome_id": "o2"
        },
        {
            "id": "d3",
            "text": f"Delay implementation of {key_point} until next quarter",
            "outcome_id": "o3"
        }
    ]

def generate_scenario_description(key_point, change_type):
    """Generate a description for a simulation scenario"""
    change_contexts = {
        "technology": "implementing a new system",
        "process": "changing your team's workflow",
        "organizational": "reorganizing department structures"
    }
    
    context = change_contexts.get(change_type.lower(), "making changes")
    return f"You're {context} that involves {key_point}. How do you proceed?"

def generate_outcomes(decisions):
    """Generate outcomes for simulation decisions"""
    outcomes = {
        "o1": {
            "text": "Quick implementation leads to initial resistance but faster results.",
            "impact": {
                "timeline": -10,
                "adoption": -20,
                "results": +30
            }
        },
        "o2": {
            "text": "The pilot approach provides valuable insights and builds support.",
            "impact": {
                "timeline": +10,
                "adoption": +30,
                "results": +20
            }
        },
        "o3": {
            "text": "Delaying creates more time for preparation but slows momentum.",
            "impact": {
                "timeline": +30,
                "adoption": +10,
                "results": -10
            }
        }
    }
    return outcomes

def create_badges_for_adkar(adkar_stage):
    """Create badges based on ADKAR stage"""
    badges = {
        "awareness": ["Change Aware", "Big Picture Thinker"],
        "desire": ["Change Advocate", "Motivation Master"],
        "knowledge": ["Change Scholar", "Knowledge Keeper"],
        "ability": ["Change Implementer", "Skill Builder"],
        "reinforcement": ["Change Ambassador", "Sustainability Champion"]
    }
    
    return badges.get(adkar_stage.lower(), ["Change Participant"])

def calculate_points(game_type, num_key_points, adkar_stage):
    """Calculate points based on game complexity and ADKAR stage"""
    # Base points by game type
    base_points = {
        "mcq": 10,
        "quiz": 15,
        "challenge": 25,
        "simulation": 40
    }.get(game_type.lower(), 10)
    
    # Multiplier by ADKAR stage (later stages are worth more)
    adkar_multiplier = {
        "awareness": 1.0,
        "desire": 1.2,
        "knowledge": 1.5,
        "ability": 1.8,
        "reinforcement": 2.0
    }.get(adkar_stage.lower(), 1.0)
    
    # Points scaled by complexity (number of key points)
    complexity_factor = 1 + (0.1 * min(10, num_key_points))
    
    return int(base_points * adkar_multiplier * complexity_factor)

def create_user_progress_response(progress: UserProgress) -> UserProgressResponse:
    """Create a response with user progress including level information"""
    
    # Calculate user level based on points
    level = 1 + (progress.points // 100)
    next_level_points = (level * 100)
    
    return UserProgressResponse(
        user_id=progress.user_id,
        points=progress.points,
        badges=progress.badges,
        completed_games=progress.completed_games,
        adkar_progress=progress.adkar_progress,
        level=level,
        next_level_points=next_level_points
    )