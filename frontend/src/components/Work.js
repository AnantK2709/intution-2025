// frontend/src/components/Work.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Section, Heading, Text, GlassPanel, Badge } from './ui';
import { useScrollAnimation } from '../hooks/useAnimations';

const WorkContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;

const WorkFilter = styled.div`
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
  cursor: pointer;
  overflow: hidden;
  
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
      background: ${({ theme }) => `linear-gradient(to top, ${theme.colors.surface}, transparent)`};
      opacity: 0.2;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      img {
        transform: scale(1.05);
      }
      
      .overlay {
        opacity: 0.4;
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

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
`;

// Define animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1]
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.4
    }
  }
};

const Work = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const containerRef = useScrollAnimation();
  
  // Sample work items data
  const workItems = [
    {
      id: 1,
      title: 'Modern E-commerce Platform',
      description: 'A sophisticated online shopping experience with seamless animations.',
      image: '/images/work-1.jpg',
      categories: ['Web Design', 'Development'],
      slug: 'ecommerce-platform'
    },
    {
      id: 2,
      title: 'Financial Dashboard',
      description: 'Interactive analytics platform with real-time data visualization.',
      image: '/images/work-2.jpg',
      categories: ['UI/UX', 'Dashboard'],
      slug: 'financial-dashboard'
    },
    {
      id: 3,
      title: 'Fashion Brand Identity',
      description: 'Complete branding solution for a high-end fashion label.',
      image: '/images/work-3.jpg',
      categories: ['Branding', 'Design'],
      slug: 'fashion-brand'
    },
    {
      id: 4,
      title: 'Travel Blog Platform',
      description: 'Immersive content platform for travel enthusiasts.',
      image: '/images/work-4.jpg',
      categories: ['Web Design', 'Development'],
      slug: 'travel-blog'
    },
    {
      id: 5,
      title: 'Mobile Fitness App',
      description: 'Health tracking app with intuitive interface and animations.',
      image: '/images/work-5.jpg',
      categories: ['UI/UX', 'Mobile'],
      slug: 'fitness-app'
    },
    {
      id: 6,
      title: 'Restaurant Website',
      description: 'Elegant website design for a premium dining establishment.',
      image: '/images/work-6.jpg',
      categories: ['Web Design', 'Branding'],
      slug: 'restaurant-website'
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
    <Section id="work">
      <Container>
        <SectionHeader>
          <Heading 
            size="lg" 
            gradient
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            Our Latest Projects
          </Heading>
          <Text 
            secondary 
            size="lg"
            maxWidth="600px"
            style={{ margin: '0 auto' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore our portfolio of high-performance, visually stunning websites
            and digital experiences.
          </Text>
        </SectionHeader>
        
        <WorkFilter>
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
        </WorkFilter>
        
        <WorkContainer ref={containerRef}>
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => (
              <WorkItem
                key={item.id}
                layoutId={`work-${item.id}`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -10 }}
              >
                <Link to={`/work/${item.slug}`}>
                  <div className="image-container">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      onError={handleImageError}
                    />
                    <div className="overlay"></div>
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
        </WorkContainer>
      </Container>
    </Section>
  );
};

export default Work;