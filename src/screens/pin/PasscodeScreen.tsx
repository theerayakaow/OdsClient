import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { replace } from '@/navigation/navigationService';
import { usePinContext } from '@/context/PinContext';
import { useAuthContext } from '@/context/AuthContext';

const PasscodeScreen = () => {
    const { verifyPin, clearPin } = usePinContext();
    const { logout } = useAuthContext();
    const [pin, setPin] = useState('');

    const isPinComplete = pin.length === 6;

    useEffect(() => {
        if (isPinComplete) {
            const timer = setTimeout(() => handleConfirm(), 400);
            return () => clearTimeout(timer);
        }
    }, [pin]);

    const handleForgotPin = useCallback(async () => {
        await clearPin();
        await logout();
        Toast.show({
            type: 'info',
            text1: 'Reset PIN',
            text2: 'Your session has been cleared. Please verify your phone number again.',
        });
    }, [clearPin, logout]);

    const handlePress = useCallback((digit: string) => {
        if (pin.length < 6) {
            setPin(prev => prev + digit);
        }
    }, [pin]);

    const handleDelete = useCallback(() => {
        setPin(prev => prev.slice(0, -1));
    }, []);

    const handleConfirm = useCallback(async () => {
        if (!isPinComplete) return;

        const isValid = await verifyPin(pin);
        if (isValid) {
            Toast.show({ type: 'success', text1: 'PIN Accepted' });
            replace('MainAppTabs');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Invalid PIN',
                text2: 'Please try again.',
            });
            setPin('');
        }
    }, [pin, isPinComplete, verifyPin]);

    const handleKeyPress = (key: string) => {
        if (key === 'x') return handleDelete();
        if (key === 'ok') return isPinComplete && handleConfirm();
        handlePress(key);
    };

    const renderKey = (key: string) => {
        const isBackspace = key === 'x';
        const isOK = key === 'ok';
        const disabled = isOK && !isPinComplete;

        return (
            <TouchableOpacity
                key={key}
                style={[styles.circleKey, disabled && styles.circleDisabled]}
                onPress={() => handleKeyPress(key)}
                disabled={disabled}
            >
                {isBackspace ? (
                    <Ionicons name="backspace-outline" size={26} color="#FF3B30" />
                ) : isOK ? (
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={26}
                        color={isPinComplete ? '#34C759' : '#ccc'}
                    />
                ) : (
                    <Text style={styles.keyText}>{key}</Text>
                )}
            </TouchableOpacity>
        );
    };

    const KEYS = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['x', '0', 'ok'],
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>Enter your PIN</Text>

                <View style={styles.dotsContainer}>
                    {[...Array(6)].map((_, i) => (
                        <View key={i} style={[styles.dot, pin.length > i && styles.dotFilled]} />
                    ))}
                </View>

                <View style={styles.keypadContainer}>
                    {KEYS.map((row, i) => (
                        <View key={i} style={styles.keypadRow}>
                            {row.map(renderKey)}
                        </View>
                    ))}
                </View>

                <TouchableOpacity onPress={handleForgotPin}>
                    <Text style={styles.changePhoneText}>Forgot PIN?</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};


export default PasscodeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
    dotsContainer: { flexDirection: 'row', marginBottom: 24 },
    circleDisabled: {
        backgroundColor: '#eee',
        borderColor: '#ccc',
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginHorizontal: 8,
        borderColor: '#aaa',
    },
    dotFilled: { backgroundColor: '#333' },
    keypadContainer: { marginTop: 8 },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12,
    },
    circleKey: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    changePhoneText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
        marginTop: 16,
        textDecorationLine: 'underline',
    },
    keyText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
});
