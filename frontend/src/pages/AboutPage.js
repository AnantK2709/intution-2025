// frontend/src/pages/AboutPage.js
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import components
import {
  Section,
  Container,
  Heading,
  Text,
  GradientText,
  Button,
  Grid,
  ImageContainer,
  GlassPanel,
  Badge
} from '../components/ui';
import { useScrollAnimation, useParallax } from '../hooks/useAnimations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Styled components
const HeroSection = styled(Section)`
  position: relative;
  padding: 10rem 0 6rem;
  overflow: hidden;
  
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.1;
    
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
`;

const AboutImage = styled.div`
  position: relative;
  
  .main-image {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.colors.shadow};
  }
  
  .accent-image {
    position: absolute;
    width: 50%;
    height: auto;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.colors.shadow};
    bottom: -20%;
    right: -15%;
    z-index: 2;
    border: 5px solid ${({ theme }) => theme.colors.background};
  }
  
  .decoration {
    position: absolute;
    width: 80%;
    height: 80%;
    border: 2px dashed ${({ theme }) => theme.colors.primary}50;
    border-radius: 16px;
    top: 10%;
    left: -30px;
    z-index: -1;
  }
`;

const TeamSection = styled(Section)`
  background: ${({ theme }) => 
    theme.name === 'dark' ? 'linear-gradient(to bottom, #121225, #0f1021)' : 'linear-gradient(to bottom, #f3f4f6, #ffffff)'
  };
`;

const TeamMember = styled(motion.div)`
  text-align: center;
  
  .image-container {
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    width: 200px;
    height: 200px;
    margin: 0 auto 1.5rem;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${({ theme }) => theme.colors.gradient};
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      }
    }
    
    &:hover {
      .overlay {
        opacity: 0.85;
        
        a {
          transform: translateY(0);
          opacity: 1;
          
          &:nth-child(2) {
            transition-delay: 0.1s;
          }
          
          &:nth-child(3) {
            transition-delay: 0.2s;
          }
        }
      }
    }
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.75rem;
  }
`;

const ValuesSection = styled(Section)`
  position: relative;
  overflow: hidden;
`;

const ValueCard = styled(GlassPanel)`
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  .icon {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const TimelineSection = styled(Section)`
  background: ${({ theme }) => 
    theme.name === 'dark' ? 'rgba(26, 27, 54, 0.5)' : 'rgba(246, 248, 252, 0.5)'
  };
