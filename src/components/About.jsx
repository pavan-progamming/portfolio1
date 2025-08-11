// src/components/About.jsx

import { motion } from 'framer-motion';
import { Container, Row, Col, Image } from 'react-bootstrap';

// Make sure this path is correct for your photo
import profilePic from '../assets/your-photo.png'; 

// --- ANIMATION VARIANTS (No 3D tilt logic) ---

const sectionVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.4, // Stagger the image and text animations
    },
  },
};

const imageVariant = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateY: 90, // Start turned to the side
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0, // Rotate to face the front
    transition: {
      duration: 0.8,
      ease: [0.6, 0.01, 0.05, 0.95]
    }
  }
};

const textContainerVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.01, // Creates the letter-by-letter reveal
      }
    }
};

const letterVariant = {
    hidden: { opacity: 0, rotateX: -90, y: -20 },
    visible: {
        opacity: 1,
        rotateX: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
};

const About = () => {
    const aboutText1 = "Hello! I'm Pavan, a passionate and creative developer with a love for building beautiful, intuitive, and highly performant web applications. My journey into code started with a simple \"Hello World,\" and has since grown into a full-fledged passion for turning complex problems into elegant digital experiences.";
    const aboutText2 = "I specialize in the frontend, crafting seamless user interfaces with modern technologies. I thrive in collaborative environments and am always eager to learn and adapt to new challenges. When I'm not coding, you can find me exploring new tech, contributing to open-source, or enjoying a good cup of coffee.";

  return (
    <motion.section 
        id="about" 
        className="py-5 my-5"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
    >
      <Container>
        <h2 className="text-center mb-5 display-4">About Me</h2>
        {/* The perspective is still needed for the 3D letter/image unfold */}
        <Row className="align-items-center" style={{ perspective: '1200px' }}>
          
          <Col md={4} className="text-center mb-4 mb-md-0">
            <motion.div variants={imageVariant} style={{ transformStyle: 'preserve-3d' }}>
              <Image 
                src={profilePic} 
                roundedCircle 
                fluid 
                alt="Pavan"
                style={{
                    border: '3px solid var(--primary-color)',
                    boxShadow: '0 0 20px var(--primary-glow)',
                    maxWidth: '250px'
                }}
              />
            </motion.div>
          </Col>

          <Col md={8}>
            <motion.div variants={textContainerVariant}>
                <p className="lead text-glow" style={{ transformStyle: 'preserve-3d' }}>
                    {aboutText1.split("").map((letter, index) => (
                        <motion.span key={`${letter}-${index}`} variants={letterVariant} style={{display: 'inline-block'}}>
                            {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                    ))}
                </p>
                <p className="text-glow" style={{ transformStyle: 'preserve-d' }}>
                    {aboutText2.split("").map((letter, index) => (
                        <motion.span key={`${letter}-${index}`} variants={letterVariant} style={{display: 'inline-block'}}>
                            {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                    ))}
                </p>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.section>
  );
};

export default About;