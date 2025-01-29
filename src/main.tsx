// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Box from '@cloudscape-design/components/box';
import { I18nProvider, importMessages } from '@cloudscape-design/components/i18n';
import '@cloudscape-design/global-styles/index.css';
import './index.css'; // Import global styles
import { Authenticator } from '@aws-amplify/ui-react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import AppSettingsContextProvider from '@/store/appSettings';
import AppThemeContextProvider from '@/store/appTheme';
import AuthContextProvider from '@/store/auth';
import NotificationsContextProvider from '@/store/notifications';

import { App } from './components';

const locale = document.documentElement.lang;
const messages = await importMessages(locale);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <I18nProvider locale={locale} messages={messages}>
                <Authenticator.Provider>
                    <AuthContextProvider>
                        <AppThemeContextProvider>
                            <AppSettingsContextProvider>
                                <NotificationsContextProvider>
                                    <App />
                                    <Box>
                                        <Toaster position="bottom-left" reverseOrder={false} />
                                    </Box>
                                </NotificationsContextProvider>
                            </AppSettingsContextProvider>
                        </AppThemeContextProvider>
                    </AuthContextProvider>
                </Authenticator.Provider>
            </I18nProvider>
        </BrowserRouter>
    </React.StrictMode>
);