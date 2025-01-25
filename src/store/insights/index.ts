import React, { createContext, useContext, useState } from 'react';

type InsightsContextType = {
    summary: string;
    setSummary: (summary: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

const InsightsContext = createContext<InsightsContextType>({
    summary: '',
    setSummary: () => {},
    loading: false,
    setLoading: () => {}
});

export function useInsightsContext() {
    return useContext(InsightsContext);
}

export default function InsightsContextProvider({ children }: { children: React.ReactNode }) {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <InsightsContext.Provider value={{ summary, setSummary, loading, setLoading }}>
            {children}
        </InsightsContext.Provider>
    );
}