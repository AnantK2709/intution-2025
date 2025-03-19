import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Button,
  Grid,
  Badge,
  ImageContainer,
  GradientText
} from '../components/ui';
import { useScrollAnimation, useParallax } from '../hooks/useAnimations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Styled components
const ProjectHero = styled(Section)`
  position: relative;
  padding: 10rem 0 6rem;
  overflow: hidden;
  
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
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

const ProjectDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  .detail-group {
    h4 {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.textSecondary};
    }
    
    p {
      font-size: 1.125rem;
      font-weight: 500;
    }
  }
`;

const ProjectImage = styled(motion.div)`
  margin-bottom: 4rem;
  
  &.hero-image {
    box-shadow: ${({ theme }) => theme.colors.shadow};
    border-radius: 16px;
    overflow: hidden;
  }
  
  &.full-width {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    width: 100vw;
    
    img {
      width: 100%;
    }
  }
  
  img {
    width: 100%;
    height: auto;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 4rem;
  
  h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    position: relative;
    padding-left: 1rem;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.25rem;
      bottom: 0.25rem;
      width: 3px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 3px;
    }
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 1.5rem;
    font-size: 1.125rem;
    line-height: 1.7;
  }
  
  ul {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    
    li {
      color: ${({ theme }) => theme.colors.textSecondary};
      margin-bottom: 0.75rem;
      position: relative;
      
      &::before {
        content: '•';
        color: ${({ theme }) => theme.colors.primary};
        position: absolute;
        left: -1rem;
      }
    }
  }
`;

const ResultsSection = styled(Section)`
  background: ${({ theme }) => 
    theme.name === 'dark' ? 'linear-gradient(to bottom, #121225, #0f1021)' : 'linear-gradient(to bottom, #f3f4f6, #ffffff)'
  };
`;

const ResultCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  border: 1px solid ${({ theme }) => theme.colors.glassStroke};
  
  .number {
    font-size: 3rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 2rem;
  
  a {
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    
    svg {
      margin-right: 0.5rem;
    }
    
    &.next {
      flex-direction: row-reverse;
      
      svg {
        margin-right: 0;
        margin-left: 0.5rem;
      }
    }
  }
`;

const WorkDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageRefs = useRef([]);
  
  // Sample project data
  const projects = [
    {
      id: 1,
      title: 'Modern E-commerce Platform',
      description: 'A sophisticated online shopping experience with seamless animations.',
      fullDescription: 'We designed and developed a modern e-commerce platform for FashionX, focusing on a seamless user experience with intuitive navigation and smooth animations. The goal was to create a visually stunning interface that would showcase their premium fashion products while ensuring high performance and conversion rates.',
      image: '/images/work-1.jpg',
      categories: ['Web Design', 'Development'],
      slug: 'ecommerce-platform',
      client: 'FashionX',
      year: '2023',
      services: ['UI/UX Design', 'Web Development', 'E-commerce Solutions', 'Animation'],
      challenge: 'FashionX needed a complete e-commerce solution that would elevate their brand presence online while providing an intuitive shopping experience for their customers. The existing platform was outdated, lacked mobile responsiveness, and had poor performance metrics, leading to high bounce rates and abandoned carts.',
      solution: 'We designed a custom e-commerce platform with a focus on visual aesthetics and performance. The new design features a minimalist interface with sophisticated animations, high-quality product visualization, and a streamlined checkout process. We implemented advanced filtering options, personalized recommendations, and seamless mobile experience to enhance user engagement.',
      results: [
        { value: '48%', label: 'Increase in Conversion Rate' },
        { value: '35%', label: 'Reduction in Cart Abandonment' },
        { value: '120%', label: 'Increase in Mobile Sales' },
        { value: '3.2s', label: 'Average Page Load Time' }
      ],
      additionalImages: [
        '/images/work-detail-1.jpg',
        '/images/work-detail-2.jpg',
        '/images/work-detail-3.jpg'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'GSAP', 'Stripe API', 'Algolia Search']
    },
    {
      id: 2,
      title: 'Financial Dashboard',
      description: 'Interactive analytics platform with real-time data visualization.',
      fullDescription: 'We created a comprehensive financial dashboard for InvestCorp that provides real-time analytics and data visualization for investment portfolios. The platform enables users to track performance, analyze trends, and make informed decisions through an intuitive interface.',
      image: '/images/work-2.jpg',
      categories: ['UI/UX', 'Dashboard'],
      slug: 'financial-dashboard',
      client: 'InvestCorp',
      year: '2023',
      services: ['UI/UX Design', 'Frontend Development', 'Data Visualization', 'API Integration'],
      challenge: 'InvestCorp was struggling with outdated financial reporting tools that were slow, difficult to use, and failed to provide real-time insights. Their team needed a modern solution to analyze complex financial data and share insights with clients efficiently.',
      solution: 'We developed a custom financial dashboard with interactive data visualization components, real-time data feeds, and customizable reporting tools. The interface features intuitive controls, responsive design, and sophisticated charts that make complex financial data easy to understand. We integrated multiple data sources to provide a comprehensive view of investment performance.',
      results: [
        { value: '65%', label: 'Faster Data Analysis' },
        { value: '40%', label: 'Increase in User Engagement' },
        { value: '200+', label: 'Active Users' },
        { value: '28%', label: 'Improvement in Client Retention' }
      ],
      additionalImages: [
        '/images/work-detail-4.jpg',
        '/images/work-detail-5.jpg',
        '/images/work-detail-6.jpg'
      ],
      technologies: ['Vue.js', 'D3.js', 'Express', 'PostgreSQL', 'WebSockets', 'PDF Export API']
    },
    // Add more projects as needed
  ];
  
  useEffect(() => {
    // Find the project by slug
    const foundProject = projects.find(p => p.slug === slug);
    
    if (foundProject) {
      setProject(foundProject);
      setLoading(false);
    } else {
      // If project not found, redirect to work page
      navigate('/work', { replace: true });
    }
  }, [slug, navigate]);
  
  useEffect(() => {
    if (project && imageRefs.current.length > 0) {
      // Create GSAP animations for images
      imageRefs.current.forEach((img, index) => {
        if (!img) return;
        
        gsap.fromTo(
          img,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  }, [project, loading]);
  
  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://via.placeholder.com/1200x800/6e00ff/ffffff?text=${encodeURIComponent(e.target.alt)}`;
  };
  
  if (loading) {
    return (
      <Section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <Text size="lg">Loading project...</Text>
          </div>
        </Container>
      </Section>
    );
  }
  
  // Find next and previous projects
  const currentIndex = projects.findIndex(p => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  
  return (
    <main>
      <ProjectHero>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge 
              variant="primary" 
              pill 
              style={{ marginBottom: '1.5rem' }}
            >
              {project.categories[0]}
            </Badge>
            
            <Heading size="xl" mb="2rem">
              {project.title}
            </Heading>
            
            <Text 
              size="lg" 
              secondary 
              mb="3rem" 
              style={{ maxWidth: '800px' }}
            >
              {project.fullDescription}
            </Text>
            
            <ProjectDetails>
              <div className="detail-group">
                <h4>Client</h4>
                <p>{project.client}</p>
              </div>
              
              <div className="detail-group">
                <h4>Year</h4>
                <p>{project.year}</p>
              </div>
              
              <div className="detail-group">
                <h4>Services</h4>
                <p>{project.services.join(', ')}</p>
              </div>
              
              <div className="detail-group">
                <h4>Technologies</h4>
                <p>{project.technologies.slice(0, 3).join(', ')}...</p>
              </div>
            </ProjectDetails>
          </motion.div>
        </Container>
      </ProjectHero>
      
      <Section>
        <Container>
          <ProjectImage 
            className="hero-image"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img 
              src={project.image} 
              alt={project.title} 
              onError={handleImageError}
            />
          </ProjectImage>
          
          <ContentSection>
            <h2>The Challenge</h2>
            <Text>{project.challenge}</Text>
          </ContentSection>
          
          <ContentSection>
            <h2>Our Solution</h2>
            <Text>{project.solution}</Text>
          </ContentSection>
          
          <ProjectImage 
            className="full-width"
            ref={el => imageRefs.current[0] = el}
          >
            <img 
              src={project.additionalImages[0]} 
              alt={`${project.title} Preview 1`}
              onError={handleImageError}
            />
          </ProjectImage>
          
          <Grid cols={2} mdCols={1} gap="2rem">
            <ProjectImage ref={el => imageRefs.current[1] = el}>
              <img 
                src={project.additionalImages[1]} 
                alt={`${project.title} Preview 2`}
                onError={handleImageError}
              />
            </ProjectImage>
            
            <ProjectImage ref={el => imageRefs.current[2] = el}>
              <img 
                src={project.additionalImages[2]} 
                alt={`${project.title} Preview 3`}
                onError={handleImageError}
              />
            </ProjectImage>
          </Grid>
          
          <ContentSection>
            <h2>Technologies Used</h2>
            <ul>
              {project.technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </ContentSection>
        </Container>
      </Section>
      
      <ResultsSection>
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
              Project <GradientText>Results</GradientText>
            </Heading>
            <Text 
              size="lg" 
              secondary 
              maxWidth="700px" 
              style={{ margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our solutions delivered measurable results for {project.client},
              helping them achieve their business objectives.
            </Text>
          </div>
          
          <Grid 
            cols={4} 
            mdCols={2} 
            smCols={1} 
            gap="2rem"
          >
            {project.results.map((result, index) => (
              <ResultCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="number">{result.value}</div>
                <p>{result.label}</p>
              </ResultCard>
            ))}
          </Grid>
        </Container>
      </ResultsSection>
      
      <Section>
        <Container>
          <NavigationButtons>
            {prevProject && (
              <Button
                as={Link}
                to={`/work/${prevProject.slug}`}
                variant="text"
                style={{ color: 'inherit' }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M15 10H5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M10 15L5 10L10 5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Previous Project
              </Button>
            )}
            
            <Button
              as={Link}
              to="/work"
              variant="text"
              style={{ color: 'inherit' }}
            >
              All Projects
            </Button>
            
            {nextProject && (
              <Button
                as={Link}
                to={`/work/${nextProject.slug}`}
                variant="text"
                style={{ color: 'inherit' }}
                className="next"
              >
                Next Project
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M5 10H15" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M10 5L15 10L10 15" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            )}
          </NavigationButtons>
        </Container>
      </Section>
      
      <Section light>
        <Container>
          <div className="text-center">
            <Heading 
              size="lg" 
              mb="1.5rem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              Ready to Start Your Project?
            </Heading>
            <Text 
              size="lg" 
              secondary 
              maxWidth="600px" 
              mb="2rem"
              style={{ margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Let's create something amazing together. Reach out today to discuss
              your project and see how we can help bring your vision to life.
            </Text>
            <Button
              as={Link}
              to="/contact"
              variant="primary"
              size="large"
              rounded
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Get in Touch
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
};

export default WorkDetailPage;