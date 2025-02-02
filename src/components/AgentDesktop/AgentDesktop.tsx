import React from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import FormField from '@cloudscape-design/components/form-field';
import Tabs from '@cloudscape-design/components/tabs';
import { MedicalScribeJob } from '@aws-sdk/client-transcribe';
import MedicalSummary from './MedicalSummary';
import { ProviderLocator } from './ProviderLocator';
import Conversations from '@/components/Conversations';
import LeftPanel from '@/components/Conversation/LeftPanel';
import RightPanel from '@/components/Conversation/RightPanel';
import { IAuraClinicalDocOutput, IAuraTranscriptOutput } from '@/types/HealthScribe';
import WaveSurfer from 'wavesurfer.js';
import { ChatPanel } from './ChatPanel';
import styles from './AgentDesktop.module.css';

interface ConversationData {
  jobLoading: boolean;
  jobDetails: MedicalScribeJob | null;
  transcriptFile: IAuraTranscriptOutput | null;
  clinicalDocument: IAuraClinicalDocOutput | null;
  highlightId: {
    allSegmentIds: string[];
    selectedSegmentId: string;
  };
  setHighlightId: React.Dispatch<React.SetStateAction<{
    allSegmentIds: string[];
    selectedSegmentId: string;
  }>>;
  wavesurfer: React.MutableRefObject<WaveSurfer | undefined>;
}

