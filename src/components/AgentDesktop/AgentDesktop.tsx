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

const patientResponses = [
  "Hi, I've been experiencing severe stomach pain since yesterday.",
  "It's a sharp pain in my lower right abdomen. Gets worse when I move.",
  "Yes, I felt nauseous this morning and my temperature was 100.4°F.",
  "No, I haven't had this type of pain before.",
  "Yes, I feel a bit nauseous too.",
];

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

  // Start the conversation with the first patient message
  useEffect(() => {
    if (activeCommTab === 'chat' && messages.length === 0) {
      setMessages([{
        sender: "Patient",
        message: patientResponses[0],
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      }]);
      setResponseIndex(1);
    }
  }, [activeCommTab]);

  const simulatePatientResponse = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate typing delay
    setIsTyping(false);
    
    const response = patientResponses[responseIndex];
    if (response) {
      setMessages(prev => [...prev, {
        sender: "Patient",
        message: response,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      }]);
      setResponseIndex(prev => (prev + 1) % patientResponses.length);
    }
  };

  const fetchPatientInfo = () => {
    setSpinner(true);
    setTimeout(() => {
      setPatientInfoVisible(true);
      setSpinner(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setMessages(prev => [...prev, {
        sender: "Nurse",
        message: chatMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      }]);
      setChatMessage("");
      
      simulatePatientResponse();
    }
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
                    <KeyValuePairs
                      columns={2}
                      items={[
                        {
                          type: "group",
                          title: "Personal",
                          items: [
                            { label: "DOD ID :", value: "1234567890" },
                            { label: "Address :", value: "123 Main St, Virginia, USA" },
                            { label: "Contact Number :", value: "+1 (555) 123-4567" },
                            { label: "Military Relationship :", value: "Spouse" },
                            { label: "TRICARE Convergency :", value: "Active" },
                            { label: "Primary Care Manager :", value: "Dr. Sarah Kumar" },
                            { label: "Authenticated :", value: <StatusIndicator>Yes</StatusIndicator> }
                          ]
                        },
                        {
                          type: "group",
                          title: "Medical",
                          items: [
                            { label: "Symptom :", value: "Pain in neck" },
                            { label: "Is it for child or Adult? :", value: "child" },
                            { label: "Related to Head and Neck?:", value: "Yes" },
                            { label: "Had any surgery before? :", value: "No" },
                            { label: "Having trouble breathing? :", value: "No" },
                            { label: "Is child having a fever?", value: "Yes" },
                            { label: "Body Temperature :", value: "102 F" }
                          ]
                        },
                      ]}
                    />
                  )}
                </div>
              </Container>

              {/* Communication Container */}
              <Container
                
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
                              <Button onClick={handleSendMessage}>Send</Button>
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