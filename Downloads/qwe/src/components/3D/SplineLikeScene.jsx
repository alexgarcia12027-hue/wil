import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  Float, 
  Center, 
  OrbitControls,
  EffectComposer,
  Bloom,
  ChromaticAberration
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Professional Crystal Glass Material
const CrystalGlass = ({ children, color = '#667eea', opacity = 0.8, ...props }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  const material = useMemo(() => 
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95,
      thickness: 0.5,
      transparent: true,
      opacity: opacity,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 1.8,
      reflectivity: 0.95,
      iridescence: 0.5,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 800],
      sheen: 0.5,
      sheenRoughness: 0.1,
      sheenColor: new THREE.Color(color).multiplyScalar(0.5),
      envMapIntensity: 1.5,
    }), [color, opacity]
  );

  return (
    <mesh ref={meshRef} material={material} {...props}>
      {children}
    </mesh>
  );
};

// Enhanced Legal Symbol (Scale of Justice)
const LegalSymbol3D = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Scale base */}
      <CrystalGlass color="#1e40af" opacity={0.9}>
        <cylinderGeometry args={[0.1, 0.15, 0.3, 12]} />
      </CrystalGlass>
      
      {/* Scale arm */}
      <CrystalGlass color="#3b82f6" opacity={0.8} position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 0.05, 0.05]} />
      </CrystalGlass>
      
      {/* Left scale pan */}
      <CrystalGlass color="#60a5fa" opacity={0.7} position={[-0.8, 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
      </CrystalGlass>
      
      {/* Right scale pan */}
      <CrystalGlass color="#60a5fa" opacity={0.7} position={[0.8, 0.6, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
      </CrystalGlass>
    </group>
  );
};

// Abstract Legal Pattern
const AbstractPattern = () => {
  const meshRefs = useRef([]);
  
  useFrame((state) => {
    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.rotation.x = state.clock.elapsedTime * (0.5 + i * 0.1);
        mesh.rotation.z = state.clock.elapsedTime * (0.3 + i * 0.05);
        mesh.position.y = Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.2;
      }
    });
  });

  return (
    <group>
      {[...Array(5)].map((_, i) => (
        <CrystalGlass 
          key={i}
          ref={el => meshRefs.current[i] = el}
          color={['#667eea', '#764ba2', '#667eea', '#4f46e5', '#3b82f6'][i]}
          opacity={0.6}
          position={[
            Math.cos(i * Math.PI * 2 / 5) * 2,
            0,
            Math.sin(i * Math.PI * 2 / 5) * 2
          ]}
        >
          <icosahedronGeometry args={[0.3, 1]} />
        </CrystalGlass>
      ))}
    </group>
  );
};

// Enhanced Lighting System
const ProfessionalLighting = () => {
  const lightRef = useRef();
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#667eea" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight 
        ref={lightRef}
        position={[5, 5, 5]} 
        intensity={1} 
        color="#667eea"
        distance={15}
        decay={2}
      />
      <pointLight 
        position={[-5, 5, -5]} 
        intensity={0.8} 
        color="#764ba2"
        distance={12}
        decay={2}
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ffffff"
        castShadow
      />
    </>
  );
};

// Mouse Follower Effect
const MouseFollower = () => {
  const meshRef = useRef();
  const { viewport, mouse } = useThree();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = (mouse.x * viewport.width) / 8;
      meshRef.current.position.y = (mouse.y * viewport.height) / 8;
    }
  });

  return (
    <CrystalGlass ref={meshRef} color="#f59e0b" opacity={0.3}>
      <sphereGeometry args={[0.1, 16, 16]} />
    </CrystalGlass>
  );
};

// Main Scene Component
const Scene = ({ enableMouseFollow = true, showLegalSymbol = true }) => {
  return (
    <>
      <ProfessionalLighting />
      
      {/* Professional Environment */}
      <Environment 
        preset="city"
        background={false}
        blur={0.8}
      />
      
      {/* Main Content */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        {showLegalSymbol && <LegalSymbol3D />}
      </Float>
      
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <AbstractPattern />
      </Float>
      
      {enableMouseFollow && <MouseFollower />}
      
      {/* Contact Shadows */}
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2.5} 
        far={4} 
      />
      
      {/* Post Processing Effects */}
      <EffectComposer>
        <Bloom 
          intensity={0.5} 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration 
          offset={[0.002, 0.002]} 
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
};

// Main SplineLike Component
const SplineLikeScene = ({ 
  width = 600, 
  height = 400, 
  className = '',
  enableControls = false,
  enableMouseFollow = true,
  showLegalSymbol = true,
  autoRotate = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace
        }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        onCreated={() => setIsLoaded(true)}
      >
        <Scene 
          enableMouseFollow={enableMouseFollow}
          showLegalSymbol={showLegalSymbol}
        />
        
        {enableControls && (
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        )}
      </Canvas>
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm">
          <div className="text-white text-lg font-medium">Cargando...</div>
        </div>
      )}
    </motion.div>
  );
};

export default SplineLikeScene;