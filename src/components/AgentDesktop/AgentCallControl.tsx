import React, { useEffect, useState } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

// Mock Connect CCP states and functions for now
const AGENT_STATES = {
    OFFLINE: 'Offline',
    AVAILABLE: 'Available',
    ON_CALL: 'On Call',
    AFTER_CALL_WORK: 'After Call Work'
} as const;

type AgentState = typeof AGENT_STATES[keyof typeof AGENT_STATES];

export default function AgentCallControl() {
    const [agentState, setAgentState] = useState<AgentState>(AGENT_STATES.OFFLINE);
    const [callDuration, setCallDuration] = useState<number>(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Mock initialization of Connect CCP
        console.log('Initializing Connect CCP...');
        return () => {
            if (timer) clearInterval(timer);
        };
    }, []);

    const handleStateChange = (newState: AgentState) => {
        setAgentState(newState);
        if (newState === AGENT_STATES.ON_CALL) {
            const interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
            setTimer(interval);
        } else {
            if (timer) {
                clearInterval(timer);
                setTimer(null);
            }
            setCallDuration(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SpaceBetween size="l">
            <Box variant="h2">Call Control</Box>
            
            <SpaceBetween size="s">
                <Box>
                    <Box variant="awsui-key-label">Agent Status</Box>
                    <StatusIndicator
                        type={agentState === AGENT_STATES.AVAILABLE ? 'success' : 'pending'}
                    >
                        {agentState}
                    </StatusIndicator>
                </Box>

                {agentState === AGENT_STATES.ON_CALL && (
                    <Box>
                        <Box variant="awsui-key-label">Call Duration</Box>
                        <Box>{formatTime(callDuration)}</Box>
                    </Box>
                )}
            </SpaceBetween>

            <SpaceBetween size="s" direction="horizontal">
                <Button
                    variant={agentState === AGENT_STATES.AVAILABLE ? 'primary' : 'normal'}
                    onClick={() => handleStateChange(AGENT_STATES.AVAILABLE)}
                    disabled={agentState === AGENT_STATES.ON_CALL}
                >
                    Available
                </Button>
                <Button
                    variant="normal"
                    onClick={() => handleStateChange(AGENT_STATES.OFFLINE)}
                    disabled={agentState === AGENT_STATES.ON_CALL}
                >
                    Offline
                </Button>
            </SpaceBetween>

            {agentState === AGENT_STATES.ON_CALL && (
                <SpaceBetween size="s">
                    <Button 
                        variant="primary"
                        onClick={() => handleStateChange(AGENT_STATES.AFTER_CALL_WORK)}
                    >
                        End Call
                    </Button>
                    <Button>Hold</Button>
                    <Button>Mute</Button>
                </SpaceBetween>
            )}

            {agentState === AGENT_STATES.AFTER_CALL_WORK && (
                <Button
                    variant="primary"
                    onClick={() => handleStateChange(AGENT_STATES.AVAILABLE)}
                >
                    Complete After Call Work
                </Button>
            )}
        </SpaceBetween>
    );
}
