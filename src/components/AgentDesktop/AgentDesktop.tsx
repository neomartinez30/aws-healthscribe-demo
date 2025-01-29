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
import Textarea from '@cloudscape-design/components/textarea';
import Select from '@cloudscape-design/components/select';
import Alert from '@cloudscape-design/components/alert';

interface Message {
  text: string;
  isUser: boolean;
}

const AgentDesktop: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isUser: false },
    { text: "I need some assistance please", isUser: true },
    { text: "Of course! I'm here to help. What do you need?", isUser: false }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage('');
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Virtual Nurse Workspace"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button>New Session</Button>
              <Button>End Call</Button>
            </SpaceBetween>
          }
        >
          Medical Dashboard
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
                Medical Insights
              </Header>
            }
          >
            <SpaceBetween size="l">
              <Box>
                <Box variant="awsui-key-label">Last Visit</Box>
                <Box variant="p">March 15, 2024</Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Primary Care</Box>
                <Box variant="p">Dr. Sarah Johnson</Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Allergies</Box>
                <Box variant="p">Penicillin</Box>
              </Box>
            </SpaceBetween>
          </Container>
        </Grid>

        {/* Agent Tools Section */}
        <Container
          header={
            <Header
              variant="h2"
              description="Tools and resources for patient care"
            >
              Agent Tools
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Select
              selectedOption={null}
              onChange={({ detail }) => console.log(detail.selectedOption)}
              options={[
                { label: "FHIR Summary", value: "1" },
                { label: "Provider Locator", value: "2" },
                { label: "Settings", value: "3" }
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
                <Textarea
                  placeholder="Record patient symptoms"
                  rows={3}
                />
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
                      backgroundColor={msg.isUser ? 'blue-600' : 'grey-100'}
                      color={msg.isUser ? 'white' : 'inherit'}
                      borderRadius="s"
                      maxWidth="70%"
                    >
                      {msg.text}
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
};

export default AgentDesktop;
