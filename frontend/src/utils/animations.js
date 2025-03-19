// Animation variants for Framer Motion
// frontend/src/utils/animations.js
export const fadeIn = (direction = 'up', delay = 0) => ({
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 1.25,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  });
  
  export const staggerContainer = (staggerChildren, delayChildren = 0) => ({
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  });
  
  export const textVariant = (delay) => ({
    hidden: {
      y: 50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 1.25,
        delay,
      },
    },
  });
  
  export const slideIn = (direction, type, delay, duration) => ({
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type,
        delay,
        duration,
        ease: 'easeOut',
      },
    },
  });
  
  export const scaleVariant = (delay = 0) => ({
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'tween',
        ease: 'easeOut',
        duration: 1.2,
        delay,
      },
    },
  });
  
  // Parallax scroll effect with GSAP
  export const parallaxScroll = (ref, speed = 0.1) => {
    let y = 0;
    let position = 0;
    
    const update = () => {
      position = window.scrollY * speed;
      y = position;
      
      if (ref.current) {
        ref.current.style.transform = `translate3d(0, ${y}px, 0)`;
      }
    };
    
    window.addEventListener('scroll', update);
    
    return () => {
      window.removeEventListener('scroll', update);
    };
  };
  
  // Mouse follow effect
  export const mouseFollow = (ref, { ease = 0.1, scale = 1 } = {}) => {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    const animate = () => {
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;
      
      if (ref.current) {
        ref.current.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
      }
      
      requestAnimationFrame(animate);
    };
    
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  };
  
  // Animation for text splitting
  export const splitTextAnimation = (text, staggerValue = 0.02) => {
    // Split text into characters
    const chars = text.split('');
    
    return {
      hidden: {},
      show: {
        transition: {
          staggerChildren: staggerValue,
        },
      },
      children: {
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            damping: 12,
          },
        },
      },
      render: (variants) => (
        <>
          {chars.map((char, index) => (
            <span key={index} style={{ display: 'inline-block' }} variants={variants.children}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </>
      ),
    };
  };