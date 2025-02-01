import React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Container from '@cloudscape-design/components/container';

export function ChatPanel() {
    return (
        <SpaceBetween size="l">
            <Container>
                <iframe
                    src="https://patientinsights.gnaldemo.com/"
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 400px)', // Adjusted for AgentDesktop layout
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: 'white'
                    }}
                    title="Patient Insights"
                />
            </Container>
        </SpaceBetween>
    );
}