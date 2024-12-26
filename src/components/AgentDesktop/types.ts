export type AgentState = 'Available' | 'Offline';

export interface ConnectConfig {
  ccpUrl: string;
  loginPopup: boolean;
  loginPopupAutoClose: boolean;
  loginOptions: {
    autoClose: boolean;
    height: number;
    width: number;
  };
  softphone: {
    allowFramedSoftphone: boolean;
    disableRingtone: boolean;
  };
  region: string;
}

export interface Contact {
  getInitialConnection: () => any;
  getAttributes: () => any;
  getQueue: () => any;
  isOnHold: () => boolean;
  isMuted: () => boolean;
  accept: () => void;
  destroy: (options: any) => void;
  hold: () => void;
  resume: () => void;
  onConnecting: (handler: () => void) => void;
  onConnected: (handler: () => void) => void;
  onEnded: (handler: () => void) => void;
}

export interface Agent {
  getState: () => any;
  onStateChange: (handler: (state: any) => void) => void;
  setState: (state: any, options: any) => void;
  getAgentStates: () => any[];
}

export interface CustomerProfile {
  name: string;
  id: string;
  phone: string;
  queue: string;
  verification: string;
}