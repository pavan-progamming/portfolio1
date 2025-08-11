// src/components/Skills.jsx

import { motion, useAnimation } from 'framer-motion';
import { Container } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useMediaQuery } from '../hooks'; // <-- Import our new hook

// Icons and Skills data...
import { 
  FaReact, FaNodeJs, FaBootstrap, FaHtml5, FaCss3Alt, FaGitAlt 
} from 'react-icons/fa';
import { 
  SiJavascript, SiVite, SiFramer, SiMongodb, SiNpm 
} from 'react-icons/si';
import { TbApi } from "react-icons/tb";

const skills = [
  { name: 'React', icon: <FaReact color="#61DAFB" /> },
  { name: 'JavaScript', icon: <SiJavascript color="#F7DF1E" /> },
  { name: 'Vite', icon: <SiVite color="#646CFF" /> },
  { name: 'Node.js', icon: <FaNodeJs color="#339933" /> },
  { name: 'Bootstrap', icon: <FaBootstrap color="#7952B3" /> },
  { name: 'Framer Motion', icon: <SiFramer color="#0055FF" /> },
  { name: 'HTML5', icon: <FaHtml5 color="#E34F26" /> },
  { name: 'CSS3', icon: <FaCss3Alt color="#1572B6" /> },
  { name: 'Git', icon: <FaGitAlt color="#F05032" /> },
  { name: 'REST APIs', icon: <TbApi color="#FFFFFF" /> },
  { name: 'NPM', icon: <SiNpm color="#CB3837" /> },
  { name: 'MongoDB', icon: <SiMongodb color="#47A248" /> }
];

// ... (itemContentVariant and lightEffectVariant are unchanged)

const itemContentVariant = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 15 } }
};

const lightEffectVariant = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: [0, 1, 0], scale: [0, 1.5, 0], transition: { duration: 1.2, ease: "easeOut" } }
};

const calc = (x, y, rect) => [
  -(y - rect.top - rect.height / 2) / 25,
  (x - rect.left - rect.width / 2) / 25,
  1.03
];
const trans = (x, y, s) => `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const Skills = () => {
  // --- THIS IS THE NEW LOGIC ---
  // This will be `true` if the screen is smaller than 768px
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // ... (all other hooks and effects are unchanged)

  const [path, setPath] = useState('');
  const pathControls = useAnimation();
  const sparkControls = useAnimation();
  const itemControls = skills.map(() => ({
      content: useAnimation(),
      halo: useAnimation()
  }));
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  const tiltRef = useRef(null);
  const [props, api] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 }
  }));

  useEffect(() => {
    const calculatePath = () => {
      let pathData = '';
      if (itemRefs.current.length > 0) {
        itemRefs.current.forEach((ref, i) => {
          if (ref) {
            const x = ref.offsetLeft + ref.offsetWidth / 2;
            const y = ref.offsetTop + ref.offsetHeight / 2;
            if (i === 0) { pathData += `M ${x} ${y}`; } 
            else { pathData += ` L ${x} ${y}`; }
          }
        });
      }
      setPath(pathData);
    };
    const timeoutId = setTimeout(calculatePath, 100);
    window.addEventListener('resize', calculatePath);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculatePath);
    }
  }, []);

  useEffect(() => {
    const sequence = async () => {
        const animationDuration = 2.5;
        itemControls.forEach((ctrl, i) => {
            const delay = i * (animationDuration / skills.length);
            ctrl.content.start({ ...itemContentVariant.visible, transition: { ...itemContentVariant.visible.transition, delay } });
            ctrl.halo.start({ ...lightEffectVariant.visible, transition: { ...lightEffectVariant.visible.transition, delay } });
        });
        pathControls.start({ pathLength: 1, transition: { duration: animationDuration, ease: "easeInOut" } });
        sparkControls.start({ offsetDistance: "100%", transition: { duration: animationDuration, ease: "easeInOut" } });
        await new Promise(resolve => setTimeout(resolve, animationDuration * 1000));
        pathControls.start({ opacity: 0, transition: { duration: 0.3 } });
        sparkControls.start({ opacity: 0, transition: { duration: 0.3 } });
    };
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && path) {
            sequence();
            observer.disconnect();
        }
    }, { threshold: 0.2 });
    if (containerRef.current) { observer.observe(containerRef.current); }
    return () => { if(containerRef.current) { observer.unobserve(containerRef.current) } };
  }, [path, pathControls, sparkControls, itemControls]);

  return (
    <section id="skills" className="py-5 my-5">
      <Container className="text-center">
        <style>{/* ... (CSS is unchanged) ... */`
            #skills-list-container-wrapper { position: relative; }
            #skills-list-container { position: relative; list-style-type: none; padding: 0; display: grid; gap: 1.5rem; max-width: 950px; margin: auto; transform-style: preserve-3d; }
            .skill-item { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 0.5rem; }
            .light-halo { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; border-radius: 8px; background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%); }
            .skill-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
            .skill-item-icon { font-size: 2.5rem; }
            .skill-item-name { font-size: 0.85rem; font-weight: bold; }
            @media (max-width: 767px) { #skills-list-container { grid-template-columns: repeat(3, 1fr); gap: 1rem; } }
            @media (min-width: 768px) { #skills-list-container { grid-template-columns: repeat(4, 1fr); gap: 2rem; } }
            @media (min-width: 1200px) { #skills-list-container { grid-template-columns: repeat(6, 1fr); } }
        `}</style>
        
        <h2 className="mb-5 display-4">My Tech Stack</h2>
        
        <div id="skills-list-container-wrapper" ref={containerRef}>
          {/* --- THE MOUSE EVENT HANDLERS ARE NOW CONDITIONAL --- */}
          <animated.div
            ref={tiltRef}
            style={{ 
              transform: isMobile ? 'none' : props.xys.to(trans), // Disable transform on mobile
              touchAction: 'pan-y' // Improve scrolling on mobile
            }}
            // Only attach these events if it's NOT mobile
            onMouseLeave={!isMobile ? () => api.start({ xys: [0, 0, 1] }) : undefined}
            onMouseMove={!isMobile ? (e) => {
              const rect = tiltRef.current.getBoundingClientRect();
              api.start({ xys: calc(e.clientX, e.clientY, rect) });
            } : undefined}
          >
            <div id="skills-list-container">
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
                <motion.path d={path} fill="none" stroke="var(--primary-glow)" strokeWidth="2" animate={pathControls} initial={{ pathLength: 0, opacity: 1 }} />
                <motion.circle cx="0" cy="0" r="6" fill="var(--primary-color)" animate={sparkControls} style={{ offsetPath: `path("${path}")`, offsetDistance: "0%", opacity: 1 }}>
                    <animate attributeName="r" values="6;3;6" dur="1s" repeatCount="indefinite" />
                </motion.circle>
              </svg>

              {skills.map((skill, index) => (
                <div key={skill.name} ref={el => itemRefs.current[index] = el} className="skill-item">
                  <motion.div className="light-halo" variants={lightEffectVariant} initial="hidden" animate={itemControls[index].halo}></motion.div>
                  <motion.div className="skill-content" variants={itemContentVariant} initial="hidden" animate={itemControls[index].content}>
                    <span className="skill-item-icon">{skill.icon}</span>
                    <span className="skill-item-name text-glow">{skill.name}</span>
                  </motion.div>
                </div>
              ))}
            </div>
          </animated.div>
        </div>
      </Container>
    </section>
  );
};

export default Skills;