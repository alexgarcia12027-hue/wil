import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Floating Particles Component
const FloatingParticles = ({ count = 1000, colors = ['#667eea', '#764ba2', '#f59e0b'] }) => {
  const pointsRef = useRef();
  
  const [positions, colorsArray] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorObjects = colors.map(color => new THREE.Color(color));
    
    for (let i = 0; i < count; i++) {
      // Random positions in a sphere
      const radius = Math.random() * 15 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random colors
      const colorIndex = Math.floor(Math.random() * colorObjects.length);
      const color = colorObjects[colorIndex];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, [count, colors]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      
      // Animate individual particles
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.01) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colorsArray}>
      <PointMaterial
        size={0.02}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        fog={false}
      />
    </Points>
  );
};

// Animated Geometric Shapes
const AnimatedShapes = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const shapes = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ],
      scale: Math.random() * 0.5 + 0.1,
      color: ['#667eea', '#764ba2', '#f59e0b'][Math.floor(Math.random() * 3)],
      shape: ['box', 'sphere', 'octahedron'][Math.floor(Math.random() * 3)],
      rotationSpeed: (Math.random() - 0.5) * 0.02
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <ShapeInstance
          key={i}
          position={shape.position}
          scale={shape.scale}
          color={shape.color}
          shape={shape.shape}
          rotationSpeed={shape.rotationSpeed}
        />
      ))}
    </group>
  );
};

// Individual Shape Instance
const ShapeInstance = ({ position, scale, color, shape, rotationSpeed }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.7;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.001;
    }
  });

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.8,
    thickness: 0.1,
    transparent: true,
    opacity: 0.6,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 1.5,
    reflectivity: 0.9,
  });

  const getGeometry = () => {
    switch (shape) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 16, 16]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.5, 0]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position} scale={scale} material={material}>
      {getGeometry()}
    </mesh>
  );
};

// Energy Waves Component
const EnergyWaves = ({ color = '#667eea' }) => {
  const waveRefs = useRef([]);
  
  useFrame((state) => {
    waveRefs.current.forEach((wave, i) => {
      if (wave) {
        const time = state.clock.elapsedTime;
        wave.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
        wave.material.opacity = 0.3 + Math.sin(time * 3 + i) * 0.2;
        wave.rotation.z = time * 0.5 + i;
      }
    });
  });

  return (
    <group>
      {[...Array(3)].map((_, i) => (
        <mesh
          key={i}
          ref={el => waveRefs.current[i] = el}
          position={[0, 0, i * 2 - 2]}
        >
          <ringGeometry args={[2, 2.1, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

// Main Particle System Component
const ParticleSystem = ({ 
  width = 400, 
  height = 300, 
  className = '',
  particleCount = 500,
  enableShapes = true,
  enableWaves = true,
  colors = ['#667eea', '#764ba2', '#f59e0b'],
  intensity = 'medium'
}) => {
  const intensityConfig = {
    light: { particles: 200, shapes: 10, waves: 2 },
    medium: { particles: 500, shapes: 20, waves: 3 },
    heavy: { particles: 1000, shapes: 30, waves: 5 }
  };

  const config = intensityConfig[intensity] || intensityConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#764ba2" />
        
        {/* Particle Effects */}
        <FloatingParticles count={config.particles} colors={colors} />
        
        {enableShapes && <AnimatedShapes />}
        
        {enableWaves && <EnergyWaves color={colors[0]} />}
      </Canvas>
      
      {/* Overlay Effects */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%)`,
        }}
      />
    </motion.div>
  );
};

export default ParticleSystem;