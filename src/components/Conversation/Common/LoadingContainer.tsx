import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Spinner from '@cloudscape-design/components/spinner';

type LoadingContainerProps = {
    containerTitle: string;
    text?: string;
};

export default function LoadingContainer({ containerTitle, text }: LoadingContainerProps) {
    return (
        <Container header={<Header variant="h2">{containerTitle}</Header>}>
            <div className="flex items-center justify-center min-h-[300px]">
                <Spinner /> {text}
            </div>
        </Container>
    );
}
