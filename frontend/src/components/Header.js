// frontend/src/components/Header.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { Flex, Container, IconButton } from './ui';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  background: ${({ theme, isScrolled }) => 
    isScrolled 
      ? theme.name === 'dark'
        ? 'rgba(10, 10, 20, 0.8)'
        : 'rgba(255, 255, 255, 0.8)'
      : 'transparent'
  };
  border-bottom: ${({ isScrolled, theme }) => 
    isScrolled ? `1px solid ${theme.colors.border}` : 'none'
  };
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  
  a {
    display: flex;
    align-items: center;
    
    span {
      background: ${({ theme }) => theme.colors.gradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
`;

const NavItem = styled.li`
  position: relative;
  
  a {
    color: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary : theme.colors.text
    };
    font-weight: ${({ isActive }) => (isActive ? '500' : '400')};
    transition: color 0.3s ease;
    padding: 0.5rem 0;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: ${({ isActive }) => (isActive ? '100%' : '0')};
      height: 2px;
      background-color: ${({ theme }) => theme.colors.primary};
      transition: width 0.3s ease;
    }
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      
      &::after {
        width: 100%;
      }
    }
  }
`;

const MobileMenuButton = styled(IconButton)`
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const MobileNavLinks = styled.ul`
  list-style: none;
  text-align: center;
`;

const MobileNavItem = styled(motion.li)`
  margin-bottom: 2rem;
  
  a {
    font-size: 1.5rem;
    color: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary : theme.colors.text
    };
    font-weight: ${({ isActive }) => (isActive ? '500' : '400')};
    transition: color 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const menuVariants = {
  hidden: {
    y: '-100%',
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1]
    }
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
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
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

const ThemeSwitchIcon = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {theme.name === 'dark' ? (
        // Sun icon
        <>
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </>
      ) : (
        // Moon icon
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      )}
    </svg>
  );
};

const MenuIcon = ({ isOpen }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      initial={false}
      animate={isOpen ? { d: "M18 6L6 18" } : { d: "M3 12H21" }}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <motion.path
      initial={false}
      animate={isOpen ? { d: "M6 6L18 18" } : { d: "M3 6H21" }}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <motion.path
      initial={false}
      animate={isOpen ? { opacity: 0 } : { opacity: 1, d: "M3 18H21" }}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'SwiftSend' },
    { path: '/about', label: 'Strategy Assistant' },
    { path: '/contact', label: 'FrameworkLens' }
  ];
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      <HeaderContainer
        isScrolled={isScrolled}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 100, 
          damping: 20, 
          delay: 0.2 
        }}
      >
        <Container>
          <Flex justify="space-between">
            <Logo>
              <Link to="/">
                ADADPTIFY <span>.</span><span>AI</span>
              </Link>
            </Logo>
            
            <Nav>
              <NavLinks>
                {navItems.map(item => (
                  <NavItem key={item.path} isActive={isActive(item.path)}>
                    <Link to={item.path}>{item.label}</Link>
                  </NavItem>
                ))}
              </NavLinks>
              
              <IconButton 
                transparent 
                onClick={toggleTheme} 
                aria-label="Toggle theme"
                style={{ marginLeft: '1.5rem' }}
              >
                <ThemeSwitchIcon />
              </IconButton>
            </Nav>
            
            <Flex style={{ gap: '1rem' }}>
              <IconButton 
                transparent 
                onClick={toggleTheme} 
                aria-label="Toggle theme"
                style={{ display: 'none', '@media (max-width: 768px)': { display: 'flex' } }}
              >
                <ThemeSwitchIcon />
              </IconButton>
              
              <MobileMenuButton
                transparent
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <MenuIcon isOpen={mobileMenuOpen} />
              </MobileMenuButton>
            </Flex>
          </Flex>
        </Container>
      </HeaderContainer>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <MobileNavLinks>
              {navItems.map(item => (
                <MobileNavItem 
                  key={item.path} 
                  isActive={isActive(item.path)}
                  variants={itemVariants}
                >
                  <Link to={item.path}>{item.label}</Link>
                </MobileNavItem>
              ))}
            </MobileNavLinks>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;