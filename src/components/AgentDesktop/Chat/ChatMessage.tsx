// src/components/AgentDesktop/Chat/ChatMessage.tsx
import React from 'react';
import Box from '@cloudscape-design/components/box';
import { ChatMessage as ChatMessageType } from '../types';

export function ChatMessage({ message }: { message: ChatMessageType }) {
    return (
        <Box
            margin={{ bottom: 'xs' }}
            textAlign={message.sender === 'agent' ? 'right' : 'left'}
        >
            <Box
                color={message.sender === 'agent' ? 'text-status-info' : 'text-status-inactive'}
                padding="s"
                variant="p"
            >
                {message.text}
                <Box variant="small" color="text-body-secondary">
                    {message.timestamp.toLocaleTimeString()}
                </Box>
            </Box>
        </Box>
    );
}
