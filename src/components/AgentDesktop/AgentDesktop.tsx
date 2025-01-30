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
import Tabs from '@cloudscape-design/components/tabs';
import MedicalSummary from './MedicalSummary';
import styles from './AgentDesktop.module.css';

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
  const [activeTabId, setActiveTabId] = useState("tool1");

  const textareaProps: TextareaProps = {
    value: symptoms,
    onChange: ({ detail }) => setSymptoms(detail.value),
    placeholder: "Record patient symptoms",
    rows: 3
  };

  return (
    <div className={styles.fullWidthLayout}>
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
        <div className={styles.contentWrapper}>
          <SpaceBetween size="xl">
            {/* First Row */}
            <Grid
              gridDefinition={[
                { colspan: { default: 12, xxs: 12, xs: 12, s: 6, m: 6, l: 6, xl: 6 } },
                { colspan: { default: 12, xxs: 12, xs: 12, s: 6, m: 6, l: 6, xl: 6 } }
              ]}
            >
              {/* Caller Attributes */}
              <div className={styles.gridItem}>
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
                  <div className={styles.scrollContainer}>
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
                      <FormField label="Email">
                        <Input value="john.doe@example.com" disabled />
                      </FormField>
                      <FormField label="Address">
                        <Input value="123 Main St, Anytown, USA" disabled />
                      </FormField>
                      <FormField label="Insurance">
                        <Input value="Blue Cross Blue Shield" disabled />
                      </FormField>
                      <FormField label="Primary Care">
                        <Input value="Dr. Sarah Johnson" disabled />
                      </FormField>
                    </SpaceBetween>
                  </div>
                </Container>
              </div>

              {/* Medical Insights */}
              <div className={styles.gridItem}>
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
                  <div className={styles.scrollContainer}>
                    <MedicalSummary />
                  </div>
                </Container>
              </div>
            </Grid>

            {/* Agent Tools Panel */}
            <Container
              header={
                <Header
                  variant="h2"
                  description="Available tools and resources"
                >
                  Agent Tools
                </Header>
              }
            >
              <Tabs
                activeTabId={activeTabId}
                onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
                tabs={[
                  {
                    label: "Clinical Decision Support",
                    id: "tool1",
                    content: <div className={styles.tabContent}>Clinical Decision Support Tool Content</div>
                  },
                  {
                    label: "Resource Locator",
                    id: "tool2",
                    content: <div className={styles.tabContent}>Resource Locator Tool Content</div>
                  },
                  {
                    label: "Care Protocols",
                    id: "tool3",
                    content: <div className={styles.tabContent}>Care Protocols Tool Content</div>
                  },
                  {
                    label: "Documentation Helper",
                    id: "tool4",
                    content: <div className={styles.tabContent}>Documentation Helper Tool Content</div>
                  }
                ]}
              />
            </Container>

            {/* Last Row */}
            <Grid
              gridDefinition={[
                { colspan: { default: 12, xxs: 12, xs: 12, s: 6, m: 6, l: 6, xl: 6 } },
                { colspan: { default: 12, xxs: 12, xs: 12, s: 6, m: 6, l: 6, xl: 6 } }
              ]}
            >
              {/* Triage */}
              <div className={styles.gridItem}>
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
                  <div className={styles.scrollContainer}>
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
                      <FormField label="Notes">
                        <Textarea
                          value=""
                          onChange={() => {}}
                          placeholder="Additional notes"
                          rows={4}
                        />
                      </FormField>
                    </SpaceBetween>
                  </div>
                </Container>
              </div>

              {/* Chat Box */}
              <div className={styles.gridItem}>
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
                  <div className={styles.scrollContainer}>
                    <SpaceBetween size="l">
                      <div className={styles.chatMessages}>
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
                              textAlign={msg.isUser ? "right" : "left"}
                              fontSize="body-m"
                              margin={{ right: msg.isUser ? "s" : "xxxl", left: msg.isUser ? "xxxl" : "s" }}
                            >
                              <div style={{
                                backgroundColor: msg.isUser ? "#0972d3" : "#f2f3f3",
                                padding: "8px 12px",
                                borderRadius: "4px",
                                color: msg.isUser ? "#ffffff" : "#000000"
                              }}>
                                {msg.text}
                              </div>
                            </Box>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleSendMessage} className={styles.chatForm}>
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
                  </div>
                </Container>
              </div>
            </Grid>
          </SpaceBetween>
        </div>
      </ContentLayout>
    </div>
  );
};

export default AgentDesktop;