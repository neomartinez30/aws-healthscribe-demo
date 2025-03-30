import React, { useEffect, useRef, useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import { useDebouncedCallback } from 'use-debounce';
import { useScroll } from '@/hooks/useScroll';

type ScrollingContainerProps = {
    containerTitle: string;
    containerActions?: React.ReactNode;
    children: React.ReactNode;
};

export default function ScrollingContainer({
    containerTitle,
    containerActions = null,
    children,
}: ScrollingContainerProps) {
    const [showUpScroll, setShowUpScroll] = useState<boolean>(false);
    const [showDownScroll, setShowDownScroll] = useState<boolean>(false);

    const childContainerRef = useRef(null);
    
    function handleScroll(e: Event) {
        const scrollElement = e.target as HTMLElement;
        const scrollLeftTop = scrollElement.scrollTop > 0;
        if (scrollLeftTop) {
            setShowUpScroll(true);
        } else {
            setShowUpScroll(false);
        }
        const scrollAtBottom = scrollElement.scrollHeight - scrollElement.scrollTop === scrollElement.clientHeight;
        if (scrollAtBottom) {
            setShowDownScroll(false);
        } else {
            setShowDownScroll(true);
        }
    }
    
    const debouncedHandleScroll = useDebouncedCallback(handleScroll, 300);
    useScroll(childContainerRef, debouncedHandleScroll);

    useEffect(() => {
        if (childContainerRef.current == null) return;
        const childContainer = childContainerRef.current as HTMLElement;
        if (childContainer.scrollHeight > childContainer.clientHeight) setShowDownScroll(true);
    }, [childContainerRef.current]);

    return (
        <Container
            header={
                <Header variant="h2" actions={containerActions}>
                    {containerTitle}
                </Header>
            }
        >
            {showUpScroll && (
                <div className="absolute top-[5px] left-1/2 opacity-50 animate-bounce">
                    <Icon name="angle-up" size="medium" />
                </div>
            )}
            <div className="min-h-[300px] h-[calc(100vh-400px)] mb-4 overflow-scroll scrollbar-hide" ref={childContainerRef}>
                {children}
            </div>
            {showDownScroll && (
                <div className="absolute bottom-0 left-1/2 opacity-50 animate-bounce">
                    <Icon name="angle-down" size="medium" />
                </div>
            )}
        </Container>
    );
}
