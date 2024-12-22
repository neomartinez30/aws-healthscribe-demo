// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextContent from '@cloudscape-design/components/text-content';

export function Overview() {
    return (
        <SpaceBetween size={'s'}>
            <Header variant="h2">Overview</Header>
            <Container>
                <SpaceBetween size={'s'}>
                    <TextContent>
                        <Box variant="p">
                            This sample web app shows the art of the possible in using AI and GenAI techniques for Next-Gen Virtual Nurse workspaces.
                            <li>This demo website uses synthetic patient data. Nothing is real.</li>
                        </Box>
                        <Box variant="p">
                        </Box>
                    </TextContent>
                </SpaceBetween>
            </Container>
        </SpaceBetween>
    );
}

export function Highlights() {
    return (
        <SpaceBetween size={'s'}>
            <Header variant="h2">Conversations</Header>
            <Container>
                <SpaceBetween size={'s'}>
                    <Box>
                        The <b>conversations<b> tab is powered by AWS Healthscribe and AWS Bedrock. AWS HealthScribe is a HIPAA-eligible service empowering healthcare software vendors to build clinical applications that automatically generate clinical notes by analyzing patient-clinician conversations.
                        <ul>
                            <li>Summarized clinical notes</li>
                            <li>Rich consultation transcripts</li>
                            <li>Transcript segmentation</li>
                            <li>Evidence mapping</li>
                            <li>Structured medical terms</li>
                        </ul>
                    </Box>
                </SpaceBetween>
            </Container>
        </SpaceBetween>
    );
}

export function Details() {
    return (
        <SpaceBetween size={'s'}>
            <Header variant="h2">
                <span>Patient Insights</span>
            </Header>
            <Container>
                <SpaceBetween size={'s'}>
                    <Box>
                        The patient insights module is powered by AWS HealthLake and AWS Berock.
                        <ul>
                            <li>Summarized clinical notes</li>
                            <li>Rich consultation transcripts</li>
                            <li>Transcript segmentation</li>
                            <li>Evidence mapping</li>
                            <li>Structured medical terms</li>
                        </ul>
                    </Box>
                </SpaceBetween>
            </Container>
        </SpaceBetween>
    );
}

