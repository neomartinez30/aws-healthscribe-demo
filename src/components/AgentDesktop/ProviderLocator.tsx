import React, { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';

const MOCK_PROVIDERS = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', address: '123 Medical Ave', zip: '20001', availability: 'Next available: Tomorrow 2pm' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Family Medicine', address: '456 Health St', zip: '20002', availability: 'Next available: Today 4pm' },
    { id: '3', name: 'Dr. Emily Williams', specialty: 'Pediatrics', address: '789 Care Ln', zip: '20003', availability: 'Next available: Friday 10am' },
    { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics', address: '321 Wellness Rd', zip: '20004', availability: 'Next available: Monday 9am' },
];

export function ProviderLocator() {
    const [zipCode, setZipCode] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [showReferralModal, setShowReferralModal] = useState(false);

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
        </Container>
    );
}