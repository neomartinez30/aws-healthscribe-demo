import React, { useEffect, useRef, useState } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import FormField from '@cloudscape-design/components/form-field';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Textarea from '@cloudscape-design/components/textarea';
import Select from '@cloudscape-design/components/select';
import AppLayout from '@cloudscape-design/components/app-layout';
import 'amazon-connect-streams';
import { TransferType, AgentStateType } from 'amazon-connect-streams';
import { DatabaseSettings } from './DatabaseSettings';
import { ChatPanel } from './ChatPanel';
import styles from './AgentDesktop.module.css';
import SchedulingForm from './SchedulingForm';
import { ProviderLocator } from './ProviderLocator';
import Tabs, { TabsProps } from "@cloudscape-design/components/tabs";
import FHIRSectionSummary from "./FHIRSectionSummary";
import MedicalSummary from './MedicalSummary';

interface Provider {
    id: string;
    name: string;
    specialty: string;
    address: string;
    zip: string;
    availability: string;
}

interface ReferralForm {
    patientName: string;
    illness: string;
    medications: string;
    referTo: string;
    details: string;
}

interface MyComponentProps {
    activeTabId: string;
    setActiveTabId: (id: string) => void;
}

const MOCK_PROVIDERS: Provider[] = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', address: '123 Medical Ave', zip: '20001', availability: 'Next available: Tomorrow 2pm' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Family Medicine', address: '456 Health St', zip: '20002', availability: 'Next available: Today 4pm' },
    { id: '3', name: 'Dr. Emily Williams', specialty: 'Pediatrics', address: '789 Care Ln', zip: '20003', availability: 'Next available: Friday 10am' },
    { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics', address: '321 Wellness Rd', zip: '20004', availability: 'Next available: Monday 9am' },
];

interface CustomerProfile {
    name: string;
    id: string;
    phone: string;
    queue: string;
    verification: string;
}

