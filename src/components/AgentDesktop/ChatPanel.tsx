import React, { useState, useEffect } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import Icon from '@cloudscape-design/components/icon';
import Spinner from '@cloudscape-design/components/spinner';

export function ChatPanel() {
    const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [streamlitUrl] = useState('http://localhost:8501');

    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
        
        try {
            // Send message to Streamlit iframe
            const iframe = document.getElementById('streamlit-chat') as HTMLIFrameElement;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'chat_input',
                    message: inputValue
                }, '*');
            }
            
            setInputValue('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Listen for messages from Streamlit iframe
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'chat_response') {
                setMessages(prev => [...prev, { role: 'assistant', content: event.data.message }]);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <SpaceBetween size="l">
            <Box padding="s">
                <div style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            margin={{ bottom: 's' }}
                            padding="s"
                            color={message.role === 'user' ? "text-body-secondary" : "text-status-info"}
                            variant="div"
                            textAlign={message.role === 'user' ? "right" : "left"}
                        >
                            <Box margin={{ bottom: 'xxxs' }}>
                                <Icon name={message.role === 'user' ? "user-profile" : "status-info"} />
                                <Box margin={{ left: 'xs' }} display="inline" fontWeight="bold">
                                    {message.role === 'user' ? 'You' : 'Assistant'}
                                </Box>
                            </Box>
                            <Box variant="p">{message.content}</Box>
                        </Box>
                    ))}
                </div>
            </Box>
            
            <Box padding={{ top: 's', bottom: 's' }} variant="div">
                <SpaceBetween size="s">
                    <Input
                        value={inputValue}
                        onChange={({ detail }) => setInputValue(detail.value)}
                        placeholder="Ask a question about the patient's medical history..."
                        disabled={isLoading}
                    />
                    <Button 
                        onClick={handleSubmit}
                        loading={isLoading}
                        disabled={!inputValue.trim()}
                    >
                        Send
                    </Button>
                </SpaceBetween>
            </Box>

            <iframe
                id="streamlit-chat"
                src={streamlitUrl}
                style={{ display: 'none' }}
                title="Streamlit Chat"
            />
        </SpaceBetween>
    );
}