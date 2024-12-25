import React from 'react';
import Box from '@cloudscape-design/components/box';

type ScrollableContainerProps = {
    children: React.ReactNode;
};

export default function ScrollableContainer({ children }: ScrollableContainerProps) {
    return (
        <Box
            padding="s"
            className="scrollable-container"
        >
            {children}
        </Box>
    );
}
