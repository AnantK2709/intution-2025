// frontend/src/hooks/useAnimations.js
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMedia } from 'react-use';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (start = 'top 80%', end = 'bottom 20%', scrub = false) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    
    if (!element) return;
    
    const animation = gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: scrub ? 1 : 0.8,
        ease: 'power2.out',
      }
    );
    
    const trigger = ScrollTrigger.create({
      trigger: element,
      start,
      end: scrub ? end : 'bottom 80%',
      animation,
      scrub,
      once: !scrub,
    });
    
    return () => {
      trigger.kill();
      animation.kill();
    };
  }, [start, end, scrub]);
  
  return elementRef;
};

export const useParallax = (speed = 0.1) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      const parallaxOffset = scrollPosition * speed;
      
      gsap.to(element, {
        y: parallaxOffset,
        ease: 'none',
        overwrite: 'auto',
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);
  
  return elementRef;
};

export const useTextReveal = (threshold = 0.1) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
  });
  
  useEffect(() => {
    if (!ref.current || !inView) return;
    
    const spans = ref.current.querySelectorAll('.reveal-text');
    
    gsap.fromTo(
      spans,
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.05, 
        duration: 0.8, 
        ease: 'power3.out' 
      }
    );
  }, [inView, ref]);
  
  return { ref, inView };
};

export const useSmoothScroll = (enabled = true) => {
  const [locomotiveScroll, setLocomotiveScroll] = useState(null);
  const isMobile = useMedia('(max-width: 768px)');
  
  useEffect(() => {
    if (!enabled || isMobile) return;
    
    // Dynamically import locomotive-scroll to avoid SSR issues
    const importLocomotiveScroll = async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        
        const scroll = new LocomotiveScroll({
          el: document.querySelector('[data-scroll-container]'),
          smooth: true,
          smartphone: { smooth: false },
          tablet: { smooth: true, breakpoint: 768 },
          lerp: 0.07,
        });
        
        setLocomotiveScroll(scroll);
        
        // Initialize ScrollTrigger with locomotive-scroll
        ScrollTrigger.scrollerProxy('[data-scroll-container]', {
          scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
          },
          pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed',
        });
        
        scroll.on('scroll', ScrollTrigger.update);
        
        ScrollTrigger.addEventListener('refresh', () => scroll.update());
        ScrollTrigger.refresh();
      } catch (error) {
        console.error('Error initializing smooth scroll:', error);
      }
    };
    
    importLocomotiveScroll();
    
    return () => {
      if (locomotiveScroll) {
        locomotiveScroll.destroy();
        setLocomotiveScroll(null);
      }
    };
  }, [enabled, isMobile]);
  
  return locomotiveScroll;
};

export const useGlassMorphism = (blur = 10, opacity = 0.7) => {
  const glassRef = useRef(null);
  
  useEffect(() => {
    if (!glassRef.current) return;
    
    // Set glass effect styles
    const style = glassRef.current.style;
    style.backdropFilter = `blur(${blur}px)`;
    style.WebkitBackdropFilter = `blur(${blur}px)`;
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Reduce motion for users who prefer reduced motion
      style.transition = 'none';
    }
  }, [blur, opacity]);
  
  return glassRef;
};