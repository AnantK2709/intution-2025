import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Container, Button, GradientText } from '../components/ui';

const NotFoundContainer = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  position: relative;
  overflow: hidden;
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  z-index: 1;
`;

const ErrorCode = styled(motion.h1)`
  font-size: clamp(6rem, 20vw, 12rem);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1rem;
  
  .gradient {
    background: ${({ theme }) => theme.colors.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

const ErrorTitle = styled(motion.h2)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 1.5rem;
`;

const ErrorDescription = styled(motion.p)`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.05;
  
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    
    &.shape-1 {
      width: 40vw;
      height: 40vw;
      background: ${({ theme }) => theme.colors.primary};
      top: -10%;
      right: -10%;
    }
    
    &.shape-2 {
      width: 30vw;
      height: 30vw;
      background: ${({ theme }) => theme.colors.secondary};
      bottom: 10%;
      left: -5%;
    }
  }
  
  .lines {
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(90deg, ${({ theme }) => theme.colors.primary}50 1px, transparent 1px),
      linear-gradient(${({ theme }) => theme.colors.primary}50 1px, transparent 1px);
    background-size: 40px 40px;
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <Background>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="lines"></div>
      </Background>
      
      <Container>
        <NotFoundContent>
          <ErrorCode
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient">404</span>
          </ErrorCode>
          
          <ErrorTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Page Not Found
          </ErrorTitle>
          
          <ErrorDescription
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </ErrorDescription>
          
          <ButtonContainer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              as={Link}
              to="/"
              variant="primary"
              size="large"
              rounded
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Home
            </Button>
            
            <Button
              as={Link}
              to="/contact"
              variant="outlined"
              size="large"
              rounded
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Us
            </Button>
          </ButtonContainer>
        </NotFoundContent>
      </Container>
    </NotFoundContainer>
  );
};

export default NotFoundPage;