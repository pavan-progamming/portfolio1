// src/App.jsx

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Container } from 'react-bootstrap';

import ParticleBackground from './components/ParticleBackground';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = 'auto';
    }, 2500);

    document.body.style.overflow = 'hidden';
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      <ParticleBackground />
      
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>
      
      {!isLoading && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Hero />
          <Container>
            <About />
            <Skills />
            <Projects />
            <Contact />
          </Container>
          <footer className="text-center py-4">
            <p>© {new Date().getFullYear()} Your Name. All Rights Reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;