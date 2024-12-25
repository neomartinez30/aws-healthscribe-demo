import React from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';

import AgentCallControl from './AgentCallControl';
import AgentWorkspace from './AgentWorkspace';

export default function AgentDesktop() {
    return (
        <ContentLayout
            headerVariant="high-contrast"
            header={
                <Header 
                    variant="h1" 
                    description="Amazon Connect agent desktop interface"
                >
                    Agent Desktop
                </Header>
            }
        >
            <Grid
                gridDefinition={[
                    { colspan: { default: 3, s: 4 } },
                    { colspan: { default: 9, s: 8 } }
                ]}
            >
                <Container>
                    <AgentCallControl />
                </Container>
                <Container>
                    <AgentWorkspace />
                </Container>
            </Grid>
        </ContentLayout>
    );
}
