import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Import components
import {
  Section,
  Container,
  Heading,
  Text,
  GradientText,
  GlassPanel,
  Button,
  Input,
  Textarea,
  Grid
} from '../components/ui';

// Styled components
const ContactSection = styled(Section)`
  position: relative;
  overflow: hidden;
  
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.1;
    
    &.shape-1 {
      width: 50vw;
      height: 50vw;
      background: ${({ theme }) => theme.colors.primary};
      top: -20%;
      right: -20%;
    }
    
    &.shape-2 {
      width: 30vw;
      height: 30vw;
      background: ${({ theme }) => theme.colors.accent};
      bottom: -10%;
      left: -10%;
    }
  }
`;

const ContactFormPanel = styled(GlassPanel)`
  @media (min-width: 992px) {
    margin-left: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .error-message {
    color: #f44336;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
`;

const ContactInfo = styled.div`
  @media (max-width: 991px) {
    margin-bottom: 3rem;
  }
  
  .contact-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.primary}20;
      color: ${({ theme }) => theme.colors.primary};
      font-size: 1.25rem;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .content {
      h4 {
        font-size: 1.125rem;
        margin-bottom: 0.25rem;
      }
      
      p, a {
        color: ${({ theme }) => theme.colors.textSecondary};
        
        &:hover {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: ${({ theme }) => theme.colors.glassBlur};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-3px);
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, 1500);
    }
  };
  
  return (
    <main>
      <ContactSection>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        
        <Container>
          <div className="text-center mb-16">
            <Heading 
              size="lg" 
              mb="1.5rem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Get In <GradientText>Touch</GradientText>
            </Heading>
            <Text 
              size="lg" 
              secondary 
              maxWidth="600px" 
              style={{ margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Have a project in mind or want to learn more about our services?
              We'd love to hear from you.
            </Text>
          </div>
          
          <Grid cols={2} mdCols={1} gap="2rem">
            <ContactInfo
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Heading size="md" mb="2rem">Contact Information</Heading>
              
              <div className="contact-item">
                <div className="icon">📍</div>
                <div className="content">
                  <h4>Our Location</h4>
                  <p>123 Design Street, Creative District<br />New York, NY 10001</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="icon">📧</div>
                <div className="content">
                  <h4>Email Us</h4>
                  <a href="mailto:info@adriennwhite.com">info@commitandconquer.com</a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="icon">📞</div>
                <div className="content">
                  <h4>Call Us</h4>
                  <a href="tel:+12125551234">+1 (212) 555-1234</a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="icon">⏰</div>
                <div className="content">
                  <h4>Working Hours</h4>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday - Sunday: Closed</p>
                </div>
              </div>
              
              <Heading size="sm" mb="1rem" style={{ marginTop: '2.5rem' }}>Follow Us</Heading>
              <SocialLinks>
                {['twitter', 'instagram', 'linkedin', 'facebook', 'dribbble'].map((platform, i) => (
                  <SocialLink 
                    key={platform}
                    href={`https://${platform}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className={`icon-${platform}`}></i>
                  </SocialLink>
                ))}
              </SocialLinks>
            </ContactInfo>
            
            <ContactFormPanel
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Heading size="md" mb="2rem">Send Us a Message</Heading>
              
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassPanel
                    style={{ background: 'rgba(0, 200, 83, 0.1)', borderColor: 'rgba(0, 200, 83, 0.3)' }}
                  >
                    <Text style={{ color: '#00c853', textAlign: 'center' }}>
                      Thank you for your message! We'll get back to you as soon as possible.
                    </Text>
                  </GlassPanel>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <label htmlFor="name">Your Name</label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      style={formErrors.name ? { borderColor: '#f44336' } : {}}
                    />
                    {formErrors.name && (
                      <div className="error-message">{formErrors.name}</div>
                    )}
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="email">Your Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={formErrors.email ? { borderColor: '#f44336' } : {}}
                    />
                    {formErrors.email && (
                      <div className="error-message">{formErrors.email}</div>
                    )}
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="subject">Subject</label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="message">Your Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us about your project or inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      style={formErrors.message ? { borderColor: '#f44336' } : {}}
                    />
                    {formErrors.message && (
                      <div className="error-message">{formErrors.message}</div>
                    )}
                  </FormGroup>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ width: '100%' }}
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </ContactFormPanel>
          </Grid>
        </Container>
      </ContactSection>
      
      <Section dense>
        <Container>
          <MapContainer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304605!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1650000000000!5m2!1sen!2s"
              title="Our Location"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </MapContainer>
        </Container>
      </Section>
      
      <Section light>
        <Container>
          <div className="text-center">
            <Heading 
              size="md" 
              mb="1.5rem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              Ready to Start Your Project?
            </Heading>
            <Text 
              size="lg" 
              secondary 
              maxWidth="600px" 
              mb="2rem"
              style={{ margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Let's create something amazing together. Reach out today and let's discuss your vision.
            </Text>
            <Button
              as="a"
              href="mailto:info@adriennwhite.com"
              variant="primary"
              size="large"
              rounded
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Schedule a Call
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
};

export default ContactPage;