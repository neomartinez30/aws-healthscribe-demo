import { useState, useEffect, useRef } from 'react';
import { Button } from '@cloudscape-design/components';
import Icon from "@cloudscape-design/components/icon";

interface SidebarProps {
    isScriptVisible: boolean;
    handleScriptButtonClick: () => void;
}

const Sidebar: React.FC = () => {
    const [isSoftphoneVisible, setIsSoftphoneVisible] = useState(false);
    const softphoneContainerRef = useRef<HTMLDivElement>(null);

    const handleSoftphoneButtonClick = () => {
        setIsSoftphoneVisible(!isSoftphoneVisible);
    };

    useEffect(() => {
        const onIncomingCall = () => {
            setIsSoftphoneVisible(true);
        };

        window.addEventListener('genesys-incoming-call', onIncomingCall);

        return () => {
            window.removeEventListener('genesys-incoming-call', onIncomingCall);
        };
    }, []);

    const handleVideoMeetingClick = () => {
        // Logic to start or join a Chime meeting
    };

    return (
        <div style={{ position: 'fixed', left: '0px', top: '0px', height: '100vh', backgroundColor: '#2f2937', color: '#ffffff', boxShadow: '0 0 10px rgba(0,0,0,0.5)', zIndex: 1000 }}
        //className="fixed top-0 left-0 h-screen bg-gray-800 shadow-lg text-white"
        >


            {/* Genesys Softphone Integration */}
            <div style={{ position: 'absolute', bottom: '0px', left: '0px', width: '100%' }} ref={softphoneContainerRef}>
                <div style={{ position: 'absolute', bottom: '15px', left: '10px' }}>
                    <Button
                        iconName='call' variant={isSoftphoneVisible ? "primary" : "link"} onClick={handleSoftphoneButtonClick}>
                    </Button>
                </div>

                <div
                    style={{ bottom: '550px', left: 30, width: '200px', position: 'absolute', transform: 'translate(0, 0)', zIndex: 10, display: isSoftphoneVisible ? 'block' : 'none' }}

                >
                    <div className='softphone'>
                        <iframe
                            id="softphone"
                            allow="camera *; microphone *; autoplay *; hid *"
                            src="https://placeholder.apps.mypurecloud.com/crm/embeddableFramework.html"
                            style={{ width: '300px', height: '530px', border: 'none', position: 'fixed', top: '10px', left: '10px' }}
                        >
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;