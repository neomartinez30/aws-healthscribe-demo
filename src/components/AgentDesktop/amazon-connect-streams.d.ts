declare module 'amazon-connect-streams' {
    export const TransferType: any;
    export const AgentStateType: any;
    export function initCCP(container: HTMLElement, options: any): void;
    export const core: {
        initCCP(container: HTMLElement, options: any): void;
    };
    export const agent: (callback: (agent: any) => void) => void;
    export const contact: (callback: (contact: any) => void) => void;
}
