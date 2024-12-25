// src/components/AgentDesktop/AgentCallControl.tsx
import React, { useEffect, useState } from 'react';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Tabs from '@cloudscape-design/components/tabs';
import { AgentState, ChatMessage } from './types';
import { StatusDisplay } from './CallControl/StatusDisplay';
import { ChatContainer } from './Chat/ChatContainer';
import { ChatInput } from './Chat/ChatInput';
import { CallControls } from './CallControl/CallControls';

export default function AgentCallControl() {
    const [agentState, setAgentState] = useState<AgentState>('Offline');
    const [callDuration, setCallDuration] = useState<number>(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timer]);

    const handleStateChange = (newState: AgentState) => {
        setAgentState(newState);
        if (newState === 'On Call') {
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

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            const newMessage: ChatMessage = {
                id: Date.now().toString(),
                sender: 'agent',
                text: chatMessage,
                timestamp: new Date()
            };
            setChatMessages([...chatMessages, newMessage]);
            setChatMessage('');
        }
    };

    return (
        <SpaceBetween size="l">
            <Tabs
                tabs={[
                    {
                        label: "Call Controls",
                        id: "call-controls",
                        content: (
                            <SpaceBetween size="l">
                                <StatusDisplay agentState={agentState} callDuration={callDuration} />
                                <CallControls agentState={agentState} onStateChange={handleStateChange} />
                            </SpaceBetween>
                        )
                    },
                    {
                        label: "Chat",
                        id: "chat",
                        content: (
                            <SpaceBetween size="l">
                                <Box variant="h2">Chat</Box>
                                <ChatContainer messages={chatMessages} />
                                <ChatInput 
                                    message={chatMessage}
                                    onMessageChange={setChatMessage}
                                    onSend={handleSendMessage}
                                />
                            </SpaceBetween>
                        )
                    }
                ]}
            />
        </SpaceBetween>
    );
}
