import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@cloudscape-design/components/app-layout';
import Flashbar from '@cloudscape-design/components/flashbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import SuspenseLoader from '@/components/SuspenseLoader';
import TopNav from '@/components/TopNav';
import Welcome from '@/components/Welcome';
import { useAuthContext } from '@/store/auth';
import { useNotificationsContext } from '@/store/notifications';
import InsightsContextProvider from '@/store/insights';

const PatientInsights = lazy(() => import('@/components/PatientInsights'));

// Lazy components
const Debug = lazy(() => import('@/components/Debug'));
const Settings = lazy(() => import('@/components/Settings'));
const Conversations = lazy(() => import('@/components/Conversations'));
const Conversation = lazy(() => import('@/components/Conversation'));
const NewConversation = lazy(() => import('@/components/NewConversation'));
const GenerateAudio = lazy(() => import('@/components/GenerateAudio'));
const PatientInsights = lazy(() => import('@/components/PatientInsights'));
const AgentDesktop = lazy(() => import('@/components/AgentDesktop'));

export default function App() {
    const { isUserAuthenticated } = useAuthContext();
    const { flashbarItems } = useNotificationsContext();

    return (
        <>
            <div id="appTopNav">
                <TopNav />
            </div>
            <AppLayout
                breadcrumbs={<Breadcrumbs />}
                content={
                    <InsightsContextProvider>
                        <Suspense fallback={<SuspenseLoader />}>
                            {isUserAuthenticated ? (
                                <Routes>
                                    <Route index element={<Welcome />} />
                                    <Route path="/patient-insights" element={<PatientInsights />} />
                                    {/* ... other routes */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            ) : (
                                <Routes>
                                    <Route path="*" element={<Welcome />} />
                                </Routes>
                            )}
                        </Suspense>
                    </InsightsContextProvider>
                }
                headerSelector="#appTopNav"
                headerVariant="high-contrast"
                notifications={<Flashbar items={flashbarItems} />}
                toolsHide={true}
                navigationHide={true}
                contentType="default"
                disableContentPaddings={false}
                maxContentWidth={1280}
            />
        </>
    );
}