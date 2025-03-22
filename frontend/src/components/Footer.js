// frontend/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Flex, GradientText, AnimatedLink } from './ui';

const FooterContainer = styled.footer`
  position: relative;
  padding: 5rem 0 2rem;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled(motion.div)`
  h4 {
    font-size: 1.125rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 0.75rem;
      
      a {
        color: ${({ theme }) => theme.colors.textSecondary};
        transition: color 0.2s ease;
        
        &:hover {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }
`;

const FooterLogo = styled.div`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  
  a {
    display: inline-block;
  }
`;

const FooterDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 300px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.glass};
  color: ${({ theme }) => theme.colors.text};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const NewsletterForm = styled.form`
  margin-bottom: 1.5rem;
  
  p {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  .input-group {
    display: flex;
    
    input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-right: none;
      border-radius: 8px 0 0 8px;
      background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
      color: ${({ theme }) => theme.colors.text};
      
      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
      }
    }
    
    button {
      padding: 0.75rem 1.25rem;
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      border: none;
      border-radius: 0 8px 8px 0;
      cursor: pointer;
      transition: background 0.2s ease;
      
      &:hover {
        background: ${({ theme }) => theme.colors.secondary};
      }
    }
  }
`;

const Copyright = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .links {
    display: flex;
    gap: 1.5rem;
    
    a {
      color: ${({ theme }) => theme.colors.textSecondary};
      
      &:hover {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1]
    }
  })
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: i => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.4 + (i * 0.1),
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1]
    }
  })
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <Container>
        <FooterGrid>
          <FooterColumn
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={columnVariants}
          >
            <FooterLogo>
              <Link to="/">
                COMMIT And <GradientText>CONQUER</GradientText>
              </Link>
            </FooterLogo>
            <FooterDescription>
              Creating visually stunning, high-performance websites that leave a lasting impression.
            </FooterDescription>
            <SocialLinks>
              {['twitter', 'instagram', 'linkedin', 'dribbble'].map((platform, i) => (
                <SocialLink 
                  key={platform}
                  href={`https://${platform}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={socialVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={`icon-${platform}`}></i>
                </SocialLink>
              ))}
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={columnVariants}
          >
            <h4>Navigation</h4>
            <ul>
              {[
                { path: '/', label: 'Home' },
                { path: '/work', label: 'Work' },
                { path: '/about', label: 'About' },
                { path: '/services', label: 'Services' },
                { path: '/contact', label: 'Contact' }
              ].map(item => (
                <li key={item.path}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </FooterColumn>
          
          <FooterColumn
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={columnVariants}
          >
            <h4>Services</h4>
            <ul>
              {[
                'Web Design',
                'UI/UX Design',
                'Brand Identity',
                'Digital Marketing',
                'Development'
              ].map(service => (
                <li key={service}>
                  <a href="#services">{service}</a>
                </li>
              ))}
            </ul>
          </FooterColumn>
          
          <FooterColumn
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={columnVariants}
          >
            <h4>Stay Updated</h4>
            <NewsletterForm>
              <p>Subscribe to our newsletter to get the latest updates.</p>
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  aria-label="Your email address"
                />
                <button type="submit">Subscribe</button>
              </div>
            </NewsletterForm>
            <p style={{ color: 'var(--text-secondary)' }}>
              <AnimatedLink href="mailto:info@adriennwhite.com">
                info@commitandconquer.com
              </AnimatedLink>
            </p>
          </FooterColumn>
        </FooterGrid>
        
        <Copyright>
          <div>
            &copy; {currentYear} Adrienn White. All rights reserved.
          </div>
          <div className="links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </Copyright>
      </Container>
    </FooterContainer>
  );
};

export default Footer;