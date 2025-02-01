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
import Tabs from '@cloudscape-design/components/tabs';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { MedicalScribeJob } from '@aws-sdk/client-transcribe';
import MedicalSummary from './MedicalSummary';
import { ProviderLocator } from './ProviderLocator';
import Conversations from '@/components/Conversations';
import LeftPanel from '@/components/Conversation/LeftPanel';
import RightPanel from '@/components/Conversation/RightPanel';
import { IAuraClinicalDocOutput, IAuraTranscriptOutput } from '@/types/HealthScribe';
import WaveSurfer from 'wavesurfer.js';
import { ChatPanel } from './ChatPanel';

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
  const [activeTabId, setActiveTabId] = useState("tool1");
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [patientRiskLevel, setPatientRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [callTimer, setCallTimer] = useState(0);

  // Start timer when component mounts
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Virtual Nurse Workspace"
          info={
            <StatusIndicator type="success">
              Connected
            </StatusIndicator>
          }
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Box>Call Duration: {formatTime(callTimer)}</Box>
              <Badge color={patientRiskLevel === 'high' ? 'red' : patientRiskLevel === 'medium' ? 'blue' : 'green'}>
                Risk Level: {patientRiskLevel.toUpperCase()}
              </Badge>
              <Button iconName="external" href="/knowledgebase" target="_blank">KnowledgeBase</Button>
              <Button iconName="contact" href="/phonebook" target="_blank">PhoneBook</Button>
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
                actions={
                  <Button iconName="edit">Edit</Button>
                }
              >
                Caller Attributes
              </Header>
            }
          >
            <div style={{ height: '300px' }}>
              <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
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
                <FormField label="Insurance">
                  <Input value="Blue Cross Blue Shield" disabled />
                </FormField>
                <FormField label="Primary Care">
                  <Input value="Dr. Sarah Johnson" disabled />
                </FormField>
              </Grid>
            </div>
          </Container>

          {/* Medical Insights */}
          <Container
            header={
              <Header
                variant="h2"
                description="Key medical information and history"
                actions={
                  <Button iconName="refresh">Refresh</Button>
                }
              >
                Medical Summary
              </Header>
            }
          >
            <div style={{ height: '300px', overflowY: 'auto' }}>
              <MedicalSummary />
            </div>
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
                      <Alert type="info">
                        Based on the conversation, here are my recommendations:
                      </Alert>
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
                      id="myIframe"
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
                      <Conversations />
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
    </ContentLayout>
  );
};

export default AgentDesktop;