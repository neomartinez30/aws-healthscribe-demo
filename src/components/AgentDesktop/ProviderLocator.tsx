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
import ExpandableSection from '@cloudscape-design/components/expandable-section';

interface Provider {
    id: string;
    name: string;
    specialty: string;
    address: string;
    zip: string;
    availableTimes: string[];
    phone: string;
    education: string;
    languages: string;
    insurance: string[];
    rating: string;
    experience: string;
}

const MOCK_PROVIDERS: Provider[] = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        address: '123 Medical Ave, Suite 200, Washington DC',
        zip: '20001',
        availableTimes: [
            'Tomorrow 2:00 PM',
            'Tomorrow 3:30 PM',
            'Friday 9:00 AM',
            'Friday 11:30 AM',
            'Monday 10:00 AM'
        ],
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
        availableTimes: [
            'Today 4:00 PM',
            'Tomorrow 1:30 PM',
            'Thursday 9:00 AM',
            'Thursday 2:30 PM',
            'Friday 11:00 AM'
        ],
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
        availableTimes: [
            'Friday 10:00 AM',
            'Friday 2:30 PM',
            'Monday 9:00 AM',
            'Monday 3:30 PM',
            'Tuesday 11:00 AM'
        ],
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
        availableTimes: [
            'Monday 9:00 AM',
            'Monday 2:30 PM',
            'Wednesday 10:00 AM',
            'Wednesday 1:30 PM',
            'Friday 11:00 AM'
        ],
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
        availableTimes: [
            'Wednesday 1:00 PM',
            'Wednesday 3:30 PM',
            'Thursday 9:00 AM',
            'Thursday 2:30 PM',
            'Friday 10:00 AM'
        ],
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
        availableTimes: [
            'Thursday 3:00 PM',
            'Thursday 4:30 PM',
            'Friday 9:00 AM',
            'Friday 2:30 PM',
            'Monday 11:00 AM'
        ],
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
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
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
                            <Box variant="h3">{item.name}</Box>
                        ),
                        sections: [
                            {
                                id: "location",
                                content: item => (
                                    <SpaceBetween size="xs">
                                        <div>{item.address}</div>
                                        <div>{item.phone}</div>
                                    </SpaceBetween>
                                )
                            },
                            {
                                id: "details",
                                content: item => (
                                    <ExpandableSection headerText="View Details">
                                        <SpaceBetween size="m">
                                            <div>
                                                <Box variant="h4">Specialty</Box>
                                                <div>{item.specialty}</div>
                                            </div>
                                            <div>
                                                <Box variant="h4">Education & Experience</Box>
                                                <div>{item.education}</div>
                                                <div>{item.experience} of experience</div>
                                            </div>
                                            <div>
                                                <Box variant="h4">Languages</Box>
                                                <div>{item.languages}</div>
                                            </div>
                                            <div>
                                                <Box variant="h4">Insurance Accepted</Box>
                                                <div>{item.insurance.join(', ')}</div>
                                            </div>
                                            <div>
                                                <Box variant="h4">Available Appointments</Box>
                                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                    {item.availableTimes.map((time: string, index: number) => (
                                                        <li key={index} style={{ marginBottom: '4px' }}>
                                                            {time}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <Box variant="h4">Rating</Box>
                                                <div>{item.rating}</div>
                                            </div>
                                        </SpaceBetween>
                                    </ExpandableSection>
                                )
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