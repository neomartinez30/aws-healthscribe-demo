import React, { useEffect, useState } from 'react';
import { Settings, Bell, Send } from 'lucide-react';
import 'amazon-connect-streams';

type Contact = any;
type Agent = any;

interface Message {
  text: string;
  isUser: boolean;
}

interface CustomerProfile {
  name: string;
  id: string;
  phone: string;
  queue: string;
  verification: string;
}

const AgentDesktop: React.FC = () => {
  const [agentState, setAgentState] = useState<string>('Offline');
  const [contact, setContact] = useState<Contact | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
    name: "",
    id: "",
    phone: "",
    queue: "",
    verification: ""
  });
  const [activeTab, setActiveTab] = useState(1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isUser: false },
    { text: "I need some assistance please", isUser: true },
    { text: "Of course! I'm here to help. What do you need?", isUser: false }
  ]);

  useEffect(() => {
    const connectUrl = process.env.CONNECT_INSTANCE_URL || "https://neoathome2024.my.connect.aws";
    const containerDiv = document.getElementById("ccp-container");

    if (!containerDiv) {
      console.error('CCP container element not found');
      return;
    }

    try {
      const ccpParams = {
        ccpUrl: `${connectUrl}/ccp-v2/`,
        loginPopup: true,
        loginPopupAutoClose: true,
        loginOptions: {
          autoClose: true,
          height: 600,
          width: 400,
        },
        softphone: {
          allowFramedSoftphone: true,
          disableRingtone: false
        },
        region: process.env.CONNECT_REGION || "us-east-1"
      };

      // @ts-ignore
      connect.core.initCCP(containerDiv, ccpParams);

      // @ts-ignore
      connect.agent((agent: Agent) => {
        setAgent(agent);
        agent.onStateChange((state: { name: string }) => {
          setAgentState(state.name);
        });

        const initialState = agent.getState();
        if (initialState) {
          setAgentState(initialState.name);
        }
      });

      // @ts-ignore
      connect.contact((contact: Contact) => {
        setContact(contact);

        contact.onConnecting(() => {
          console.log('Incoming contact connecting...');
        });

        contact.onConnected(() => {
          const attributes = contact.getAttributes();
          setCustomerProfile({
            name: attributes.name?.value || "Unknown",
            id: attributes.customerId?.value || "Unknown",
            phone: contact.getInitialConnection().getAddress() || "",
            queue: contact.getQueue()?.name || "",
            verification: attributes.verified?.value || "Pending"
          });
        });

        contact.onEnded(() => {
          setContact(null);
          setCustomerProfile({
            name: "",
            id: "",
            phone: "",
            queue: "",
            verification: ""
          });
        });
      });

    } catch (error) {
      console.error(`Failed to initialize CCP: ${error}`);
    }
  }, []);

  const handleNewSession = () => {
    handleStateChange('Available');
  };

  const handleEndCall = () => {
    if (contact) {
      try {
        contact.destroy({
          success: () => {
            console.log('Call has been terminated successfully');
          },
          failure: (err: any) => {
            console.error(`Failed to end call: ${err}`);
          }
        });
      } catch (error) {
        console.error(`Failed to end call: ${error}`);
      }
    }
  };

  const handleStateChange = async (newState: string) => {
    if (agent) {
      try {
        const stateToSet = {
          name: newState,
          // @ts-ignore
          type: connect.AgentStateType.ROUTABLE
        };

        await agent.setState(stateToSet, {
          success: () => {
            console.log(`Agent state changed to ${newState}`);
          },
          failure: (err: any) => {
            console.error(`Failed to change state: ${err}`);
          }
        });
      } catch (error) {
        console.error(`Failed to change state: ${error}`);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">Medical Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button 
            onClick={handleNewSession}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Session
          </button>
          <button 
            onClick={handleEndCall}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            End Call
          </button>
        </div>

        {/* First Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Caller Attributes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Caller Attributes
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              <div id="ccp-container" style={{ width: '100%', height: '200px' }}></div>
            </div>
          </div>

          {/* Medical Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Medical Insights
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              {/* Content will go here */}
            </div>
          </div>
        </div>

        {/* Agent Tools Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Agent Tools</h2>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[1, 2, 3].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tab {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mt-4 min-h-[150px]">
            {activeTab === 1 && <div>Content for Tab 1</div>}
            {activeTab === 2 && <div>Content for Tab 2</div>}
            {activeTab === 3 && <div>Content for Tab 3</div>}
          </div>
        </div>

        {/* Last Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Triage */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Triage</h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              {/* Content will go here */}
            </div>
          </div>

          {/* Chat Box */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDesktop;