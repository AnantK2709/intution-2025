import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

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

const TextField = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  margin-bottom: 1.5rem;
  font-size: 1rem;
  background: ${({ theme }) => theme?.colors?.inputBg || '#fff'};
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.primary || '#6e00ff'}30;
  }
`;

const InputField = styled.input`
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

const QuickButton = styled(Button)`
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme?.colors?.primary + '10' || '#6e00ff10'};
  color: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Section = styled(motion.div)`
  padding: 2rem;
  background: white;
  color: #333;
  border-radius: 16px;
  margin-top: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ResultBox = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  white-space: pre-wrap;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e0e0fa'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const SourcesList = styled.ul`
  margin-top: 1rem;
  list-style: none;
  padding-left: 0;

  li {
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    padding: 0.75rem;
    background: #f8f9ff;
    border-radius: 8px;
    color: #333;
  }
`;

const ErrorMessage = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: #ef4444;
  background: #ef444420;
  font-weight: 500;
`;

const TabContainer = styled.div`
  display: flex;
  margin: 2rem 0;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  background: linear-gradient(to right, #ffffff, #f5f7ff, #eff1ff);
  border-radius: 8px 8px 0 0;
  padding: 0.5rem 0 0 0;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? ({ theme }) => theme?.colors?.primary + '20' || '#6e00ff20' : 'transparent'};
  color: ${props => props.active ? ({ theme }) => theme?.colors?.primary || '#6e00ff' : '#333'};
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

const Table = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
      padding: 0.75rem;
      text-align: left;
      font-size: 0.9rem;
    }

    th {
      background-color: ${({ theme }) => theme?.colors?.surface || '#f8fafc'};
      font-weight: 600;
      position: sticky;
      top: 0;
      color: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
    }

    tr:nth-child(even) {
      background-color: ${({ theme }) => theme?.colors?.surface || '#f8fafc'};
    }

    tr:hover {
      background-color: ${({ theme }) => theme?.colors?.primary + '05' || 'rgba(110, 0, 255, 0.05)'};
    }
  }
`;

