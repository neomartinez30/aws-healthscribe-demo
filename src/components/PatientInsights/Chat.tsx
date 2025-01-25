import React, { useState } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { streamBedrock } from '@/utils/BedrockApi';
import { PROMPTS } from '@/utils/prompts';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatProps {
    patientData: any;
    disabled?: boolean;
}

export default function Chat({ patientData, disabled = false }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const context = PROMPTS.CHAT_CONTEXT.replace('{{data}}', JSON.stringify(patientData, null, 2));
            const prompt = `${context}\n\nQuestion: ${input}\n\nAnswer:`;

            let responseContent = '';
            await streamBedrock(prompt, undefined, (chunk) => {
                responseContent += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    if (newMessages[newMessages.length - 1].role === 'assistant') {
                        newMessages[newMessages.length - 1].content = responseContent;
                    } else {
                        newMessages.push({ role: 'assistant', content: responseContent });
                    }
                    return newMessages;
                });
            });
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error processing your question. Please try again.' 
            }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container
            header={
                <Header variant="h2">
                    Ask Questions About Patient Data
                </Header>
            }
        >
            <SpaceBetween size="l">
                <div style={{ height: '400px', overflowY: 'auto' }}>
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            margin={{ bottom: 's' }}
                            padding="s"
                            color={message.role === 'assistant' ? 'text-status-info' : 'text-status-success'}
                        >
                            <Box fontWeight="bold" margin={{ bottom: 'xxxs' }}>
                                {message.role === 'assistant' ? 'Assistant' : 'You'}
                            </Box>
                            <Box variant="p">{message.content}</Box>
                        </Box>
                    ))}
                </div>

                <SpaceBetween direction="horizontal" size="xs">
                    <Input
                        value={input}
                        onChange={({ detail }) => setInput(detail.value)}
                        placeholder="Ask a question about the patient data..."
                        disabled={disabled || loading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    <Button
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={disabled || !input.trim()}
                    >
                        Send
                    </Button>
                </SpaceBetween>
            </SpaceBetween>
        </Container>
    );
}