// src/components/Contact.jsx

import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// --- NEW 3D ANIMATION VARIANTS ---

const containerVariant = {
  hidden: {}, // The parent doesn't need to do anything but trigger the children
  visible: {
    transition: {
      staggerChildren: 0.2, // Each child will animate 0.2s after the previous one
    }
  }
};

// Variant for each item to "flip up" in 3D
const itemVariant = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90, // Start flat, facing the floor
    transformOrigin: 'top' // Pivot the rotation from the top edge
  }, 
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0, // Animate to face the viewer
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

const Contact = () => {
  return (
    // We add `perspective` to the parent container to create the 3D space
    <motion.section 
      id="contact" 
      className="py-5"
      style={{ perspective: '1000px' }} // This is crucial for 3D
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Container>
        <motion.h2 variants={itemVariant} className="text-center mb-5 display-4">Get In Touch</motion.h2>
        
        <Row className="justify-content-center">
          <Col md={8}>
            <Form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
              
              <motion.div variants={itemVariant}>
                <Form.Group className="mb-3" controlId="formGroupName">
                  <Form.Label className="text-glow">Name</Form.Label>
                  <Form.Control type="text" name="name" placeholder="Enter your name" required style={{ backgroundColor: '#222', color: 'white', borderColor: '#444' }}/>
                </Form.Group>
              </motion.div>

              <motion.div variants={itemVariant}>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label className="text-glow">Email address</Form.Label>
                  <Form.Control type="email" name="email" placeholder="Enter your email" required style={{ backgroundColor: '#222', color: 'white', borderColor: '#444' }}/>
                </Form.Group>
              </motion.div>

              <motion.div variants={itemVariant}>
                <Form.Group className="mb-3" controlId="formGroupMessage">
                  <Form.Label className="text-glow">Message</Form.Label>
                  <Form.Control as="textarea" name="message" rows={5} placeholder="Your message" required style={{ backgroundColor: '#222', color: 'white', borderColor: '#444' }}/>
                </Form.Group>
              </motion.div>

              <motion.div variants={itemVariant} className="text-center">
                  <Button type="submit" variant="outline-custom" size="lg">Send Message</Button>
              </motion.div>

            </Form>
          </Col>
        </Row>
      </Container>
    </motion.section>
  );
};

export default Contact;