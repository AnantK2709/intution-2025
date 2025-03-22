import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

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

const FormGroup = styled(motion.div)`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 0.875rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6e00ff;
    box-shadow: 0 0 0 3px rgba(110, 0, 255, 0.1);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236e00ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #6e00ff;
    box-shadow: 0 0 0 3px rgba(110, 0, 255, 0.1);
  }
`;

const FormTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  transition: all 0.3s ease;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6e00ff;
    box-shadow: 0 0 0 3px rgba(110, 0, 255, 0.1);
  }
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
  margin-right: 1rem;
  margin-left: 1rem;
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

const Badge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme?.colors?.primary + '20' || 'rgba(110, 0, 255, 0.1)'};
  color: ${({ theme }) => theme?.colors?.primary || '#6e00ff'};
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin-top: 2rem;
`;

const EditableDraft = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1.5rem;
  border-radius: 8px;
  background: ${({ theme }) => theme?.colors?.surfaceAlt || 'lightgrey'};
  color: ${({ theme }) => theme?.colors?.text || '#f9fafb'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#374151'};
  resize: vertical;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #6e00ff;
    box-shadow: 0 0 0 3px rgba(110, 0, 255, 0.15);
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

// New styled components for game section
const GameSectionCard = styled(Card)`
  background: linear-gradient(135deg, rgba(110, 0, 255, 0.05), rgba(0, 180, 216, 0.05));
  border: 1px solid rgba(110, 0, 255, 0.1);
  margin-top: 3rem;
