// frontend/src/components/Hero.js
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParallax } from '../hooks/useAnimations';
import { Container, Button, ScrollIndicator } from './ui';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 6rem 0;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  
  .gradient-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }
  
  .circle-1 {
    width: 60vw;
    height: 60vw;
    background: ${({ theme }) => `${theme.colors.primary}20`};
    top: -10%;
    right: -20%;
  }
  
  .circle-2 {
    width: 40vw;
    height: 40vw;
    background: ${({ theme }) => `${theme.colors.secondary}20`};
    bottom: -10%;
    left: -10%;
  }
  
  .circle-3 {
    width: 30vw;
    height: 30vw;
    background: ${({ theme }) => `${theme.colors.accent}20`};
    top: 50%;
    left: 30%;
    transform: translateY(-50%);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 6rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 600;
  
  .highlight {
    display: inline-block;
    background: ${({ theme }) => theme.colors.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  line-height: 1.5;
  opacity: 0.8;
  max-width: 600px;
  margin-bottom: 2.5rem;
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const HeroImageWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 991px) {
    margin-top: 3rem;
  }
`;

const HeroImage = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  border: 1px solid ${({ theme }) => theme.colors.glassStroke};
  box-shadow: ${({ theme }) => theme.colors.shadow};
  transform-style: preserve-3d;
  perspective: 1000px;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
    z-index: 2;
  }
  
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
    opacity: 0.1;
    z-index: 1;
  }
`;

const HeroImageDecoration = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  border: 2px dashed ${({ theme }) => theme.colors.primary}50;
  border-radius: 12px;
  top: 10%;
  left: 10%;
  z-index: -1;
  animation: rotate 20s linear infinite;
  
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const FloatingObjects = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  
  .floating-object {
    position: absolute;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.gradient};
    opacity: 0.1;
    filter: blur(5px);
  }
  
  .obj1 {
    width: 5vw;
    height: 5vw;
    top: 20%;
    left: 10%;
    animation: float 10s ease-in-out infinite;
  }
  
  .obj2 {
    width: 3vw;
    height: 3vw;
    top: 40%;
    right: 15%;
    animation: float 8s ease-in-out infinite reverse;
  }
  
  .obj3 {
    width: 4vw;
    height: 4vw;
    bottom: 20%;
    left: 20%;
    animation: float 12s ease-in-out infinite 1s;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
    100% {
      transform: translateY(0) rotate(360deg);
    }
  }
`;

// Animation variants
const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.2
        }
    }
};

const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.4
        }
    }
};

const buttonsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.6
        }
    }
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.8
        }
    }
};

const Hero = () => {
    const parallaxRef = useParallax(0.2);
    const heroRef = useRef(null);
    const imageRef = useRef(null);

    // 3D tilt effect on mouse move
    useEffect(() => {
        if (!imageRef.current) return;

        const handleMouseMove = (e) => {
            const { left, top, width, height } = imageRef.current.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            gsap.to(imageRef.current, {
                rotationY: x * 10,
                rotationX: y * -10,
                duration: 0.5,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(imageRef.current, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
        };

        const imageElement = imageRef.current;
        imageElement.addEventListener('mousemove', handleMouseMove);
        imageElement.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            imageElement.removeEventListener('mousemove', handleMouseMove);
            imageElement.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Parallax scrolling effect
    useEffect(() => {
        const sections = gsap.utils.toArray('.parallax-section');

        sections.forEach((section) => {
            const depth = section.dataset.depth || 0.2;

            gsap.to(section, {
                y: (i, el) => -el.offsetHeight * depth,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        });
    }, []);

    return (
        <HeroSection ref={heroRef}>
            <HeroBackground>
                <div className="gradient-circle circle-1"></div>
                <div className="gradient-circle circle-2"></div>
                <div className="gradient-circle circle-3"></div>
            </HeroBackground>

            <FloatingObjects>
                <div className="floating-object obj1"></div>
                <div className="floating-object obj2"></div>
                <div className="floating-object obj3"></div>
            </FloatingObjects>

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <HeroContent className="parallax-section" data-depth="0.1">
                        <HeroTitle
                            variants={titleVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            Empower, <span className="highlight">Adapt</span>Innovate with AI
                        </HeroTitle>

                        <HeroSubtitle
                            variants={subtitleVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <b>Driving seamless AI-powered change adoption across MSD for a future-ready workforce.</b>
                        </HeroSubtitle>

                        <HeroButtons
                            variants={buttonsVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Button
                                as="a"
                                href="#work"
                                variant="primary"
                                rounded
                                size="large"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Explore Form & Fun
                            </Button>

                            <Button
                                as="a"
                                href="#contact"
                                variant="outlined"
                                rounded
                                size="large"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Strategy Assistant
                            </Button>
                        </HeroButtons>
                    </HeroContent>
                </div>
            </Container>

            <ScrollIndicator
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
            >
                <div className="mouse"></div>
                <div className="text">Scroll Down</div>
            </ScrollIndicator>
        </HeroSection>
    );
};

export default Hero;