import React, { useEffect, useState } from 'react';
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
import 'amazon-connect-streams';

import styles from './AgentDesktop.module.css';

declare global {
    interface Window {
        connect: any;
    }
}

export default function AgentDesktop() {
    const [agentState, setAgentState] = useState('Offline');
    const [contact, setContact] = useState<any>(null);
    const [agent, setAgent] = useState<any>(null);
    const [customerProfile, setCustomerProfile] = useState({
        name: "",
        id: "",
        phone: "",
        queue: "",
        verification: ""
    });

    useEffect(() => {
        // Initialize CCP
        const connectUrl = "https://mydemopage.my.connect.aws"; // Connect instance URL
        const containerDiv = document.getElementById("ccp-container");
        
        if (containerDiv) {
            const ccpParams = {
                ccpUrl: connectUrl + "/ccp-v2/",
                loginPopup: false,
                softphone: {
                    allowFramedSoftphone: true
                }
            };
            
            window.connect.core.initCCP(containerDiv, ccpParams);

            // Subscribe to agent state changes
            window.connect.agent((agent: any) => {
                setAgent(agent);
                agent.onStateChange((state: any) => {
                    setAgentState(state.name);
                });
            });

            // Subscribe to contact events
            window.connect.contact((contact: any) => {
                setContact(contact);
                
                // Get customer information when contact is established
                contact.onConnected(() => {
                    const attributes = contact.getAttributes();
                    setCustomerProfile({
                        name: attributes.name?.value || "Unknown",
                        id: attributes.customerId?.value || "Unknown",
                        phone: contact.getInitialConnection().getAddress() || "",
                        queue: contact.getQueue().name || "",
                        verification: attributes.verified?.value || "Pending"
                    });
                });
            });
        }
    }, []);

    const handleMute = () => {
        if (contact) {
            const connection = contact.getInitialConnection();
            connection.toggleMute();
        }
    };

    const handleHold = () => {
        if (contact) {
            if (contact.isOnHold()) {
                contact.resume();
            } else {
                contact.hold();
            }
        }
    };

    const handleEndCall = () => {
        if (contact) {
            contact.destroy();
        }
    };

    const handleTransfer = () => {
        if (contact) {
            // Implement transfer logic based on your requirements
            // Example: Quick connects, queues, or direct numbers
            contact.transfer(window.connect.TransferType.QUEUE, {
                queueId: "YOUR_QUEUE_ARN"
            });
        }
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
                                    onItemClick={({ detail }) => {
                                        if (agent) {
                                            const newState = detail.id === 'available' ? 'Available' : 'Offline';
                                            agent.setState(newState);
                                        }
                                    }}
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
                                        onClick={() => {
                                            if (contact && !contact.isConnected()) {
                                                contact.accept();
                                            }
                                        }}
                                    >
                                        Answer
                                    </Button>
                                    <Button
                                        iconName={contact?.isMuted() ? "microphone-off" : "microphone"}
                                        onClick={handleMute}
                                    >
                                        {contact?.isMuted() ? "Unmute" : "Mute"}
                                    </Button>
                                    <Button
                                        iconName={contact?.isOnHold() ? "status-negative" : "status-positive"}
                                        onClick={handleHold}
                                    >
                                        {contact?.isOnHold() ? "Resume" : "Hold"}
                                    </Button>
                                    <Button onClick={handleEndCall}>End</Button>
                                    <Button onClick={handleTransfer}>Transfer</Button>
                                </SpaceBetween>
                            }
                        >
                            Call Control
                        </Header>
                    }
                >
                    <ColumnLayout columns={2}>
                        <div>Name: {customerProfile.name}</div>
                        <div>Caller ID: {customerProfile.phone}</div>
                        <div>Queue: {customerProfile.queue}</div>
                        <div>Verification: {customerProfile.verification}</div>
                    </ColumnLayout>
                </Container>

                {/* Hidden CCP container */}
                <div id="ccp-container" style={{ display: 'none' }}></div>

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
