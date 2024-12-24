import React from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';

export default function StreamlitApp() {
    return (
        <ContentLayout
            headerVariant={'high-contrast'}
        >
            <iframe
                title="Streamlit Application"
                src="http://54.85.192.249:8501//" // Replace with Streamlit app URL
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }}
            />
        </ContentLayout>
    );
}