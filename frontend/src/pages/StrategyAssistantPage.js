import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components with new aesthetic
const PageWrapper = styled.main`
  position: relative;
  overflow: hidden;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 8rem 0 4rem;
  overflow: hidden;
  
  .bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.1;
    
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
      background: ${({ theme }) => theme?.colors?.secondary || '#00a2ff'};
      bottom: 10%;
      left: -5%;
    }
  }
`;

const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Heading = styled(motion.h1)`
  font-size: ${props => props.size === 'xl' ? '3rem' : '2.25rem'};
  font-weight: 700;
  margin-bottom: ${props => props.mb || '1rem'};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: ${props => props.size === 'xl' ? '2.5rem' : '2rem'};
  }
`;

const GradientText = styled.span`
  background: linear-gradient(to right, 
    ${({ theme }) => theme?.colors?.primary || '#6e00ff'}, 
    ${({ theme }) => theme?.colors?.secondary || '#00a2ff'}
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
`;

const Text = styled(motion.p)`
  font-size: ${props => props.size === 'lg' ? '1.125rem' : '1rem'};
  line-height: 1.6;
  color: ${props => props.secondary 
    ? ({ theme }) => theme?.colors?.textSecondary || '#64748b' 
    : ({ theme }) => theme?.colors?.text || '#333'};
  margin-bottom: ${props => props.mb || '0'};
  max-width: ${props => props.maxWidth || 'none'};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  margin-bottom: 1.5rem;
  font-size: 1rem;
  background: ${({ theme }) => theme?.colors?.inputBg || '#fff'};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.primary || '#6e00ff'}30;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  margin-bottom: 1.5rem;
  font-size: 1rem;
  background: ${({ theme }) => theme?.colors?.inputBg || '#fff'};
  transition: all 0.3s ease;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.primary || '#6e00ff'}30;
  }
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'secondary' 
    ? 'transparent' 
    : ({ theme }) => theme?.colors?.primary || '#6e00ff'};
  color: ${props => props.variant === 'secondary' 
    ? ({ theme }) => theme?.colors?.text || '#333' 
    : '#fff'};
  padding: ${props => props.size === 'large' ? '0.875rem 2.5rem' : '0.75rem 2rem'};
  border-radius: ${props => props.rounded ? '9999px' : '8px'};
  border: 1px solid ${props => props.variant === 'secondary' 
    ? ({ theme }) => theme?.colors?.border || '#e2e8f0' 
    : ({ theme }) => theme?.colors?.primary || '#6e00ff'};
  font-weight: 500;
  font-size: ${props => props.size === 'large' ? '1.125rem' : '1rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ theme }) => theme?.colors?.primary || '#6e00ff'}30;
  }
`;

