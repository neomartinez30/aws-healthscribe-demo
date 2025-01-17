import React, { useMemo, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { MedicalScribeJob } from '@aws-sdk/client-transcribe';

import { getPresignedUrl, getS3Object } from '@/utils/S3Api';

type ConversationHeaderProps = {
    jobDetails: MedicalScribeJob | null;
    setShowOutputModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ConversationHeader({ jobDetails, setShowOutputModal }: ConversationHeaderProps) {
    const [showHighRiskAlert, setShowHighRiskAlert] = useState(false);

    // Check for high risk content when transcript is loaded
    useMemo(() => {
        if (jobDetails?.MedicalScribeOutput?.TranscriptFileUri) {
            const transcriptUrl = jobDetails.MedicalScribeOutput.TranscriptFileUri;
            getPresignedUrl(getS3Object(transcriptUrl))
                .then(url => fetch(url))
                .then(response => response.json())
                .then(data => {
                    const transcriptText = data.Conversation.TranscriptSegments
                        .map((segment: any) => segment.Content.toLowerCase())
                        .join(' ');
                    const highRiskKeywords = ['suicide', 'kill myself', 'end it all', 'don\'t want to live', 'self harm'];
                    const hasHighRiskContent = highRiskKeywords.some(keyword => transcriptText.includes(keyword));
                    setShowHighRiskAlert(hasHighRiskContent);
                })
                .catch(error => console.error('Error checking transcript:', error));
        }
    }, [jobDetails]);

    async function openUrl(detail: { id: string }) {
        let jobUrl: string = '';
        if (detail.id === 'audio') {
            jobUrl = jobDetails?.Media?.MediaFileUri as string;
        } else if (detail.id === 'transcript') {
            jobUrl = jobDetails?.MedicalScribeOutput?.TranscriptFileUri as string;
        } else if (detail.id === 'summary') {
            jobUrl = jobDetails?.MedicalScribeOutput?.ClinicalDocumentUri as string;
        }
        if (jobUrl) {
            const presignedUrl = await getPresignedUrl(getS3Object(jobUrl));
            window.open(presignedUrl, '_blank');
        }
    }

    return (
        <Box>
            {showHighRiskAlert && (
                <Alert type="error" header={
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span>⚠️ High Risk Call Alert ⚠️</span>
                        <span>Patient is hinting towards self-harm. Immediate action required.</span>
                    </div>
                } />
            )}
            <Header
                variant="awsui-h1-sticky"
                actions={
                    <SpaceBetween direction="horizontal" size="xs">
                        <ButtonDropdown
                            items={[
                                { text: 'Audio', id: 'audio' },
                                { text: 'Transcript', id: 'transcript' },
                                { text: 'Summary', id: 'summary' },
                            ]}
                            onItemClick={({ detail }) => openUrl(detail)}
                        >
                            Download
                        </ButtonDropdown>
                        <Button onClick={() => setShowOutputModal(true)}>View HealthScribe Output</Button>
                    </SpaceBetween>
                }
            >
                {jobDetails?.MedicalScribeJobName}
            </Header>
        </Box>
    );
}