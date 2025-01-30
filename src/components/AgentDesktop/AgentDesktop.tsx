import React, { useState } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import FormField from '@cloudscape-design/components/form-field';
import Textarea, { TextareaProps } from '@cloudscape-design/components/textarea';
import Select from '@cloudscape-design/components/select';
import Alert from '@cloudscape-design/components/alert';
import MedicalSummary from './MedicalSummary';

interface Message {
  text: string;
  isUser: boolean;
}

const AgentDesktop: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isUser: false },
    { text: "What are current prescriptions is the patient taking ", isUser: true },
    { text: "The active prescriptions for this patient is 10mg propranolol, once daily. Would you like to see the patients prescription history?", isUser: false }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage('');
    }
  };

  const [symptoms, setSymptoms] = useState('');

  const textareaProps: TextareaProps = {
    value: symptoms,
    onChange: ({ detail }) => setSymptoms(detail.value),
    placeholder: "Record patient symptoms",
    rows: 3
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Virtual Nurse Workspace"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button>KnowledgeBase</Button>
              <Button>PhoneBook</Button>
            </SpaceBetween>
          }
        >
          Nurse Workstation
        </Header>
      }
    >
      <SpaceBetween size="l">
        {/* First Row */}
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          {/* Caller Attributes */}
          <Container
            header={
              <Header
                variant="h2"
                description="Patient information and attributes"
              >
                Caller Attributes
              </Header>
            }
          >
            <SpaceBetween size="l">
              <FormField label="Name">
                <Input value="John Doe" disabled />
              </FormField>
              <FormField label="ID">
                <Input value="12345" disabled />
              </FormField>
              <FormField label="Phone">
                <Input value="+1 (555) 123-4567" disabled />
              </FormField>
            </SpaceBetween>
          </Container>

          {/* Medical Insights */}
          <Container
            header={
              <Header
                variant="h2"
                description="Key medical information and history"
              >
                Patient Insights
              </Header>
            }
          >
            <MedicalSummary />
          </Container>
        </Grid>

        {/* Agent Tools Section */}
        <Container
          header={
            <Header
              variant="h2"
              description="Tools and resources for patient care"
            >
              Nurse Toolkit
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Select
              selectedOption={null}
              onChange={({ detail }) => console.log(detail.selectedOption)}
              options={[
                { label: "Agent Assist", value: "1" },
                { label: "Provider Locator", value: "2" },
                { label: "Scheduler", value: "3" }
              ]}
              placeholder="Select a tool"
            />
            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <Box>
                <Header variant="h3">Patient History</Header>
                <Box variant="p">View detailed patient history</Box>
              </Box>
              <Box>
                <Header variant="h3">Medications</Header>
                <Box variant="p">Current prescriptions</Box>
              </Box>
            </Grid>
          </SpaceBetween>
        </Container>

        {/* Last Row */}
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          {/* Triage */}
          <Container
            header={
              <Header
                variant="h2"
                description="Patient triage information"
              >
                Triage
              </Header>
            }
          >
            <SpaceBetween size="l">
              <FormField label="Current Symptoms">
                <Textarea {...textareaProps} />
              </FormField>
              <FormField label="Urgency Level">
                <Select
                  selectedOption={null}
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" }
                  ]}
                  placeholder="Select urgency level"
                />
              </FormField>
            </SpaceBetween>
          </Container>

          {/* Chat Box */}
          <Container
            header={
              <Header
                variant="h2"
                description="Communication log"
              >
                Chat
              </Header>
            }
          >
            <SpaceBetween size="l">
              <div style={{ height: '300px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                      marginBottom: '10px'
                    }}
                  >
                    <Box
                      padding="s"
                      variant="div"
                      color={msg.isUser ? "text-status-info" : "text-body-default"}
                      textAlign={msg.isUser ? "right" : "left"}
                      fontSize="body-m"
                      margin={{ right: msg.isUser ? "s" : "xxxl", left: msg.isUser ? "xxxl" : "s" }}
                    >
                      <div style={{
                        backgroundColor: msg.isUser ? "#0972d3" : "#f2f3f3",
                        padding: "8px 12px",
                        borderRadius: "4px",
                      }}>
                        {msg.text}
                      </div>
                    </Box>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage}>
                <SpaceBetween direction="horizontal" size="xs">
                  <Input
                    value={message}
                    onChange={({ detail }) => setMessage(detail.value)}
                    placeholder="Type your message..."
                  />
                  <Button formAction="submit" variant="primary" iconName="send">
                    Send
                  </Button>
                </SpaceBetween>
              </form>
            </SpaceBetween>
          </Container>
        </Grid>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default AgentDesktop;