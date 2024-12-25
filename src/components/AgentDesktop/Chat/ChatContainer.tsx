// src/components/AgentDesktop/Chat/ChatContainer.tsx
import React from 'react';
import Box from '@cloudscape-design/components/box';
import { ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from './ChatMessage';

export function ChatContainer({ messages }: { messages: ChatMessageType[] }) {
    return (
        <Box padding="s">
            <div style={{ height: '300px', overflowY: 'auto' }}>
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
            </div>
        </Box>
    );
}
