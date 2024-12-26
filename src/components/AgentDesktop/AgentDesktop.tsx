import React from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';

import { AgentStateControl } from './components/AgentStateControl';
import { AudioControls } from './components/AudioControls';
import { PatientProfile } from './components/PatientProfile';
import { useConnect } from './hooks/useConnect';
import { CustomerProfile } from './types';
import styles from './AgentDesktop.module.css';

const DEFAULT_PROFILE: CustomerProfile = {
  name: "",
  id: "",
  phone: "",
  queue: "",
  verification: ""
};

// Define the AgentState type
type AgentState = 'Offline' | 'Online' | 'Busy' | 'Away';

export default function AgentDesktop() {
  const [customerProfile, setCustomerProfile] = React.useState<CustomerProfile>(DEFAULT_PROFILE);
  const [agentState, setAgentState] = React.useState<AgentState>('Offline');

  const connectConfig = {
    ccpUrl: `${process.env.CONNECT_INSTANCE_URL || "https://neoathome2024.my.connect.aws"}/ccp-v2/`,
    loginPopup: true,
    loginPopupAutoClose: true,
  };

  const { agent, contact } = useConnect(connectConfig);
};

  const handleStateChange = async (newState: string) => {
    if (agent) {
      try {
        const agentStates = agent.getAgentStates();
        const stateToSet = agentStates.find((state) => state.name === newState);
        
        if (!stateToSet) {
          throw new Error('Invalid state name');
        }

        await agent.setState(stateToSet, {
          success: () => setAgentState(newState),
          failure: (err: any) => {
            throw new Error(`Failed to change state: ${err}`);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="awsui-h1-sticky"
          actions={
            <AgentStateControl 
              currentState={agentState}
              onStateChange={handleStateChange}
            />
          }
        >
          Agent Desktop
        </Header>
      }
    >
      <div className={styles.container}>
        <Container
          header={
            <Header
              variant="h2"
              description="Patient Profile"
              actions={
                <AudioControls
                  isMuted={contact?.isMuted() || false}
                  isOnHold={contact?.isOnHold() || false}
                  onMute={() => contact?.getInitialConnection().toggleMute()}
                  onHold={() => contact?.isOnHold() ? contact.resume() : contact?.hold()}
                  onEnd={() => contact?.destroy({})}
                  onTransfer={() => {/* Implement transfer logic */}}
                  disabled={!contact}
                />
              }
            >
              Call Control
            </Header>
          }
        >
          <PatientProfile {...customerProfile} />
        </Container>

        <div id="ccp-container" style={{ display: 'none' }}></div>

        <div className={styles.mainContent}>
          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <div className={styles.leftPanel}>
              <div className={styles.videoSection}>
                <h3>Telemedicine Video</h3>
                <p>Video stream will appear here when connected</p>
              </div>
              <div className={styles.chatSection}>
                <h3>Chat</h3>
                <p>Chat messages will appear here</p>
              </div>
            </div>
            <div className={styles.rightPanel}>
              <h3>Patient Medical History</h3>
              <p>Patient medical history will be displayed here</p>
            </div>
          </Grid>
        </div>
      </div>
    </ContentLayout>
  );
}