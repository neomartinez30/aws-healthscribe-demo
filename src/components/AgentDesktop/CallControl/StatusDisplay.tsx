// src/components/AgentDesktop/CallControl/StatusDisplay.tsx
import React from 'react';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { AgentState } from '../types';

type StatusDisplayProps = {
    agentState: AgentState;
    callDuration?: number;
};

export function StatusDisplay({ agentState, callDuration }: StatusDisplayProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SpaceBetween size="s">
            <Box>
                <Box variant="awsui-key-label">Agent Status</Box>
                <StatusIndicator type={agentState === 'Available' ? 'success' : 'pending'}>
                    {agentState}
                </StatusIndicator>
            </Box>
            {callDuration !== undefined && (
                <Box>
                    <Box variant="awsui-key-label">Call Duration</Box>
                    <Box>{formatTime(callDuration)}</Box>
                </Box>
            )}
        </SpaceBetween>
    );
}
