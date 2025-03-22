import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Styled components (matching existing style)
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
    background: linear-gradient(to right, #6e00ff, #f59e0b);
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
  background: rgba(245, 158, 11, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 3rem;
  border-left: 4px solid #f59e0b;
  
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

const StageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const StageName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  
  span {
    color: #f59e0b;
  }
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ timeRunningOut }) => 
    timeRunningOut ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  border-radius: 9999px;
  color: ${({ timeRunningOut }) => timeRunningOut ? '#ef4444' : '#f59e0b'};
  font-weight: 600;
  transition: background 0.3s ease, color 0.3s ease;
`;

const StageDescription = styled.p`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme?.colors?.text || '#4b5563'};
`;

const TaskContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid #f59e0b;
`;

const TaskTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TaskText = styled.p`
  margin: 0;
  line-height: 1.6;
`;

const ResponseContainer = styled.div`
  margin-bottom: 2rem;
`;

const ResponseTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  transition: all 0.3s ease;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
`;

const SuccessCriteria = styled.div`
  margin-bottom: 2rem;
  
  h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme?.colors?.text || '#4b5563'};
    }
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
  background: linear-gradient(to right, #f59e0b, #fbbf24);
  border-radius: 9999px;
  transition: width 0.5s ease;
`;

const Button = styled(motion.button)`
  background: ${({ variant, theme }) => 
    variant === 'outline' 
      ? 'transparent' 
      : (theme?.colors?.primary || '#f59e0b')};
  color: ${({ variant }) => variant === 'outline' ? '#f59e0b' : 'white'};
  border: 2px solid ${({ theme }) => theme?.colors?.primary || '#f59e0b'};
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
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
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
    background: linear-gradient(to right, #6e00ff, #f59e0b);
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
  border: 3px solid rgba(245, 158, 11, 0.1);
  border-top-color: #f59e0b;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const StageSummary = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
`;

const StageSummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const StageSummaryLabel = styled.div`
  font-weight: 500;
`;

const StageSummaryValue = styled.div`
  font-weight: 600;
  color: ${({ completed }) => completed ? '#10b981' : '#f59e0b'};
`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const ChallengeGamePage = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [game, setGame] = useState(location.state?.game || null);
  const [currentStage, setCurrentStage] = useState(0);
  const [responses, setResponses] = useState({});
  const [timer, setTimer] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [stageStartTime, setStageStartTime] = useState(null);
  const [stageTimes, setStageTimes] = useState({});
  const [loading, setLoading] = useState({
    game: !location.state?.game,
    submit: false
  });
  const [startTime] = useState(Date.now());
  const timerRef = useRef(null);
  
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
          } else {
            // Navigate back if game not found
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
  
  // Initialize timer when stage changes
  useEffect(() => {
    if (game && game.content.stages && game.content.stages[currentStage]) {
      const stage = game.content.stages[currentStage];
      const timeLimit = stage.time_limit || 120; // Default to 2 minutes if not specified
      
      setTimer(timeLimit);
      setStageStartTime(Date.now());
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start countdown
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Cleanup timer on component unmount or stage change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [game, currentStage]);
  
  const handleResponseChange = (stageId, value) => {
    setResponses(prev => ({
      ...prev,
      [stageId]: value
    }));
  };
  
  const handleNextStage = () => {
    if (game && game.content.stages) {
      // Record completion time for current stage
      const elapsedTime = Math.round((Date.now() - stageStartTime) / 1000);
      
      setStageTimes(prev => ({
        ...prev,
        [game.content.stages[currentStage].id]: elapsedTime
      }));
      
      // Move to next stage
      if (currentStage < game.content.stages.length - 1) {
        setCurrentStage(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  
  const handlePrevStage = () => {
    if (currentStage > 0) {
      setCurrentStage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const calculateScore = () => {
    if (!game || !game.content.stages) return 0;
    
    const stages = game.content.stages;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    stages.forEach(stage => {
      const stageId = stage.id;
      const response = responses[stageId] || '';
      const timeLimit = stage.time_limit || 120;
      const completionTime = stageTimes[stageId] || timeLimit;
      
      // Basic scoring: 70% for content, 30% for speed
      const contentScore = response.length > 50 ? 70 : Math.min(70, response.length * 1.4);
      const timeScore = Math.max(0, 30 * (1 - completionTime / timeLimit));
      
      const stageScore = Math.round(contentScore + timeScore);
      earnedPoints += stageScore;
      totalPoints += 100;
    });
    
    return Math.round((earnedPoints / totalPoints) * 100);
  };
  
  const getResultMessage = (score) => {
    if (score >= 80) {
      return "Excellent work! You've demonstrated great ability to apply the concepts under pressure.";
    } else if (score >= 60) {
      return "Good job! You've shown solid skills in putting your knowledge into practice.";
    } else if (score >= 40) {
      return "Nice effort! With more practice, you'll improve your speed and application of these concepts.";
    } else {
      return "Good start! Continue to practice applying these concepts in timed situations.";
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const isStageComplete = (stageId) => {
    return !!responses[stageId] && responses[stageId].trim().length > 0;
  };
  
  const handleSubmit = async () => {
    // Record completion time for final stage if not already recorded
    if (game && game.content.stages && !stageTimes[game.content.stages[currentStage].id]) {
      const elapsedTime = Math.round((Date.now() - stageStartTime) / 1000);
      
      setStageTimes(prev => ({
        ...prev,
        [game.content.stages[currentStage].id]: elapsedTime
      }));
    }
    
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
        progress: response.data,
        stage_times: stageTimes
      });
      
      setCompleted(true);
    } catch (error) {
      console.error('Error submitting game completion:', error);
      
      // Even if the API call fails, show result
      setResult({
        score,
        time_taken: timeTaken,
        progress: null,
        stage_times: stageTimes
      });
      
      setCompleted(true);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };
  
  const handlePlayAgain = () => {
    setResponses({});
    setCurrentStage(0);
    setCompleted(false);
    setResult(null);
    setStageTimes({});
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
  
  // Get current stage data
  const stages = game.content.stages;
  const currentStageData = stages[currentStage];
  const progress = ((currentStage + 1) / stages.length) * 100;
  const timeRunningOut = timer <= 30; // 30 seconds remaining
  
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
              key={currentStage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <StageHeader>
                  <StageName>
                    Stage {currentStage + 1}: <span>{currentStageData.name}</span>
                  </StageName>
                  
                  <TimerContainer timeRunningOut={timeRunningOut}>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    {formatTime(timer)}
                  </TimerContainer>
                </StageHeader>
                
                <StageDescription>{currentStageData.description}</StageDescription>
                
                <TaskContainer>
                  <TaskTitle>
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" 
                        stroke="#f59e0b" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    Your Task
                  </TaskTitle>
                  <TaskText>{currentStageData.task}</TaskText>
                </TaskContainer>
                
                <ResponseContainer>
                  <ResponseTextarea 
                    value={responses[currentStageData.id] || ''}
                    onChange={(e) => handleResponseChange(currentStageData.id, e.target.value)}
                    placeholder="Type your response here..."
                  />
                </ResponseContainer>
                
                <SuccessCriteria>
                  <h4>Success Criteria:</h4>
                  <ul>
                    <li>{currentStageData.success_criteria}</li>
                    <li>Complete the task within the time limit</li>
                  </ul>
                </SuccessCriteria>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outline"
                    onClick={handlePrevStage}
                    disabled={currentStage === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Previous Stage
                  </Button>
                  
                  {currentStage < stages.length - 1 ? (
                    <Button 
                      onClick={handleNextStage}
                      disabled={!isStageComplete(currentStageData.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next Stage
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={!isStageComplete(currentStageData.id) || loading.submit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading.submit ? 'Submitting...' : 'Submit Challenge'}
                    </Button>
                  )}
                </div>
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
                <span>Challenge Completed!</span>
              </ResultTitle>
              
              <ResultMessage>
                {getResultMessage(result.score)}
              </ResultMessage>
              
              <StageSummary>
                <h4 style={{ marginBottom: '1rem' }}>Stage Completion Times:</h4>
                {stages.map((stage, index) => {
                  const timeSpent = result.stage_times[stage.id] || 0;
                  const timeLimit = stage.time_limit || 120;
                  const withinLimit = timeSpent <= timeLimit;
                  
                  return (
                    <StageSummaryItem key={stage.id}>
                      <StageSummaryLabel>Stage {index + 1}: {stage.name}</StageSummaryLabel>
                      <StageSummaryValue completed={withinLimit}>
                        {formatTime(timeSpent)} / {formatTime(timeLimit)}
                      </StageSummaryValue>
                    </StageSummaryItem>
                  );
                })}
                
                <StageSummaryItem style={{ marginTop: '1rem', fontWeight: '600' }}>
                  <StageSummaryLabel>Total Time</StageSummaryLabel>
                  <StageSummaryValue>{formatTime(result.time_taken)}</StageSummaryValue>
                </StageSummaryItem>
              </StageSummary>
              
              {result.progress && (
                <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
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
                  Try Again
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

export default ChallengeGamePage;