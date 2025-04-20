import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';

interface PinContextType {
    pinLoading:boolean;
    hasPin: boolean;
    setPin: (pin: string) => Promise<void>;
    verifyPin: (pin: string) => Promise<boolean>;
    clearPin: () => Promise<void>;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const PinProvider = ({ children }: { children: React.ReactNode }) => {
    const [hasPin, setHasPin] = useState(false);
    const [pinLoading, setPinLoading] = useState(true);

    useEffect(() => {
        checkPin();
    }, []);

    const checkPin = async () => {
        setPinLoading(true);
        const credentials = await Keychain.getGenericPassword({ service: 'app-pin' });
        setHasPin(!!credentials);
        setPinLoading(false);
    };

    const setPin = async (pin: string) => {
        await Keychain.setGenericPassword('pin', pin, { service: 'app-pin' });
        setHasPin(true);
    };

    const verifyPin = async (inputPin: string): Promise<boolean> => {
        const credentials = await Keychain.getGenericPassword({ service: 'app-pin' });
        if (!credentials) return false;
        return credentials.password === inputPin;
    };

    const clearPin = async () => {
        setPinLoading(true);
        try {
            await Keychain.resetGenericPassword({ service: 'app-pin' });
            setHasPin(false);
        } catch (err) {
            console.warn('Failed to clear PIN:', err);
        } finally {
            setPinLoading(false);
        }
    };

    return (
        <PinContext.Provider value={{ pinLoading,hasPin, setPin, verifyPin, clearPin }}>
            {children}
        </PinContext.Provider>
    );
};

export const usePinContext = () => {
    const context = useContext(PinContext);
    if (!context) {
        throw new Error('usePinContext must be used within a PinProvider');
    }
    return context;
}
