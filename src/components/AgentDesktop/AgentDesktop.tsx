import React, { useState } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import styles from './AgentDesktop.module.css';

// Placeholder for Connect Streams integration
const mockCustomerProfile = {
    name: "Julius Cesar",
    id: "12345",
    phone: "+1 999 123 1234",
    queue: "Nurse Line",
    verification: "Successful"
};

export default function AgentDesktop() {
    const [isMuted, setIsMuted] = useState(false);
    const [isOnHold, setIsOnHold] = useState(false);
    const [agentState, setAgentState] = useState('Available');

    // Placeholder functions for Connect Streams integration
    const handleMute = () => {
        setIsMuted(!isMuted);
        // TODO: Implement Connect Streams mute functionality
    };

    const handleHold = () => {
        setIsOnHold(!isOnHold);
        // TODO: Implement Connect Streams hold functionality
    };

    const handleEndCall = () => {
        // TODO: Implement Connect Streams end call functionality
        console.log("End call");
    };

    return (
        <ContentLayout
            header={
                <Header
                    variant="awsui-h1-sticky"
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <div className={styles.agentStateContainer}>
                                <StatusIndicator type={agentState === 'Available' ? 'success' : 'error'} />
                                <ButtonDropdown
                                    items={[
                                        { text: 'Available', id: 'available' },
                                        { text: 'Offline', id: 'offline' }
                                    ]}
                                    onItemClick={({ detail }) => 
                                        setAgentState(detail.id === 'available' ? 'Available' : 'Offline')
                                    }
                                >
                                    Agent State
                                </ButtonDropdown>
                            </div>
                        </SpaceBetween>
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
                                <SpaceBetween direction="horizontal" size="xs">
                                    <Button
                                        variant="primary"
                                    >
                                        Answer
                                    </Button>
                                    <Button
                                        iconName={isMuted ? "microphone-off" : "microphone"}
                                        onClick={handleMute}
                                    >
                                        {isMuted ? "Unmute" : "Mute"}
                                    </Button>
                                    <Button
                                        iconName={isOnHold ? "status-negative" : "status-positive"}
                                        onClick={handleHold}
                                    >
                                        {isOnHold ? "Resume" : "Hold"}
                                    </Button>
                                    <Button onClick={handleEndCall}>End</Button>
                                    <Button>Transfer</Button>
                                </SpaceBetween>
                            }
                        >
                            Call Control
                        </Header>
                    }
                >
                    <ColumnLayout columns={2}>
                        <div>Name: {mockCustomerProfile.name}</div>
                        <div>Caller ID: {mockCustomerProfile.phone}</div>
                        <div>Queue: {mockCustomerProfile.queue}</div>
                        <div>Verification: {mockCustomerProfile.verification}</div>
                    </ColumnLayout>
                </Container>

                {/* Main Content Area */}
                <div className={styles.mainContent}>
                    {/* Left Panel */}
                    <div className={styles.leftPanel}>
                        {/* Video Section */}
                        <div className={styles.videoSection}>
                            <Box variant="h3">Telemedicine Video</Box>
                            <Box variant="p" color="text-status-inactive">
                                Video stream will appear here when connected
                            </Box>
                        </div>

                        {/* Chat Section */}
                        <div className={styles.chatSection}>
                            <Box variant="h3">Chat</Box>
                            <Box variant="p" color="text-status-inactive">
                                Chat messages will appear here
                            </Box>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className={styles.rightPanel}>
                        <Box variant="h3">Patient Medical History</Box>
                        <Box variant="p" color="text-status-inactive">
                            Patient medical history will be displayed here
                        </Box>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
}
