import React, { KeyboardEvent } from 'react';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

type ChatInputProps = {
    message: string;
    onMessageChange: (message: string) => void;
    onSend: () => void;
};

export function ChatInput({ message, onMessageChange, onSend }: ChatInputProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSend();
        }
    };

    return (
        <SpaceBetween size="xs" direction="horizontal">
            <Input
                value={message}
                onChange={({ detail }) => onMessageChange(detail.value)}
                placeholder="Type your message..."
                onKeyDown={handleKeyDown}
            />
            <Button onClick={onSend}>Send</Button>
        </SpaceBetween>
    );
}