`;

const GameActionButton = styled(Button)`
  background: linear-gradient(to right, #6e00ff, #00b4d8);
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const GameHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  span {
    background: linear-gradient(to right, #6e00ff, #00b4d8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const GameDescription = styled.p`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme?.colors?.text || '#4b5563'};
  line-height: 1.6;
`;

const GameBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

// Options for dropdown menus
const audienceOptions = [
  { value: '', label: 'Select an audience' },
  { value: 'all_employees', label: 'All Employees' },
  { value: 'engineering_team', label: 'Engineering Team' },
  { value: 'sales_team', label: 'Sales Team' },
  { value: 'leadership', label: 'Leadership Team' },
  { value: 'product_team', label: 'Product Team' },
  { value: 'marketing', label: 'Marketing Team' },
  { value: 'customer_support', label: 'Customer Support' },
  { value: 'external_clients', label: 'External Clients' }
];

const techProficiencyOptions = [
  { value: '', label: 'Select tech proficiency' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'mixed', label: 'Mixed' }
];

const urgencyOptions = [
  { value: '', label: 'Select urgency' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'fyi', label: 'FYI Only' }
];

const changeTypeOptions = [
  { value: '', label: 'Select change type' },
  { value: 'technology_upgrade', label: 'Technology Upgrade' },
  { value: 'process_change', label: 'Process Change' },
  { value: 'policy_update', label: 'Policy Update' },
  { value: 'security_update', label: 'Security Update' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'feature_release', label: 'Feature Release' },
  { value: 'service_outage', label: 'Service Outage' },
  { value: 'organizational_change', label: 'Organizational Change' }
];

const PromptFlowPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [form, setForm] = useState({
    change_type: '',
    audience: '',
    tech_proficiency: '',
    urgency: '',
    purpose: '',
    key_points: '',
    recipients: ''
  });

  const [draft, setDraft] = useState('');
  const [review, setReview] = useState(null); // Fixed to use setReview
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState({
    generating: false,
    sending: false
  });
  const [status, setStatus] = useState({
    message: '',
    isError: false
  });

  // Function to navigate to game creation with form data
  // Function to navigate to game creation with form data
  // Helper function to determine ADKAR stage based on content
  // Improve the determineAdkarStage function in PromptFlowPage.js
const determineAdkarStage = () => {
  const content = (draft + form.key_points + form.purpose).toLowerCase();
  
  // More detailed keyword matching
  const keywords = {
    awareness: ["why", "reason", "inform", "announce", "introduce", "background", "context"],
    desire: ["benefit", "advantage", "impact", "value", "opportunity", "motivation"],
    knowledge: ["how to", "train", "learn", "understand", "guide", "instruction"],
    ability: ["implement", "skill", "practice", "apply", "do", "perform", "execute"],
    reinforcement: ["maintain", "sustain", "continue", "support", "embed", "reinforce"]
  };
  
  // Count matches for each stage
  const matches = {};
  Object.entries(keywords).forEach(([stage, words]) => {
    matches[stage] = words.filter(word => content.includes(word)).length;
  });
  
  // Find stage with most matches
  const maxStage = Object.entries(matches).reduce((max, [stage, count]) => 
    count > max.count ? {stage, count} : max, {stage: "awareness", count: 0});
    
  return maxStage.stage;
};

  // Function to navigate to game creation with form data
  const handleCreateGame = () => {
    // Make sure key_points is properly split into an array
    const keyPointsArray = form.key_points
      .split('\n')
      .filter(point => point.trim() !== '');

    // Log for debugging
    console.log("Creating game with", keyPointsArray.length, "key points:", keyPointsArray);

    // If there's only one or no key points, add some defaults
    let finalKeyPoints = keyPointsArray;
    if (keyPointsArray.length <= 1) {
      finalKeyPoints = [
        form.purpose,
        "Understanding the benefits of this change",
        "Key implementation steps for this change",
        "How this affects daily workflows"
      ];
    }

    // Determine ADKAR stage
    const adkarStage = determineAdkarStage();
    console.log("Determined ADKAR stage:", adkarStage);

    // Convert the form data to the format needed for game creation
    const gameData = {
      change_type: form.change_type.split('_')[0] || 'technology',
      audience: form.audience || 'all_employees',
      tech_proficiency: form.tech_proficiency || 'medium',
      change_name: form.purpose,
      change_description: draft.split('\n')[0] || form.purpose,
      adkar_stage: adkarStage,
      game_type: 'mcq',
      key_points: finalKeyPoints  // Use our processed key points array
    };

    // Navigate to games page with state data
    navigate('/games', { state: { gameCreationData: gameData } });
  };

  // Your existing functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['change_type', 'audience', 'purpose', 'key_points'];
    for (const field of requiredFields) {
      if (!form[field]) {
        setStatus({
          message: `Please fill in the ${field.replace('_', ' ')} field`,
          isError: true
        });
        return false;
      }
    }
    return true;
  };

  const resetFlow = () => {
    setForm({
      change_type: '',
      audience: '',
      tech_proficiency: '',
      urgency: '',
      purpose: '',
      key_points: '',
      recipients: ''
    });
    setDraft('');
    setReview(null);
    setApproved(false);
    setStatus({ message: '', isError: false });
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(prev => ({ ...prev, generating: true }));
      setStatus({ message: '', isError: false });

      const response = await axios.post('http://localhost:8000/create_draft', {
        change_type: form.change_type,
        audience: form.audience,
        tech_proficiency: form.tech_proficiency,
        urgency: form.urgency,
        purpose: form.purpose,
        key_points: form.key_points.split('\n'),
        include_scholarly_references: false
      });

      if (response.data && response.data.draft) {
        setDraft(response.data.draft);
        setStatus({ message: 'Draft generated successfully!', isError: false });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error generating draft:', err);
      setStatus({
        message: `Error generating draft: ${err.response?.data?.detail || err.message}`,
        isError: true
      });
    } finally {
      setLoading(prev => ({ ...prev, generating: false }));
    }
  };

  const validateRecipients = () => {
    const emails = form.recipients.split(',').map(email => email.trim()).filter(Boolean);

    if (emails.length === 0) {
      setStatus({
        message: 'Please enter at least one recipient email',
        isError: true
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setStatus({
        message: `Invalid email format: ${invalidEmails.join(', ')}`,
        isError: true
      });
      return false;
    }

    return emails;
  };

  const handleApproveAndSend = async () => {
    const validatedEmails = validateRecipients();
    if (!validatedEmails) return;

    try {
      setLoading(prev => ({ ...prev, sending: true }));
      setStatus({ message: 'Sending email...', isError: false });

      const response = await axios.post('http://localhost:8000/send_approved_draft', {
        subject: `🚀 New Change Communication - ${form.purpose}`,
        message: draft,
        recipients: validatedEmails
      });

      setStatus({
        message: response.data.message || 'Email sent successfully!',
        isError: false
      });

      setApproved(true);
    } catch (err) {
      console.error('Error sending email:', err);
      setStatus({
        message: `Error sending email: ${err.response?.data?.detail || err.message}`,
        isError: true
      });
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
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
          Generate <span>Change Communication</span>
        </PageHeading>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <FormGroup variants={fadeInUp}>
            <FormLabel htmlFor="change_type">Change Type</FormLabel>
            <FormSelect
              id="change_type"
              name="change_type"
              value={form.change_type}
              onChange={handleChange}
            >
              {changeTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup variants={fadeInUp}>
            <FormLabel htmlFor="audience">Audience</FormLabel>
            <FormSelect
              id="audience"
              name="audience"
              value={form.audience}
              onChange={handleChange}
            >
              {audienceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup variants={fadeInUp}>
              <FormLabel htmlFor="tech_proficiency">Tech Proficiency</FormLabel>
              <FormSelect
                id="tech_proficiency"
                name="tech_proficiency"
                value={form.tech_proficiency}
                onChange={handleChange}
              >
                {techProficiencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup variants={fadeInUp}>
              <FormLabel htmlFor="urgency">Urgency</FormLabel>
              <FormSelect
                id="urgency"
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
              >
                {urgencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
          </div>

          <FormGroup variants={fadeInUp}>
            <FormLabel htmlFor="purpose">Purpose</FormLabel>
            <FormInput
              id="purpose"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="e.g., inform, announce, prepare"
            />
          </FormGroup>

          <FormGroup variants={fadeInUp}>
            <FormLabel htmlFor="key_points">Key Points / Message</FormLabel>
            <FormTextArea
              id="key_points"
              name="key_points"
              value={form.key_points}
              onChange={handleChange}
              placeholder="Enter each key point on a new line"
            />
          </FormGroup>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <Button
              variants={fadeInUp}
              onClick={handleGenerate}
              disabled={loading.generating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading.generating ? "Generating..." : "Generate Draft"}
            </Button>
          </div>
        </motion.div>

        {status.message && (
          <StatusMessage
            isError={status.isError}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {status.isError ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L8.58579 10L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L10 11.4142L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L11.4142 10L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L10 8.58579L8.70711 7.29289Z"
                  fill="currentColor"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM14.7071 8.70711C15.0976 8.31658 15.0976 7.68342 14.7071 7.29289C14.3166 6.90237 13.6834 6.90237 13.2929 7.29289L9 11.5858L6.70711 9.29289C6.31658 8.90237 5.68342 8.90237 5.29289 9.29289C4.90237 9.68342 4.90237 10.3166 5.29289 10.7071L8.29289 13.7071C8.68342 14.0976 9.31658 14.0976 9.70711 13.7071L14.7071 8.70711Z"
                  fill="currentColor"
                />
              )}
            </svg>
            {status.message}
          </StatusMessage>
        )}

        {draft && (
          <Card
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: '0.75rem' }}
                >
                  <path
                    d="M21 14L14 21M14 21H19M14 21V16M10 3H3V10H10V3Z"
                    stroke="#6e00ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                  Email Draft
                </h2>
              </div>

              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Badge>Change Communication</Badge>
                {form.urgency && <Badge>{form.urgency.charAt(0).toUpperCase() + form.urgency.slice(1)} Urgency</Badge>}
                <Badge>{form.change_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Badge>
              </div>

              <FormLabel htmlFor="editable_draft">Edit Draft Before Sending</FormLabel>
              <EditableDraft
                id="editable_draft"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Edit your message here..."
              />

              {/* Preview */}
              <div style={{ marginTop: '1rem' }}>
                <FormLabel>Preview</FormLabel>
                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <ReactMarkdown>{draft}</ReactMarkdown>
                </div>
              </div>

              <FormGroup style={{ marginTop: '2rem' }}>
                <FormLabel htmlFor="recipients">Recipients (comma-separated emails)*</FormLabel>
                <FormInput
                  id="recipients"
                  name="recipients"
                  value={form.recipients}
                  onChange={handleChange}
                  placeholder="e.g., user1@example.com, user2@example.com"
                />
              </FormGroup>

              {!approved ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <Button
                    onClick={handleApproveAndSend}
                    disabled={loading.sending || !form.recipients.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading.sending ?
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}
                        >
                          <path
                            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        Sending...
                      </>
                      :
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ marginRight: '0.5rem' }}
                        >
                          <path
                            d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Approve & Send
                      </>
                    }
                  </Button>
        
                  <Button
                    variant="outline"
                    onClick={() => navigate('/faq', { state: { formData: form } })}
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
                        d="M9.09 9C9.03043 9.58008 9.21642 10.1559 9.6 10.59C9.96857 11.0226 10.1747 11.5778 10.18 12.15C10.18 13.54 9.18 14.7 7.89 14.93C7.01873 15.0549 6.12908 14.8117 5.46961 14.2723C4.81014 13.7328 4.44214 12.9549 4.46 12.14C4.42864 11.5894 4.60454 11.0458 4.95 10.62C5.3202 10.1853 5.52557 9.62825 5.53 9.05C5.53 7.64 6.53 6.47 7.82 6.24C8.69127 6.11508 9.58092 6.35828 10.2404 6.89776C10.8998 7.43724 11.2678 8.21511 11.25 9.03C11.2736 9.57982 11.1045 10.1201 10.75 10.54C10.3775 10.98 10.1535 11.5451 10.16 12.13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17H12.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.09 17C19.3251 17.0008 19.5458 17.1075 19.7016 17.2835C19.8573 17.4595 19.9332 17.6905 19.91 17.92C19.7651 18.9406 19.3081 19.8889 18.5971 20.6233C17.886 21.3577 16.9562 21.8421 15.9393 22.0062C14.9225 22.1704 13.8808 22.0054 12.9616 21.5398C12.0425 21.0741 11.2982 20.337 10.8494 19.4339C10.4006 18.5308 10.2753 17.5147 10.493 16.5373C10.7106 15.5599 11.2591 14.68 12.0412 14.0195C12.8233 13.359 13.7872 12.9546 14.8 12.86C15.2088 12.8291 15.6177 12.8495 16.02 12.92"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.09 7C6.85492 6.99921 6.63422 6.89249 6.47844 6.71652C6.32266 6.54054 6.24682 6.30953 6.27 6.08C6.41496 5.05944 6.87195 4.11115 7.58301 3.37677C8.29407 2.64239 9.22386 2.15795 10.2407 1.99382C11.2575 1.82969 12.2992 1.99467 13.2184 2.46028C14.1375 2.92588 14.8819 3.66299 15.3307 4.56613C15.7795 5.46927 15.9048 6.48537 15.687 7.46277C15.4694 8.44017 14.9209 9.32007 14.1388 9.98054C13.3567 10.641 12.3928 11.0455 11.38 11.14C10.9712 11.1708 10.5623 11.1505 10.16 11.08"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Generate FAQ for Employees
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(34, 197, 94, 0.08)',
                    borderRadius: '8px',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: '0.75rem' }}
                  >
                    <path
                      d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 4L12 14.01L9 11.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Email sent successfully!
                </motion.div>
              )}

              {approved && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <Button
                    onClick={resetFlow}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Another Communication
                  </Button>
                </div>
              )}
            </motion.div>
          </Card>
        )}

        {/* Gamification Section - Shows after draft is generated */}
        {draft && (
          <GameSectionCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <GameHeading>
                Reinforce Learning with <span>Gamification</span>
              </GameHeading>

              <GameDescription>
                Want to help your team better understand and adapt to this change? Create interactive games based on your communication to improve knowledge retention and change adoption.
              </GameDescription>

              <GameBadges>
                <Badge>ADKAR Model</Badge>
                <Badge>Interactive Learning</Badge>
                <Badge>Change Management</Badge>
                <Badge>{determineAdkarStage().charAt(0).toUpperCase() + determineAdkarStage().slice(1)} Stage</Badge>
              </GameBadges>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GameActionButton
                  onClick={handleCreateGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 5H7C4.79086 5 3 6.79086 3 9V15C3 17.2091 4.79086 19 7 19H17C19.2091 19 21 17.2091 21 15V9C21 6.79086 19.2091 5 17 5Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 9L15 12L10 15V9Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Create Learning Games
                </GameActionButton>
              </div>
            </motion.div>
          </GameSectionCard>
        )}
      </Container>
    </PageSection>
  );
};

export default PromptFlowPage;