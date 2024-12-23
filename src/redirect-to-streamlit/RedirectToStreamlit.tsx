// src/pages/RedirectToStreamlit.tsx

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const RedirectToStreamlit = () => {
    const history = useHistory();
    
    useEffect(() => {
        // Replace with your Streamlit app URL
        window.location.href = "https://qb0qspckljwjq6q.studio.us-east-1.sagemaker.aws/jupyterlab/default/proxy/8501/";
    }, [history]);

    return (
        <div>
            <p>Redirecting to Streamlit app...</p>
        </div>
    );
};

export default RedirectToStreamlit;
