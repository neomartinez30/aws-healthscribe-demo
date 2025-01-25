import React, { useEffect, useState } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import { useAuthContext } from '@/store/auth';

export default function PatientInsights() {
    const { isUserAuthenticated } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);
    const [streamlitUrl, setStreamlitUrl] = useState('');

    useEffect(() => {
        // In production, this would be your deployed Streamlit URL
        setStreamlitUrl('http://localhost:8501');
        setIsLoading(false);
    }, []);

    if (!isUserAuthenticated) {
        return (
            <ContentLayout header={<Header variant="h1">Patient Insights</Header>}>
                <Container>
                    Please sign in to access Patient Insights.
                </Container>
            </ContentLayout>
        );
    }

    if (isLoading) {
        return (
            <ContentLayout header={<Header variant="h1">Patient Insights</Header>}>
                <Container>
                    <SpaceBetween size="m">
                        <Spinner size="large" />
                        <div>Loading Patient Insights...</div>
                    </SpaceBetween>
                </Container>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout header={<Header variant="h1">Patient Insights</Header>}>
            <Container>
                <iframe
                    src={streamlitUrl}
                    width="100%"
                    height="800px"
                    style={{
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    title="Patient Insights"
                />
            </Container>
        </ContentLayout>
    );
}