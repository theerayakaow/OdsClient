import React, { createContext, useEffect, useState, useContext } from 'react';
import {
    isAuthenticated,
    logout as clearToken,
    storeTokenWithDecodedExpiry,
    getDecodedToken,
} from '@/utils/tokenManager';

type AuthContextType = {
    isAuthenticated: boolean;
    authLoading: boolean;
    phoneNumber: string | null;
    userId: string | null;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    setPhoneNumber: (phone: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    authLoading: true,
    phoneNumber: null,
    userId: null,
    login: async () => {},
    logout: async () => {},
    checkAuthStatus: async () => {},
    setPhoneNumber: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticatedState, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const checkAuthStatus = async () => {
        setAuthLoading(true);
        try {
            const valid = await isAuthenticated();
            if (valid) {
                const decoded = await getDecodedToken();
                setIsAuthenticated(true);
                setPhoneNumber(decoded?.phone || null);
                setUserId(decoded?.userUid || null);
            } else {
                await logout();
            }
        } catch (err) {
            console.warn('Failed to check auth:', err);
            await logout();
        } finally {
            setAuthLoading(false);
        }
    };

    const login = async (token: string) => {
        await storeTokenWithDecodedExpiry(token);
        await checkAuthStatus();
    };

    const logout = async () => {
        setAuthLoading(true);
        try {
            await clearToken();
            setIsAuthenticated(false);
            setPhoneNumber(null);
            setUserId(null);
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: isAuthenticatedState,
                authLoading,
                phoneNumber,
                userId,
                login,
                logout,
                checkAuthStatus,
                setPhoneNumber,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
