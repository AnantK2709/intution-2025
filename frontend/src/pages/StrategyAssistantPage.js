import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

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

const handleDownloadPDF = () => {
  const element = document.getElementById('strategy-guide');

  const opt = {
    margin: 0.5,
    filename: 'strategy_guide.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};

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

const TabContainer = styled.div`
  display: flex;
  margin: 2rem 0;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? ({ theme }) => theme?.colors?.primary + '20' || '#6e00ff20' : 'transparent'};
  color: ${props => props.active ? ({ theme }) => theme?.colors?.primary || '#6e00ff' : ({ theme }) => theme?.colors?.text || '#333'};
  border: none;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.active ? ({ theme }) => theme?.colors?.primary || '#6e00ff' : 'transparent'};
  }

  &:hover {
    background: ${({ theme }) => theme?.colors?.primary + '10' || '#6e00ff10'};
  }
`;

const ResultsTab = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme?.colors?.surface || '#f8fafc'};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const Card = styled(motion.div)`
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 1.5rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
  const [audience, setAudience] = useState('');
  
  // New state for additional tools
  const [activeTab, setActiveTab] = useState('strategy');
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [resultsTitle, setResultsTitle] = useState('');
  const [resultsLoading, setResultsLoading] = useState(false);
  
  // Case studies state
  const [caseStudyIndustry, setCaseStudyIndustry] = useState('');
  const [caseStudyChallenge, setCaseStudyChallenge] = useState('');
  
  // What-if analysis state
  const [currentFramework, setCurrentFramework] = useState('');
  const [alternativeFramework, setAlternativeFramework] = useState('');
  const [scenario, setScenario] = useState('');

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
        framework,
        audience, 
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
  
  const handleExploreCaseStudies = async () => {
    if (!caseStudyIndustry && !caseStudyChallenge) {
      setStatusMsg('Please enter either an industry or challenge for case studies.');
      setStatusType('error');
      return;
    }
    
    setResultsLoading(true);
    setShowResults(true);
    setResultsTitle('Case Studies');
    
    try {
      const res = await axios.post('http://localhost:8000/api/case-studies', {
        industry: caseStudyIndustry,
        challenge: caseStudyChallenge
      });
      
      setResultsData({
        type: 'case-studies',
        content: res.data.case_studies,
        metadata: {
          industry: caseStudyIndustry,
          challenge: caseStudyChallenge
        }
      });
      
      setStatusMsg('');
    } catch (err) {
      setShowResults(true);
      setResultsData({
        type: 'error',
        content: `Failed to fetch case studies: ${err.message}`
      });
      console.error("Failed to fetch case studies:", err);
    } finally {
      setResultsLoading(false);
    }
  };
  
  const handleExploreWhatIf = async () => {
    if (!currentFramework || !alternativeFramework || !scenario) {
      setStatusMsg('Please fill all fields for What-If Analysis.');
      setStatusType('error');
      return;
    }
    
    setResultsLoading(true);
    setShowResults(true);
    setResultsTitle('What-If Analysis');
    
    try {
      const res = await axios.post('http://localhost:8000/api/what-if-analysis', {
        current_framework: currentFramework,
        alternative_framework: alternativeFramework,
        scenario: scenario
      });
      
      setResultsData({
        type: 'what-if',
        content: res.data.analysis,
        metadata: {
          currentFramework,
          alternativeFramework,
          scenario
        }
      });
      
      setStatusMsg('');
    } catch (err) {
      setShowResults(true);
      setResultsData({
        type: 'error',
        content: `Failed to fetch what-if analysis: ${err.message}`
      });
      console.error("Failed to fetch what-if analysis:", err);
    } finally {
      setResultsLoading(false);
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
      
      // Reset feedback field
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
      
      // Reset feedback field
      setFeedback('');
      
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to submit training feedback.");
      setStatusType('error');
    } finally {
      setSubmittingFeedback(false);
    }
  };
  
  // Render content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'strategy':
        return (
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
            
            <Input
              placeholder="Audience (e.g. software developers, marketing team)"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
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
        );
        
      case 'case-studies':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Heading as="h3" size="md" mb="1rem">Explore Case Studies</Heading>
            <Text mb="1.5rem">
              Find real-world examples of successful change management implementations. 
              Enter an industry, challenge, or both to find relevant case studies.
            </Text>
            
            <Input
              placeholder="Industry (e.g. healthcare, technology, retail)"
              value={caseStudyIndustry}
              onChange={(e) => setCaseStudyIndustry(e.target.value)}
            />
            
            <Input
              placeholder="Challenge (e.g. digital transformation, merger, cultural change)"
              value={caseStudyChallenge}
              onChange={(e) => setCaseStudyChallenge(e.target.value)}
            />
            
            <div className="text-center">
              <Button 
                onClick={handleExploreCaseStudies}
                disabled={resultsLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                rounded
              >
                {resultsLoading ? "Searching..." : "Find Case Studies"}
              </Button>
            </div>
          </motion.div>
        );
        
      case 'what-if':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Heading as="h3" size="md" mb="1rem">What-If Analysis</Heading>
            <Text mb="1.5rem">
              Explore how different change management frameworks might perform in your specific scenario.
            </Text>
            
            <Input
              placeholder="Current Framework (e.g. ADKAR)"
              value={currentFramework}
              onChange={(e) => setCurrentFramework(e.target.value)}
            />
            
            <Input
              placeholder="Alternative Framework (e.g. Kotter's 8-Step)"
              value={alternativeFramework}
              onChange={(e) => setAlternativeFramework(e.target.value)}
            />
            
            <TextArea
              placeholder="Scenario (e.g. implementing Grok AI in a team resistant to new tools)"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            />
            
            <div className="text-center">
              <Button 
                onClick={handleExploreWhatIf}
                disabled={resultsLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                rounded
              >
                {resultsLoading ? "Analyzing..." : "Run Analysis"}
              </Button>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  // Render the results section
  const renderResults = () => {
    if (!showResults || !resultsData) return null;
    
    return (
      <ResultsTab
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="md" mb="1rem">
          {resultsTitle} {resultsLoading && '(Loading...)'}
        </Heading>
        
        {resultsData.type === 'error' ? (
          <div className="error-message" style={{ color: '#ef4444' }}>
            {resultsData.content}
          </div>
        ) : (
          <div>
            {resultsData.type === 'case-studies' && (
              <div>
                <div className="filters" style={{ marginBottom: '1rem' }}>
                  {resultsData.metadata.industry && (
                    <span className="filter-tag" style={{ 
                      display: 'inline-block', 
                      padding: '0.25rem 0.75rem', 
                      background: '#f3f4f6', 
                      borderRadius: '999px',
                      marginRight: '0.5rem',
                      fontSize: '0.875rem'
                    }}>
                      Industry: {resultsData.metadata.industry}
                    </span>
                  )}
                  
                  {resultsData.metadata.challenge && (
                    <span className="filter-tag" style={{ 
                      display: 'inline-block', 
                      padding: '0.25rem 0.75rem', 
                      background: '#f3f4f6', 
                      borderRadius: '999px',
                      marginRight: '0.5rem',
                      fontSize: '0.875rem'
                    }}>
                      Challenge: {resultsData.metadata.challenge}
                    </span>
                  )}
                </div>
                
                <ReactMarkdown>{resultsData.content}</ReactMarkdown>
              </div>
            )}
            
            {resultsData.type === 'what-if' && (
              <div>
                <div className="scenario" style={{ 
                  padding: '1rem', 
                  background: '#f9fafb', 
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <strong>Scenario:</strong> {resultsData.metadata.scenario}
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Comparing:</strong> {resultsData.metadata.currentFramework} (current) vs {resultsData.metadata.alternativeFramework} (alternative)
                  </div>
                </div>
                
                <ReactMarkdown>{resultsData.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </ResultsTab>
    );
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
          
          <TabContainer>
            <Tab 
              active={activeTab === 'strategy'} 
              onClick={() => setActiveTab('strategy')}
            >
              Strategy Generator
            </Tab>
            <Tab 
              active={activeTab === 'case-studies'} 
              onClick={() => setActiveTab('case-studies')}
            >
              Case Studies
            </Tab>
            <Tab 
              active={activeTab === 'what-if'} 
              onClick={() => setActiveTab('what-if')}
            >
              What-If Analysis
            </Tab>
          </TabContainer>
          
          {renderTabContent()}

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
          
          {/* Results section */}
          {renderResults()}

          <AnimatePresence>
            {guide && (
              <Section
                id="strategy-guide"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                exit="hidden"
              >
                <Heading size="lg" mb="1.5rem">📘 Initial Strategy Guide</Heading>
                <ReactMarkdown>{guide}</ReactMarkdown>
              </Section>
            )}
          </AnimatePresence>
          
          {(guide || improved) && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Button
                variant="secondary"
                size="large"
                rounded
                onClick={() => handleDownloadPDF()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Download as PDF
              </Button>
            </div>
          )}

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
                <ReactMarkdown>{improved.guide}</ReactMarkdown>
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
              onClick={() => {
                setActiveTab('strategy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Try Another Strategy
            </Button>
          </div>
        </Container>
      </section>
      
      <section style={{ padding: '4rem 0', background: '#f9fafb' }}>
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
              Explore All Tools
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
              Our platform offers a comprehensive suite of tools to help you plan and implement
              successful organizational change strategies.
            </Text>

            <Grid>
              <Card
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>📊</span>
                </div>
                <Heading size="md" mb="0.75rem">Case Studies Explorer</Heading>
                <Text mb="1.5rem">
                  Browse real-world examples of successful change management implementations across various industries.
                </Text>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setActiveTab('case-studies');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Explore Cases
                </Button>
              </Card>
              
              <Card
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>🔄</span>
                </div>
                <Heading size="md" mb="0.75rem">What-If Analysis</Heading>
                <Text mb="1.5rem">
                  Compare different frameworks and predict outcomes for your specific organizational scenario.
                </Text>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setActiveTab('what-if');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Run Analysis
                </Button>
              </Card>
            </Grid>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
};

export default StrategyAssistantPage;