`;

const Timeline = styled.div`
  position: relative;
  margin: 4rem 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(50% - 1px);
    width: 2px;
    background: ${({ theme }) => theme.colors.border};
    
    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 4rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .content {
    position: relative;
    width: calc(50% - 40px);
    padding: 2rem;
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.glass};
    backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
    border: 1px solid ${({ theme }) => theme.colors.glassStroke};
    box-shadow: ${({ theme }) => theme.colors.shadow};
    
    @media (max-width: 768px) {
      width: calc(100% - 60px);
      margin-left: 60px;
    }
    
    h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    
    .date {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.colors.textSecondary};
      margin-bottom: 1rem;
    }
    
    p {
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
  
  .dot {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    border: 4px solid ${({ theme }) => theme.colors.background};
    z-index: 1;
    
    @media (max-width: 768px) {
      left: 20px;
      transform: translateX(0);
    }
  }
  
  &:nth-child(even) {
    .content {
      margin-left: auto;
      
      @media (max-width: 768px) {
        margin-left: 60px;
      }
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const AboutPage = () => {
  const parallaxRef = useParallax(0.2);
  const timelineRef = useRef(null);
  
  useEffect(() => {
    // GSAP animations for timeline items
    const timelineItems = gsap.utils.toArray('.timeline-item');
    
    timelineItems.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);
  
  // Team members data
  const team = [
    {
      id: 1,
      name: 'Adrienn White',
      role: 'Founder & Creative Director',
      image: '/images/team-1.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        instagram: '#'
      }
    },
    {
      id: 2,
      name: 'James Rodriguez',
      role: 'Lead Developer',
      image: '/images/team-2.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    },
    {
      id: 3,
      name: 'Sophia Chen',
      role: 'UI/UX Designer',
      image: '/images/team-3.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        dribbble: '#'
      }
    },
    {
      id: 4,
      name: 'Alex Johnson',
      role: 'Project Manager',
      image: '/images/team-4.jpg',
      social: {
        twitter: '#',
        linkedin: '#'
      }
    }
  ];
  
  // Core values data
  const values = [
    {
      id: 1,
      title: 'Innovation',
      icon: '💡',
      description: 'We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.'
    },
    {
      id: 2,
      title: 'Excellence',
      icon: '✨',
      description: 'We are committed to delivering the highest quality in every aspect of our work.'
    },
    {
      id: 3,
      title: 'Collaboration',
      icon: '🤝',
      description: 'We believe in the power of teamwork and open communication with our clients.'
    },
    {
      id: 4,
      title: 'User-Centric',
      icon: '👥',
      description: 'We place users at the center of our design process to create intuitive, enjoyable experiences.'
    }
  ];
  
  // Timeline data
  const timeline = [
    {
      id: 1,
      year: '2015',
      title: 'The Beginning',
      description: 'Adrienn White founded the studio with a vision to create beautiful, high-performance websites.'
    },
    {
      id: 2,
      year: '2017',
      title: 'Team Expansion',
      description: 'Growing demand led to our first team expansion, adding specialized talents in development and design.'
    },
    {
      id: 3,
      year: '2019',
      title: 'International Recognition',
      description: 'Our work gained international recognition, winning several prestigious design awards.'
    },
    {
      id: 4,
      year: '2021',
      title: 'New Studio',
      description: 'We moved to a larger studio space to accommodate our growing team and expanding client base.'
    },
    {
      id: 5,
      year: '2023',
      title: 'Today',
      description: 'We continue to create innovative digital experiences for clients around the world.'
    }
  ];
  
  // Handle image errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://via.placeholder.com/500x500/6e00ff/ffffff?text=${e.target.alt.charAt(0)}`;
  };
  
  return (
    <main>
      <HeroSection>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        
        <Container>
          <Grid cols={2} mdCols={1} gap="4rem" style={{ alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Heading size="xl" mb="1.5rem">
                About <GradientText>Adrienn White</GradientText>
              </Heading>
              
              <Text size="lg" secondary mb="2rem">
                We are a creative studio specializing in web design, development, and digital experiences 
                that captivate users and deliver exceptional results.
              </Text>
              
              <Text mb="2rem">
                Founded in 2015, we've been at the forefront of digital innovation, creating
                seamless, high-performance websites and applications for clients across industries.
                Our approach combines cutting-edge technology with timeless design principles to
                craft experiences that are both beautiful and functional.
              </Text>
              
              <Button
                as="a"
                href="#team"
                variant="primary"
                rounded
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Meet the Team
              </Button>
            </motion.div>
            
            <AboutImage>
              <motion.div
                className="main-image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <ImageContainer ratio="3/4">
                  <img
                    src="/images/about-main.jpg"
                    alt="Adrienn White Studio"
                    onError={handleImageError}
                  />
                </ImageContainer>
              </motion.div>
              
              <motion.div
                className="accent-image"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <ImageContainer ratio="1/1">
                  <img
                    src="/images/about-accent.jpg"
                    alt="Creative Process"
                    onError={handleImageError}
                  />
                </ImageContainer>
              </motion.div>
              
              <motion.div
                className="decoration"
                ref={parallaxRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              ></motion.div>
            </AboutImage>
          </Grid>
        </Container>
      </HeroSection>
      
      <ValuesSection>
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
              Our Core Values
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
              The principles that guide everything we do, from design to client relationships.
            </Text>
          </div>
          
          <Grid 
            cols={4} 
            mdCols={2} 
            smCols={1} 
            gap="2rem"
          >
            {values.map((value, index) => (
              <ValueCard
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </ValueCard>
            ))}
          </Grid>
        </Container>
      </ValuesSection>
      
      <TeamSection id="team">
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
              Meet Our Team
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
              Talented professionals passionate about creating exceptional digital experiences.
            </Text>
          </div>
          
          <Grid 
            cols={4} 
            mdCols={2} 
            smCols={1} 
            gap="3rem"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {team.map((member, index) => (
              <TeamMember
                key={member.id}
                variants={fadeInUp}
              >
                <div className="image-container">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={handleImageError}
                  />
                  <div className="overlay">
                    {Object.entries(member.social).map(([platform, link], i) => (
                      <a 
                        key={platform} 
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platform}
                      >
                        <i className={`icon-${platform}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </TeamMember>
            ))}
          </Grid>
        </Container>
      </TeamSection>
      
      <TimelineSection>
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
              Our Journey
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
              The milestones that have shaped our studio over the years.
            </Text>
          </div>
          
          <Timeline ref={timelineRef}>
            {timeline.map((item) => (
              <TimelineItem key={item.id} className="timeline-item">
                <div className="dot"></div>
                <div className="content">
                  <h3>{item.title}</h3>
                  <div className="date">{item.year}</div>
                  <p>{item.description}</p>
                </div>
              </TimelineItem>
            ))}
          </Timeline>
        </Container>
      </TimelineSection>
    </main>
  );
};

export default AboutPage;