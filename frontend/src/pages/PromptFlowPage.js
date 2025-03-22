import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

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
  background: ${({ theme }) => theme?.colors?.surfaceAlt || '#1f2937'};
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
  const [setReview] = useState(null);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState({
    generating: false,
    sending: false
  });
  const [status, setStatus] = useState({
    message: '',
    isError: false
  });

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
            <FormLabel htmlFor="change_type">Change Type*</FormLabel>
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
            <FormLabel htmlFor="audience">Audience*</FormLabel>
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
            <FormLabel htmlFor="purpose">Purpose*</FormLabel>
            <FormInput 
              id="purpose"
              name="purpose" 
              value={form.purpose} 
              onChange={handleChange} 
              placeholder="e.g., inform, announce, prepare" 
            />
          </FormGroup>

          <FormGroup variants={fadeInUp}>
            <FormLabel htmlFor="key_points">Key Points / Message*</FormLabel>
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

{/* If you want to show a preview */}
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
                    {loading.sending ? (
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
                    ) : (
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
                    )}
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
      </Container>
    </PageSection>
  );
};

export default PromptFlowPage;