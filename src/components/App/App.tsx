import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider, importMessages } from '@cloudscape-design/components/i18n';
import '@cloudscape-design/global-styles/index.css';
import './index.css';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import Box from '@cloudscape-design/components/box';

import AppSettingsContextProvider from '@/store/appSettings';
import AppThemeContextProvider from '@/store/appTheme';
import NotificationsContextProvider from '@/store/notifications';

import { App } from './components';

const locale = document.documentElement.lang;
const messages = await importMessages(locale);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <I18nProvider locale={locale} messages={messages}>
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
            </I18nProvider>
        </BrowserRouter>
    </React.StrictMode>
);
