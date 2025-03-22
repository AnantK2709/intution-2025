import React, { useState, useEffect } from 'react';
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
    background: linear-gradient(to right, #6e00ff, #d9376e);
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
  background: rgba(217, 55, 110, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 3rem;
  border-left: 4px solid #d9376e;
  
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

const ScenarioCard = styled(Card)`
  text-align: left;
`;

const ScenarioTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  
  span {
    color: #d9376e;
  }
`;

const ScenarioDescription = styled.p`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme?.colors?.text || '#4b5563'};
  line-height: 1.6;
`;

const DecisionContainer = styled.div`
  margin-bottom: 2rem;
`;

const DecisionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DecisionOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DecisionOption = styled.div`
  cursor: pointer;
  border: 2px solid ${({ selected }) => selected ? '#d9376e' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ selected }) => selected ? '#d9376e' : '#d9376e50'};
    background: ${({ selected }) => selected ? 'rgba(217, 55, 110, 0.05)' : 'transparent'};
  }
  
  ${({ selected }) => selected && `
    background: rgba(217, 55, 110, 0.05);
  `}
`;

const OutcomeCard = styled(motion.div)`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 2rem;
  border-left: 3px solid #d9376e;
`;

const OutcomeTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #d9376e;
`;

const OutcomeText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ImpactContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const ImpactItem = styled.div`
  background: ${({ value }) => {
    if (value > 0) return 'rgba(16, 185, 129, 0.1)';
    if (value < 0) return 'rgba(239, 68, 68, 0.1)';
    return 'rgba(107, 114, 128, 0.1)';
  }};
  color: ${({ value }) => {
    if (value > 0) return '#10b981';
    if (value < 0) return '#ef4444';
    return '#6b7280';
  }};
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  background: linear-gradient(to right, #d9376e, #f04786);
  border-radius: 9999px;
  transition: width 0.5s ease;
`;

const Button = styled(motion.button)`
  background: ${({ variant, theme }) => 
    variant === 'outline' 
      ? 'transparent' 
      : (theme?.colors?.primary || '#d9376e')};
  color: ${({ variant }) => variant === 'outline' ? '#d9376e' : 'white'};
  border: 2px solid ${({ theme }) => theme?.colors?.primary || '#d9376e'};
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
    box-shadow: 0 4px 12px rgba(217, 55, 110, 0.15);
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
    background: linear-gradient(to right, #6e00ff, #d9376e);
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
  border: 3px solid rgba(217, 55, 110, 0.1);
  border-top-color: #d9376e;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ScenarioSummary = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
`;

const ScenarioSummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ScenarioSummaryLabel = styled.div`
  font-weight: 500;
`;

