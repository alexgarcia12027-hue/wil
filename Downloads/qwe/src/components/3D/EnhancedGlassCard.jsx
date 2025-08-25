import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// 3D Glass Layer Component
const GlassLayer3D = ({ mouseX, mouseY }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = mouseY * 0.3;
      meshRef.current.rotation.y = mouseX * 0.3;
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x667eea,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.1,
    transparent: true,
    opacity: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 1.5,
    reflectivity: 0.9,
    iridescence: 0.3,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
  });

  return (
    <mesh ref={meshRef} material={glassMaterial}>
      <planeGeometry args={[4, 3, 32, 32]} />
    </mesh>
  );
};

const EnhancedGlassCard = ({ 
  children, 
  className = '', 
  glowColor = '#667eea',
  enableTilt = true,
  enableGlow = true,
  enableParticles = true,
  enable3D = true,
  depth = 'medium'
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for smooth interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform values for 3D effects
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const scale = useTransform(mouseX, [-0.5, 0.5], [0.95, 1.05]);

  // Depth configurations
  const depthConfig = {
    light: { blur: 5, shadow: 10, transform: 5 },
    medium: { blur: 10, shadow: 20, transform: 10 },
    heavy: { blur: 20, shadow: 30, transform: 20 }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !enableTilt) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableTilt, mouseX, mouseY]);

  return (
    <motion.div 
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* 3D Glass Background */}
      {enable3D && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 2], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Environment preset="city" />
            <GlassLayer3D mouseX={mouseX.get()} mouseY={mouseY.get()} />
          </Canvas>
        </div>
      )}
      
      {/* Main Glass Card */}
      <motion.div
        className=\"relative rounded-2xl border border-white/20 overflow-hidden\"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 50%, 
            rgba(255, 255, 255, 0.1) 100%)`,
          backdropFilter: `blur(${depthConfig[depth].blur}px)`,
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1)
          `,
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          scale: enableTilt ? scale : 1,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          boxShadow: isHovered
            ? `0 ${depthConfig[depth].shadow}px 60px rgba(${hexToRgb(glowColor)}, 0.3), 
               inset 0 1px 0 rgba(255, 255, 255, 0.3),
               inset 0 -1px 0 rgba(255, 255, 255, 0.2)`
            : `0 8px 32px rgba(0, 0, 0, 0.1),
               inset 0 1px 0 rgba(255, 255, 255, 0.2),
               inset 0 -1px 0 rgba(255, 255, 255, 0.1)`
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow Effect */}
        {enableGlow && (
          <motion.div 
            className=\"absolute inset-0 rounded-2xl\"
            style={{
              background: `radial-gradient(circle at center, ${glowColor}40, transparent 70%)`,
              filter: 'blur(20px)',
            }}
            animate={{
              opacity: isHovered ? 0.6 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Reflection Effect */}
        <div 
          className=\"absolute inset-0 rounded-2xl pointer-events-none\"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.3) 0%, 
              transparent 20%, 
              transparent 80%, 
              rgba(255, 255, 255, 0.1) 100%)`,
            transform: 'translateZ(1px)',
          }}
        />

        {/* Noise Texture */}
        <div 
          className=\"absolute inset-0 rounded-2xl opacity-10\"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content Container */}
        <div 
          className=\"relative p-6 z-10\"
          style={{
            transform: 'translateZ(10px)',
          }}
        >
          {children}
        </div>

        {/* Particle Effects */}
        {enableParticles && isHovered && (
          <div className=\"absolute inset-0 pointer-events-none\">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className=\"absolute w-1 h-1 rounded-full\"
                style={{
                  background: glowColor,
                  left: `${20 + (i * 10)}%`,
                  top: `${30 + (i * 5)}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Light Streak Effect */}
        <motion.div
          className=\"absolute inset-0 rounded-2xl pointer-events-none\"
          style={{
            background: `linear-gradient(45deg, 
              transparent 30%, 
              rgba(255, 255, 255, 0.1) 50%, 
              transparent 70%)`,
            transform: 'translateX(-100%)',
          }}
          animate={{
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '102, 126, 234';
};

export default EnhancedGlassCard;