import React from 'react';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

export default function AgentWorkspace() {
    return (
        <SpaceBetween size="l">
            <Box variant="h2">Agent Workspace</Box>
            <Box color="text-status-inactive">
                Workspace content will be added here
            </Box>
        </SpaceBetween>
    );
}
