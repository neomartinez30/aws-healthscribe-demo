// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Grid from '@cloudscape-design/components/grid';
import RadioGroup from '@cloudscape-design/components/radio-group';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { useAuthContext } from '@/store/auth';

interface WelcomeHeaderProps {
    logoUrl: string;
}

export default function WelcomeHeader({ logoUrl }: WelcomeHeaderProps) {
    const navigate = useNavigate();
    const { isUserAuthenticated } = useAuthContext();
    const [getStartedSelection, setGetStartedSelection] = useState<string>('conversations');

    const getStartedSelectionText = useMemo(() => {
        if (getStartedSelection === 'conversations') {
            return 'View Conversations';
        } else if (getStartedSelection === 'newConversation') {
            return 'View Insights';
        } else if (getStartedSelection === 'generateAudio') {
            return 'Find a Provider';
        } else {
            return 'Go';
        }
    }, [getStartedSelection]);

    function handleGetStartedClick() {
        if (getStartedSelection === 'conversations') {
            navigate('/conversations');
        } else if (getStartedSelection === 'newConversation') {
            navigate('/new');
        } else if (getStartedSelection === 'generateAudio') {
            navigate('/generate');
        }
    }

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
                        Virtual Nurse Experience
                    </Box>
                    <Box fontSize="display-l">DHA Nurse Advise Health Line</Box>
                </SpaceBetween>

                <div>
                    {isUserAuthenticated && (
                        <Container>
                            <SpaceBetween size="l">
                                <Box variant="h1" fontWeight="heavy" padding="n" fontSize="heading-m">
                                    Get started
                                </Box>
                                <RadioGroup
                                    onChange={({ detail }) => setGetStartedSelection(detail.value)}
                                    value={getStartedSelection}
                                    items={[
                                        {
                                            value: 'conversations',
                                            label: 'Conversations',
                                            description: 'View available conversations',
                                        },
                                        {
                                            value: 'newConversation',
                                            label: 'Patient Insights',
                                            description: 'Interact with patient medical history',
                                        },
                                        {
                                            value: 'generateAudio',
                                            label: 'Provider Locator',
                                            description: 'Find and triage to a provider',
                                        },
                                    ]}
                                />
                                <Button variant="primary" onClick={handleGetStartedClick}>
                                    {getStartedSelectionText}
                                </Button>
                            </SpaceBetween>
                        </Container>
                    )}
                </div>
            </Grid>
        </Box>
    );
}
