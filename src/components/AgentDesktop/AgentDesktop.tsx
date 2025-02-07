import React, { useEffect, useState, useRef } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import Tabs from '@cloudscape-design/components/tabs';
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Icon from "@cloudscape-design/components/icon";
import { MedicalScribeJob } from '@aws-sdk/client-transcribe';
import MedicalSummary from './MedicalSummary';
import { ProviderLocator } from './ProviderLocator';
import Conversations from '@/components/Conversations';
import LeftPanel from '@/components/Conversation/LeftPanel';
import RightPanel from '@/components/Conversation/RightPanel';
import Spinner from "@cloudscape-design/components/spinner";
import { IAuraClinicalDocOutput, IAuraTranscriptOutput } from '@/types/HealthScribe';
import WaveSurfer from 'wavesurfer.js';
import { ChatPanel } from './ChatPanel';
import styles from './AgentDesktop.module.css';
import Sidebar from './Sidebar';
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import FormField from '@cloudscape-design/components/form-field';
import Select, { SelectProps } from '@cloudscape-design/components/select';


interface VitalSignProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color?: 'normal' | 'warning' | 'critical';
}

interface VitalSign {
  id: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  color: VitalSignProps['color'];
}

const VitalSign: React.FC<VitalSignProps> = ({ icon, value, label, color = "normal" }) => (
  <div style={{ 
    textAlign: 'center', 
    padding: '15px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  }}>
    <div style={{ fontSize: '28px', marginBottom: '8px', color: '#545b64' }}>{icon}</div>
    <div style={{ 
      fontSize: '24px', 
      fontWeight: 'bold',
      color: color === 'warning' ? '#f4b400' : 
            color === 'critical' ? '#d93025' : 
            '#1a73e8',
      marginBottom: '4px'
    }}>{value}</div>
    <div style={{ fontSize: '14px', color: '#5f6368', fontWeight: '500' }}>{label}</div>
  </div>
);

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
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [meetingId] = useState("meeting-" + Math.random().toString(36).substr(2, 9));
  const [activeCommTab, setActiveCommTab] = useState<string>("video");
  const [activeTabId, setActiveTabId] = useState("tool1");
  const [patientInfoVisible, setPatientInfoVisible] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [showVideoMeeting, setShowVideoMeeting] = useState(false);
  const [uniqueKey] = useState("16db42ff-fa");
  const [messages, setMessages] = useState<Array<{ sender: string; message: string; time: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchPatientInfo = () => {
    setSpinner(true);
    setTimeout(() => {
      setPatientInfoVisible(true);
      setSpinner(false);
    }, 2000);
  };

  const personalInfoItems = [
    { id: "dodId", label: "DOD ID", value: "1234567890" },
    { id: "address", label: "Address", value: "123 Main St, Virginia, USA" },
    { id: "contact", label: "Contact Number", value: "+1 (555) 123-4567" },
    { id: "relationship", label: "Military Relationship", value: "Spouse" },
    { id: "tricare", label: "TRICARE Convergency", value: "Active" },
    { id: "pcm", label: "Primary Care Manager", value: "Dr. Sarah Kumar" }
  ];

  const medicalInfoItems = [
    { id: "bloodType", label: "Blood Type", value: "O+" },
    { id: "allergies", label: "Allergies", value: "Penicillin, Peanuts" },
    { id: "conditions", label: "Chronic Conditions", value: "Asthma" },
    { id: "physical", label: "Last Physical", value: "2023-12-15" },
    { id: "medications", label: "Medications", value: "Albuterol Inhaler" },
    { id: "surgeries", label: "Past Surgeries", value: "Appendectomy (2020)" }
  ];

  const vitalSigns: VitalSign[] = [
    { id: "heartRate", icon: <Icon name="heart" size="big" />, value: "72 bpm", label: "Heart Rate", color: "normal" },
    { id: "temp", icon: <Icon name="status-warning" size="big" />, value: "102.1°F", label: "Temperature", color: "critical" },
    { id: "respRate", icon: <Icon name="status-info" size="big" />, value: "18/min", label: "Respiratory Rate", color: "normal" },
    { id: "bp", icon: <Icon name="status-pending" size="big" />, value: "138/85", label: "Blood Pressure", color: "warning" },
    { id: "weight", icon: <Icon name="status-in-progress" size="big" />, value: "165 lbs", label: "Weight", color: "normal" },
    { id: "height", icon: <Icon name="status-positive" size="big" />, value: "5'8", label: "Height", color: "normal" },
    { id: "o2", icon: <Icon name="status-stopped" size="big" />, value: "98%", label: "O2 Saturation", color: "normal" },
    { id: "bmi", icon: <Icon name="status-negative" size="big" />, value: "27.4", label: "BMI", color: "warning" }
  ];

  return (
    <div>
      <div className={styles.fixedSidebar}>
        <Sidebar />
      </div>
      <div style={{ marginLeft: '40px' }}>
        <ContentLayout>
          <SpaceBetween size="l">
            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              {/* Patient Info Container */}
              <Container
                header={
                  <Header
                    variant="h2"
                    description="Patient information and attributes"
                    actions={
                      patientInfoVisible && (
                        <Button iconName="refresh" variant="icon" onClick={fetchPatientInfo} />
                      )
                    }
                  >
                    Patient Information
                  </Header>
                }
                className={styles.container}
              >
                <div className={styles.scrollableContent}>
                  {!patientInfoVisible ? (
                    <div className={styles.fetchButtonContainer}>
                      {spinner ? <Spinner /> : 
                        <Button onClick={fetchPatientInfo} variant="primary">
                          Fetch Patient Information
                        </Button>
                      }
                    </div>
                  ) : (
                    <SpaceBetween size="l">
                      {/* Personal Information Card */}
                      <Container
                        header={<Header variant="h3">Personal Information</Header>}
                        className={styles.infoCard}
                      >
                        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                          <KeyValuePairs
                            items={personalInfoItems.slice(0, Math.ceil(personalInfoItems.length / 2))}
                          />
                          <KeyValuePairs
                            items={personalInfoItems.slice(Math.ceil(personalInfoItems.length / 2))}
                          />
                        </Grid>
                        <Box textAlign="right" padding={{ top: 's' }}>
                          <StatusIndicator type="success">Authenticated</StatusIndicator>
                        </Box>
                      </Container>

                      {/* Medical Information Card */}
                      <Container
                        header={<Header variant="h3">Medical Information</Header>}
                        className={styles.infoCard}
                      >
                        <ExpandableSection headerText="Medical History">
                          <KeyValuePairs items={medicalInfoItems} />
                        </ExpandableSection>
                      </Container>

                      {/* Vitals Card */}
                      <Container
                        header={<Header variant="h3">Patient Vitals</Header>}
                        className={styles.infoCard}
                      >
                        <ExpandableSection headerText="Current Vitals">
                          <Grid
                            gridDefinition={[
                              { colspan: 6 },
                              { colspan: 6 }
                            ]}
                          >
                            <Grid
                              gridDefinition={[
                                { colspan: 6 },
                                { colspan: 6 }
                              ]}
                            >
                              {vitalSigns.slice(0, 4).map((vital) => (
                                <VitalSign 
                                  key={vital.id}
                                  icon={vital.icon}
                                  value={vital.value}
                                  label={vital.label}
                                  color={vital.color}
                                />
                              ))}
                            </Grid>
                            <Grid
                              gridDefinition={[
                                { colspan: 6 },
                                { colspan: 6 }
                              ]}
                            >
                              {vitalSigns.slice(4).map((vital) => (
                                <VitalSign 
                                  key={vital.id}
                                  icon={vital.icon}
                                  value={vital.value}
                                  label={vital.label}
                                  color={vital.color}
                                />
                              ))}
                            </Grid>
                          </Grid>
                        </ExpandableSection>
                      </Container>
                    </SpaceBetween>
                  )}
                </div>
              </Container>

              {/* Communication Container */}
              <Container>
                <Tabs
                  activeTabId={activeCommTab}
                  onChange={({ detail }) => setActiveCommTab(detail.activeTabId)}
                  tabs={[
// In the existing AgentDesktop.tsx file, locate the chat tab content and replace it with:

{
  id: "chat",
  label: "Chat",
  content: (
      <div className={styles.chatContainer}>
          {!messages.length ? (
              <div className={styles.startChatContainer}>
                  <FormField label="Select Patient Address">
                      <Select
                          selectedOption={null}
                          onChange={({ detail }: { detail: SelectProps.ChangeDetail }) => {
                              // Start chat with selected patient
                              setMessages([{
                                  sender: "Nurse",
                                  message: `Hello, this is Nurse Johnson from the DHA Nurse Advice Line. How can I assist you today?`,
                                  time: new Date().toLocaleTimeString()
                              }]);
                          }}
                          options={[
                              { label: "377 Sauer Rapid Apt 46, Los Angeles, CA 91040", value: "addr1" },
                              { label: "892 Highland Drive, San Diego, CA 92101", value: "addr2" },
                              { label: "1234 Ocean View Blvd, Santa Monica, CA 90401", value: "addr3" },
                              { label: "567 Mountain Way, Beverly Hills, CA 90210", value: "addr4" }
                          ]}
                          placeholder="Select patient address to start chat"
                      />
                  </FormField>
              </div>
          ) : (
              <>
                  <div className={styles.chatMessages}>
                      {messages.map((msg, index) => (
                          <div key={index} className={`${styles.messageBox} ${msg.sender === "Nurse" ? styles.nurseMessage : styles.patientMessage}`}>
                              <div className={styles.messageContent}>{msg.message}</div>
                              <div className={styles.messageTime}>{msg.time}</div>
                          </div>
                      ))}
                      {isTyping && (
                          <div className={styles.typingIndicator}>
                              <div className={styles.typingDot}></div>
                              <div className={styles.typingDot}></div>
                              <div className={styles.typingDot}></div>
                          </div>
                      )}
                      <div ref={messagesEndRef} />
                  </div>
                  <div className={styles.chatForm}>
                      <div className={styles.chatInputContainer}>
                          <Input
                              value={chatMessage}
                              onChange={({ detail }) => setChatMessage(detail.value)}
                              placeholder="Type your message..."
                          />
                          <Button onClick={() => {
                              if (chatMessage.trim()) {
                                  setMessages(prev => [...prev, {
                                      sender: "Nurse",
                                      message: chatMessage,
                                      time: new Date().toLocaleTimeString()
                                  }]);
                                  setChatMessage("");
                              }
                          }}>Send</Button>
                      </div>
                  </div>
              </>
          )}
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
                <Header variant="h2" description="Available tools and resources">
                  Nurse's Toolkit
                </Header>
              }
            >
              <Tabs
                activeTabId={activeTabId}
                onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
                tabs={[
                  {
                    id: "tool5",
                    label: "Patient Insights",
                    content: <ChatPanel />
                  },
                  {
                    id: "tool2",
                    label: "Resource Locator",
                    content: <ProviderLocator />
                  },
                  {
                    id: "tool3",
                    label: "Clear Triage",
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
                    id: "tool4",
                    label: "Medical Notes",
                    content: (
                      <div>
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
                  }
                ]}
              />
            </Container>
          </SpaceBetween>
        </ContentLayout>
      </div>
    </div>
  );
};

export default AgentDesktop;
