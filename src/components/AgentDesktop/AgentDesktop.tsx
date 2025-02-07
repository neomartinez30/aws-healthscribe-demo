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
import ExpandableSection from "@cloudscape-design/components/expandable-section";
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

interface VitalSignProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color?: 'normal' | 'warning' | 'critical';
}

const VitalSign: React.FC<VitalSignProps> = ({ icon, value, label, color = "normal" }) => (
  <div style={{ textAlign: 'center', padding: '10px' }}>
    <div style={{ fontSize: '24px', marginBottom: '5px', color: '#545b64' }}>{icon}</div>
    <div style={{ 
      fontSize: '20px', 
      fontWeight: 'bold',
      color: color === 'warning' ? '#f4b400' : 
            color === 'critical' ? '#d93025' : 
            '#1a73e8'
    }}>{value}</div>
    <div style={{ fontSize: '14px', color: '#5f6368' }}>{label}</div>
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
                      {/* Personal Information */}
                      <KeyValuePairs
                        columnDefinitions={[
                          { key: "label", label: "Label", width: 170 },
                          { key: "value", label: "Value", width: 400 }
                        ]}
                        items={[
                          { label: "DOD ID", value: "1234567890" },
                          { label: "Address", value: "123 Main St, Virginia, USA" },
                          { label: "Contact Number", value: "+1 (555) 123-4567" },
                          { label: "Military Relationship", value: "Spouse" },
                          { label: "TRICARE Convergency", value: "Active" },
                          { label: "Primary Care Manager", value: "Dr. Sarah Kumar" },
                          { label: "Authenticated", value: <StatusIndicator>Yes</StatusIndicator> }
                        ]}
                      />

                      {/* Medical Information */}
                      <ExpandableSection headerText="Medical Information" variant="container">
                        <SpaceBetween size="l">
                          <KeyValuePairs
                            columnDefinitions={[
                              { key: "label", label: "Label", width: 170 },
                              { key: "value", label: "Value", width: 400 }
                            ]}
                            items={[
                              { label: "Blood Type", value: "O+" },
                              { label: "Allergies", value: "Penicillin, Peanuts" },
                              { label: "Chronic Conditions", value: "Asthma" },
                              { label: "Last Physical", value: "2023-12-15" },
                              { label: "Medications", value: "Albuterol Inhaler" },
                              { label: "Past Surgeries", value: "Appendectomy (2020)" }
                            ]}
                          />
                        </SpaceBetween>
                      </ExpandableSection>

                      {/* Vitals */}
                      <ExpandableSection headerText="Patient Vitals" variant="container">
                        <Grid
                          gridDefinition={[
                            { colspan: 3 },
                            { colspan: 3 },
                            { colspan: 3 },
                            { colspan: 3 }
                          ]}
                        >
                          <VitalSign 
                            icon={<Icon name="heart" size="big" />}
                            value="72 bpm" 
                            label="Heart Rate"
                            color="normal"
                          />
                          <VitalSign 
                            icon={<Icon name="status-warning" size="big" />}
                            value="102.1°F" 
                            label="Temperature"
                            color="critical"
                          />
                          <VitalSign 
                            icon={<Icon name="status-info" size="big" />}
                            value="18/min" 
                            label="Respiratory Rate"
                            color="normal"
                          />
                          <VitalSign 
                            icon={<Icon name="status-pending" size="big" />}
                            value="138/85" 
                            label="Blood Pressure"
                            color="warning"
                          />
                          <VitalSign 
                            icon={<Icon name="status-in-progress" size="big" />}
                            value="165 lbs" 
                            label="Weight"
                            color="normal"
                          />
                          <VitalSign 
                            icon={<Icon name="status-positive" size="big" />}
                            value="5'8" 
                            label="Height"
                            color="normal"
                          />
                          <VitalSign 
                            icon={<Icon name="status-stopped" size="big" />}
                            value="98%" 
                            label="O2 Saturation"
                            color="normal"
                          />
                          <VitalSign 
                            icon={<Icon name="status-negative" size="big" />}
                            value="27.4" 
                            label="BMI"
                            color="warning"
                          />
                        </Grid>
                      </ExpandableSection>
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
                    {
                      label: "Chat",
                      id: "chat",
                      content: (
                        <div className={styles.chatContainer}>
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
                    label: "Patient Insights",
                    id: "tool5",
                    content: <ChatPanel />
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