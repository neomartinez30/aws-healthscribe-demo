import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@cloudscape-design/components/app-layout';
import SuspenseLoader from '@/components/SuspenseLoader';

// Lazy components
const Debug = lazy(() => import('@/components/Debug'));
const Settings = lazy(() => import('@/components/Settings'));
const Conversations = lazy(() => import('@/components/Conversations'));
const Conversation = lazy(() => import('@/components/Conversation'));
const NewConversation = lazy(() => import('@/components/NewConversation'));
const GenerateAudio = lazy(() => import('@/components/GenerateAudio'));
const PatientInsights = lazy(() => import('@/components/PatientInsights'));

export default function App() {
    const content = (
        <Suspense fallback={<SuspenseLoader />}>
            <Routes>
                <Route path="/" element={<PatientInsights />} />
                <Route path="/debug" element={<Debug />} />
                <Route path="/conversations" element={<Conversations />} />
                <Route path="/conversation/:conversationName" element={<Conversation />} />
                <Route path="/new" element={<NewConversation />} />
                <Route path="/generate" element={<GenerateAudio />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/PatientInsights" element={<PatientInsights />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );

    return (
        <AppLayout
            content={content}
            headerSelector="#appTopNav"
            contentType="default"
            disableContentPaddings={false}
            navigationHide={true}
            toolsHide={true}
            maxContentWidth={1280}
        />
    );
}
