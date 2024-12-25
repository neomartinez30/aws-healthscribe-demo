import React, { useState } from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';

import styles from './AgentDesktop.module.css';

// Placeholder for Connect Streams integration
const mockCustomerProfile = {
    name: "John Doe",
    id: "12345",
    dob: "1980-01-01",
    phone: "+1 (555) 123-4567",
    status: "Connected"
};

export default function AgentDesktop() {
    const [isMuted, setIsMuted] = useState(false);
    const [isOnHold, setIsOnHold] = useState(false);

    // Placeholder functions for Connect Streams integration
    const handleMute = () => {
        setIsMuted(!isMuted);
        // TODO: Implement Connect Streams mute functionality
    };

    const handleHold = () => {
        setIsOnHold(!isOnHold);
        // TODO: Implement Connect Streams hold functionality
    };

    const handleEndCall = () => {
        // TODO: Implement Connect Streams end call functionality
        console.log("End call");
    };

    return (
        <ContentLayout
            header={
                <Header
                    variant="h1"
                    description="Agent workspace for handling patient interactions"
                >
                    Agent Desktop
                </Header>
            }
        >
            <div className={styles.container}>
                {/* Top Box - Call Controls and Customer Profile */}
                <div className={styles.topBox}>
                    <div className={styles.profileSection}>
                        <div className={styles.avatar}>
                            <Icon name="user-profile" size="big" />
                        </div>
                        <div className={styles.profileInfo}>
                            <SpaceBetween size="s">
                                <Box variant="h2">{mockCustomerProfile.name}</Box>
                                <SpaceBetween size="xs" direction="horizontal">
                                    <Box variant="small">ID: {mockCustomerProfile.id}</Box>
                                    <Box variant="small">DOB: {mockCustomerProfile.dob}</Box>
                                    <Box variant="small">Phone: {mockCustomerProfile.phone}</Box>
                                    <Badge color="green">{mockCustomerProfile.status}</Badge>
                                </SpaceBetween>
                            </SpaceBetween>
                        </div>
                    </div>
                    <div className={styles.controlsSection}>
                        <Button
                            iconName={isMuted ? "microphone-off" : "microphone"}
                            variant="icon"
                            onClick={handleMute}
                        />
                        <Button
                            iconName={isOnHold ? "status-negative" : "status-positive"}
                            variant="icon"
                            onClick={handleHold}
                        />
                        <Button
                            iconName="close"
                            variant="primary"
                            onClick={handleEndCall}
                        >
                            End Call
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={styles.mainContent}>
                    {/* Left Panel */}
                    <div className={styles.leftPanel}>
                        {/* Video Section */}
                        <div className={styles.videoSection}>
                            <Box variant="h3">Telemedicine Video</Box>
                            <Box variant="p" color="text-status-inactive">
                                Video stream will appear here when connected
                            </Box>
                        </div>

                        {/* Chat Section */}
                        <div className={styles.chatSection}>
                            <Box variant="h3">Chat</Box>
                            <Box variant="p" color="text-status-inactive">
                                Chat messages will appear here
                            </Box>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className={styles.rightPanel}>
                        <Box variant="h3">Patient Medical History</Box>
                        <Box variant="p" color="text-status-inactive">
                            Patient medical history will be displayed here
                        </Box>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
}
