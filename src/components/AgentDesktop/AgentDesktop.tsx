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
import Cards from '@cloudscape-design/components/cards';
import Textarea from '@cloudscape-design/components/textarea';
import Select from '@cloudscape-design/components/select';
import Tabs from '@cloudscape-design/components/tabs';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import AppLayout from '@cloudscape-design/components/app-layout';
import HelpPanel from '@cloudscape-design/components/help-panel';
import "amazon-connect-streams";

import styles from './AgentDesktop.module.css';
import {
  AllergyIntoleranceSection,
  ClaimSection,
  MedicationRequestSection,
  ImmunizationSection,
  FamilyMemberHistorySection,
  ConditionsSection
} from "./ExpandableSections";
import SchedulingForm from './SchedulingForm';
import { ProviderLocator } from './ProviderLocator';

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

const MOCK_PROVIDERS: Provider[] = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', address: '123 Medical Ave', zip: '20001', availability: 'Next available: Tomorrow 2pm' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Family Medicine', address: '456 Health St', zip: '20002', availability: 'Next available: Today 4pm' },
    { id: '3', name: 'Dr. Emily Williams', specialty: 'Pediatrics', address: '789 Care Ln', zip: '20003', availability: 'Next available: Friday 10am' },
    { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics', address: '321 Wellness Rd', zip: '20004', availability: 'Next available: Monday 9am' },
];

export default function AgentDesktop() {
    const containerRef = useRef<HTMLIFrameElement>(null);
    const instanceURL = "https://neoathome2024.my.connect.aws/ccp-v2/softphone";
    const [toolsOpen, setToolsOpen] = useState(true);
    const [activeTabId, setActiveTabId] = useState("patient-summary");
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [referralForm, setReferralForm] = useState<ReferralForm>({
        patientName: '',
        illness: '',
        medications: '',
        referTo: '',
        details: ''
    });

    useEffect(() => {
        if (containerRef.current) {
            window.connect.core.initCCP(containerRef.current, {
                ccpUrl: instanceURL,
                loginPopup: true,
                loginPopupAutoClose: true,
                loginOptions: {
                    autoClose: true,
                    height: 600,
                    width: 400,
                    top: 0,
                    left: 0
                },
                region: 'us-east-1',
                softphone: {
                    allowFramedSoftphone: true,
                    disableRingtone: false
                }
            });
        }
    }, []);

    const handleReferralSubmit = () => {
        // Handle referral submission logic here
        setShowReferralModal(false);
    };

    const PatientDetails = () => (
        <Container className={styles.patientDetails}>
            <div className={styles.patientDetailsGrid}>
                <div className={styles.patientDetailsItem}>
                    <span className={styles.patientDetailsLabel}>Name</span>
                    <span className={styles.patientDetailsValue}>John Smith</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={styles.patientDetailsLabel}>DOB</span>
                    <span className={styles.patientDetailsValue}>03/15/1985</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={styles.patientDetailsLabel}>Insurance</span>
                    <span className={styles.patientDetailsValue}>Blue Cross</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={styles.patientDetailsLabel}>Member ID</span>
                    <span className={styles.patientDetailsValue}>BC123456789</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={styles.patientDetailsLabel}>Last Visit</span>
                    <span className={styles.patientDetailsValue}>01/10/2024</span>
                </div>
                <div className={styles.patientDetailsItem}>
                    <span className={styles.patientDetailsLabel}>PCP</span>
                    <span className={styles.patientDetailsValue}>Dr. Johnson</span>
                </div>
            </div>
        </Container>
    );

    const helpPanelContent = (
        <div className={styles.helpPanelContent}>
            <SpaceBetween size="l">
                <Header variant="h2">
                    Virtual Assistant
                </Header>
                <Container>
                    <iframe
                        src="https://qb0qspckljwjq6q.studio.us-east-1.sagemaker.aws/jupyterlab/default/proxy/8524/"
                        className={styles.chatbotIframe}
                        title="AI Assistant"
                    />
                </Container>
            </SpaceBetween>
        </div>
    );

    return (
        <AppLayout
            content={
                <ContentLayout
                    header={
                        <Header
                            variant="h1"
                            description="Advise Health Line"
                        >
                            Nurse Workspace
                        </Header>
                    }
                >
                    <div className={styles.mainContent}>
                        <Grid
                            gridDefinition={[
                                { colspan: 4 },
                                { colspan: 8 }
                            ]}
                        >
                            <Container>
                                <div className={styles.ccpContainer}>
                                    <iframe 
                                        ref={containerRef}
                                        className={styles.iframeContainer}
                                        title="Call Center Softphone"
                                    />
                                </div>
                            </Container>

                            <SpaceBetween size="l">
                                <PatientDetails />

                                <Container>
                                    <Tabs
                                        activeTabId={activeTabId}
                                        onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
                                        tabs={[
                                            {
                                                id: "patient-summary",
                                                label: "Patient Summary",
                                                content: (
                                                    <iframe
                                                        src="https://qb0qspckljwjq6q.studio.us-east-1.sagemaker.aws/jupyterlab/default/proxy/8523/"
                                                        className={styles.summaryIframe}
                                                        title="Patient Summary"
                                                    />
                                                )
                                            },
                                            {
                                                id: "medical-history",
                                                label: "Medical History",
                                                content: (
                                                    <iframe
                                                        src="https://qb0qspckljwjq6q.studio.us-east-1.sagemaker.aws/jupyterlab/default/proxy/8525/"
                                                        className={styles.fhirIframe}
                                                        title="Medical History"
                                                    />
                                                )
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
                                                content: (
                                                    <iframe
                                                        src="https://qb0qspckljwjq6q.studio.us-east-1.sagemaker.aws/jupyterlab/default/proxy/8522/"
                                                        className={styles.settingsIframe}
                                                        title="Settings"
                                                    />
                                                )
                                            }
                                        ]}
                                    />
                                </Container>
                            </SpaceBetween>
                        </Grid>

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
                                            onChange={(event) =>
                                                setReferralForm(prev => ({ ...prev, details: event.detail.value }))
                                            }
                                        />
                                    </FormField>
                                </SpaceBetween>
                            </Form>
                        </Modal>
                    </div>
                </ContentLayout>
            }
            toolsOpen={toolsOpen}
            tools={helpPanelContent}
            onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        />
    );
}