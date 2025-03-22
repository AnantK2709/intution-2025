import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const Wrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 3rem 2rem;
`;

const Input = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: #6e00ff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #5a00cc;
  }
`;

const ResultBox = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f3f4f6;
  border-radius: 8px;
  white-space: pre-wrap;
`;

const SourcesList = styled.ul`
  margin-top: 1rem;
  list-style: none;
  padding-left: 0;

  li {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;

const Section = styled.div`
  margin-bottom: 4rem;
`;

const RAGQueryPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [framework1, setFramework1] = useState('');
  const [framework2, setFramework2] = useState('');
  const [comparison, setComparison] = useState('');

  const handleQuery = async () => {
    setLoading(true);
    setError('');
    setAnswer('');
    setSources([]);

    try {
      const res = await axios.post('http://localhost:8000/api/query', {
        question
      });
      setAnswer(res.data.answer);
      setSources(res.data.sources);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
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
      setError('Failed to compare frameworks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Section>
        <h2>🔎 Ask a Question</h2>
        <Input
          placeholder="e.g. What are the principles of Lewin's Change Model?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button onClick={handleQuery} disabled={loading}>
          {loading ? 'Searching...' : 'Get Answer'}
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {answer && (
          <ResultBox>
            <ReactMarkdown>{answer}</ReactMarkdown>
            {sources.length > 0 && (
              <>
                <h4>📚 Sources</h4>
                <SourcesList>
                  {sources.map((src, i) => (
                    <li key={i}><strong>{src.source}</strong>: {src.content.slice(0, 150)}...</li>
                  ))}
                </SourcesList>
              </>
            )}
          </ResultBox>
        )}
      </Section>

      <Section>
        <h2>📊 Compare Frameworks</h2>
        <Input
          placeholder="Framework 1"
          value={framework1}
          onChange={(e) => setFramework1(e.target.value)}
        />
        <Input
          placeholder="Framework 2"
          value={framework2}
          onChange={(e) => setFramework2(e.target.value)}
        />
        <Button onClick={handleCompare} disabled={loading}>
          {loading ? 'Comparing...' : 'Compare'}
        </Button>
        {comparison && (
          <ResultBox>
            <ReactMarkdown>{comparison}</ReactMarkdown>
          </ResultBox>
        )}
      </Section>
    </Wrapper>
  );
};

export default RAGQueryPage;
