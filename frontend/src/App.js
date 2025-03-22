<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> origin/Anant
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import { useSmoothScroll } from './hooks/useAnimations';
<<<<<<< HEAD
import PromptFlowPage from './pages/PromptFlowPage';
import StrategyAssistantPage from './pages/StrategyAssistantPage';
=======

>>>>>>> origin/Anant
// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
<<<<<<< HEAD
=======
import WorkPage from './pages/WorkPage';
import AboutPage from './pages/AboutPage';
>>>>>>> origin/Anant
import ContactPage from './pages/ContactPage';
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
<<<<<<< HEAD
          <Route path="/work" element={<PromptFlowPage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/about" element={<StrategyAssistantPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/generate-email" element={<PromptFlowPage />} />

=======
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
>>>>>>> origin/Anant
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