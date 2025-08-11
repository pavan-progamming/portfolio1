// src/components/Hero.jsx

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { arc } from 'd3-shape';

// --- CUSTOM HOOKS ARE NOW INSIDE THIS FILE ---

const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    const handleOrientation = (event) => {
      setOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return orientation;
};

const useScramble = (text) => {
  const [scrambledText, setScrambledText] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#_';
  const rafRef = useRef();

  useEffect(() => {
    let frame = 0;
    let queue = [];
    for (let i = 0; i < text.length; i++) {
      const from = '';
      const to = text[i];
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end });
    }
    const update = () => {
      let output = '';
      for (let i = 0; i < queue.length; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) { output += to; } 
        else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          output += char;
        } else { output += from; }
      }
      setScrambledText(output);
      if (output !== text) {
        frame++;
        rafRef.current = requestAnimationFrame(update);
      }
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text]);
  return scrambledText;
};

// --- MAIN HERO COMPONENT ---

const Hero = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const name = "Pavan";

  return isMobile ? <MobileHero name={name} /> : <DesktopHero name={name} />;
};

// --- MOBILE HERO COMPONENT ---
const MobileHero = ({ name }) => {
  // --- THIS IS THE BULLETPROOF FIX ---
  // We provide a default empty object to prevent the crash
  const { beta, gamma } = useDeviceOrientation() || { beta: 0, gamma: 0 };
  const scrambledName = useScramble(name);
  
  const motionBeta = useMotionValue(0);
  const motionGamma = useMotionValue(0);

  useEffect(() => {
    // We use `beta || 0` to ensure we never pass a null value to animate
    animate(motionBeta, beta || 0, { type: 'spring', stiffness: 100, damping: 20 });
    animate(motionGamma, gamma || 0, { type: 'spring', stiffness: 100, damping: 20 });
  }, [beta, gamma, motionBeta, motionGamma]);

  const rotateX = useTransform(motionBeta, [-45, 45], [10, -10]);
  const rotateY = useTransform(motionGamma, [-45, 45], [-10, 10]);

  return (
    <motion.div 
      className="container vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{ perspective: '800px' }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <h1 className="display-3 fw-bold text-glow" style={{ minHeight: '80px', fontFamily: 'monospace' }}>
          {scrambledName}
        </h1>
        <TypeAnimation
          sequence={[ 'Frontend Developer', 2000, 'React Specialist', 2000, 'Creative Coder', 2000, ]}
          wrapper="h4"
          speed={50}
          style={{ color: 'white', minHeight: '80px', display: 'inline-block' }}
          repeat={Infinity}
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="mt-4"
        >
          <a href="#projects" className="btn btn-outline-custom btn-lg">View My Work</a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- DESKTOP HERO & TEXT RING COMPONENTS ---
const DesktopHero = ({ name }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-400, 400], [15, -15]);
  const rotateY = useTransform(x, [-400, 400], [-15, 15]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    animate(x, 0, { type: 'spring', stiffness: 50 });
    animate(y, 0, { type: 'spring', stiffness: 50 });
  };

  const ring1Text = "Frontend Developer • UI/UX Enthusiast • ";
  const ring2Text = "React Specialist • JavaScript Expert • ";
  const ring3Text = "Creative Coder • Problem Solver • ";

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="container vh-100 d-flex flex-column justify-content-center align-items-center text-center position-relative"
      style={{ perspective: '1200px' }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transformStyle: 'preserve-3d', position: 'relative' }}
        >
            <h1 className="display-1 fw-bold">{name}</h1>
        </motion.div>
        <AnimatedTextRing text={ring1Text.repeat(3)} radius={150} duration={40} />
        <AnimatedTextRing text={ring2Text.repeat(2)} radius={220} duration={60} reversed />
        <AnimatedTextRing text={ring3Text.repeat(2)} radius={290} duration={80} />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-5"
        >
          <a href="#projects" className="btn btn-outline-custom btn-lg">View My Work</a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const AnimatedTextRing = ({ text, radius, duration, reversed = false }) => {
  const characters = text.split("");
  const angleStep = 360 / characters.length;
  const arcGenerator = arc().innerRadius(radius).outerRadius(radius);
  const rotation = useMotionValue(0);

  useEffect(() => {
    const animation = animate(rotation, reversed ? -360 : 360, { duration, repeat: Infinity, ease: 'linear' });
    return () => animation.stop();
  }, [duration, reversed, rotation]);

  return (
    <motion.div
      style={{ position: 'absolute', top: '50%', left: '50%', transformStyle: 'preserve-3d', rotate: rotation }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
    >
      {characters.map((char, i) => {
        const angle = i * angleStep;
        const [x, y] = arcGenerator.centroid({ startAngle: angle * (Math.PI / 180), endAngle: (angle + 1) * (Math.PI / 180) });
        return (
          <motion.span key={i} style={{
              position: 'absolute', left: '0px', top: '0px',
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
              color: 'var(--primary-color)', opacity: 0.5, fontSize: '1rem',
              textShadow: '0 0 5px var(--primary-glow)',
            }} >{char}</motion.span>
        );
      })}
    </motion.div>
  );
};

export default Hero;