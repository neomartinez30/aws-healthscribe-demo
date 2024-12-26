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
import { useNotificationsContext } from '@/store/notifications';
import 'amazon-connect-streams';

import styles from './AgentDesktop.module.css';

declare global {
    interface Window {
        connect: any;
    }
}

export default function AgentDesktop() {
    const { addFlashMessage } = useNotificationsContext();
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
        const connectUrl = process.env.CONNECT_INSTANCE_URL || "https://neoathome2024.my.connect.aws";
        const containerDiv = document.getElementById("ccp-container");
        
        if (!containerDiv) {
            addFlashMessage({
                id: 'ccp-container-missing',
                header: 'CCP Error',
                content: 'CCP container element not found',
                type: 'error'
            });
            return;
        }

        try {
            const ccpParams = {
                ccpUrl: `${connectUrl}/ccp-v2/`,
                loginPopup: true,
                loginPopupAutoClose: true,
                loginOptions: {
                    autoClose: true,
                    height: 600,
                    width: 400,
                },
                softphone: {
                    allowFramedSoftphone: true,
                    disableRingtone: false
                },
                region: process.env.CONNECT_REGION || "us-east-1"
            };
            
            window.connect.core.initCCP(containerDiv, ccpParams);

            // Subscribe to agent state changes
            window.connect.agent((agent: any) => {
                setAgent(agent);
                agent.onStateChange((state: any) => {
                    setAgentState(state.name);
                });

                // Get initial agent state
                const initialState = agent.getState();
                if (initialState) {
                    setAgentState(initialState.name);
                }
            });

            // Subscribe to contact events
            window.connect.contact((contact: any) => {
                setContact(contact);
                
                contact.onConnecting(() => {
                    addFlashMessage({
                        id: 'contact-connecting',
                        header: 'New Contact',
                        content: 'Incoming contact connecting...',
                        type: 'info'
                    });
                });

                contact.onConnected(() => {
                    const attributes = contact.getAttributes();
                    setCustomerProfile({
                        name: attributes.name?.value || "Unknown",
                        id: attributes.customerId?.value || "Unknown",
                        phone: contact.getInitialConnection().getAddress() || "",
                        queue: contact.getQueue()?.name || "",
                        verification: attributes.verified?.value || "Pending"
                    });
                });

                contact.onEnded(() => {
                    setContact(null);
                    setCustomerProfile({
                        name: "",
                        id: "",
                        phone: "",
                        queue: "",
                        verification: ""
                    });
                });
            });

        } catch (error) {
            addFlashMessage({
                id: 'ccp-init-error',
                header: 'CCP Error',
                content: `Failed to initialize CCP: ${error}`,
                type: 'error'
            });
        }
    }, []);

    const handleMute = () => {
        if (contact) {
            try {
                const connection = contact.getInitialConnection();
                connection.toggleMute();
            } catch (error) {
                addFlashMessage({
                    id: 'mute-error',
                    header: 'Action Failed',
                    content: `Failed to toggle mute: ${error}`,
                    type: 'error'
                });
            }
        }
    };

    const handleHold = () => {
        if (contact) {
            try {
                if (contact.isOnHold()) {
                    contact.resume();
                } else {
                    contact.hold();
                }
            } catch (error) {
                addFlashMessage({
                    id: 'hold-error',
                    header: 'Action Failed', 
                    content: `Failed to toggle hold: ${error}`,
                    type: 'error'
                });
            }
        }
    };

    const handleEndCall = () => {
        if (contact) {
            try {
                contact.destroy({
                    success: () => {
                        addFlashMessage({
                            id: 'call-ended',
                            header: 'Call Ended',
                            content: 'Call has been terminated successfully',
                            type: 'success'
                        });
                    },
                    failure: (err: any) => {
                        addFlashMessage({
                            id: 'end-call-error',
                            header: 'Action Failed',
                            content: `Failed to end call: ${err}`,
                            type: 'error'
                        });
                    }
                });
            } catch (error) {
                addFlashMessage({
                    id: 'end-call-error',
                    header: 'Action Failed',
                    content: `Failed to end call: ${error}`,
                    type: 'error'
                });
            }
        }
    };

    const handleTransfer = () => {
        if (contact) {
            try {
                // Get the queue ARN from environment variable
                const queueArn = process.env.CONNECT_QUEUE_ARN;
                if (!queueArn) {
                    throw new Error('Queue ARN not configured');
                }

                contact.transfer(window.connect.TransferType.QUEUE, {
                    queueARN: queueArn,
                    success: () => {
                        addFlashMessage({
                            id: 'transfer-success',
                            header: 'Transfer Initiated',
                            content: 'Call transfer has been initiated',
                            type: 'success'
                        });
                    },
                    failure: (err: any) => {
                        addFlashMessage({
                            id: 'transfer-error',
                            header: 'Transfer Failed',
                            content: `Failed to transfer call: ${err}`,
                            type: 'error'
                        });
                    }
                });
            } catch (error) {
                addFlashMessage({
                    id: 'transfer-error',
                    header: 'Transfer Failed',
                    content: `Failed to transfer call: ${error}`,
                    type: 'error'
                });
            }
        }
    };

    const handleStateChange = async (newState: string) => {
        if (agent) {
            try {
                const stateToSet = {
                    name: newState,
                    type: window.connect.AgentStateType.ROUTABLE
                };
                
                await agent.setState(stateToSet, {
                    success: () => {
                        addFlashMessage({
                            id: 'state-change-success',
                            header: 'State Changed',
                            content: `Agent state changed to ${newState}`,
                            type: 'success'
                        });
                    },
                    failure: (err: any) => {
                        addFlashMessage({
                            id: 'state-change-error',
                            header: 'State Change Failed',
                            content: `Failed to change state: ${err}`,
                            type: 'error'
                        });
                    }
                });
            } catch (error) {
                addFlashMessage({
                    id: 'state-change-error',
                    header: 'State Change Failed',
                    content: `Failed to change state: ${error}`,
                    type: 'error'
                });
            }
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
                                        { text: 'Available', id: 'Available' },
                                        { text: 'Offline', id: 'Offline' }
                                    ]}
                                    onItemClick={({ detail }) => handleStateChange(detail.id)}
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
                                        disabled={!contact || contact.isConnected()}
                                    >
                                        Answer
                                    </Button>
                                    <Button
                                        iconName={contact?.isMuted() ? "microphone-off" : "microphone"}
                                        onClick={handleMute}
                                        disabled={!contact}
                                    >
                                        {contact?.isMuted() ? "Unmute" : "Mute"}
                                    </Button>
                                    <Button
                                        iconName={contact?.isOnHold() ? "status-negative" : "status-positive"}
                                        onClick={handleHold}
                                        disabled={!contact}
                                    >
                                        {contact?.isOnHold() ? "Resume" : "Hold"}
                                    </Button>
                                    <Button onClick={handleEndCall} disabled={!contact}>End</Button>
                                    <Button onClick={handleTransfer} disabled={!contact}>Transfer</Button>
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
