// frontend/src/components/ui/index.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Button component with variants
export const Button = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'small' ? '0.5rem 1rem' : props.size === 'large' ? '1rem 2.5rem' : '0.75rem 1.75rem'};
  font-size: ${props => props.size === 'small' ? '0.875rem' : props.size === 'large' ? '1.125rem' : '1rem'};
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: ${props => props.rounded ? '9999px' : '8px'};
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'primary' && `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      box-shadow: 0 6px 20px ${props.theme.colors.primary}60;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: ${props.theme.colors.secondary};
    color: white;
    
    &:hover {
      box-shadow: 0 6px 20px ${props.theme.colors.secondary}60;
    }
  `}
  
  ${props => props.variant === 'outlined' && `
    background: transparent;
    color: ${props.theme.colors.primary};
    border: 1.5px solid ${props.theme.colors.primary};
    
    &:hover {
      background: ${props.theme.colors.primary}10;
    }
  `}
  
  ${props => props.variant === 'text' && `
    background: transparent;
    color: ${props.theme.colors.primary};
    padding-left: 0;
    padding-right: 0;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 2px;
      background: ${props.theme.colors.primary};
      transition: width 0.3s ease;
    }
    
    &:hover::after {
      width: 100%;
    }
  `}
  
  &:active {
    transform: translateY(2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      box-shadow: none;
      transform: none;
    }
  }
`;

// Card component with glass effect
export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  border: 1px solid ${({ theme }) => theme.colors.glassStroke};
  border-radius: 16px;
  padding: ${props => props.compact ? '1rem' : '2rem'};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  ${props => props.interactive && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
  `}
`;

// Section container with padding options
export const Section = styled.section`
  padding: ${props => props.dense ? '3rem 0' : '6rem 0'};
  position: relative;
  overflow: hidden;
  
  ${props => props.dark && `
    background-color: ${props.theme.name === 'dark' ? props.theme.colors.surface : '#0c0c1d'};
    color: white;
  `}
  
  ${props => props.light && `
    background-color: ${props.theme.name === 'dark' ? '#1a1b36' : '#f8f9fc'};
  `}
  
  ${props => props.gradient && `
    background: ${props.theme.colors.gradient};
    color: white;
  `}
`;

// Text components with animation capabilities
export const Heading = styled(motion.h2)`
  font-size: ${props => {
    switch (props.size) {
      case 'xl': return 'clamp(2.5rem, 5vw, 4rem)';
      case 'lg': return 'clamp(2rem, 4vw, 3rem)';
      case 'sm': return 'clamp(1.25rem, 2vw, 1.5rem)';
      case 'xs': return 'clamp(1rem, 1.5vw, 1.25rem)';
      default: return 'clamp(1.5rem, 3vw, 2.5rem)'; // md - default
    }
  }};
  font-weight: ${props => props.weight || '600'};
  line-height: 1.2;
  margin-bottom: ${props => props.mb || '1.5rem'};
  font-family: ${props => props.serif ? 'var(--font-secondary)' : 'var(--font-primary)'};
  
  ${props => props.gradient && `
    background: ${props.theme.colors.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  `}
`;

export const Text = styled(motion.p)`
  font-size: ${props => {
    switch (props.size) {
      case 'lg': return 'clamp(1.125rem, 2vw, 1.25rem)';
      case 'sm': return 'clamp(0.875rem, 1.5vw, 1rem)';
      case 'xs': return 'clamp(0.75rem, 1vw, 0.875rem)';
      default: return 'clamp(1rem, 1.5vw, 1.125rem)'; // md - default
    }
  }};
  line-height: ${props => props.tight ? '1.4' : '1.7'};
  margin-bottom: ${props => props.mb || '1rem'};
  color: ${props => props.secondary ? props.theme.colors.textSecondary : 'inherit'};
  max-width: ${props => props.maxWidth || 'none'};
  font-weight: ${props => props.weight || '400'};
  font-family: ${props => props.serif ? 'var(--font-secondary)' : 'var(--font-primary)'};
