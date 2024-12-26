import { useState, useEffect } from 'react';
import { useNotificationsContext } from '@/store/notifications';
import { ConnectConfig, Contact, Agent } from '../types';

// Extend the window interface to include the connect property
declare global {
  interface Window {
    connect: any;
  }
}

export const useConnect = (config: ConnectConfig) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const { addFlashMessage } = useNotificationsContext();

  useEffect(() => {
    const initializeCCP = async () => {
      try {
        const containerDiv = document.getElementById("ccp-container");
        if (!containerDiv) {
          throw new Error('CCP container element not found');
        }

        window.connect.core.initCCP(containerDiv, config);

        // Subscribe to agent events
        window.connect.agent((agent: Agent) => {
          setAgent(agent);
          agent.onStateChange((state: any) => {
            setAgentState(state.name);
          });
        });

        // Subscribe to contact events  
        window.connect.contact((contact: Contact) => {
          setupContactHandlers(contact);
        });
      } catch (error) {
        addFlashMessage({ type: 'error', content: (error as Error).message });
      }
    };

    initializeCCP();
  }, [config, addFlashMessage]);

  const setAgentState = (state: string) => {
    // Implement the logic to set the agent state
  };

  const setupContactHandlers = (contact: Contact) => {
    // Implement the logic to handle contact events
  };

  return { agent, contact };
};