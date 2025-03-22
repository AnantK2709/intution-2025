import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Styled components
const PageSection = styled.section`
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.1;
    z-index: -1;
    
    &.shape-1 {
      width: 40vw;
      height: 40vw;
      background: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
      top: -10%;
      right: -10%;
    }
    
    &.shape-2 {
      width: 30vw;
      height: 30vw;
      background: ${({ theme }) => theme?.colors?.secondary || '#00b4d8'};
      bottom: 10%;
      left: -5%;
    }
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const GameHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
`;

const PageHeading = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  
  span {
    background: linear-gradient(to right, #6e00ff, #00b4d8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const GameDescription = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme?.colors?.text || '#4b5563'};
  max-width: 600px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
`;

const Instructions = styled.div`
  background: rgba(110, 0, 255, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 3rem;
  border-left: 4px solid #6e00ff;
  
  p {
    margin: 0;
    font-size: 0.95rem;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
`;

const QuestionNumber = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #6e00ff;
  margin-bottom: 0.75rem;
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionItem = styled.div`
  cursor: pointer;
  border: 2px solid ${({ selected }) => selected ? '#6e00ff' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    border-color: ${({ selected }) => selected ? '#6e00ff' : '#6e00ff50'};
    background: ${({ selected }) => selected ? 'rgba(110, 0, 255, 0.05)' : 'transparent'};
  }
  
  ${({ selected }) => selected && `
    background: rgba(110, 0, 255, 0.05);
  `}
`;

const OptionRadio = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ selected }) => selected ? '#6e00ff' : '#d1d5db'};
  margin-right: 1rem;
  position: relative;
  flex-shrink: 0;
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #6e00ff;
    opacity: ${({ selected }) => selected ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const OptionLabel = styled.div`
  flex: 1;
`;

const Button = styled(motion.button)`
  background: ${({ variant, theme }) => 
    variant === 'outline' 
      ? 'transparent' 
      : (theme?.colors?.primary || '#6e00ff')};
  color: ${({ variant }) => variant === 'outline' ? '#6e00ff' : 'white'};
  border: 2px solid ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
  border-radius: 9999px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(110, 0, 255, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ percent }) => `${percent}%`};
  background: linear-gradient(to right, #6e00ff, #00b4d8);
  border-radius: 9999px;
  transition: width 0.5s ease;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const ResultCard = styled(motion.div)`
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const ScoreCircle = styled(motion.div)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${({ score }) => {
    if (score >= 80) return 'linear-gradient(135deg, #10b981, #34d399)';
    if (score >= 50) return 'linear-gradient(135deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(135deg, #ef4444, #f87171)';
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  box-shadow: 0 10px 25px ${({ score }) => {
    if (score >= 80) return 'rgba(16, 185, 129, 0.2)';
    if (score >= 50) return 'rgba(245, 158, 11, 0.2)';
    return 'rgba(239, 68, 68, 0.2)';
  }};
`;

const ScorePercent = styled.div`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
`;

const ScoreLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const ResultTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  span {
    background: linear-gradient(to right, #6e00ff, #00b4d8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ResultMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme?.colors?.text || '#4b5563'};
`;

const Badge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme?.colors?.primary + '20' || 'rgba(110, 0, 255, 0.1)'};
  color: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0.5rem 0.75rem;
`;

const LoadingSpinner = styled.div`
  margin: 4rem auto;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid rgba(110, 0, 255, 0.1);
  border-top-color: #6e00ff;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;


const MCQGamePage = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [game, setGame] = useState(location.state?.game || null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [extractedQuestions, setExtractedQuestions] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState({
    game: !location.state?.game,
    submit: false
  });
  const [startTime] = useState(Date.now());

  // Helper function to extract questions from potentially nested structures
  const extractQuestions = (gameContent) => {
    if (!gameContent) return [];
    
    console.log("Analyzing game content:", gameContent);
    
    // Case 1: Direct array of questions
    if (Array.isArray(gameContent.questions)) {
      console.log("Found direct array of questions");
      return gameContent.questions;
    }
    
    // Case 2: Questions nested in an object
    if (typeof gameContent.questions === 'object' && gameContent.questions !== null) {
      // Check if it contains an array
      const nestedKeys = Object.keys(gameContent.questions);
      console.log("Questions object keys:", nestedKeys);
      
      if (nestedKeys.includes('questions') && Array.isArray(gameContent.questions.questions)) {
        console.log("Found nested questions array");
        return gameContent.questions.questions;
      }
      
      // Check if the object itself is a questions array with numeric keys
      if (nestedKeys.some(key => !isNaN(parseInt(key)))) {
        console.log("Found questions object with numeric keys");
        return Object.values(gameContent.questions);
      }
    }
    
    // Case 3: Check if the entire content object itself is the questions array
    if (gameContent && typeof gameContent === 'object') {
      const keys = Object.keys(gameContent);
      if (keys.includes('0') && keys.some(key => !isNaN(parseInt(key)))) {
        console.log("Content itself appears to be the questions array");
        return Object.values(gameContent);
      }
    }
    
    // Case 4: If we have an object with numeric keys that contains question objects
    if (typeof gameContent === 'object' && gameContent !== null) {
      const keys = Object.keys(gameContent);
      if (keys.some(key => !isNaN(parseInt(key))) && 
          typeof gameContent[keys[0]] === 'object' &&
          gameContent[keys[0]] !== null &&
          'text' in gameContent[keys[0]]) {
        console.log("Found questions as direct numeric properties");
        return Object.values(gameContent);
      }
    }
    
    console.log("No valid questions structure found");
    return [];
  };

  // Debug logging to check game data structure
  useEffect(() => {
    if (game) {
      console.log("Complete game object:", game);
      
      if (game && game.content) {
        console.log("Game content structure:", game.content);
        const questions = extractQuestions(game.content);
        if (questions && questions.length > 0) {
          console.log(`Successfully extracted ${questions.length} questions:`, questions);
          setExtractedQuestions(questions);
        } else {
          console.error("Failed to extract valid questions from game content");
        }
      }
    }
  }, [game]);
  
  // Fetch game data if not provided in location state
  useEffect(() => {
    const fetchGame = async () => {
      if (!location.state?.game) {
        try {
          setLoading(prev => ({ ...prev, game: true }));
          // First, fetch all games and filter by ID
          const response = await axios.get('http://localhost:8000/games');
          const games = response.data.games || [];
          const foundGame = games.find(g => g.game_id === gameId);
          
          if (foundGame) {
            setGame(foundGame);
            console.log("Found game:", foundGame);
          } else {
            // Navigate back if game not found
            console.error("Game not found with ID:", gameId);
            navigate('/games');
          }
        } catch (error) {
          console.error('Error fetching game:', error);
          navigate('/games');
        } finally {
          setLoading(prev => ({ ...prev, game: false }));
        }
      }
    };
    
    fetchGame();
  }, [gameId, location.state, navigate]);
  
  const handleSelectOption = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  const handleNextQuestion = () => {
    if (extractedQuestions.length > 0 && currentQuestion < extractedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const calculateScore = () => {
    if (!extractedQuestions || extractedQuestions.length === 0) return 0;
    
    let correctCount = 0;
    let totalQuestions = extractedQuestions.length;
    
    extractedQuestions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correctCount++;
      }
    });
    
    return Math.round((correctCount / totalQuestions) * 100);
  };
  
  const getResultMessage = (score) => {
    if (score >= 80) {
      return "Excellent work! You've demonstrated a great understanding of the concepts.";
    } else if (score >= 60) {
      return "Good job! You've grasped most of the key concepts.";
    } else if (score >= 40) {
      return "Nice effort! With a bit more practice, you'll master these concepts.";
    } else {
      return "Good start! Consider reviewing the material and trying again to strengthen your understanding.";
    }
  };
  
  const handleSubmit = async () => {
    const score = calculateScore();
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    setLoading(prev => ({ ...prev, submit: true }));
    
    try {
      // Default user ID for demo purposes
      const userId = 'user123';
      
      // Submit game completion
      const response = await axios.post('http://localhost:8000/complete_game', {
        user_id: userId,
        game_id: game.game_id,
        score,
        time_taken: timeTaken
      });
      
      setResult({
        score,
        time_taken: timeTaken,
        progress: response.data
      });
      
      setCompleted(true);
    } catch (error) {
      console.error('Error submitting game completion:', error);
      
      // Even if the API call fails, show result
      setResult({
        score,
        time_taken: timeTaken,
        progress: null
      });
      
      setCompleted(true);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };
  
  const handlePlayAgain = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setCompleted(false);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading.game || !game) {
    return (
      <PageSection>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <Container>
          <LoadingSpinner />
        </Container>
      </PageSection>
    );
  }
  
  // Check if game content is properly formatted
  if (!game.content || extractedQuestions.length === 0) {
    return (
      <PageSection>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <Container>
          <Card>
            <h2>Error: Invalid Game Content</h2>
            <p>This game doesn't contain valid questions. Please try another game or contact support.</p>
            <Button 
              onClick={() => navigate('/games')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Games
            </Button>
          </Card>
        </Container>
      </PageSection>
    );
  }
  
  // Get current question data
  const questions = extractedQuestions;
  const currentQuestionData = questions[currentQuestion] || {};
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  // Render the game UI
  return (
    <PageSection>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      
      <Container>
        {!completed ? (
          <>
            <GameHeader>
              <PageHeading
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span>{game.title}</span>
              </PageHeading>
              
              <GameDescription>{game.description}</GameDescription>
              
              <Instructions>
                <p>{game.instructions}</p>
              </Instructions>
              
              <ProgressBar>
                <ProgressFill percent={progress} />
              </ProgressBar>
            </GameHeader>
            
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <QuestionNumber>Question {currentQuestion + 1} of {questions.length}</QuestionNumber>
                <QuestionText>{currentQuestionData.text}</QuestionText>
                
                <OptionsList>
                  {currentQuestionData.options && Array.isArray(currentQuestionData.options) ? (
                    currentQuestionData.options.map(option => (
                      <OptionItem 
                        key={option.id} 
                        selected={answers[currentQuestionData.id] === option.id}
                        onClick={() => handleSelectOption(currentQuestionData.id, option.id)}
                      >
                        <OptionRadio selected={answers[currentQuestionData.id] === option.id} />
                        <OptionLabel>{option.text}</OptionLabel>
                      </OptionItem>
                    ))
                  ) : (
                    <p>Error: This question doesn't have valid options.</p>
                  )}
                </OptionsList>
                
                <Navigation>
                  <Button 
                    variant="outline"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestion === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Previous
                  </Button>
                  
                  {currentQuestion < questions.length - 1 ? (
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={!answers[currentQuestionData.id]}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={!answers[currentQuestionData.id] || loading.submit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading.submit ? 'Submitting...' : 'Submit'}
                    </Button>
                  )}
                </Navigation>
              </Card>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ResultCard>
              <ScoreCircle 
                score={result.score}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
              >
                <ScorePercent>{result.score}%</ScorePercent>
                <ScoreLabel>Score</ScoreLabel>
              </ScoreCircle>
              
              <ResultTitle>
                <span>Game Completed!</span>
              </ResultTitle>
              
              <ResultMessage>
                {getResultMessage(result.score)}
              </ResultMessage>
              
              {result.progress && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontWeight: '600', marginBottom: '1rem' }}>Rewards:</div>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      +{result.progress.points - (result.progress.points - Math.round(game.points * (result.score / 100)))} points earned
                    </div>
                    
                    {result.progress.badges && result.progress.badges.length > 0 && (
                      <div>
                        <div style={{ marginBottom: '0.5rem' }}>Badges earned:</div>
                        <div>
                          {result.progress.badges.map((badge, index) => (
                            <Badge key={index}>{badge}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Button 
                  variant="outline"
                  onClick={handlePlayAgain}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Play Again
                </Button>
                
                <Button 
                  onClick={() => navigate('/games')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  All Games
                </Button>
              </div>
            </ResultCard>
          </motion.div>
        )}
      </Container>
    </PageSection>
  );
};

export default MCQGamePage;