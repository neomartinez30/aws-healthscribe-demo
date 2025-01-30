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
import MedicalSummary from './MedicalSummary';

const AgentDesktop: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState("tool1");

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
            <div style={{ height: '300px', overflowY: 'auto' }}>
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
              Agent Tools
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
                content: <div style={{ height: '200px', padding: '20px' }}>Resource Locator Tool Content</div>
              },
              {
                label: "Care Protocols",
                id: "tool3",
                content: <div style={{ height: '200px', padding: '20px' }}>Care Protocols Tool Content</div>
              },
              {
                label: "Documentation Helper",
                id: "tool4",
                content: <div style={{ height: '200px', padding: '20px' }}>Documentation Helper Tool Content</div>
              }
            ]}
          />
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default AgentDesktop;