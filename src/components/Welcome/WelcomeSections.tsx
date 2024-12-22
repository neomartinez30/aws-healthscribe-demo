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
        <SpaceBetween size="s">
            <Header variant="h2">Overview</Header>
            <Container>
                <SpaceBetween size="s">
                    <TextContent>
                        <Box variant="p">
                            This sample web app shows the art of the possible in using AI and GenAI techniques for Next-Gen Virtual Nurse workspaces.
                            <ul>
                                <li>This demo website uses synthetic patient data. Nothing is real.</li>
                            </ul>
                        </Box>
                    </TextContent>
                </SpaceBetween>
            </Container>
        </SpaceBetween>
    );
}

export function Highlights() {
    return (
        <SpaceBetween size="s">
            <Header variant="h2">Conversations</Header>
            <Container>
                <SpaceBetween size="s">
                    <Box>
                        The <b>Conversations</b> tab is powered by AWS HealthScribe and AWS Bedrock. AWS HealthScribe is a HIPAA-eligible service empowering healthcare software vendors to build clinical applications that automatically generate clinical notes by analyzing patient-clinician conversations.
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
                        The <b>Patient Insights</b> module utilizes Amazon Bedrock to summarize patient data stored in Amazon HealthLake. It allows users to interact with their HealthLake database, retrieve patient information, and generate consolidated summaries of patient medical histories.
                        <ul>
                            <li>Database Integration: Connect databased to Amazon HealthLake and select the resources to analyze.</li>
                            <li>Summarization: Generate detailed summaries of patient medical data by leveraging Amazon Bedrock's Generative AI capabilities.</li>
                            <li>Consolidated Summary: Obtain a comprehensive, coherent summary of the patient's medical history by merging information from various sources.</li>
                            <li>Individual FHIR summary: Obtain a more granular summary of each FHIR resource selected for analysis.</li>
                            <li>Interactive Chat: Engage in a conversational interface to ask questions about the patient's medical record and receive relevant answers.</li>
                        </ul>
                    </Box>
                </SpaceBetween>
            </Container>
        </SpaceBetween>
    );
}