const AgentDesktop: React.FC = () => {
  const [activeTabId, setActiveTabId] = React.useState("tool1");
  const [selectedConversation, setSelectedConversation] = React.useState<ConversationData | null>(null);
  const [meetingId] = React.useState("meeting-" + Math.random().toString(36).substr(2, 9));
  const [activeCommTab, setActiveCommTab] = React.useState("chat");
  const [chatMessage, setChatMessage] = React.useState("");

  // Sample chat messages
  const chatMessages = [
    { sender: "Nurse", message: "Hello, I'm Nurse Johnson. How can I assist you today?", time: "10:02 AM" },
    { sender: "Patient", message: "Hi, I've been having severe headaches for the past week.", time: "10:03 AM" },
    { sender: "Nurse", message: "I'm sorry to hear that. Can you describe the pain and its location?", time: "10:03 AM" },
    { sender: "Patient", message: "It's a throbbing pain, mainly on the right side of my head. Gets worse with light.", time: "10:04 AM" },
    { sender: "Nurse", message: "That sounds like it could be a migraine. Have you experienced any nausea or sensitivity to sound?", time: "10:04 AM" },
    { sender: "Patient", message: "Yes, both actually. I've had to stay in a dark room several times.", time: "10:05 AM" },
    { sender: "Nurse", message: "I understand. Have you taken any medication for this?", time: "10:05 AM" }
  ];

  return (
    <ContentLayout>
      <Box padding={{ top: "l", bottom: "l" }}>
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
                  Patient Information
                </Header>
              }
              disableContentPaddings={false}
              className={styles.container}
            >
              <div className={styles.scrollableContent}>
                <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                  <FormField label="Name">
                    <Input value="John Doe" disabled />
                  </FormField>
                  <FormField label="Date of Birth">
                    <div className={styles.dateField}>
                      <Input value="03/15/1985" disabled />
                    </div>
                  </FormField>
                  <FormField label="Phone">
                    <Input value="+1 (555) 123-4567" disabled />
                  </FormField>
                  <FormField label="Email">
                    <Input value="john.doe@example.com" disabled />
                  </FormField>
                  <FormField label="Member ID">
                    <Input value="BCBS123456789" disabled />
                  </FormField>
                  <FormField label="Primary Care">
                    <Input value="Dr. Sarah Johnson" disabled />
                  </FormField>
                  <FormField label="Emergency Contact">
                    <Input value="Jane Doe (Wife) - (555) 987-6543" disabled />
                  </FormField>
                  <FormField label="Last Visit">
                    <Input value="01/15/2024" disabled />
                  </FormField>
                </Grid>
              </div>
            </Container>

            {/* Communication Panel */}
            <Container
              header={
                <Header
                  variant="h2"
                  description="Patient communication"
                >
                  Communication
                </Header>
              }
              disableContentPaddings={false}
              className={styles.container}
            >
              <Tabs
                activeTabId={activeCommTab}
                onChange={({ detail }) => setActiveCommTab(detail.activeTabId)}
                tabs={[
                  {
                    label: "Chat",
                    id: "chat",
                    content: (
                      <div className={styles.chatContainer}>
                        <div className={styles.chatMessages}>
                          {chatMessages.map((msg, index) => (
                            <div key={index} className={`${styles.messageBox} ${msg.sender === "Nurse" ? styles.nurseMessage : styles.patientMessage}`}>
                              <div className={styles.messageSender}>{msg.sender}</div>
                              <div className={styles.messageContent}>{msg.message}</div>
                              <div className={styles.messageTime}>{msg.time}</div>
                            </div>
                          ))}
                        </div>
                        <div className={styles.chatForm}>
                          <SpaceBetween direction="horizontal" size="xs">
                            <Input
                              value={chatMessage}
                              onChange={({ detail }) => setChatMessage(detail.value)}
                              placeholder="Type your message..."
                            />
                            <Button>Send</Button>
                          </SpaceBetween>
                        </div>
                      </div>
                    )
                  },
                  {
                    label: "Video Call",
                    id: "video",
                    content: (
                      <div className={styles.meetingContainer}>
                        <div className={styles.meetingContent}>
                          <SpaceBetween size="l">
                            <FormField label="Meeting ID">
                              <Input 
                                value={meetingId} 
                                readOnly
                                className={styles.meetingIdField}
                              />
                            </FormField>
                            <Button variant="primary" iconName="call">Start Video Call</Button>
                            <Box color="text-status-info">
                              Waiting for patient to join...
                            </Box>
                          </SpaceBetween>
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </Container>
          </Grid>

          {/* Agent Tools Panel */}
          <Container
            header={
              <Header
                variant="h2"
                description="Available tools and resources"
              >
                Nurse's Toolkit
              </Header>
            }
          >
            <Tabs
              activeTabId={activeTabId}
              onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
              tabs={[
                {
                  label: "Agent Assist",
                  id: "tool1",
                  content: (
                    <div style={{ padding: '20px' }}>
                      <SpaceBetween size="l">
                        <Box>
                          <SpaceBetween size="m">
                            <div>
                              <Box variant="h4">Key Points:</Box>
                              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                                <li>Patient is expressing thoughts of self-harm</li>
                                <li>Immediate intervention required</li>
                                <li>Has support system (sister) available</li>
                              </ul>
                            </div>
                            <div>
                              <Box variant="h4">Recommended Actions:</Box>
                              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                                <li>Keep patient on the line</li>
                                <li>Connect with crisis counselor immediately</li>
                                <li>Encourage contacting sister for support</li>
                                <li>Document suicide risk assessment</li>
                              </ul>
                            </div>
                            <div>
                              <Box variant="h4">Resources to Share:</Box>
                              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                                <li>National Suicide Prevention Lifeline: 988</li>
                                <li>Local Crisis Center: (555) 123-4567</li>
                                <li>Emergency Services if needed: 911</li>
                              </ul>
                            </div>
                          </SpaceBetween>
                        </Box>
                      </SpaceBetween>
                    </div>
                  )
                },
                {
                  label: "Resource Locator",
                  id: "tool2",
                  content: <ProviderLocator />
                },
                {
                  label: "Clear Triage",
                  id: "tool3",
                  content: (
                    <div style={{ height: 'calc(100vh - 400px)', padding: '20px' }}>
                      <iframe 
                        src="https://app.cleartriage.com/app/login" 
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '4px',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                        title="Clear Triage"
                      />
                    </div>
                  )
                },
                {
                  label: "Medical Notes",
                  id: "tool4",
                  content: (
                    <div style={{ padding: '20px' }}>
                      {!selectedConversation ? (
                        <Conversations onConversationSelect={setSelectedConversation} />
                      ) : (
                        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                          <LeftPanel 
                            jobLoading={selectedConversation.jobLoading}
                            transcriptFile={selectedConversation.transcriptFile}
                            highlightId={selectedConversation.highlightId}
                            setHighlightId={selectedConversation.setHighlightId}
                            wavesurfer={selectedConversation.wavesurfer}
                            smallTalkCheck={false}
                            audioTime={0}
                            setAudioTime={() => {}}
                            audioReady={false}
                          />
                          <RightPanel 
                            jobLoading={selectedConversation.jobLoading}
                            clinicalDocument={selectedConversation.clinicalDocument}
                            transcriptFile={selectedConversation.transcriptFile}
                            highlightId={selectedConversation.highlightId}
                            setHighlightId={selectedConversation.setHighlightId}
                            wavesurfer={selectedConversation.wavesurfer}
                          />
                        </Grid>
                      )}
                    </div>
                  )
                },
                {
                  label: "Patient Insights",
                  id: "tool5",
                  content: <ChatPanel />
                }
              ]}
            />
          </Container>
        </SpaceBetween>
      </Box>
    </ContentLayout>
  );
};

export default AgentDesktop;