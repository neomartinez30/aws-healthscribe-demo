import React from 'react';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

type ValueWithLabelProps = {
    label: string;
    children: string | React.ReactNode;
    variant?: 'inline' | 'stacked';
};

export default function ValueWithLabel({ label, children, variant = 'stacked' }: ValueWithLabelProps) {
    if (variant === 'inline') {
        return (
            <SpaceBetween direction="horizontal" size="xs">
                <Box variant="awsui-key-label">{label}:</Box>
                <div>{children}</div>
            </SpaceBetween>
        );
    }

    return (
        <div>
            <Box variant="awsui-key-label">{label}</Box>
            <div>{children}</div>
        </div>
    );
}