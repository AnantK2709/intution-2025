import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import { useSmoothScroll } from './hooks/useAnimations';
import PromptFlowPage from './pages/PromptFlowPage';
import StrategyAssistantPage from './pages/StrategyAssistantPage';
import RAGQueryPage from './pages/RAGQueryPage';
import DraftReviewPage from './pages/DraftReviewPage';

// Game Pages
import GamificationPage from './pages/GamificationPage';
import MCQGamePage from './pages/MCQGamePage';
import QuizGamePage from './pages/QuizGamePage';
import ChallengeGamePage from './pages/ChallengeGamePage';
import SimulationGamePage from './pages/SimulationGamePage';
import FAQPage from './pages/FAQPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import WorkDetailPage from './pages/WorkDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Styled components
const PageTransition = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: ${({ theme }) => theme.colors.background};
  pointer-events: none;
`;

const MainWrapper = styled.div`
  position: relative;
  min-height: 100vh;
`;

// AnimatePresence wrapper for page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  const locomotiveScroll = useSmoothScroll();
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Update locomotive scroll if it's active
    if (locomotiveScroll) {
      setTimeout(() => {
        locomotiveScroll.update();
      }, 500);
    }
  }, [location.pathname, locomotiveScroll]);
  
  // Page transition variants
  const pageTransitionVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1]
      }
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransitionVariants}
        style={{ width: '100%' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<PromptFlowPage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/about" element={<StrategyAssistantPage />} />
          <Route path="/contact" element={<RAGQueryPage/>} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/generate-email" element={<PromptFlowPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/review" element={<DraftReviewPage />} />
          {/* Gamification Routes */}
          <Route path="/games" element={<GamificationPage />} />
          <Route path="/play/mcq/:gameId" element={<MCQGamePage />} />
          <Route path="/play/quiz/:gameId" element={<QuizGamePage />} />
          <Route path="/play/challenge/:gameId" element={<ChallengeGamePage />} />
          <Route path="/play/simulation/:gameId" element={<SimulationGamePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ThemeProvider>
      <GlobalStyles />
      <BrowserRouter>
        <MainWrapper data-scroll-container>
          
          <AnimatePresence mode="wait">
            {!isPageLoaded && (
              <PageTransition
                initial={{ scaleY: 1 }}
                exit={{ 
                  scaleY: 0, 
                  transformOrigin: 'top',
                  transition: { 
                    duration: 1, 
                    ease: [0.76, 0, 0.24, 1] 
                  }
                }}
              />
            )}
          </AnimatePresence>
          
          <Header />
          <AnimatedRoutes />
          <Footer />
        </MainWrapper>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;