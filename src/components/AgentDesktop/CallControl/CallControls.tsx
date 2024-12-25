import React from 'react';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { AgentState } from '../types';

type CallControlsProps = {
    agentState: AgentState;
    onStateChange: (newState: AgentState) => void;
};

export function CallControls({ agentState, onStateChange }: CallControlsProps) {
    return (
        <SpaceBetween size="s" direction="horizontal">
            <Button
                disabled={agentState === 'On Call'}
                onClick={() => onStateChange('Available')}
                variant={agentState === 'Available' ? 'primary' : 'normal'}
            >
                Available
            </Button>
            <Button
                disabled={agentState !== 'Available'}
                onClick={() => onStateChange('On Call')}
            >
                Accept Call
            </Button>
            <Button
                disabled={agentState !== 'On Call'}
                onClick={() => onStateChange('After Call Work')}
            >
                End Call
            </Button>
            <Button
                disabled={agentState !== 'After Call Work'}
                onClick={() => onStateChange('Offline')}
            >
                Complete Work
            </Button>
        </SpaceBetween>
    );
}
