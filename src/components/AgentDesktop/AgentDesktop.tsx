import React, { useEffect, useState } from 'react';
import { Settings, Bell, Send } from 'lucide-react';
import 'amazon-connect-streams';
import { TransferType, AgentStateType } from 'amazon-connect-streams';
import { DatabaseSettings } from './DatabaseSettings';
import { ChatPanel } from './ChatPanel';
import styles from './AgentDesktop.module.css';
import SchedulingForm from './SchedulingForm';
import { ProviderLocator } from './ProviderLocator';
import FHIRSectionSummary from "./FHIRSectionSummary";
import MedicalSummary from './MedicalSummary';

interface Provider {
    id: string;
    name: string;
    specialty: string;
    address: string;
    zip: string;
    availability: string;
}

interface CustomerProfile {
    name: string;
    id: string;
    phone: string;
    queue: string;
    verification: string;
}

const MOCK_PROVIDERS: Provider[] = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', address: '123 Medical Ave', zip: '20001', availability: 'Next available: Tomorrow 2pm' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Family Medicine', address: '456 Health St', zip: '20002', availability: 'Next available: Today 4pm' },
    { id: '3', name: 'Dr. Emily Williams', specialty: 'Pediatrics', address: '789 Care Ln', zip: '20003', availability: 'Next available: Friday 10am' },
    { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics', address: '321 Wellness Rd', zip: '20004', availability: 'Next available: Monday 9am' },
];

const AgentDesktop: React.FC = () => {
    const [agentState, setAgentState] = useState<string>('Offline');
    const [contact, setContact] = useState<any>(null);
    const [agent, setAgent] = useState<any>(null);
    const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
        name: "",
        id: "",
        phone: "",
        queue: "",
        verification: ""
    });
    const [activeTab, setActiveTab] = useState(1);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { text: "Hello! How can I help you today?", isUser: false },
        { text: "I need some assistance please", isUser: true },
        { text: "Of course! I'm here to help. What do you need?", isUser: false }
    ]);

    useEffect(() => {
        // Initialize CCP
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

            connect.core.initCCP(containerDiv, ccpParams);

            // Subscribe to agent state changes
            connect.agent((agent: any) => {
                setAgent(agent);
                agent.onStateChange((state: any) => {
                    setAgentState(state.name);
                });

                // Get initial agent state
                const initialState = agent.getState();
                if (initialState) {
                    setAgentState(initialState.name);
                }
            });

            // Subscribe to contact events
            connect.contact((contact: any) => {
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                       
                    >
                        New Session
                    </button>
                    <button 
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
                            <div id="ccp-container" style={{ width: '100%', height: '100%' }}></div>
                        </div>
                    </div>

                    {/* Medical Insights */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-blue-600" />
                            Medical Insights
                        </h2>
                        <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                            <MedicalSummary />
                        </div>
                    </div>
                </div>

                {/* Agent Tools Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Agent Tools</h2>
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 1, label: "FHIR Summary" },
                                { id: 2, label: "Provider Locator" },
                                { id: 3, label: "Settings" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mt-4 min-h-[150px]">
                        {activeTab === 1 && <FHIRSectionSummary />}
                        {activeTab === 2 && <ProviderLocator />}
                        {activeTab === 3 && <DatabaseSettings />}
                    </div>
                </div>

                {/* Last Row */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Triage */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Triage</h2>
                        <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                            <SchedulingForm />
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