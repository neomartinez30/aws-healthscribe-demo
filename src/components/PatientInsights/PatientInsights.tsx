import React from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';

export default function StreamlitApp() {
    return (
        <ContentLayout
            headerVariant={'high-contrast'}
        >
            <iframe
                title="Streamlit Application"
                src="https://qb0qspckljwjq6q.studio.us-east-1.sagemaker.aws/jupyterlab/default/proxy/8503/" // Replace with Streamlit app URL testing 
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
