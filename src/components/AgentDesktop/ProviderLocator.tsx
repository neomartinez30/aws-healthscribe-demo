import React, { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import Input from '@cloudscape-design/components/input';
import Textarea from '@cloudscape-design/components/textarea';

const MOCK_PROVIDERS = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        address: '123 Medical Ave, Suite 200, Washington DC',
        zip: '20001',
        availability: 'Next available: Tomorrow 2pm',
        phone: '(202) 555-0123',
        education: 'Harvard Medical School',
        languages: 'English, Spanish',
        insurance: ['Blue Cross', 'Aetna', 'United Healthcare'],
        rating: '4.8/5',
        experience: '15 years'
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Family Medicine',
        address: '456 Health St, Building B, Washington DC',
        zip: '20002',
        availability: 'Next available: Today 4pm',
        phone: '(202) 555-0124',
        education: 'Johns Hopkins University',
        languages: 'English, Mandarin',
        insurance: ['Medicare', 'Cigna', 'Kaiser'],
        rating: '4.9/5',
        experience: '12 years'
    },
    {
        id: '3',
        name: 'Dr. Emily Williams',
        specialty: 'Pediatrics',
        address: '789 Care Ln, Washington DC',
        zip: '20003',
        availability: 'Next available: Friday 10am',
        phone: '(202) 555-0125',
        education: 'Stanford Medical School',
        languages: 'English, French',
        insurance: ['Aetna', 'United Healthcare', 'Humana'],
        rating: '4.7/5',
        experience: '8 years'
    },
    {
        id: '4',
        name: 'Dr. James Wilson',
        specialty: 'Orthopedics',
        address: '321 Wellness Rd, Washington DC',
        zip: '20004',
        availability: 'Next available: Monday 9am',
        phone: '(202) 555-0126',
        education: 'Yale School of Medicine',
        languages: 'English',
        insurance: ['Blue Cross', 'Medicare', 'Cigna'],
        rating: '4.6/5',
        experience: '20 years'
    },
    {
        id: '5',
        name: 'Dr. Maria Rodriguez',
        specialty: 'Internal Medicine',
        address: '567 Health Parkway, Washington DC',
        zip: '20005',
        availability: 'Next available: Wednesday 1pm',
        phone: '(202) 555-0127',
        education: 'Columbia University',
        languages: 'English, Spanish, Portuguese',
        insurance: ['United Healthcare', 'Aetna', 'Humana'],
        rating: '4.9/5',
        experience: '10 years'
    },
    {
        id: '6',
        name: 'Dr. David Kim',
        specialty: 'Dermatology',
        address: '890 Medical Center Dr, Washington DC',
        zip: '20006',
        availability: 'Next available: Thursday 3pm',
        phone: '(202) 555-0128',
        education: 'UCLA Medical School',
        languages: 'English, Korean',
        insurance: ['Blue Cross', 'Cigna', 'Kaiser'],
        rating: '4.8/5',
        experience: '14 years'
    }
];

export function ProviderLocator() {
    const [zipCode, setZipCode] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [referralReason, setReferralReason] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');

    const filteredProviders = MOCK_PROVIDERS.filter(provider =>
        zipCode ? provider.zip.includes(zipCode) : true
    );

    return (
        <Container
            header={
                <Header
                    variant="h2"
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={() => setShowReferralModal(true)}>Create Referral</Button>
                        </SpaceBetween>
                    }
                >
                    Provider Locator
                </Header>
            }
        >
            <SpaceBetween size="l">
                <FormField label="Filter by ZIP code">
                    <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="Enter ZIP code"
                        style={{
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border-input-default)',
                            width: '200px'
                        }}
                    />
                </FormField>
                <Cards
                    items={filteredProviders}
                    cardDefinition={{
                        header: item => (
                            <SpaceBetween size="xs">
                                <Box variant="h3">{item.name}</Box>
                                <Box color="text-status-info" float="right">{item.rating}</Box>
                            </SpaceBetween>
                        ),
                        sections: [
                            {
                                id: "specialty",
                                header: "Specialty",
                                content: item => item.specialty
                            },
                            {
                                id: "contact",
                                header: "Contact",
                                content: item => (
                                    <SpaceBetween size="xs">
                                        <div>{item.phone}</div>
                                        <div>{item.address}</div>
                                    </SpaceBetween>
                                )
                            },
                            {
                                id: "details",
                                header: "Details",
                                content: item => (
                                    <SpaceBetween size="xs">
                                        <div><strong>Education:</strong> {item.education}</div>
                                        <div><strong>Experience:</strong> {item.experience}</div>
                                        <div><strong>Languages:</strong> {item.languages}</div>
                                        <div><strong>Insurance:</strong> {item.insurance.join(', ')}</div>
                                    </SpaceBetween>
                                )
                            },
                            {
                                id: "availability",
                                header: "Availability",
                                content: item => item.availability
                            }
                        ]
                    }}
                    selectionType="single"
                    selectedItems={selectedProvider ? [selectedProvider] : []}
                    onSelectionChange={({ detail }) =>
                        setSelectedProvider(detail.selectedItems[0])
                    }
                    empty={
                        <Box textAlign="center" color="inherit">
                            <b>No providers found</b>
                            <Box padding={{ bottom: 's' }}>
                                Try adjusting the ZIP code filter
                            </Box>
                        </Box>
                    }
                />
            </SpaceBetween>

            <Modal
                visible={showReferralModal}
                onDismiss={() => setShowReferralModal(false)}
                header="Create Referral"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={() => setShowReferralModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={() => setShowReferralModal(false)}>
                                Create Referral
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <SpaceBetween size="l">
                    <FormField label="Provider">
                        <Input 
                            value={selectedProvider?.name || ''} 
                            disabled 
                        />
                    </FormField>
                    <FormField label="Reason for Referral">
                        <Textarea
                            value={referralReason}
                            onChange={({ detail }) => setReferralReason(detail.value)}
                            placeholder="Enter reason for referral"
                            rows={3}
                        />
                    </FormField>
                    <FormField label="Additional Notes">
                        <Textarea
                            value={additionalNotes}
                            onChange={({ detail }) => setAdditionalNotes(detail.value)}
                            placeholder="Enter any additional notes"
                            rows={3}
                        />
                    </FormField>
                </SpaceBetween>
            </Modal>
        </Container>
    );
}