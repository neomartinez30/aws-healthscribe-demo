// src/components/AgentDesktop/ScrollableContainer.tsx
import React from 'react';
import Box from '@cloudscape-design/components/box';

type ScrollableContainerProps = {
    children: React.ReactNode;
};

export default function ScrollableContainer({ children }: ScrollableContainerProps) {
    return (
        <Box
            style={{
                height: '300px',
                overflowY: 'auto',
                padding: '10px',
                border: '1px solid #eaeded',
                borderRadius: '4px'
            }}
        >
            {children}
        </Box>
    );
}
