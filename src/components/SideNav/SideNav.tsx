import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

export default function SideNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const sideNavItems: SideNavigationProps.Item[] = [
        {
            type: 'link',
            text: 'Conversations',
            href: '/conversations',
        },
        { type: 'divider' },
        {
            type: 'link',
            text: 'Patient Insights',
            href: '/PatientInsights',
        },
        { type: 'divider' },
        {
            type: 'link',
            text: 'Agent Desktop',
            href: '/AgentDesktop',
        },
        { type: 'divider' },
        {
            type: 'link',
            text: 'Provider Locator',
            href: '/settings',
        },
    ];

    return (
        <SideNavigation
            activeHref={`/${location.pathname.split('/')[1]}`}
            header={{ text: 'Toolkit', href: '/' }}
            items={sideNavItems}
            onFollow={(e) => {
                e.preventDefault();
                if (e.detail.external === true) {
                    window.open(e.detail.href, '_blank', 'noopener');
                    return;
                }
                navigate(e.detail.href, { relative: 'route' });
            }}
        />
    );
}