const Card = styled(motion.div)`
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
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

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
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

// Main Component
const RAGQueryPage = () => {
  // State management
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [framework1, setFramework1] = useState('');
  const [framework2, setFramework2] = useState('');
  const [comparison, setComparison] = useState('');
  
  const [activeTab, setActiveTab] = useState('query');
  // Adding activeSection state to fix undefined variable error
  const [activeSection, setActiveSection] = useState('query');

  // API handlers
  const handleQuery = async () => {
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }
    
    setLoading(true);
    setError('');
    setAnswer('');
    setSources([]);

    try {
      const res = await axios.post('http://localhost:8000/api/query', {
        question
      });
      setAnswer(res.data.answer);
      setSources(res.data.sources || []);
    } catch (err) {
      setError('Failed to get an answer. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!framework1.trim() || !framework2.trim()) {
      setError('Please enter both frameworks to compare.');
      return;
    }
    
    setLoading(true);
    setError('');
    setComparison('');

    try {
      const res = await axios.post('http://localhost:8000/api/compare-frameworks', {
        framework1,
        framework2
      });
      setComparison(res.data.comparison);
    } catch (err) {
      setError('Failed to compare frameworks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Quick select handlers
  const setQuickQuestion = (q) => {
    setQuestion(q);
  };

  const setQuickCompare = (f1, f2) => {
    setFramework1(f1);
    setFramework2(f2);
  };

  // Framework data
  const tableData = [
    {
      name: 'ADKAR',
      icon: '🧩',
      iconColor: '#6e00ff',
      focus: 'Individual change',
      steps: 'Awareness → Desire → Knowledge → Ability → Reinforcement',
      pros: 'Simple, actionable steps focused on people',
      cons: 'Not comprehensive for organization-wide change',
      industry: 'Tech, HR, Service sectors'
    },
    {
      name: "Kotter's 8-Step",
      icon: '🚀',
      iconColor: '#00a2ff',
      focus: 'Leadership-driven organizational change',
      steps: 'Create urgency → Build coalition → Form vision → Communicate → Empower → Quick wins → Build momentum → Make it stick',
      pros: 'Structured, motivating, clear leadership focus',
      cons: 'Can be rigid, less adaptable to rapid changes',
      industry: 'Finance, Enterprise, Government'
    },
    {
      name: "Lewin's Model",
      icon: '🧊',
      iconColor: '#00c7b1',
      focus: 'Behavioral change',
      steps: 'Unfreeze → Change → Refreeze',
      pros: 'Simple, intuitive, focused on stability',
      cons: 'Overly simplistic for complex changes',
      industry: 'Education, Small Business, Healthcare'
    },
    {
      name: "McKinsey 7-S",
      icon: '🏛️',
      iconColor: '#9c27b0',
      focus: 'Organizational alignment',
      steps: 'Structure, Strategy, Systems, Skills, Style, Staff, Shared values',
      pros: 'Holistic, addresses all organizational aspects',
      cons: 'Complex implementation, time-consuming',
      industry: 'Consulting, Corporate Strategy, Large Organizations'
    }
  ];

  // Sample questions
  const sampleQuestions = [
    "What are the 5 stages of the ADKAR model?",
    "How does Lewin's Change Model work?",
    "What makes Kotter's model effective for large organizations?",
    "How to implement McKinsey 7-S in a tech company?"
  ];

  // Sample comparisons
  const sampleComparisons = [
    { name: "ADKAR vs Kotter", f1: "ADKAR", f2: "Kotter's 8-Step" },
    { name: "Lewin vs McKinsey", f1: "Lewin's Model", f2: "McKinsey 7-S" },
    { name: "ADKAR vs Lewin", f1: "ADKAR", f2: "Lewin's Model" },
    { name: "Kotter vs McKinsey", f1: "Kotter's 8-Step", f2: "McKinsey 7-S" }
  ];


  // Get framework color
  const getFrameworkColor = (name) => {
    const framework = tableData.find(f => f.name === name || name.includes(f.name));
    return framework ? framework.iconColor : '#6e00ff';
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
              <GradientText>Knowledge</GradientText> Center
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
              Explore change management frameworks, compare approaches, and find best practices
              for successful organizational transformation.
            </Text>
          </div>
          
          <TabContainer>
            <Tab 
              active={activeTab === 'query'} 
              onClick={() => setActiveTab('query')}
            >
              🔎 Ask Questions
            </Tab>
            <Tab 
              active={activeTab === 'compare'} 
              onClick={() => setActiveTab('compare')}
            >
              📊 Compare Frameworks
            </Tab>
            <Tab 
              active={activeTab === 'table'} 
              onClick={() => setActiveTab('table')}
            >
              📋 Browse Frameworks
            </Tab>
          </TabContainer>

          <AnimatePresence mode="wait">
            {activeTab === 'query' && (
              <Section
                key="query"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
              >
                <Heading as="h3" size="md" mb="1rem">🔎 Ask a Question About Change Management</Heading>
                
                <Text mb="1.5rem">
                  Enter your question about change management frameworks, implementation strategies, or best practices.
                </Text>
                
                <TextField
                  placeholder="e.g. What are the principles of Lewin's Change Model?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <Button 
                    onClick={handleQuery} 
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    rounded
                  >
                    {loading ? <><LoadingSpinner /> Searching...</> : '🔍 Get Answer'}
                  </Button>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {sampleQuestions.map((q, i) => (
                      <QuickButton 
                        key={i} 
                        onClick={() => setQuickQuestion(q)}
                        variant="secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Q{i+1}
                      </QuickButton>
                    ))}
                  </div>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <ErrorMessage
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </ErrorMessage>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {answer && (
                    <ResultBox
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Heading as="h3" size="md" mb="1rem" style={{ color: '#6e00ff' }}>Answer:</Heading>
                      <ReactMarkdown>{answer}</ReactMarkdown>
                      
                      {sources.length > 0 && (
                        <>
                          <Heading as="h4" size="sm" mb="1rem" style={{ color: '#6e00ff', marginTop: '1.5rem' }}>
                            📚 Sources
                          </Heading>
                          <SourcesList>
                            {sources.map((src, i) => (
                              <li key={i}>
                                <strong>{src.source}</strong>
                                <p>{src.content.slice(0, 150)}...</p>
                              </li>
                            ))}
                          </SourcesList>
                        </>
                      )}
                    </ResultBox>
                  )}
                </AnimatePresence>
              </Section>
            )}

            {activeTab === 'compare' && (
              <Section
                key="compare"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
              >
                <Heading as="h3" size="md" mb="1rem">📊 Compare Change Management Frameworks</Heading>
                
                <Text mb="1.5rem">
                  Select two frameworks to compare their strengths, weaknesses, and best use cases.
                </Text>
                
                <InputGroup>
                  <InputField
                    placeholder="Framework 1 (e.g. ADKAR)"
                    value={framework1}
                    onChange={(e) => setFramework1(e.target.value)}
                  />
                  <InputField
                    placeholder="Framework 2 (e.g. Kotter's 8-Step)"
                    value={framework2}
                    onChange={(e) => setFramework2(e.target.value)}
                  />
                </InputGroup>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <Button 
                    onClick={handleCompare} 
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    rounded
                  >
                    {loading ? <><LoadingSpinner /> Comparing...</> : '⚖️ Compare Frameworks'}
                  </Button>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {sampleComparisons.map((comp, i) => (
                      <QuickButton 
                        key={i} 
                        onClick={() => setQuickCompare(comp.f1, comp.f2)}
                        variant="secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {comp.name}
                      </QuickButton>
                    ))}
                  </div>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <ErrorMessage
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </ErrorMessage>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {comparison && (
                    <ResultBox
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Heading as="h3" size="md" mb="1rem" style={{ color: '#6e00ff' }}>
                        Comparison Results:
                      </Heading>
                      <ReactMarkdown>{comparison}</ReactMarkdown>
                    </ResultBox>
                  )}
                </AnimatePresence>
                
                <Heading as="h3" size="md" mb="1rem" style={{ marginTop: '2rem' }}>
                  Popular Frameworks
                </Heading>
                
                <CardGrid>
                  {tableData.map((framework, idx) => (
                    <Card 
                      key={idx} 
                      onClick={() => setQuickCompare(framework.name, '')}
                      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)' }}
                      style={{ borderLeft: `4px solid ${framework.iconColor}` }}
                    >
                      <Heading as="h4" size="sm" mb="0.5rem" style={{ color: framework.iconColor, display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px' }}>{framework.icon}</span>
                        {framework.name}
                      </Heading>
                      <Text mb="0.5rem" style={{ fontSize: '0.9rem' }}><strong>Focus:</strong> {framework.focus}</Text>
                      <Text style={{ fontSize: '0.9rem', margin: 0 }}><strong>Industry:</strong> {framework.industry}</Text>
                    </Card>
                  ))}
                </CardGrid>
              </Section>
            )}

            {activeTab === 'table' && (
              <Section
                key="table"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInUp}
              >
                <Heading as="h3" size="md" mb="1rem">📋 Change Management Frameworks Overview</Heading>
                
                <Text mb="1.5rem">
                  Comprehensive overview of popular change management frameworks with their key attributes, strengths, and typical applications.
                </Text>
                
                <Table>
                  <table>
                    <thead>
                      <tr>
                        <th>Framework</th>
                        <th>Focus</th>
                        <th>Process Steps</th>
                        <th>Strengths</th>
                        <th>Limitations</th>
                        <th>Common Industries</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((f, idx) => (
                        <tr key={idx}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ color: f.iconColor, marginRight: '8px', fontSize: '1.2rem' }}>{f.icon}</span>
                              {f.name}
                            </div>
                          </td>
                          <td>{f.focus}</td>
                          <td>{f.steps}</td>
                          <td>{f.pros}</td>
                          <td>{f.cons}</td>
                          <td>{f.industry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Table>
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
              Make Informed Decisions
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
              Our AI-powered knowledge center helps you explore change management approaches
              and choose the right framework for your organization's needs.
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
                setActiveTab('query');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Try the Knowledge Center
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
                  <span style={{ fontSize: '2rem' }}>📝</span>
                </div>
                <Heading size="md" mb="0.75rem">Strategy Generator</Heading>
                <Text mb="1.5rem">
                  Create customized change management strategies based on proven frameworks for your specific organization.
                </Text>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    window.location.href = "/about";
                  }}
                >
                  Create Strategy
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
                  <span style={{ fontSize: '2rem' }}>🎮</span>
                </div>
                <Heading size="md" mb="0.75rem">Gamification Tools</Heading>
                <Text mb="1.5rem">
                  Engage your team with interactive games and challenges to reinforce change management concepts.
                </Text>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    window.location.href = "/games";
                  }}
                >
                  Explore Games
                </Button>
              </Card>
            </Grid>
          </div>
        </Container>
      </section>
      
      <footer style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem 0', color: '#64748b', fontSize: '0.9rem' }}>
        Change Management Knowledge Center © {new Date().getFullYear()} | Powered by RAG Technology
      </footer>
    </PageWrapper>
  );
};

export default RAGQueryPage;