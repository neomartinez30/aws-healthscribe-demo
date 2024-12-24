import React from 'react';
import ContentLayout from '@cloudscape-design/components/content-layout';
import TopNav from '../TopNav'; // Correct import statement

export default function StreamlitApp() {
    return (
        <ContentLayout
            headerVariant={'high-contrast'}
            header={<TopNav />}
        >
            <iframe
                title="Streamlit Application"
                src="https://qb0qspckljwjq6q.studio.us-east-1.sagemaker.aws/jupyterlab/default/proxy/8501/" // Replace with Streamlit app URL
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
