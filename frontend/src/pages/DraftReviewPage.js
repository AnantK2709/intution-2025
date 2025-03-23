import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

// Styled components with matching aesthetic to StrategyAssistantPage
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
  font-size: ${props => props.size === 'xl' ? '3rem' : props.size === 'lg' ? '2.25rem' : props.size === 'md' ? '1.75rem' : '1.5rem'};
  font-weight: 700;
  margin-bottom: ${props => props.mb || '1rem'};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: ${props => props.size === 'xl' ? '2.5rem' : props.size === 'lg' ? '2rem' : props.size === 'md' ? '1.5rem' : '1.25rem'};
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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
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
    : ({ theme }) => theme?.colors?.textLight || 'black'};
  border-radius: 16px;
  margin-top: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  font-color: black;
`;

const StatusMessage = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: ${props => props.type === 'success' ? '#10b981' : '#ef4444'};
  background: ${props => props.type === 'success' ? '#10b98120' : '#ef444420'};
  font-weight: 500;
`;

const ScoreCard = styled(motion.div)`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme, value }) => {
    if (value >= 8) return theme?.colors?.success || '#10b981';
    if (value >= 6) return theme?.colors?.warning || '#f59e0b';
    return theme?.colors?.error || '#ef4444';
  }};
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  text-align: center;
`;

const ReviewSection = styled(motion.div)`
  margin-top: 2rem;
`;

const List = styled.ul`
  margin: 1rem 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

const handleDownloadPDF = () => {
  const element = document.getElementById('review-results');

  const opt = {
    margin: 0.5,
    filename: 'draft_review.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};

const DraftReviewPage = () => {
  const [draftContent, setDraftContent] = useState('');
  const [changeType, setChangeType] = useState('');
  const [audience, setAudience] = useState('');
  const [purpose, setPurpose] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('error');

  const handleReviewDraft = async () => {
    if (!draftContent || !changeType || !audience || !purpose || !keyPoints) {
      setStatusMsg('Please fill in all required fields.');
      setStatusType('error');
      return;
    }

    setLoading(true);
    setReviewResult(null);
    setStatusMsg('');
    
    try {
      const keyPointsArray = keyPoints.split('\n').filter(point => point.trim() !== '');
      
      const res = await axios.post('http://localhost:8000/review_draft', {
        content: draftContent,
        change_type: changeType,
        audience: audience,
        purpose: purpose,
        key_points: keyPointsArray
      });
      
      setReviewResult(res.data);
      setStatusMsg('Draft review completed successfully!');
      setStatusType('success');
    } catch (err) {
      setStatusMsg(`Error reviewing draft: ${err.response?.data?.detail || 'Server error'}`);
      setStatusType('error');
      console.error(err);
    } finally {
      setLoading(false);
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
              <GradientText>Draft</GradientText> Review
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
              Get comprehensive analysis and improvement suggestions for your change management communications.
              Our AI will score your draft on clarity, completeness, tone, and more.
            </Text>
          </div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Heading as="h3" size="md" mb="1rem">Draft Details</Heading>
            
            <Input
              placeholder="Change Type (e.g. technology, process, organizational)"
              value={changeType}
              onChange={(e) => setChangeType(e.target.value)}
            />
            
            <Input
              placeholder="Target Audience (e.g. software developers, marketing team)"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
            
            <Input
              placeholder="Purpose (e.g. inform, instruct, inspire, reassure)"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
            
            <Heading as="h4" size="sm" mb="0.5rem">Key Points (one per line)</Heading>
            <TextArea
              placeholder="Enter each key point on a new line"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              style={{ minHeight: '120px' }}
            />
            
            <Heading as="h4" size="sm" mb="0.5rem">Draft Content</Heading>
            <TextArea
              placeholder="Paste your draft communication here for review"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
            />

            <div className="text-center">
              <Button 
                onClick={handleReviewDraft} 
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                rounded
              >
                {loading ? "Analyzing..." : "Review Draft"}
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
            {reviewResult && (
              <Section
                id="review-results"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                exit="hidden"
              >
                <Heading size="lg" mb="1.5rem">📊 Draft Analysis Results</Heading>
                
                <Heading as="h3" size="md" mb="1rem">Overall Score</Heading>
                <ScoreCard>
                  <ScoreValue value={reviewResult.overall_score}>{reviewResult.overall_score.toFixed(1)}/10</ScoreValue>
                  <ScoreLabel>Overall Effectiveness</ScoreLabel>
                </ScoreCard>
                
                <Heading as="h3" size="md" mb="1rem">Detailed Scores</Heading>
                <ScoreGrid>
                  <ScoreCard>
                    <ScoreValue value={reviewResult.clarity_score}>{reviewResult.clarity_score.toFixed(1)}</ScoreValue>
                    <ScoreLabel>Clarity</ScoreLabel>
                  </ScoreCard>
                  
                  <ScoreCard>
                    <ScoreValue value={reviewResult.completeness_score}>{reviewResult.completeness_score.toFixed(1)}</ScoreValue>
                    <ScoreLabel>Completeness</ScoreLabel>
                  </ScoreCard>
                  
                  <ScoreCard>
                    <ScoreValue value={reviewResult.tone_score}>{reviewResult.tone_score.toFixed(1)}</ScoreValue>
                    <ScoreLabel>Tone</ScoreLabel>
                  </ScoreCard>
                  
                  <ScoreCard>
                    <ScoreValue value={reviewResult.action_clarity_score}>{reviewResult.action_clarity_score.toFixed(1)}</ScoreValue>
                    <ScoreLabel>Action Clarity</ScoreLabel>
                  </ScoreCard>
                  
                  <ScoreCard>
                    <ScoreValue value={reviewResult.relevance_score}>{reviewResult.relevance_score.toFixed(1)}</ScoreValue>
                    <ScoreLabel>Relevance</ScoreLabel>
                  </ScoreCard>
                  
                  <ScoreCard>
                    <ScoreValue value={reviewResult.empathy_score}>{reviewResult.empathy_score.toFixed(1)}</ScoreValue>
                    <ScoreLabel>Empathy</ScoreLabel>
                  </ScoreCard>
                  
                  <ScoreCard>
                    <ScoreValue value={reviewResult.resistance_mitigation_score}>{reviewResult.resistance_mitigation_score.toFixed(1)}</ScoreValue>
                    <ScoreLabel>Resistance Mitigation</ScoreLabel>
                  </ScoreCard>
                </ScoreGrid>
                
                <ReviewSection>
                  <Heading as="h3" size="md" mb="1rem">Strengths</Heading>
                  <List>
                    {reviewResult.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </List>
                  
                  <Heading as="h3" size="md" mb="1rem">Areas for Improvement</Heading>
                  <List>
                    {reviewResult.improvement_areas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </List>
                  
                  <Heading as="h3" size="md" mb="1rem">Specific Suggestions</Heading>
                  <List>
                    {reviewResult.specific_suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </List>
                  
                  <Heading as="h3" size="md" mb="1rem">Improved Draft</Heading>
                  <Section light style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
                    {reviewResult.improved_draft}
                  </Section>
                </ReviewSection>
              </Section>
            )}
          </AnimatePresence>
          
          {reviewResult && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Button
                variant="secondary"
                size="large"
                rounded
                onClick={handleDownloadPDF}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Download as PDF
              </Button>
            </div>
          )}
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
              Improve Your Communications
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
              Effective change management communication is critical for successful adoption.
              Our AI-powered review tool helps you craft messages that resonate with your audience.
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
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Review Another Draft
            </Button>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
};

export default DraftReviewPage;