`;

// Container
export const Container = styled.div`
  width: 100%;
  max-width: ${props => props.narrow ? '960px' : props.wide ? '1440px' : '1280px'};
  margin: 0 auto;
  padding: 0 ${props => props.fluid ? '0' : '1.5rem'};
  
  @media (min-width: 768px) {
    padding: 0 ${props => props.fluid ? '0' : '2rem'};
  }
`;

// Grid system
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${props => props.cols || 1},
    1fr
  );
  gap: ${props => props.gap || '2rem'};
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(
      ${props => Math.min(props.cols, props.mdCols || props.cols) || 1},
      1fr
    );
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(
      ${props => Math.min(props.cols, props.smCols || (props.mdCols || props.cols)) || 1},
      1fr
    );
  }
`;

// Flex container
export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '0'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  
  @media (max-width: 768px) {
    flex-direction: ${props => props.smDirection || props.direction || 'row'};
  }
`;

// Divider
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${props => props.my || '2rem'} 0;
  width: ${props => props.width || '100%'};
`;

// Image with aspect ratio and optimization
export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: ${props => props.ratio || '56.25%'}; /* Default to 16:9 ratio */
  overflow: hidden;
  border-radius: ${props => props.rounded ? '12px' : '0'};
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: ${props => props.objectFit || 'cover'};
    transition: transform 0.5s ease;
  }
  
  ${props => props.hover && `
    &:hover img {
      transform: scale(1.05);
    }
  `}
`;

// Badge component
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${props => props.pill ? '9999px' : '4px'};
  
  ${props => props.variant === 'primary' && `
    background-color: ${props.theme.colors.primary}20;
    color: ${props.theme.colors.primary};
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: ${props.theme.colors.secondary}20;
    color: ${props.theme.colors.secondary};
  `}
  
  ${props => props.variant === 'accent' && `
    background-color: ${props.theme.colors.accent}20;
    color: ${props.theme.colors.accent};
  `}
  
  ${props => props.variant === 'default' && `
    background-color: ${props.theme.name === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
    color: ${props.theme.colors.textSecondary};
  `}
`;

// Icon button
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: ${props => props.rounded ? '50%' : '8px'};
  background: ${props => props.transparent ? 'transparent' : props.theme.colors.glass};
  backdrop-filter: ${props => props.transparent ? 'none' : props.theme.colors.glassBlur};
  border: ${props => props.transparent ? 'none' : `1px solid ${props.theme.colors.glassStroke}`};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.transparent ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Cursor follower
export const Cursor = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  border: 2px solid white;
  transform: translate(-50%, -50%);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Animated underline for links
export const AnimatedLink = styled.a`
  position: relative;
  display: inline-block;
  color: ${props => props.color || props.theme.colors.primary};
  font-weight: ${props => props.weight || '500'};
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: ${props => props.color || props.theme.colors.primary};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

// Glassmorphism container
export const GlassPanel = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  border-radius: ${props => props.radius || '16px'};
  border: 1px solid ${({ theme }) => theme.colors.glassStroke};
  padding: ${props => props.padding || '2rem'};
  box-shadow: ${({ theme }) => theme.colors.shadow};
`;

// Theme toggle button
export const ThemeToggle = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  border: 1px solid ${({ theme }) => theme.colors.glassStroke};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  transition: all 0.3s ease;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  
  &:hover {
    transform: rotate(30deg);
  }
`;

// Animated gradient text
export const GradientText = styled.span`
  background: ${({ theme }) => theme.colors.gradient};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  display: inline-block;
  animation: shine 3s linear infinite;
  
  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
`;

// Scroll indicator
export const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .mouse {
    width: 26px;
    height: 42px;
    border: 2px solid ${({ theme }) => theme.colors.text};
    border-radius: 20px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.text};
      left: 50%;
      transform: translateX(-50%);
      top: 8px;
      animation: scroll 1.5s infinite;
    }
  }
  
  .text {
    margin-top: 8px;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  @keyframes scroll {
    0% {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 16px);
      opacity: 0;
    }
  }
`;

// Tab component
export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  background: transparent;
  border-bottom: 2px solid transparent;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  border-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TabPanel = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Input fields
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}30;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  min-height: ${props => props.rows ? `${props.rows * 1.5}rem` : '6rem'};
  resize: ${props => props.resize || 'vertical'};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}30;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
`;