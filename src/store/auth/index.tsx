import React, { createContext, useContext } from 'react';
import { AuthUser } from 'aws-amplify/auth';

type AuthContextType = {
    isUserAuthenticated: boolean;
    user: AuthUser | null;
    signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    isUserAuthenticated: true,
    user: {
        username: 'neomartinez@deloitte.com',
        userId: 'static-user-id',
        signInDetails: {
            loginId: 'neomartinez@deloitte.com',
        }
    } as AuthUser,
    signOut: () => {},
});

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }
    return context;
}

export default function AuthContextProvider({ children }: { children: React.ReactElement }) {
    // Static authentication values
    const authContextValue = {
        isUserAuthenticated: true,
        user: {
            username: 'neomartinez@deloitte.com',
            userId: 'static-user-id',
            signInDetails: {
                loginId: 'neomartinez@deloitte.com',
            }
        } as AuthUser,
        signOut: () => {},
    };

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
