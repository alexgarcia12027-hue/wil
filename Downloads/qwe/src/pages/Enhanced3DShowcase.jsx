import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SplineLikeScene from '../components/3D/SplineLikeScene';
import EnhancedCursorFollower from '../components/3D/EnhancedCursorFollower';
import EnhancedGlassCard from '../components/3D/EnhancedGlassCard';
import ParticleSystem from '../components/3D/ParticleSystem';

const Enhanced3DShowcase = () => {
  const [activeDemo, setActiveDemo] = useState('hero');

  const demoSections = {
    hero: {
      title: 'Hero Section Enhancement',
      description: 'Professional 3D scene with legal-themed animations',
      component: (
        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8 items-center\">
          <div className=\"space-y-6\">
            <motion.h1 
              className=\"text-5xl font-bold text-white\"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Abg. Wilson Alexander
              <br />
              <span className=\"text-blue-300\">Ipiales Guerron</span>
            </motion.h1>
            <motion.p 
              className=\"text-xl text-blue-100\"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Excelencia legal con tecnología de vanguardia. 
              Más de 5 años de experiencia respaldados por 
              innovación y dedicación profesional.
            </motion.p>
            <motion.div 
              className=\"flex space-x-4\"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button className=\"bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors\">
                Consulta Gratuita
              </button>
              <button className=\"bg-transparent border border-blue-300 text-blue-300 hover:bg-blue-300 hover:text-blue-900 px-6 py-3 rounded-lg font-semibold transition-colors\">
                Ver Servicios
              </button>
            </motion.div>
          </div>
          <div className=\"flex justify-center\">
            <SplineLikeScene 
              width={600} 
              height={500} 
              enableMouseFollow={true}
              showLegalSymbol={true}
              className=\"shadow-2xl\"
            />
          </div>
        </div>
      )
    },
    services: {
      title: 'Enhanced Service Cards',
      description: 'Glass morphism cards with 3D depth effects',
      component: (
        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8\">
          {[
            {
              title: 'Derecho Penal',
              description: 'Defensa especializada en casos penales con resultados comprobados',
              icon: '⚖️',
              color: '#667eea'
            },
            {
              title: 'Derecho Civil',
              description: 'Resolución efectiva de conflictos civiles y patrimoniales',
              icon: '📋',
              color: '#764ba2'
            },
            {
              title: 'Consulta Express',
              description: 'Asesoría legal inmediata con tecnología avanzada',
              icon: '⚡',
              color: '#f59e0b'
            }
          ].map((service, index) => (
            <EnhancedGlassCard
              key={index}
              glowColor={service.color}
              enableTilt={true}
              enableGlow={true}
              enableParticles={true}
              enable3D={true}
              depth=\"medium\"
              className=\"h-80\"
            >
              <div className=\"text-center space-y-4\">
                <div className=\"text-4xl mb-4\">{service.icon}</div>
                <h3 className=\"text-2xl font-bold text-white\">{service.title}</h3>
                <p className=\"text-blue-100\">{service.description}</p>
                <button 
                  className=\"mt-4 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors\"
                  style={{ borderColor: service.color }}
                >
                  Más Información
                </button>
              </div>
            </EnhancedGlassCard>
          ))}
        </div>
      )
    },
    ambient: {
      title: 'Ambient Particle Effects',
      description: 'Atmospheric particle systems for enhanced user experience',
      component: (
        <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-8\">
          <div className=\"space-y-6\">
            <h3 className=\"text-3xl font-bold text-white\">Experiencia Inmersiva</h3>
            <p className=\"text-blue-100 text-lg\">
              Nuestros efectos ambientales crean una experiencia única que 
              refleja la profesionalidad y modernidad de nuestros servicios legales.
            </p>
            <div className=\"space-y-4\">
              {[
                'Animaciones fluidas y naturales',
                'Efectos de partículas optimizados',
                'Respuesta intuitiva al usuario',
                'Diseño centrado en la experiencia'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className=\"flex items-center space-x-3\"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className=\"w-2 h-2 bg-blue-400 rounded-full\" />
                  <span className=\"text-blue-100\">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className=\"flex justify-center\">
            <ParticleSystem
              width={500}
              height={400}
              particleCount={800}
              enableShapes={true}
              enableWaves={true}
              colors={['#667eea', '#764ba2', '#f59e0b']}
              intensity=\"medium\"
            />
          </div>
        </div>
      )
    },
    interactive: {
      title: 'Interactive Elements',
      description: 'Cursor following and magnetic interaction effects',
      component: (
        <div className=\"text-center space-y-8\">
          <h3 className=\"text-4xl font-bold text-white\">Interacciones Avanzadas</h3>
          <p className=\"text-xl text-blue-100 max-w-3xl mx-auto\">
            Mueva su cursor por la pantalla para experimentar nuestros efectos 
            interactivos de última generación. Cada elemento responde de manera 
            intuitiva a sus acciones.
          </p>
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 mt-12\">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className=\"interactive bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer\"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className=\"text-3xl mb-4\">🎯</div>
                <h4 className=\"text-lg font-semibold text-white mb-2\">
                  Elemento Interactivo {index + 1}
                </h4>
                <p className=\"text-blue-100 text-sm\">
                  Experimenta la respuesta magnética al pasar el cursor
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900\">
      {/* Enhanced Cursor Follower */}
      <EnhancedCursorFollower
        size=\"medium\"
        glowEffect={true}
        trailEffect={true}
        magneticEffect={true}
        colors={{
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#f59e0b'
        }}
      />

      {/* Navigation */}
      <nav className=\"fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10\">
        <div className=\"max-w-7xl mx-auto px-6 py-4\">
          <div className=\"flex justify-between items-center\">
            <h1 className=\"text-2xl font-bold text-white\">3D Showcase</h1>
            <div className=\"flex space-x-4\">
              {Object.keys(demoSections).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key)}
                  className={`px-4 py-2 rounded-lg transition-all interactive ${
                    activeDemo === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-blue-100 hover:bg-white/20'
                  }`}
                >
                  {demoSections[key].title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className=\"pt-24 pb-12\">
        <div className=\"max-w-7xl mx-auto px-6\">
          {/* Section Header */}
          <motion.div
            className=\"text-center mb-16\"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeDemo}
            transition={{ duration: 0.8 }}
          >
            <h2 className=\"text-5xl font-bold text-white mb-4\">
              {demoSections[activeDemo].title}
            </h2>
            <p className=\"text-xl text-blue-300\">
              {demoSections[activeDemo].description}
            </p>
          </motion.div>

          {/* Demo Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeDemo}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {demoSections[activeDemo].component}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className=\"bg-black/30 backdrop-blur-lg border-t border-white/10 py-8\">
        <div className=\"max-w-7xl mx-auto px-6 text-center\">
          <p className=\"text-blue-200\">
            © 2024 Abg. Wilson Alexander Ipiales Guerron - 
            Tecnología Legal de Vanguardia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Enhanced3DShowcase;