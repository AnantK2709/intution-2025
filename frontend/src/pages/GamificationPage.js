import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Styled components remain the same as the original GamificationPage
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
`;

// Include all the original styled components...

// New styled components for success message
const SuccessMessage = styled(motion.div)`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
`;

const SuccessIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 0.875rem;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236e00ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #6e00ff;
    box-shadow: 0 0 0 3px rgba(110, 0, 255, 0.1);
  }
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

const LoadingSpinner = styled.div`
  margin: 2rem auto;
  width: 40px;
  height: 40px;
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

// Updated GamificationPage to handle incoming data from PromptFlow
const GamificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract gameCreationData if it exists in location state
    const gameCreationData = location.state?.gameCreationData;

    const [games, setGames] = useState([]);
    const [recommendedGames, setRecommendedGames] = useState([]);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState({
        games: true,
        progress: true,
        recommended: true,
        creating: false
    });
    const [activeTab, setActiveTab] = useState('recommended');
    const [filters, setFilters] = useState({
        adkar_stage: '',
        change_type: ''
    });
    const [userId, setUserId] = useState('user123'); // Default user ID for demo
    const [showGameCreationSuccess, setShowGameCreationSuccess] = useState(false);
    const [createdGame, setCreatedGame] = useState(null);
    const [showGameTypeModal, setShowGameTypeModal] = useState(false);
    const [selectedGameType, setSelectedGameType] = useState('mcq');

    // Auto-create game if data is passed from PromptFlow
    useEffect(() => {
        if (gameCreationData) {
            setShowGameTypeModal(true);
        }
    }, [gameCreationData]);

    // Fetch games, user progress, and recommendations on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch games
                const gamesResponse = await axios.get(`http://localhost:8000/games`);
                setGames(gamesResponse.data.games || []);
                setLoading(prev => ({ ...prev, games: false }));

                // Fetch user progress
                const progressResponse = await axios.get(`http://localhost:8000/user_progress/${userId}`);
                setUserProgress(progressResponse.data);
                setLoading(prev => ({ ...prev, progress: false }));

                // Fetch recommendations
                const recommendationsResponse = await axios.get(`http://localhost:8000/recommend_games/${userId}`);
                setRecommendedGames(recommendationsResponse.data.recommended_games || []);
                setLoading(prev => ({ ...prev, recommended: false }));
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading({
                    games: false,
                    progress: false,
                    recommended: false,
                    creating: false
                });
            }
        };

        fetchData();
    }, [userId]);

    // Filter games when filter values change
    useEffect(() => {
        const fetchFilteredGames = async () => {
            try {
                setLoading(prev => ({ ...prev, games: true }));

                // Build query params
                const params = new URLSearchParams();
                if (filters.adkar_stage) params.append('adkar_stage', filters.adkar_stage);
                if (filters.change_type) params.append('change_type', filters.change_type);

                const response = await axios.get(
                    `http://localhost:8000/games${params.toString() ? `?${params.toString()}` : ''}`
                );

                setGames(response.data.games || []);
                setLoading(prev => ({ ...prev, games: false }));
            } catch (error) {
                console.error('Error fetching filtered games:', error);
                setLoading(prev => ({ ...prev, games: false }));
            }
        };

        if (activeTab === 'all') {
            fetchFilteredGames();
        }
    }, [filters, activeTab]);

    // Create game with data from PromptFlow
    const handleCreateGame = async () => {
        if (!gameCreationData) return;

        setShowGameTypeModal(false);
        setLoading(prev => ({ ...prev, creating: true }));

        // Update game type from user selection
        const gameData = {
            ...gameCreationData,
            game_type: selectedGameType
        };

        try {
            const response = await axios.post('http://localhost:8000/create_game', gameData);

            if (response.data) {
                // Update games list with the new game
                setCreatedGame(response.data);

                // Refresh games lists
                const gamesResponse = await axios.get(`http://localhost:8000/games`);
                setGames(gamesResponse.data.games || []);

                const recommendationsResponse = await axios.get(`http://localhost:8000/recommend_games/${userId}`);
                setRecommendedGames(recommendationsResponse.data.recommended_games || []);

                // Show success message
                setShowGameCreationSuccess(true);

                // Auto-scroll to the success message
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
            }
        } catch (error) {
            console.error('Error creating game:', error);
        } finally {
            setLoading(prev => ({ ...prev, creating: false }));
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);

        // Reset filters when switching to recommended tab
        if (tab === 'recommended') {
            setFilters({
                adkar_stage: '',
                change_type: ''
            });
        }
    };

    const navigateToGame = (game) => {
        // Navigate to the appropriate game page based on game type
        navigate(`/play/${game.game_type}/${game.game_id}`, { state: { game } });
    };

    const handlePlayCreatedGame = () => {
        if (createdGame) {
            navigateToGame(createdGame);
        }
    };

    const changeTypeOptions = [
        { value: '', label: 'All Change Types' },
        { value: 'technology', label: 'Technology' },
        { value: 'process', label: 'Process' },
        { value: 'organizational', label: 'Organizational' }
    ];

    const gameTypeOptions = [
        { value: 'mcq', label: 'Multiple Choice Questions' },
        { value: 'quiz', label: 'Mixed Quiz (T/F & Fill-in-blank)' },
        { value: 'challenge', label: 'Timed Challenge' },
        { value: 'simulation', label: 'Decision Simulation' }
    ];

    // ADKAR stages info
    const adkarStages = [
        { key: 'awareness', label: 'Awareness' },
        { key: 'desire', label: 'Desire' },
        { key: 'knowledge', label: 'Knowledge' },
        { key: 'ability', label: 'Ability' },
        { key: 'reinforcement', label: 'Reinforcement' }
    ];

    return (
        <PageSection>
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>

            <Container>
                {/* Page Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}
                >
                    Change Management{' '}
                    <span style={{
                        background: 'linear-gradient(to right, #6e00ff, #00b4d8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Gamification
                    </span>
                </motion.h1>

                {/* Success message when game is created */}
                {showGameCreationSuccess && createdGame && (
                    <SuccessMessage
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SuccessIcon>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </SuccessIcon>
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem', fontWeight: '600' }}>Game Created Successfully!</h3>
                            <p style={{ margin: '0 0 1rem' }}>
                                Your {gameTypeOptions.find(t => t.value === createdGame.game_type)?.label} game "{createdGame.title}" is now ready to play.
                            </p>
                            <Button
                                onClick={handlePlayCreatedGame}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Play Now
                            </Button>
                        </div>
                    </SuccessMessage>
                )}

                {loading.creating && (
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(110, 0, 255, 0.05)', borderRadius: '12px', marginBottom: '2rem' }}>
                        <LoadingSpinner />
                        <p style={{ marginTop: '1rem', fontWeight: '500' }}>
                            Creating your AI-powered game... This may take a few seconds.
                        </p>
                    </div>
                )}

                {/* Rest of the original GamificationPage component... */}
                {/* Include the user progress card, tabs, filters, and game cards */}

                {/* Link back to communication page */}
                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <Link to="/generate-email" style={{ textDecoration: 'none' }}>
                        <Button
                            variant="outline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Back to Change Communication
                        </Button>
                    </Link>
                </div>
            </Container>

            {/* Game Type Selection Modal */}
            {showGameTypeModal && (
                <Modal
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <ModalContent
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Choose Game Type</h2>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Select the type of game you want to create from your change communication content:
                        </p>

                        <FormGroup>
                            <FormLabel htmlFor="gameType">Game Type</FormLabel>
                            <FormSelect
                                id="gameType"
                                value={selectedGameType}
                                onChange={(e) => setSelectedGameType(e.target.value)}
                            >
                                {gameTypeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormGroup>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                            <Button
                                variant="outline"
                                onClick={() => setShowGameTypeModal(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleCreateGame}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Create Game
                            </Button>
                        </div>
                    </ModalContent>
                </Modal>
            )}
        </PageSection>
    );
};

export default GamificationPage;