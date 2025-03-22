// frontend/src/pages/HomePage.js
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import components
import Hero from '../components/Hero';
import Work from '../components/Work';
import { 
  Section, 
  Container, 
  Heading, 
  Text, 
  GlassPanel, 
  Grid, 
  Button,
  GradientText 
} from '../components/ui';
import { useScrollAnimation, useTextReveal } from '../hooks/useAnimations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Styled components
const ServicesSection = styled(Section)`
  position: relative;
  overflow: hidden;
  
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.1;
    
    &.shape-1 {
      width: 50vw;
      height: 50vw;
      background: ${({ theme }) => theme.colors.primary};
      top: -20%;
      left: -20%;
    }
    
    &.shape-2 {
      width: 30vw;
      height: 30vw;
      background: ${({ theme }) => theme.colors.secondary};
      bottom: -10%;
      right: -10%;
    }
  }
`;

const ServiceCard = styled(GlassPanel)`
  height: 100%;
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 1.5rem;
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background: ${({ theme }) => theme.colors.primary}20;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .link {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
    
    svg {
      margin-left: 0.5rem;
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: translateX(4px);
    }
  }
`;

const TestimonialsSection = styled(Section)`
  background: ${({ theme }) => 
    theme.name === 'dark' ? 'linear-gradient(to bottom, #121225, #0f1021)' : 'linear-gradient(to bottom, #f3f4f6, #ffffff)'
  };
`;

const TestimonialCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  border: 1px solid ${({ theme }) => theme.colors.glassStroke};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  
  .quote {
    font-size: 1.25rem;
    font-family: var(--font-secondary);
    font-style: italic;
    margin-bottom: 1.5rem;
    position: relative;
    
    &::before {
      content: """;
      position: absolute;
      top: -20px;
      left: -10px;
      font-size: 4rem;
      color: ${({ theme }) => theme.colors.primary}30;
      font-family: serif;
    }
  }
  
  .author {
    display: flex;
    align-items: center;
    
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 1rem;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .info {
      h4 {
        font-size: 1rem;
        margin-bottom: 0.25rem;
      }
      
      p {
        font-size: 0.875rem;
        color: ${({ theme }) => theme.colors.textSecondary};
      }
    }
  }
`;

const StatsSection = styled(Section)`
  background: ${({ theme }) => theme.colors.gradient};
  color: white;
`;

const StatItem = styled(motion.div)`
  text-align: center;
  
  .number {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const CTASection = styled(Section)`
  position: relative;
  text-align: center;
  
  .cta-panel {
    max-width: 900px;
    margin: 0 auto;
    padding: 4rem 2rem;
    border-radius: 24px;
    background: ${({ theme }) => theme.colors.gradient};
    color: white;
    
    h2 {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: 1.5rem;
    }
    
    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const HomePage = () => {
  const servicesRef = useScrollAnimation();
  const { ref: quoteRef, inView: quoteInView } = useTextReveal();
  
  useEffect(() => {
    // Initialize GSAP animations
    gsap.fromTo(
      '.stat-counter',
      { 
        innerText: 0 
      },
      {
        innerText: (index, target) => {
          return target.getAttribute('data-value');
        },
        duration: 2,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        }
      }
    );
  }, []);
  
  // Sample services data
  const services = [
    {
      id: 1,
      title: 'SwiftSend',
      description: 'A fast and efficient tool designed to streamline communication, transactions, or content delivery.',
      icon: '🚀',
      link: '/services/web-design'
    },
    {
      id: 2,
      title: 'Strategy Assistant',
      description: 'Your AI-powered companion for navigating change management. Provides structured, step-by-step strategies, collects feedback, and continuously refines recommendations to drive effective transformation.',
      icon: '💻',
      link: '/services/ui-ux-design'
    },
    {
      id: 3,
      title: 'Framework Lens',
      description: 'A deep-dive tool for analyzing and comparing change management frameworks. Explore different strategic approaches, simulate outcomes with "what-if" analysis, and generate case studies for practical insights',
      icon: '🔍',
      link: '/services/development'
    },
    {
      id: 4,
      title: 'ChangeQuest',
      description: 'Build custom quizzes and games to educate users on the changes you\'re bringing.',
      icon: '🎮',
      link: '/services/branding'
    }
  ];

  
  return (
    <main>
      <Hero />
      
      <ServicesSection>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        
        <Container>
          <div className="text-center mb-16">
            <Heading 
              size="lg" 
              mb="1.5rem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              Our <GradientText>Services</GradientText>
            </Heading>
            <Text 
              size="lg" 
              secondary 
              maxWidth="600px" 
              style={{ margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
            </Text>
          </div>
          
          <Grid 
            cols={2} 
            mdCols={2} 
            smCols={1} 
            gap="2rem"
            ref={servicesRef}
          >
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id}
                interactive
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href={service.link} className="link">
                  Learn more
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M6 12L10 8L6 4" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </ServiceCard>
            ))}
          </Grid>
        </Container>
      </ServicesSection>
    </main>
  );
};

export default HomePage;