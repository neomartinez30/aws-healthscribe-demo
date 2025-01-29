import React, { useState } from 'react';
import { Settings, Bell, Send } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

const AgentDesktop: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isUser: false },
    { text: "I need some assistance please", isUser: true },
    { text: "Of course! I'm here to help. What do you need?", isUser: false }
  ]);

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
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">12345</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Medical Insights
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Last Visit</p>
                  <p className="text-sm text-gray-500">March 15, 2024</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Primary Care</p>
                  <p className="text-sm text-gray-500">Dr. Sarah Johnson</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Allergies</p>
                  <p className="text-sm text-gray-500">Penicillin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Tools Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Agent Tools</h2>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 1, name: "FHIR Summary" },
                { id: 2, name: "Provider Locator" },
                { id: 3, name: "Settings" }
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
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mt-4 min-h-[150px]">
            {activeTab === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900">Patient History</h3>
                  <p className="text-sm text-gray-500">View detailed patient history</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900">Medications</h3>
                  <p className="text-sm text-gray-500">Current prescriptions</p>
                </div>
              </div>
            )}
            {activeTab === 2 && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search providers..."
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900">Dr. Smith</h3>
                    <p className="text-sm text-gray-500">Cardiologist</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900">Dr. Johnson</h3>
                    <p className="text-sm text-gray-500">Primary Care</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900">Preferences</h3>
                  <p className="text-sm text-gray-500">Configure dashboard settings</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Last Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Triage */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Triage</h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900">Current Symptoms</h3>
                  <p className="text-sm text-gray-500">Record patient symptoms</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900">Urgency Level</h3>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
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