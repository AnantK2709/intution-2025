import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Styled components
const PageSection = styled.section`
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.1;
    z-index: -1;
    
    &.shape-1 {
      width: 40vw;
      height: 40vw;
      background: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
      top: -10%;
      right: -10%;
    }
    
    &.shape-2 {
      width: 30vw;
      height: 30vw;
      background: ${({ theme }) => theme?.colors?.secondary || '#00b4d8'};
      bottom: 10%;
      left: -5%;
    }
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageHeading = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  
  span {
    background: linear-gradient(to right, #6e00ff, #00b4d8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subheading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme?.colors?.textAlt || '#4a5568'};
`;

const FaqContainer = styled(motion.div)`
  margin-top: 3rem;
`;

const FaqItem = styled(motion.div)`
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
  overflow: hidden;
`;

const FaqQuestion = styled.div`
  padding: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  svg {
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const FaqAnswer = styled(motion.div)`
  padding: 0 1.5rem;
  padding-bottom: ${({ isOpen }) => isOpen ? '1.5rem' : '0'};
  line-height: 1.6;
  color: ${({ theme }) => theme?.colors?.textAlt || '#4a5568'};
`;

const Button = styled(motion.button)`
  background: ${({ variant, theme }) =>
    variant === 'outline'
      ? 'transparent'
      : (theme?.colors?.primary || '#6e00ff')};
  color: ${({ variant }) => variant === 'outline' ? '#6e00ff' : 'white'};
  border: 2px solid ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
  border-radius: 9999px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(110, 0, 255, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
  
  svg {
    animation: spin 1s linear infinite;
    color: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StatusMessage = styled(motion.div)`
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  
  background: ${({ isError }) => isError ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)'};
  color: ${({ isError }) => isError ? '#ef4444' : '#16a34a'};
  
  svg {
    margin-right: 0.75rem;
    flex-shrink: 0;
  }
`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const FAQPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  
  // Extract form data from location state (passed from PromptFlowPage)
  const formData = location.state?.formData || null;
  
  useEffect(() => {
    const generateFAQs = async () => {
      // If no form data was passed, redirect back to the form page
      if (!formData) {
        navigate('/work');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Call the API to generate FAQs
        const response = await axios.post('http://localhost:8000/generate_faqs', {
          change_type: formData.change_type,
          audience: formData.audience,
          tech_proficiency: formData.tech_proficiency,
          key_points: formData.key_points.split('\n'),
          purpose: formData.purpose
        });
        console.log('FAQs generated:', response.data);
        if (response.data && response.data.faqs) {
          setFaqs(response.data.faqs);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error generating FAQs:', err);
        setError(`Error generating FAQs: ${err.response?.data?.detail || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    generateFAQs();
  }, [formData, navigate]);
  
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const goBack = () => {
    navigate('/work');
  };

  return (
    <PageSection>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      
      <Container>
        <PageHeading
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span>Frequently Asked Questions</span>
        </PageHeading>

        {formData && (
          <Subheading>
            Addressing Common Concerns About {formData.purpose}
          </Subheading>
        )}
        
        {error && (
          <StatusMessage
            isError={true}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L8.58579 10L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L10 11.4142L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L11.4142 10L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L10 8.58579L8.70711 7.29289Z"
                fill="currentColor"
              />
            </svg>
            {error}
          </StatusMessage>
        )}
        
        {loading ? (
          <LoadingSpinner>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </LoadingSpinner>
        ) : (
          <FaqContainer
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {faqs.map((faq, index) => (
              <FaqItem key={index} variants={fadeInUp}>
                <FaqQuestion
                  onClick={() => toggleFaq(index)}
                  isOpen={openIndex === index}
                >
                  <div>{faq.question}</div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </FaqQuestion>
                <FaqAnswer
                  initial={false}
                  animate={{ 
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  isOpen={openIndex === index}
                >
                  {faq.answer}
                </FaqAnswer>
              </FaqItem>
            ))}
          </FaqContainer>
        )}
        
        <ButtonContainer>
          <Button
            onClick={goBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '0.5rem' }}
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Communication Tool
          </Button>
        </ButtonContainer>
      </Container>
    </PageSection>
  );
};

export default FAQPage;