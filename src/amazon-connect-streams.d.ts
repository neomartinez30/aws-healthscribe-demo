declare module 'amazon-connect-streams' {
    export interface CCPOptions {
        ccpUrl: string;
        loginPopup?: boolean;
        loginPopupAutoClose?: boolean;
        loginOptions?: {
            autoClose?: boolean;
            height?: number;
            width?: number;
            top?: number;
            left?: number;
        };
        softphone?: {
            allowFramedSoftphone?: boolean;
            disableRingtone?: boolean;
            ringtoneUrl?: string;
        };
    }

    export interface Agent {
        getState(): AgentState;
        // Add additional agent-specific methods here
    }

    export interface AgentState {
        name: string;
        type: string;
        duration: number;
    }

    export interface Contact {
        getContactId(): string;
        getType(): string;
        // Add additional contact-specific methods here
    }

    export const TransferType: {
        [key: string]: string; // Replace with actual transfer type keys and values if known
    };

    export const AgentStateType: {
        [key: string]: string; // Replace with actual agent state keys and values if known
    };

    export function initCCP(container: HTMLElement, options: CCPOptions): void;

    export const core: {
        initCCP(container: HTMLElement, options: CCPOptions): void;
    };

    export const agent: (callback: (agent: Agent) => void) => void;

    export const contact: (callback: (contact: Contact) => void) => void;
}
