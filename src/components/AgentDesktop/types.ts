// src/components/AgentDesktop/types.ts
export type AgentState = 'Offline' | 'Available' | 'On Call' | 'After Call Work';

export type ChatMessage = {
    id: string;
    sender: 'agent' | 'customer';
    text: string;
    timestamp: Date;
};
