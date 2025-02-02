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

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Virtual Nurse Workspace"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
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
                Patient Information
              </Header>
            }
            disableContentPaddings={false}
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
                <FormField label="Insurance">
                  <Input value="Blue Cross Blue Shield" disabled />
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
                <FormField label="Preferred Language">
                  <Input value="English" disabled />
                </FormField>
                <FormField label="Last Visit">
                  <Input value="01/15/2024" disabled />
                </FormField>
              </Grid>
            </div>
          </Container>

          {/* Video Conference Panel */}
          <Container
            header={
              <Header
                variant="h2"
                description="Video conference controls"
                actions={
                  <Button iconName="refresh">Refresh</Button>
                }
              >
                Video Call
              </Header>
            }
            disableContentPaddings={false}
          >
            <div className={styles.meetingContainer}>
              <Box padding="xxl" textAlign="center">
                <SpaceBetween size="l">
                  <div className={styles.meetingIdField}>
                    <FormField label="Meeting ID">
                      <Input value={meetingId} readOnly />
                    </FormField>
                  </div>
                  <Button variant="primary" iconName="call">Start Video Call</Button>
                  <Box color="text-status-info">
                    Waiting for patient to join...
                  </Box>
                </SpaceBetween>
              </Box>
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
    </ContentLayout>
  );
};

export default AgentDesktop;