// src/components/Projects.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

// Import Swiper for the mobile view
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Make sure your image paths are correct
import projectImage1 from '../assets/images/project1.png';
import projectImage2 from '../assets/images/project2.png';
import projectImage3 from '../assets/images/project3.png';

const projectData = [
  { title: "Project One", description: "A brief description of this cool project.", image: projectImage1, link: "#" },
  { title: "Project Two", description: "Built with Vite, featuring advanced animations.", image: projectImage2, link: "#" },
  { title: "Project Three", description: "A full-stack application with a Node.js backend.", image: projectImage3, link: "#" },
];

// --- "3D CARD FLIP" VARIANT FOR DESKTOP ---
const cardVariant = {
  hidden: { 
    opacity: 0, 
    rotateY: -180, // Start flipped backwards
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    rotateY: 0, // Flip to the front
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut" // Use a valid, clean easing function
    }
  }
};

const Projects = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // A reusable function to render a single card, used by both layouts
  const renderCard = (project) => (
    <Card 
      className="h-100 hoverable"
      style={{
        transformStyle: 'preserve-3d', // Needed for the 3D effect on desktop
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        border: '1px solid var(--primary-color)',
        boxShadow: '0 0 10px var(--primary-glow)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Card.Img variant="top" src={project.image} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-glow">{project.title}</Card.Title>
        <Card.Text style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
          {project.description}
        </Card.Text>
        <Button 
          href={project.link} target="_blank" variant="outline-custom" 
          className="mt-auto"
        >
          View Project
        </Button>
      </Card.Body>
    </Card>
  );

  return (
    <section id="projects" className="py-5">
      <Container style={{ perspective: '1200px' }}>
        <style>{`
          .swiper-pagination-bullet-active {
            background-color: var(--primary-color) !important;
          }
          .swiper-slide {
            transition: transform 0.3s ease;
          }
          .swiper-slide:hover {
            transform: scale(1.05) !important;
          }
        `}</style>
        
        <h2 className="text-center mb-5 display-4">My Projects</h2>
        
        {isMobile ? (
          // --- MOBILE VIEW: SWIPER CAROUSEL ---
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper"
          >
            {projectData.map((project, index) => (
              <SwiperSlide key={index} style={{ width: '80%', maxWidth: '350px' }}>
                {renderCard(project)}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // --- DESKTOP VIEW: 3D ANIMATED GRID ---
          <Row>
            {projectData.map((project, index) => (
              <Col md={4} key={index} className="mb-4 d-flex">
                <motion.div
                  className="w-100"
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: index * 0.15 }}
                >
                  {renderCard(project)}
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Projects;