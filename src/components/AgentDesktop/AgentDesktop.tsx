import React, { useEffect, useRef, useState } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import FormField from '@cloudscape-design/components/form-field';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Cards from '@cloudscape-design/components/cards';
import Textarea from '@cloudscape-design/components/textarea';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Tabs from '@cloudscape-design/components/tabs';
import Table from '@cloudscape-design/components/table';
import "amazon-connect-streams";

const MOCK_PROVIDERS = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', address: '123 Medical Ave', zip: '20001' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Family Medicine', address: '456 Health St', zip: '20002' },
    { id: '3', name: 'Dr. Emily Williams', specialty: 'Pediatrics', address: '789 Care Ln', zip: '20003' },
    { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics', address: '321 Wellness Rd', zip: '20004' },
];

type ReferralFormState = {
    patientName: string;
    illness: string;
    medications: string;
    referTo: string;
    details: string;
};

interface MedicalHistoryItem {
    resource: string;
    details: string;
    content: Record<string, unknown>;
}

export default function AgentDesktop() {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceURL = "https://neoathome2024.my.connect.aws/ccp-v2/softphone";
    const [zipCode, setZipCode] = useState('');
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [activeTabId, setActiveTabId] = useState("medical-history");
    const [referralForm, setReferralForm] = useState<ReferralFormState>({
        patientName: '',
        illness: '',
        medications: '',
        referTo: '',
        details: ''
    });

    const filteredProviders = MOCK_PROVIDERS.filter(provider =>
        zipCode ? provider.zip.includes(zipCode) : true
    );

    useEffect(() => {
        if (containerRef.current) {
            connect.core.initCCP(containerRef.current, {
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
        console.log('Referral submitted:', referralForm);
        setShowReferralModal(false);
    };

    // Medical history data
    const medicalHistoryItems: MedicalHistoryItem[] = [
        {
            resource: "Resource 1",
            details: "Details 1",
            content: {}
        },
        {
            resource: "Resource 2",
            details: "Details 2",
            content: {}
        }
    ];

    const ProviderLocatorContent = () => (
        <Container
            header={
                <Header
                    variant="h2"
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={() => setShowReferralModal(true)}>Referral</Button>
                        </SpaceBetween>
                    }
                >
                    Provider Locator
                </Header>
            }
        >
            <SpaceBetween size="l">
                <FormField label="Search by ZIP code">
                    <Input
                        value={zipCode}
                        onChange={(event) => setZipCode(event.detail.value)}
                        placeholder="Enter ZIP code"
                    />
                </FormField>

                <Cards
                    items={filteredProviders}
                    cardDefinition={{
                        header: item => item.name,
                        sections: [
                            {
                                id: "specialty",
                                header: "Specialty",
                                content: item => item.specialty
                            },
                            {
                                id: "address",
                                header: "Address",
                                content: item => `${item.address}, ${item.zip}`
                            }
                        ]
                    }}
                    selectionType="single"
                    selectedItems={selectedProvider ? [selectedProvider] : []}
                    onSelectionChange={({ detail }) =>
                        setSelectedProvider(detail.selectedItems[0])
                    }
                />
            </SpaceBetween>
        </Container>
    );

    return (
        <ContentLayout
            headerVariant="high-contrast"
            header={
                <Header
                    variant="h1"
                    description="Amazon Connect Contact Control Panel (CCP)"
                >
                    Agent Desktop
                </Header>
            }
        >
            <Grid
                gridDefinition={[
                    { colspan: 4 },
                    { colspan: 8 }
                ]}
            >
                <Container>
                    <div ref={containerRef} style={{ width: '100%', height: '465px' }}/>
                </Container>

                <SpaceBetween size="l">
                    <ExpandableSection
                        headerText="Patient Details"
                        variant="container"
                        defaultExpanded
                    >
                        <ColumnLayout borders="horizontal" columns={2}>
                            <div>
                                <Box variant="awsui-key-label">Name</Box>
                                <Box>John Smith</Box>
                            </div>
                            <div>
                                <Box variant="awsui-key-label">DOB</Box>
                                <Box>03/15/1985</Box>
                            </div>
                            <div>
                                <Box variant="awsui-key-label">Insurance</Box>
                                <Box>Blue Cross</Box>
                            </div>
                            <div>
                                <Box variant="awsui-key-label">Member ID</Box>
                                <Box>BC123456789</Box>
                            </div>
                            <div>
                                <Box variant="awsui-key-label">Last Visit</Box>
                                <Box>01/10/2024</Box>
                            </div>
                            <div>
                                <Box variant="awsui-key-label">PCP</Box>
                                <Box>Dr. Johnson</Box>
                            </div>
                        </ColumnLayout>
                    </ExpandableSection>

                    <Container>
                        <Tabs
                            activeTabId={activeTabId}
                            onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
                            tabs={[
                                {
                                    id: "medical-history",
                                    label: "Medical History",
                                    content: (
                                        <Table
                                            columnDefinitions={[
                                                { id: "resource", header: "Resource", cell: item => item.resource },
                                                { id: "details", header: "Details", cell: item => item.details }
                                            ]}
                                            items={medicalHistoryItems}
                                            expandableRows={{
                                                expandAll: false,
                                                expandedRows: [],
                                                onExpand: (item, expanded) => {
                                                    console.log('Row expanded:', item, expanded);
                                                }
                                            }}
                                            variant="container"
                                        />
                                    )
                                },
                                {
                                    id: "provider-locator",
                                    label: "Provider Locator",
                                    content: <ProviderLocatorContent />
                                },
                                {
                                    id: "insights",
                                    label: "Insights",
                                    content: <div>Insights content will go here</div>
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
                            <Input
                                value={referralForm.patientName}
                                onChange={(event) =>
                                    setReferralForm(prev => ({ ...prev, patientName: event.detail.value }))
                                }
                            />
                        </FormField>

                        <FormField label="Illness">
                            <Input
                                value={referralForm.illness}
                                onChange={(event) =>
                                    setReferralForm(prev => ({ ...prev, illness: event.detail.value }))
                                }
                            />
                        </FormField>

                        <FormField label="Medications">
                            <Input
                                value={referralForm.medications}
                                onChange={(event) =>
                                    setReferralForm(prev => ({ ...prev, medications: event.detail.value }))
                                }
                            />
                        </FormField>

                        <FormField label="Refer to">
                            <Input
                                value={referralForm.referTo}
                                onChange={(event) =>
                                    setReferralForm(prev => ({ ...prev, referTo: event.detail.value }))
                                }
                            />
                        </FormField>

                        <FormField label="Add details">
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
        </ContentLayout>
    );
}