const AgentDesktop: React.FC = () => {
    const [agentState, setAgentState] = useState<string>('Offline');
    const [contact, setContact] = useState<any>(null);
    const [agent, setAgent] = useState<any>(null);
    const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
        name: "",
        id: "",
        phone: "",
        queue: "",
        verification: ""
    });
    const [toolsOpen, setToolsOpen] = useState<boolean>(true);
    const [activeTabId, setActiveTabId] = useState<string>("patient-summary");
    const [showReferralModal, setShowReferralModal] = useState<boolean>(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [referralForm, setReferralForm] = useState<ReferralForm>({
        patientName: '',
        illness: '',
        medications: '',
        referTo: '',
        details: ''
    });

    useEffect(() => {
        // Initialize CCP
        const connectUrl = process.env.CONNECT_INSTANCE_URL || "https://neoathome2024.my.connect.aws";
        const containerDiv = document.getElementById("ccp-container");

        if (!containerDiv) {
            console.error('CCP container element not found');
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

            connect.core.initCCP(containerDiv, ccpParams);

            // Subscribe to agent state changes
            connect.agent((agent: any) => {
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
            connect.contact((contact: any) => {
                setContact(contact);

                contact.onConnecting(() => {
                    console.log('Incoming contact connecting...');
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
            console.error(`Failed to initialize CCP: ${error}`);
        }
    }, []);

    const handleMute = () => {
        if (contact) {
            try {
                const connection = contact.getInitialConnection();
                connection.toggleMute();
            } catch (error) {
                console.error(`Failed to toggle mute: ${error}`);
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
                console.error(`Failed to toggle hold: ${error}`);
            }
        }
    };

    const handleEndCall = () => {
        if (contact) {
            try {
                contact.destroy({
                    success: () => {
                        console.log('Call has been terminated successfully');
                    },
                    failure: (err: any) => {
                        console.error(`Failed to end call: ${err}`);
                    }
                });
            } catch (error) {
                console.error(`Failed to end call: ${error}`);
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

                contact.transfer(TransferType.QUEUE, {
                    queueARN: queueArn,
                    success: () => {
                        console.log('Call transfer has been initiated');
                    },
                    failure: (err: any) => {
                        console.error(`Failed to transfer call: ${err}`);
                    }
                });
            } catch (error) {
                console.error(`Failed to transfer call: ${error}`);
            }
        }
    };

    const handleStateChange = async (newState: string) => {
        if (agent) {
            try {
                const stateToSet = {
                    name: newState,
                    type: AgentStateType.ROUTABLE
                };

                await agent.setState(stateToSet, {
                    success: () => {
                        console.log(`Agent state changed to ${newState}`);
                    },
                    failure: (err: any) => {
                        console.error(`Failed to change state: ${err}`);
                    }
                });
            } catch (error) {
                console.error(`Failed to change state: ${error}`);
            }
        }
    };

    const handleReferralSubmit = () => {
        // Handle referral submission logic here
        setShowReferralModal(false);
    };

    const PatientDetails: React.FC = () => (
        <Container className={styles.patientDetails}>
            <div className={styles.patientDetailsGrid}>
                <div className={styles.patientDetailsItem}>
                    <span className={`${styles.patientDetailsLabel} ${styles.boldLabel}`}>Name</span>
                    <span className={styles.patientDetailsValue}>Eva Montalvo</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={`${styles.patientDetailsLabel} ${styles.boldLabel}`}>DOB</span>
                    <span className={styles.patientDetailsValue}>03/15/1985</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={`${styles.patientDetailsLabel} ${styles.boldLabel}`}>Branch</span>
                    <span className={styles.patientDetailsValue}>USMC</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={`${styles.patientDetailsLabel} ${styles.boldLabel}`}>Member ID</span>
                    <span className={styles.patientDetailsValue}>BC123456789</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={`${styles.patientDetailsLabel} ${styles.boldLabel}`}>Last Visit</span>
                    <span className={styles.patientDetailsValue}>01/10/2024</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={`${styles.patientDetailsLabel} ${styles.boldLabel}`}>PCP</span>
                    <span className={styles.patientDetailsValue}>Dr. Johnson</span>
                </div>
            </div>
        </Container>
    );

    const helpPanelContent = (
        <div className={styles.helpPanelContent}>
            <SpaceBetween size={'l'}>
                <Header variant="h2">
                    Virtual Assistant
                </Header>
                <Container>
                    <ChatPanel />
                </Container>
            </SpaceBetween>
        </div>
    );

    const mainContent = (
        <div className={styles.mainContent}>
            <Grid
                gridDefinition={[
                    { colspan: 4 },
                    { colspan: 8 }
                ]}
            >
                <div className={styles.ccpContainer}>
                    <div id="ccp-container" style={{ width: '100%', height: '600px' }}></div>
                </div>
                <SpaceBetween size="l">
                    <PatientDetails />
                    <Container>
                        <Tabs
                            activeTabId={activeTabId}
                            onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
                            tabs={[
                                {
                                    id: "medical-summary",
                                    label: "Medical Summary",
                                    content: <MedicalSummary />,
                                },
                                {
                                    id: "fhir-section-summary",
                                    label: "FHIR Section Summary",
                                    content: <FHIRSectionSummary />,
                                },
                                {
                                    id: "provider-locator",
                                    label: "Provider Locator",
                                    content: <ProviderLocator />
                                },
                                {
                                    id: "scheduling",
                                    label: "Scheduling",
                                    content: <SchedulingForm />
                                },
                                {
                                    id: "settings",
                                    label: "Settings",
                                    content: <DatabaseSettings />
                                }
                            ]}
                        />
                    </Container>
                    <Button onClick={() => setShowReferralModal(true)}>Patient Referral</Button>
                </SpaceBetween>
            </Grid>
        </div>
    );

    return (
        <AppLayout
            content={mainContent}
            toolsOpen={toolsOpen}
            tools={helpPanelContent}
            onToolsChange={({ detail }) => setToolsOpen(detail.open)}
            toolsWidth={350}
            navigationHide={true}
            contentType="default"
        >
            <Modal
                visible={showReferralModal}
                onDismiss={() => setShowReferralModal(false)}
                header="Patient Referral"
                size="medium"
            >
                <Form
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={() => setShowReferralModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleReferralSubmit}>
                                Submit
                            </Button>
                        </SpaceBetween>
                    }
                >
                    <SpaceBetween size="l">
                        <FormField label="Patient name">
                            <input
                                type="text"
                                value={referralForm.patientName}
                                onChange={(e) =>
                                    setReferralForm(prev => ({ ...prev, patientName: e.target.value }))
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--color-border-input-default)'
                                }}
                            />
                        </FormField>

                        <FormField label="Reason for referral">
                            <input
                                type="text"
                                value={referralForm.illness}
                                onChange={(e) =>
                                    setReferralForm(prev => ({ ...prev, illness: e.target.value }))
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--color-border-input-default)'
                                }}
                            />
                        </FormField>

                        <FormField label="Current medications">
                            <input
                                type="text"
                                value={referralForm.medications}
                                onChange={(e) =>
                                    setReferralForm(prev => ({ ...prev, medications: e.target.value }))
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--color-border-input-default)'
                                }}
                            />
                        </FormField>

                        <FormField label="Refer to">
                            <Select
                                selectedOption={selectedProvider ? { label: selectedProvider.name, value: selectedProvider.id } : null}
                                onChange={({ detail }) => {
                                    const provider = MOCK_PROVIDERS.find(p => p.id === detail.selectedOption.value);
                                    setSelectedProvider(provider || null);
                                    setReferralForm(prev => ({ ...prev, referTo: provider?.name || '' }));
                                }}
                                options={MOCK_PROVIDERS.map(p => ({ label: p.name, value: p.id }))}
                                placeholder="Select provider"
                            />
                        </FormField>

                        <FormField label="Additional notes">
                            <Textarea
                                value={referralForm.details}
                                onChange={(event) => {
                                    const target = event.target as HTMLTextAreaElement;
                                    setReferralForm(prev => ({ ...prev, details: target.value }));
                                }}
                            />
                        </FormField>
                    </SpaceBetween>
                </Form>
            </Modal>
        </AppLayout>
    );
};

export default AgentDesktop;
