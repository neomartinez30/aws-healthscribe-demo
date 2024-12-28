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

import { medicalHistoryData } from './medicalHistoryData';
import styles from './AgentDesktop.module.css';

// ... (keep existing MOCK_PROVIDERS and other type definitions)

export default function AgentDesktop() {
    // ... (keep existing state and refs)

    const medicalHistoryItems = Object.values(medicalHistoryData);

    // ... (keep existing functions)

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
                                                getItemContent: (item) => (
                                                    <div style={{ padding: '0.5rem' }}>
                                                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                                            {item.details}
                                                        </pre>
                                                    </div>
                                                )
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