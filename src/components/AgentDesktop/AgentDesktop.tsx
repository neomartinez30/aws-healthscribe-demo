import React, { useEffect, useRef } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import "amazon-connect-streams";

import styles from './AgentDesktop.module.css';

export default function AgentDesktop() {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceURL = "https://neoathome2024.my.connect.aws/ccp-v2/softphone";";

    useEffect(() => {
        if (containerRef.current) {
            // Initialize the CCP
            connect.core.initCCP(containerRef.current, {
                ccpUrl: instanceURL,
                loginPopup: true,
                loginPopupAutoClose: true,
                loginOptions: {
                    autoClose: true,
                    height: 600,
                    width: 400,
                    top: 0,
                    left: 0,
                },
                region: 'es-east-1',
                softphone: {
                    allowFramedSoftphone: true,
                    disableRingtone: false,
                    allowFramedVideoCall: true,
                    allowFramedScreenSharing: true,
                    allowFramedScreenSharingPopUp: true,
                    VDIPlatform: undefined,
                    allowEarlyGum: true,
                },
                task: {
                    disableRingtone: false,
                },
                pageOptions: {
                    enableAudioDeviceSettings: false,
                    enableVideoDeviceSettings: false,
                    enablePhoneTypeSettings: true,
                },
                ccpAckTimeout: 5000,
                ccpSynTimeout: 3000,
                ccpLoadTimeout: 10000,
            });
        }
    }, []);

    return (
        <ContentLayout
            headerVariant={'high-contrast'}
            header={
                <Header
                    variant="h1"
                    description="Amazon Connect Contact Control Panel (CCP)"
                >
                    Agent Desktop
                </Header>
            }
        >
            <Container>
                <div 
                    ref={containerRef} 
                    className={styles.ccpContainer}
                />
            </Container>
        </ContentLayout>
    );
}
