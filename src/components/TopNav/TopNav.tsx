import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavigation from '@cloudscape-design/components/top-navigation';
import { TopNavigationProps } from '@cloudscape-design/components/top-navigation';
import { Density, Mode, applyDensity, applyMode } from '@cloudscape-design/global-styles';

import Auth from '@/components/Auth';
import ModalLoader from '@/components/SuspenseLoader/ModalLoader';
import { useAppThemeContext } from '@/store/appTheme';
import { useAuthContext } from '@/store/auth';

import './TopNav.css';

type TopNavClick = {
    detail: {
        id: string;
    };
};

export default function TopNav() {
    const navigate = useNavigate();
    const { isUserAuthenticated, user, signOut } = useAuthContext();
    const { appTheme, setAppThemeColor, setAppThemeDensity } = useAppThemeContext();
    const [authVisible, setAuthVisible] = useState(false);

    // Set app theme
    useEffect(() => {
        if (appTheme.color === 'appTheme.light') {
            applyMode(Mode.Light);
        } else if (appTheme.color === 'appTheme.dark') {
            applyMode(Mode.Dark);
        }

        if (appTheme.density === 'density.comfortable') {
            applyDensity(Density.Comfortable);
        } else if (appTheme.density === 'density.compact') {
            applyDensity(Density.Compact);
        }
    }, [appTheme]);

    useEffect(() => {
        if (isUserAuthenticated) {
            setAuthVisible(false);
        }
    }, [isUserAuthenticated]);

    function handleUtilVisualClick(e: TopNavClick) {
        switch (e.detail.id) {
            case 'appTheme.light':
                setAppThemeColor('appTheme.light');
                break;
            case 'appTheme.dark':
                setAppThemeColor('appTheme.dark');
                break;
            case 'density.comfortable':
                setAppThemeDensity('density.comfortable');
                break;
            case 'density.compact':
                setAppThemeDensity('density.compact');
                break;
            default:
                break;
        }
    }

    const mainMenuItems: TopNavigationProps.MenuDropdownItem[] = [
        {
            text: 'Conversations',
            href: '/conversations',
            id: 'conversations'
        },
        {
            text: 'Patient Insights',
            href: '/PatientInsights',
            id: 'insights'
        },
        {
            text: 'Agent Desktop',
            href: '/AgentDesktop',
            id: 'desktop'
        },
        { type: 'divider' },
        {
            text: 'Settings',
            href: '/settings',
            id: 'settings',
            iconName: 'settings'
        }
    ];

    const utilVisual: TopNavigationProps.MenuDropdownUtility = {
        type: 'menu-dropdown',
        iconName: 'settings',
        ariaLabel: 'Settings',
        title: 'Preferences',
        items: [
            {
                id: 'appTheme',
                text: 'Theme',
                items: [
                    {
                        id: 'appTheme.light',
                        text: 'Light',
                        disabled: appTheme.color === 'appTheme.light',
                        disabledReason: 'Currently selected',
                    },
                    {
                        id: 'appTheme.dark',
                        text: 'Dark',
                        disabled: appTheme.color === 'appTheme.dark',
                        disabledReason: 'Currently selected',
                    },
                ],
            },
            {
                id: 'density',
                text: 'Density',
                items: [
                    {
                        id: 'density.comfortable',
                        text: 'Comfortable',
                        disabled: appTheme.density === 'density.comfortable',
                        disabledReason: 'Currently selected',
                    },
                    {
                        id: 'density.compact',
                        text: 'Compact',
                        disabled: appTheme.density === 'density.compact',
                        disabledReason: 'Currently selected',
                    },
                ],
            },
        ],
        onItemClick: (e) => handleUtilVisualClick(e),
    };

    const utilHelp: TopNavigationProps.MenuDropdownUtility = {
        type: 'menu-dropdown',
        iconName: 'help',
        ariaLabel: 'Help',
        title: 'Help',
        items: [
            { id: 'documentation', text: 'Documentation', href: '#', external: true },
            { id: 'feedback', text: 'Feedback', href: '#', external: true },
            { type: 'divider' },
            { id: 'support', text: 'Support', href: '#', external: true }
        ]
    };

    const utilUser: TopNavigationProps.ButtonUtility | TopNavigationProps.MenuDropdownUtility = isUserAuthenticated
        ? {
              type: 'menu-dropdown',
              text: user?.signInDetails?.loginId || user?.username,
              description: user?.signInDetails?.loginId,
              iconName: 'user-profile',
              items: [
                  { id: 'profile', text: 'Your Profile' },
                  { id: 'preferences', text: 'Preferences' },
                  { type: 'divider' },
                  { id: 'signout', text: 'Sign out' }
              ],
              onItemClick: (e) => {
                  if (e.detail.id === 'signout') {
                      signOut();
                  }
              }
          }
        : {
              type: 'button',
              text: 'Sign In',
              onClick: () => setAuthVisible(true),
          };

    return (
        <>
            {authVisible && (
                <Suspense fallback={<ModalLoader />}>
                    <Auth setVisible={setAuthVisible} />
                </Suspense>
            )}
            <TopNavigation
                identity={{
                    href: '/',
                    title: 'Virtual Nurse Workspace',
                    logo: {
                        src: "https://www.tricare.mil/About/-/media/69C0BE06D96345CC872565890A0CC4B1.ashx",
                        alt: "DHA Logo"
                    }
                }}
                utilities={[utilHelp, utilVisual, utilUser]}
                i18nStrings={{
                    searchIconAriaLabel: 'Search',
                    searchDismissIconAriaLabel: 'Close search',
                    overflowMenuTriggerText: 'More',
                    overflowMenuTitleText: 'All',
                    overflowMenuBackIconAriaLabel: 'Back',
                    overflowMenuDismissIconAriaLabel: 'Close menu'
                }}
                search={
                    <TopNavigation.Search
                        placeholder="Search"
                        ariaLabel="Search"
                        onSubmit={({ detail }) => console.log('Search submitted:', detail.value)}
                    />
                }
            />
        </>
    );
}