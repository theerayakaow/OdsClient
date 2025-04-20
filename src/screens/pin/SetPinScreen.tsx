import React, { useCallback, useState } from 'react';
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
import { usePinContext } from '@/context/PinContext';

const SetPinScreen = () => {
    const { setPin } = usePinContext();

    const [step, setStep] = useState<'enter' | 'confirm'>('enter');
    const [pin, setPinState] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const currentInput = step === 'enter' ? pin : confirmPin;
    const isPinComplete = currentInput.length === 6;

    const resetPinStates = () => {
        setPinState('');
        setConfirmPin('');
        setStep('enter');
    };

    const handlePress = useCallback((digit: string) => {
        if (currentInput.length >= 6) return;
        step === 'enter'
            ? setPinState((prev) => prev + digit)
            : setConfirmPin((prev) => prev + digit);
    }, [step, currentInput]);

    const handleDelete = useCallback(() => {
        step === 'enter'
            ? setPinState((prev) => prev.slice(0, -1))
            : setConfirmPin((prev) => prev.slice(0, -1));
    }, [step]);

    const handleConfirm = useCallback(async () => {
        if (pin !== confirmPin) {
            Toast.show({
                type: 'error',
                text1: 'PINs do not match',
                text2: 'Please try again.',
            });
            resetPinStates();
            return;
        }

        try {
            await setPin(pin);
            Toast.show({ type: 'success', text1: 'PIN set successfully' });

        } catch {
            Toast.show({
                type: 'error',
                text1: 'Failed to save PIN',
                text2: 'Something went wrong.',
            });
        }
    }, [pin, confirmPin, setPin]);

    const renderKey = (key: string) => {
        const isBackspace = key === 'x';
        const isOK = key === 'ok';
        const isDisabled = isOK && !isPinComplete;

        const handleKeyPress = () => {
            if (isBackspace) return handleDelete();
            if (isOK) return step === 'enter' ? setStep('confirm') : handleConfirm();
            handlePress(key);
        };

        return (
            <TouchableOpacity
                key={key}
                style={[styles.circleKey, isDisabled && styles.circleDisabled]}
                onPress={handleKeyPress}
                disabled={isDisabled}
            >
                {isBackspace ? (
                    <Ionicons name="backspace-outline" size={26} color="#FF3B30" />
                ) : isOK ? (
                    <Ionicons
                        name={
                            step === 'enter'
                                ? 'chevron-forward-circle-outline'
                                : 'checkmark-circle-outline'
                        }
                        size={26}
                        color={isDisabled ? '#999' : step === 'enter' ? '#007AFF' : '#34C759'}
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
                <Text style={styles.title}>
                    {step === 'enter' ? 'Set your PIN' : 'Confirm your PIN'}
                </Text>

                <View style={styles.dotsContainer}>
                    {[...Array(6)].map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, currentInput.length > i && styles.dotFilled]}
                        />
                    ))}
                </View>

                <View style={styles.keypadContainer}>
                    {KEYS.map((row, i) => (
                        <View key={i} style={styles.keypadRow}>
                            {row.map(renderKey)}
                        </View>
                    ))}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default SetPinScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
    dotsContainer: { flexDirection: 'row', marginBottom: 24 },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginHorizontal: 8,
        borderColor: '#aaa',
    },
    dotFilled: { backgroundColor: '#333' },
    keypadContainer: { marginTop: 24 },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginBottom: 16,
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
    circleDisabled: {
        backgroundColor: '#ddd',
        opacity: 0.5,
    },
    keyText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
});
