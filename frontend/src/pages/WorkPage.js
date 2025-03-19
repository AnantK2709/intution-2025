import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import components
import {
  Section,
  Container,
  Heading,
  Text,
  Grid,
  GradientText,
  Badge,
  Button
} from '../components/ui';

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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  background: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : 'transparent'
  };
  color: ${({ isActive, theme }) => 
    isActive ? 'white' : theme.colors.text
  };
  border: 1px solid ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : theme.colors.border
  };
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ isActive, theme }) => 
      isActive ? theme.colors.primary : `${theme.colors.primary}20`
    };
  }
`;

const WorkItem = styled(motion.div)`
  height: 100%;
  
  .image-container {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    aspect-ratio: 16 / 9;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${({ theme }) => `linear-gradient(to top, ${theme.colors.surface}80, transparent)`};
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .view-btn {
        padding: 0.75rem 1.5rem;
        background: ${({ theme }) => theme.colors.primary};
        color: white;
        border-radius: 9999px;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
      }
    }
    
    &:hover {
      img {
        transform: scale(1.05);
      }
      
      .overlay {
        opacity: 1;
        
        .view-btn {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 1rem;
  }
  
  .categories {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
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

const WorkPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Sample work items data
  const workItems = [
    {
      id: 1,
      title: 'Modern E-commerce Platform',
      description: 'A sophisticated online shopping experience with seamless animations.',
      image: '/images/work-1.jpg',
      categories: ['Web Design', 'Development'],
      slug: 'ecommerce-platform',
      client: 'FashionX',
      year: '2023'
    },
    {
      id: 2,
      title: 'Financial Dashboard',
      description: 'Interactive analytics platform with real-time data visualization.',
      image: '/images/work-2.jpg',
      categories: ['UI/UX', 'Dashboard'],
      slug: 'financial-dashboard',
      client: 'InvestCorp',
      year: '2023'
    },
    {
      id: 3,
      title: 'Fashion Brand Identity',
      description: 'Complete branding solution for a high-end fashion label.',
      image: '/images/work-3.jpg',
      categories: ['Branding', 'Design'],
      slug: 'fashion-brand',
      client: 'Elegance',
      year: '2022'
    },
    {
      id: 4,
      title: 'Travel Blog Platform',
      description: 'Immersive content platform for travel enthusiasts.',
      image: '/images/work-4.jpg',
      categories: ['Web Design', 'Development'],
      slug: 'travel-blog',
      client: 'Wanderlust',
      year: '2022'
    },
    {
      id: 5,
      title: 'Mobile Fitness App',
      description: 'Health tracking app with intuitive interface and animations.',
      image: '/images/work-5.jpg',
      categories: ['UI/UX', 'Mobile'],
      slug: 'fitness-app',
      client: 'FitLife',
      year: '2021'
    },
    {
      id: 6,
      title: 'Restaurant Website',
      description: 'Elegant website design for a premium dining establishment.',
      image: '/images/work-6.jpg',
      categories: ['Web Design', 'Branding'],
      slug: 'restaurant-website',
      client: 'Gastronomy',
      year: '2021'
    },
    {
      id: 7,
      title: 'Educational Platform',
      description: 'Interactive learning platform with gamification elements.',
      image: '/images/work-7.jpg',
      categories: ['UI/UX', 'Development'],
      slug: 'educational-platform',
      client: 'EduTech',
      year: '2020'
    },
    {
      id: 8,
      title: 'Smart Home App',
      description: 'Control panel for smart home devices with sleek interface.',
      image: '/images/work-8.jpg',
      categories: ['UI/UX', 'Mobile'],
      slug: 'smart-home-app',
      client: 'HomeTech',
      year: '2020'
    },
    {
      id: 9,
      title: 'Real Estate Marketplace',
      description: 'Property listing platform with advanced search features.',
      image: '/images/work-9.jpg',
      categories: ['Web Design', 'Development'],
      slug: 'real-estate-marketplace',
      client: 'PropertyHub',
      year: '2019'
    }
  ];
  
  // Get unique categories for filter buttons
  const categories = ['all', ...new Set(workItems.flatMap(item => item.categories))];
  
  // Filter items when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredItems(workItems);
    } else {
      setFilteredItems(workItems.filter(item => 
        item.categories.includes(activeFilter)
      ));
    }
  }, [activeFilter]);
  
  // Handle placeholder images for development
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://via.placeholder.com/600x337/6e00ff/ffffff?text=${encodeURIComponent(e.target.alt)}`;
  };
  
  return (
    <main>
      <HeroSection>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        
        <Container>
          <div className="text-center mb-16">
            <Heading 
              size="xl" 
              mb="1.5rem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our <GradientText>Work</GradientText>
            </Heading>
            <Text 
              size="lg" 
              secondary 
              maxWidth="700px" 
              style={{ margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore our portfolio of high-performance, visually stunning websites
              and digital experiences that push the boundaries of design and technology.
            </Text>
          </div>
          
          <FilterContainer>
            {categories.map((category, index) => (
              <FilterButton
                key={category}
                isActive={activeFilter === category}
                onClick={() => setActiveFilter(category)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </FilterButton>
            ))}
          </FilterContainer>
          
          <Grid 
            cols={3} 
            mdCols={2} 
            smCols={1} 
            gap="2rem"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {filteredItems.map((item) => (
                <WorkItem
                  key={item.id}
                  variants={fadeInUp}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Link to={`/work/${item.slug}`}>
                    <div className="image-container">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        onError={handleImageError}
                      />
                      <div className="overlay">
                        <div className="view-btn">View Project</div>
                      </div>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="categories">
                      {item.categories.map(category => (
                        <Badge 
                          key={category} 
                          variant="primary" 
                          pill
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                </WorkItem>
              ))}
            </AnimatePresence>
          </Grid>
          
          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ 
                textAlign: 'center', 
                padding: '4rem 0',
                marginTop: '2rem' 
              }}
            >
              <Text size="lg" secondary mb="2rem">
                No projects found in this category.
              </Text>
              <Button
                onClick={() => setActiveFilter('all')}
                variant="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Projects
              </Button>
            </motion.div>
          )}
        </Container>
      </HeroSection>
      
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
              Let's Work Together
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
              Have a project in mind? We'd love to bring your vision to life with our expertise in
              design and development.
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
              Start a Project
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
};

export default WorkPage;