const Section = styled(motion.div)`
  padding: 2rem;
  background: ${props => props.light 
    ? ({ theme }) => theme?.colors?.surface || '#f8fafc' 
    : ({ theme }) => theme?.colors?.surface || '#1f2937'};
  color: ${props => props.light 
    ? ({ theme }) => theme?.colors?.text || '#333' 
    : ({ theme }) => theme?.colors?.textLight || '#f9fafb'};
  border-radius: 16px;
  margin-top: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StatusMessage = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: ${props => props.type === 'success' ? '#10b981' : '#ef4444'};
  background: ${props => props.type === 'success' ? '#10b98120' : '#ef444420'};
  font-weight: 500;
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

const StrategyAssistantPage = () => {
  const [technology, setTechnology] = useState('');
  const [framework, setFramework] = useState('');
  const [guide, setGuide] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [improved, setImproved] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('error');
  const [loading, setLoading] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [trainingSubmitted, setTrainingSubmitted] = useState(false);
  const [immediateSubmitted, setImmediateSubmitted] = useState(false);


  const handleGenerate = async () => {
    if (!technology || !framework) {
      setStatusMsg('Please enter both a technology and framework.');
      setStatusType('error');
      return;
    }

    setLoading(true);
    setGuide('');
    setImproved(null);
    setStatusMsg('');
    
    try {
      const res = await axios.post('http://localhost:8000/strategies', {
        technology,
        framework
      });

      setOriginalPrompt(res.data.original_prompt);
      setGuide(res.data.guide);
      setStatusMsg('');
    } catch (err) {
      setStatusMsg(`Error generating strategy: ${err.response?.data?.message || 'Server error'}`);
      setStatusType('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitImmediateFeedback = async () => {
    if (!feedback.trim()) {
      setStatusMsg('Please enter feedback before submitting.');
      setStatusType('error');
      return;
    }
  
    setSubmittingFeedback(true);
    try {
      const res = await axios.post('http://localhost:8000/feedback_immediate', {
        original_prompt: originalPrompt,
        feedback: feedback
      });
  
      setImmediateSubmitted(true);
      if (res.data.improved_guide) {
        setImproved({
          prompt: res.data.improved_prompt,
          guide: res.data.improved_guide
        });
        setStatusMsg("✅ Improved guide generated based on your feedback.");
        setStatusType('success');
      }
  
          
      
          // 👇 Reset feedback field
          setFeedback('');
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to submit immediate feedback.");
      setStatusType('error');
    } finally {
      setSubmittingFeedback(false);
    }
  };
  
  const submitTrainingFeedback = async () => {
    if (!feedback.trim()) {
      setStatusMsg('Please enter feedback before submitting.');
      setStatusType('error');
      return;
    }
  
    setSubmittingFeedback(true);
    try {
      const res = await axios.post('http://localhost:8000/feedback_training', {
        original_prompt: originalPrompt,
        feedback: feedback
      });
  
      setTrainingSubmitted(true);
      if (res.data.improved_guide) {
        setImproved({
          prompt: res.data.improved_prompt,
          guide: res.data.improved_guide
        });
        setStatusMsg("✅ Training batch processed! Here's the new version.");
        setStatusType('success');
        
      } else {
        setStatusMsg("✅ Feedback saved for training. We'll process it after 5 entries.");
        setStatusType('success');
      }
           
          
      
          // 👇 Reset feedback field
          setFeedback('');
      
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to submit training feedback.");
      setStatusType('error');
    } finally {
      setSubmittingFeedback(false);
    }
  };
  

  return (
    <PageWrapper>
      <HeroSection>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        
        <Container>
          <div className="text-center mb-10">
            <Heading 
              size="xl" 
              mb="1.5rem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GradientText>Strategy</GradientText> Assistant
            </Heading>
            <Text 
              size="lg" 
              secondary 
              maxWidth="700px" 
              mb="3rem"
              style={{ margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Generate strategic implementation guides for adopting new technologies
              using proven frameworks. Provide feedback to improve results.
            </Text>
          </div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Input
              placeholder="Technology to adopt (e.g. Grok AI)"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
            />

            <Input
              placeholder="Framework to use (e.g. ADKAR)"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
            />

            <div className="text-center">
              <Button 
                onClick={handleGenerate} 
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                rounded
              >
                {loading ? "Generating..." : "Generate Strategy"}
              </Button>
            </div>
          </motion.div>

          <AnimatePresence>
            {statusMsg && (
              <StatusMessage
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                type={statusType}
              >
                {statusMsg}
              </StatusMessage>
            )}
          </AnimatePresence>

          <AnimatePresence>
          {guide && (
  <Section
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    exit="hidden"
  >
    <Heading size="lg" mb="1.5rem">📘 Initial Strategy Guide</Heading>
    <ReactMarkdown>{guide}</ReactMarkdown>
    {/* Alternative if using markdown: */}
    {/* <ReactMarkdown>{guide}</ReactMarkdown> */}
  </Section>
)}
          </AnimatePresence>

          <AnimatePresence>
            {guide && (
              <motion.div 
                style={{ marginTop: '2rem' }}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                exit="hidden"
              >
                <Heading as="h4" size="md" mb="1rem">Not happy with this? Leave a short feedback:</Heading>
                <TextArea
                  placeholder="e.g. This is too generic. Add more relevance to engineers."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="text-center">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
  <Button 
    onClick={submitImmediateFeedback}
    disabled={submittingFeedback}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    rounded
  >
    {submittingFeedback && !trainingSubmitted ? "Submitting..." : "Improve Now"}
  </Button>

  <Button 
    onClick={submitTrainingFeedback}
    variant="secondary"
    disabled={submittingFeedback}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    rounded
  >
    {submittingFeedback && !immediateSubmitted ? "Submitting..." : "Save for Training"}
  </Button>
</div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {improved && (
              <Section
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                exit="hidden"
              >
                <Heading size="lg" mb="1.5rem">💡 Improved Guide</Heading>
                <Text>{improved.guide}</Text>
              </Section>
            )}
          </AnimatePresence>
        </Container>
      </HeroSection>
      
      <section style={{ padding: '4rem 0' }}>
        <Container>
          <div className="text-center">
            <Heading 
              size="lg" 
              mb="1.5rem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              Create Better Strategies
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
              Our AI-powered strategy assistant helps you create comprehensive implementation 
              plans that adapt based on your feedback.
            </Text>
            <Button
              variant="primary"
              size="large"
              rounded
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Try Another Strategy
            </Button>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
};

export default StrategyAssistantPage;