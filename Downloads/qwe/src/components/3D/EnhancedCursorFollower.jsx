import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';

const EnhancedCursorFollower = ({ 
  className = '',
  size = 'medium',
  glowEffect = true,
  trailEffect = true,
  magneticEffect = true,
  colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f59e0b'
  }
}) => {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Motion values for smooth cursor movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for natural movement
  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });
  
  // Trail motion values
  const trailX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const trailY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  // Size configurations
  const sizeConfig = {
    small: { cursor: 8, trail: 12 },
    medium: { cursor: 12, trail: 18 },
    large: { cursor: 16, trail: 24 }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) {
        setIsVisible(true);
      }
      
      // Magnetic effect for interactive elements
      if (magneticEffect) {
        const target = e.target.closest('button, a, .interactive');
        if (target && !isHovering) {
          setIsHovering(true);
          const rect = target.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          gsap.to(cursorRef.current, {
            scale: 1.5,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else if (!target && isHovering) {
          setIsHovering(false);
          gsap.to(cursorRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, magneticEffect, isHovering, isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] ${className}`}
        style={{
          left: springX,
          top: springY,
          x: `-${sizeConfig[size].cursor / 2}px`,
          y: `-${sizeConfig[size].cursor / 2}px`,
          width: `${sizeConfig[size].cursor}px`,
          height: `${sizeConfig[size].cursor}px`,
          background: `radial-gradient(circle, ${colors.primary}80, ${colors.secondary}40)`,
          borderRadius: '50%',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.primary}60`,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          boxShadow: glowEffect 
            ? `0 0 20px ${colors.primary}60, 0 0 40px ${colors.primary}40`
            : 'none'
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          background: isHovering 
            ? `radial-gradient(circle, ${colors.accent}80, ${colors.primary}40)`
            : `radial-gradient(circle, ${colors.primary}80, ${colors.secondary}40)`
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20
        }}
      />
      
      {/* Trail effect */}
      {trailEffect && (
        <motion.div
          ref={trailRef}
          className=\"fixed pointer-events-none z-[9998]\"
          style={{
            left: trailX,
            top: trailY,
            x: `-${sizeConfig[size].trail / 2}px`,
            y: `-${sizeConfig[size].trail / 2}px`,
            width: `${sizeConfig[size].trail}px`,
            height: `${sizeConfig[size].trail}px`,
            background: `radial-gradient(circle, ${colors.secondary}40, transparent)`,
            borderRadius: '50%',
            opacity: isVisible ? 0.6 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {/* Additional particle effects */}
      <motion.div
        className=\"fixed pointer-events-none z-[9997]\"
        style={{
          left: springX,
          top: springY,
          x: `-${sizeConfig[size].cursor * 2}px`,
          y: `-${sizeConfig[size].cursor * 2}px`,
          width: `${sizeConfig[size].cursor * 4}px`,
          height: `${sizeConfig[size].cursor * 4}px`,
          background: `conic-gradient(from 0deg, transparent, ${colors.primary}20, transparent)`,
          borderRadius: '50%',
          opacity: isVisible && isHovering ? 0.3 : 0,
          transition: 'opacity 0.3s ease'
        }}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </>
  );
};

export default EnhancedCursorFollower;