const ScenarioSummaryValue = styled.div`
  font-weight: 600;
  color: ${({ impact }) => {
    if (impact > 0) return '#10b981';
    if (impact < 0) return '#ef4444';
    return '#6b7280';
  }};
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

const SimulationGamePage = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [game, setGame] = useState(location.state?.game || null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [decisions, setDecisions] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [extractedScenarios, setExtractedScenarios] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState({
    game: !location.state?.game,
    submit: false
  });
  const [startTime] = useState(Date.now());
  
  // Helper function to extract scenarios from potentially nested structures
  const extractScenarios = (gameContent) => {
    if (!gameContent) return [];
    
    console.log("Analyzing simulation game content:", gameContent);
    
    // Case 1: Direct array of scenarios
    if (Array.isArray(gameContent.scenarios)) {
      console.log("Found direct array of scenarios");
      return gameContent.scenarios;
    }
    
    // Case 2: Scenarios nested in an object
    if (typeof gameContent.scenarios === 'object' && gameContent.scenarios !== null) {
      // Check if it contains an array
      const nestedKeys = Object.keys(gameContent.scenarios);
      console.log("Scenarios object keys:", nestedKeys);
      
      if (nestedKeys.includes('scenarios') && Array.isArray(gameContent.scenarios.scenarios)) {
        console.log("Found nested scenarios array");
        return gameContent.scenarios.scenarios;
      }
      
      // Check if the object itself is a scenarios array with numeric keys
      if (nestedKeys.some(key => !isNaN(parseInt(key)))) {
        console.log("Found scenarios object with numeric keys");
        return Object.values(gameContent.scenarios);
      }
    }
    
    // Case 3: Check if the entire content object itself is the scenarios array
    if (gameContent && typeof gameContent === 'object') {
      const keys = Object.keys(gameContent);
      if (keys.includes('0') && keys.some(key => !isNaN(parseInt(key)))) {
        console.log("Content itself appears to be the scenarios array");
        return Object.values(gameContent);
      }
    }
    
    // Case 4: If we have an object with numeric keys that contains scenario objects
    if (typeof gameContent === 'object' && gameContent !== null) {
      const keys = Object.keys(gameContent);
      if (keys.some(key => !isNaN(parseInt(key))) && 
          typeof gameContent[keys[0]] === 'object' &&
          gameContent[keys[0]] !== null &&
          ('title' in gameContent[keys[0]] || 'description' in gameContent[keys[0]])) {
        console.log("Found scenarios as direct numeric properties");
        return Object.values(gameContent);
      }
    }
    
    console.log("No valid scenarios structure found");
    return [];
  };

  // Debug logging to check game data structure
  useEffect(() => {
    if (game) {
      console.log("Complete simulation game object:", game);
      
      if (game && game.content) {
        console.log("Simulation game content structure:", game.content);
        const scenarios = extractScenarios(game.content);
        if (scenarios && scenarios.length > 0) {
          console.log(`Successfully extracted ${scenarios.length} simulation scenarios:`, scenarios);
          setExtractedScenarios(scenarios);
        } else {
          console.error("Failed to extract valid scenarios from simulation game content");
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
  
  const handleSelectDecision = (scenarioId, decisionId) => {
    setDecisions(prev => ({
      ...prev,
      [scenarioId]: decisionId
    }));
    
    // Show outcome after decision
    setShowOutcome(true);
  };
  
  const handleNextScenario = () => {
    if (extractedScenarios.length > 0) {
      if (currentScenario < extractedScenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setShowOutcome(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  
  const handlePrevScenario = () => {
    if (currentScenario > 0) {
      setCurrentScenario(prev => prev - 1);
      setShowOutcome(true); // Show the outcome from previous decision
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const hasDecisionForCurrentScenario = () => {
    if (!extractedScenarios || extractedScenarios.length === 0) return false;
    
    const scenarioId = extractedScenarios[currentScenario].id;
    return !!decisions[scenarioId];
  };
  
  const getCurrentOutcome = () => {
    if (!extractedScenarios || extractedScenarios.length === 0 || !hasDecisionForCurrentScenario()) return null;
    
    const scenario = extractedScenarios[currentScenario];
    const decisionId = decisions[scenario.id];
    
    // Find the selected decision
    const selectedDecision = scenario.decisions.find(d => d.id === decisionId);
    if (!selectedDecision) return null;
    
    // Get the outcome based on the decision
    const outcomeId = selectedDecision.outcome_id;
    return scenario.outcomes[outcomeId] || null;
  };
  
  const calculateTotalImpact = () => {
    if (!extractedScenarios || extractedScenarios.length === 0) return { timeline: 0, adoption: 0, results: 0 };
    
    const totalImpact = { timeline: 0, adoption: 0, results: 0 };
    
    extractedScenarios.forEach(scenario => {
      const decisionId = decisions[scenario.id];
      if (!decisionId) return;
      
      // Find the selected decision
      const selectedDecision = scenario.decisions.find(d => d.id === decisionId);
      if (!selectedDecision) return;
      
      // Get the outcome based on the decision
      const outcomeId = selectedDecision.outcome_id;
      const outcome = scenario.outcomes[outcomeId];
      if (!outcome || !outcome.impact) return;
      
      // Add impact values
      Object.entries(outcome.impact).forEach(([key, value]) => {
        if (totalImpact[key] !== undefined) {
          totalImpact[key] += value;
        }
      });
    });
    
    return totalImpact;
  };
  
  const calculateScore = () => {
    if (!extractedScenarios || extractedScenarios.length === 0) return 0;
    
    // Calculate score based on the total impact
    const totalImpact = calculateTotalImpact();
    
    // Weight the different impact categories (this can be customized)
    const adoptionWeight = 0.4;  // 40%
    const resultsWeight = 0.4;   // 40% 
    const timelineWeight = 0.2;  // 20%
    
    // Normalize impacts to 0-100 scale (assuming impacts range from -50 to +50)
    const normalizeImpact = (impact) => ((impact + 50) / 100) * 100;
    
    const adoptionScore = normalizeImpact(totalImpact.adoption) * adoptionWeight;
    const resultsScore = normalizeImpact(totalImpact.results) * resultsWeight;
    const timelineScore = normalizeImpact(totalImpact.timeline) * timelineWeight;
    
    return Math.round(adoptionScore + resultsScore + timelineScore);
  };
  
  const getResultMessage = (score) => {
    if (score >= 80) {
      return "Excellent work! Your decisions show strong strategic thinking and change management skills.";
    } else if (score >= 60) {
      return "Good job! You've made mostly effective decisions for implementing change.";
    } else if (score >= 40) {
      return "You've made some good decisions, but there's room for improvement in your change management approach.";
    } else {
      return "This simulation highlights areas where your change management strategy could be strengthened. Consider trying again with different approaches.";
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
        progress: response.data,
        total_impact: calculateTotalImpact()
      });
      
      setCompleted(true);
    } catch (error) {
      console.error('Error submitting game completion:', error);
      
      // Even if the API call fails, show result
      setResult({
        score,
        time_taken: timeTaken,
        progress: null,
        total_impact: calculateTotalImpact()
      });
      
      setCompleted(true);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };
  
  const handlePlayAgain = () => {
    setDecisions({});
    setCurrentScenario(0);
    setShowOutcome(false);
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
  if (!game.content || extractedScenarios.length === 0) {
    return (
      <PageSection>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <Container>
          <Card>
            <h2>Error: Invalid Game Content</h2>
            <p>This game doesn't contain valid scenarios. Please try another game or contact support.</p>
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
  
  // Get current scenario data
  const scenarios = extractedScenarios;
  const currentScenarioData = scenarios[currentScenario] || {};
  const progress = scenarios.length > 0 ? ((currentScenario + 1) / scenarios.length) * 100 : 0;
  const outcome = showOutcome ? getCurrentOutcome() : null;
  
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
              key={currentScenario}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ScenarioCard>
                <ScenarioTitle>
                  Scenario {currentScenario + 1}: <span>{currentScenarioData.title}</span>
                </ScenarioTitle>
                
                <ScenarioDescription>{currentScenarioData.description}</ScenarioDescription>
                
                <DecisionContainer>
                  <DecisionTitle>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" 
                        stroke="#d9376e" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M22 4L12 14.01L9 11.01" 
                        stroke="#d9376e" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    Make Your Decision
                  </DecisionTitle>
                  
                  <DecisionOptions>
                    {currentScenarioData.decisions.map(decision => (
                      <DecisionOption 
                        key={decision.id}
                        selected={decisions[currentScenarioData.id] === decision.id}
                        onClick={() => !showOutcome && handleSelectDecision(currentScenarioData.id, decision.id)}
                      >
                        {decision.text}
                      </DecisionOption>
                    ))}
                  </DecisionOptions>
                </DecisionContainer>
                
                {showOutcome && outcome && (
                  <OutcomeCard
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <OutcomeTitle>Outcome</OutcomeTitle>
                    <OutcomeText>{outcome.text}</OutcomeText>
                    
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Impact:</div>
                      <ImpactContainer>
                        {Object.entries(outcome.impact).map(([key, value]) => (
                          <ImpactItem key={key} value={value}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                            {value > 0 ? ' +' : ' '}
                            {value}
                          </ImpactItem>
                        ))}
                      </ImpactContainer>
                    </div>
                  </OutcomeCard>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                  <Button 
                    variant="outline"
                    onClick={handlePrevScenario}
                    disabled={currentScenario === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Previous Scenario
                  </Button>
                  
                  {currentScenario < scenarios.length - 1 ? (
                    <Button 
                      onClick={handleNextScenario}
                      disabled={!hasDecisionForCurrentScenario()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next Scenario
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={!hasDecisionForCurrentScenario() || loading.submit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading.submit ? 'Submitting...' : 'Complete Simulation'}
                    </Button>
                  )}
                </div>
              </ScenarioCard>
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
                <span>Simulation Completed!</span>
              </ResultTitle>
              
              <ResultMessage>
                {getResultMessage(result.score)}
              </ResultMessage>
              
              <ScenarioSummary>
                <h4 style={{ marginBottom: '1rem' }}>Your Change Management Impact:</h4>
                <ScenarioSummaryItem>
                  <ScenarioSummaryLabel>Timeline</ScenarioSummaryLabel>
                  <ScenarioSummaryValue impact={result.total_impact.timeline}>
                    {result.total_impact.timeline > 0 ? '+' : ''}
                    {result.total_impact.timeline}
                  </ScenarioSummaryValue>
                </ScenarioSummaryItem>
                
                <ScenarioSummaryItem>
                  <ScenarioSummaryLabel>Adoption</ScenarioSummaryLabel>
                  <ScenarioSummaryValue impact={result.total_impact.adoption}>
                    {result.total_impact.adoption > 0 ? '+' : ''}
                    {result.total_impact.adoption}
                  </ScenarioSummaryValue>
                </ScenarioSummaryItem>
                
                <ScenarioSummaryItem>
                  <ScenarioSummaryLabel>Results</ScenarioSummaryLabel>
                  <ScenarioSummaryValue impact={result.total_impact.results}>
                    {result.total_impact.results > 0 ? '+' : ''}
                    {result.total_impact.results}
                  </ScenarioSummaryValue>
                </ScenarioSummaryItem>
              </ScenarioSummary>
              
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

export default SimulationGamePage;