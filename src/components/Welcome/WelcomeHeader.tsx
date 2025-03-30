import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import RadioGroup from '@cloudscape-design/components/radio-group';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface WelcomeHeaderProps {
    logoUrl: string;
}

export default function WelcomeHeader({ logoUrl }: WelcomeHeaderProps) {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('conversations');

    const buttonText = useMemo(() => {
        const options = {
            conversations: 'View Conversations',
            PatientInsights: 'View Insights',
            AgentDesktop: 'Open Agent Desktop'
        };
        return options[selectedOption as keyof typeof options] || 'Go';
    }, [selectedOption]);

    const navigationOptions = [
        {
            value: 'conversations',
            label: 'Conversations',
            description: 'View available conversations'
        },
        {
            value: 'PatientInsights',
            label: 'Patient Insights',
            description: 'Interact with patient medical history'
        },
        {
            value: 'AgentDesktop',
            label: 'Agent Desktop',
            description: 'Open virtual nurse workspace'
        }
    ];

    return (
        <Box padding={{ top: 'xs', bottom: 'l' }}>
            <Grid
                gridDefinition={[
                    { colspan: { default: 12, xs: 2, s: 2 } },
                    { colspan: { default: 12, xs: 5, s: 6 } },
                    { colspan: { default: 12, xs: 5, s: 4 } }
                ]}
            >
                <Box padding="xs">
                    <img
                        src={logoUrl}
                        alt="DHA Logo"
                        style={{
                            maxHeight: '64px',
                            width: 'auto'
                        }}
                    />
                </Box>
                <SpaceBetween size="xl">
                    <Box fontSize="display-l" fontWeight="bold">
                        Clinical Notes
                    </Box>
                    <Box fontSize="heading-xl">Clinical Notes</Box>
                </SpaceBetween>

                <Container>
                    <SpaceBetween size="l">
                        <Box variant="h1" fontWeight="heavy" padding="n" fontSize="heading-m">
                            Get started
                        </Box>
                        <RadioGroup
                            onChange={({ detail }) => setSelectedOption(detail.value)}
                            value={selectedOption}
                            items={navigationOptions}
                        />
                        <Button 
                            variant="primary" 
                            onClick={() => navigate(`/${selectedOption}`)}
                            iconName="arrow-right"
                        >
                            {buttonText}
                        </Button>
                    </SpaceBetween>
                </Container>
            </Grid>
        </Box>
    );
}
