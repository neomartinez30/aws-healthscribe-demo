import { useState, useEffect } from 'react';
import { useNotificationsContext } from '@/store/notifications';
import { ConnectConfig, Contact, Agent } from '../types';

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
          setContact(contact);
          setupContactHandlers(contact);
        });

      } catch (error) {
        addFlashMessage({
          id: 'ccp-init-error',
          header: 'CCP Error', 
          content: `Failed to initialize CCP: ${error}`,
          type: 'error'
        });
      }
    };

    initializeCCP();
  }, [config]);

  return {
    agent,
    contact
  };
};