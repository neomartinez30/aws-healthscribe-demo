// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { memo } from 'react';

import Alert from '@cloudscape-design/components/alert';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { useAuthContext } from '@/store/auth';

import styles from './Welcome.module.css';
import WelcomeHeader from './WelcomeHeader';
import { Details, Highlights, Overview } from './WelcomeSections';

const logoUrl = "https://sample-data-203918854345-22hcl401.s3.us-east-1.amazonaws.com/TRICARE_Logo_png.png";

function Welcome() {
    const { isUserAuthenticated } = useAuthContext();

    return (
        <ContentLayout
            headerVariant={'high-contrast'}
            header={<WelcomeHeader logoUrl={logoUrl} />}
            defaultPadding={true}
            disableOverlap={true}
        >
            <main className={styles.mainContents}>
                <SpaceBetween size={'l'}>
                    {!isUserAuthenticated && <Alert type="info">Log in for full functionality.</Alert>}
                    <Overview />
                    <Highlights />
                    <Details />
                </SpaceBetween>
            </main>
        </ContentLayout>
    );
}

export default memo(Welcome);
