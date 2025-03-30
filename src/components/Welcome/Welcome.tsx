import React, { memo } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import WelcomeHeader from './WelcomeHeader';
import { Details, Highlights, Overview } from './WelcomeSections';

const logoUrl = "https://www.tricare.mil/About/-/media/69C0BE06D96345CC872565890A0CC4B1.ashx";

function Welcome() {
    return (
        <ContentLayout
            headerVariant={'high-contrast'}
            header={<WelcomeHeader logoUrl={logoUrl} />}
            defaultPadding={true}
            disableOverlap={true}
        >
            <main className="mt-5">
                <SpaceBetween size={'l'}>
                    <Overview />
                    <Highlights />
                    <Details />
                </SpaceBetween>
            </main>
        </ContentLayout>
    );
}

export default memo(Welcome);
