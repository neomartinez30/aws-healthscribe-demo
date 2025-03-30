import React, { memo } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import WelcomeHeader from './WelcomeHeader';
import { Details, Highlights, Overview } from './WelcomeSections';

const logoUrl = "https://health.mil/-/media/Images/MHS/Infographics/DHA-Logo.svg?h=60&iar=0&w=138&hash=5890E798CDC400D0742649D53B4BD1694BC89A7F";

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
