import React, { useCallback, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuthContext } from '@/context/AuthContext';
import useAuth from '@/hooks/useAuth';
import { replace } from '@/navigation/navigationService';

const OtpScreen = () => {
    const { verifyOtp, requestOtp } = useAuth();
    const { phoneNumber: phoneInContext, login } = useAuthContext();

    const [otp, setOtp] = useState('');

    const handleResend = useCallback(async (phone: string) => {
        const res = await requestOtp(phone);
        if (res.isSuccess && res.data?.otp) {
            setOtp(res.data.otp); // autofill
            Toast.show({
                type: 'info',
                text1: 'Mock OTP',
                text2: `Your code is ${res.data.otp}`,
                visibilityTime: 3000,
            });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Failed to send OTP',
                text2: res.error ?? 'Please try again later.',
            });
        }
    }, [requestOtp]);

    const handleConfirm = useCallback(async () => {
        if (!phoneInContext || otp.length !== 6) return;

        const res = await verifyOtp(phoneInContext, otp);
        if (res.isSuccess && res.data?.token) {
            await login(res.data.token);
            Toast.show({ type: 'success', text1: 'OTP Verified' });
            setOtp('');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Verification failed',
                text2: res.error ?? 'Please try again.',
            });
        }
    }, [otp, phoneInContext, verifyOtp, login]);

    useEffect(() => {
        if (!phoneInContext || phoneInContext.length !== 10) {
            replace('SignInScreen');
            return;
        }
        handleResend(phoneInContext);
    }, [phoneInContext, handleResend]);

    // useEffect(() => {
    //     if (otp.length === 6) {
    //         const timer = setTimeout(handleConfirm, 1000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [otp, handleConfirm]);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.inner}>
                <Text style={styles.title}>OTP Verification</Text>
                <Text style={styles.subtitle}>Code sent to {phoneInContext}</Text>

                <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    placeholder="Enter OTP"
                    value={otp}
                    maxLength={6}
                    onChangeText={text => setOtp(text.replace(/\D/g, ''))}
                />

                <TouchableOpacity
                    style={[styles.button, otp.length !== 6 && styles.buttonDisabled]}
                    onPress={handleConfirm}
                    disabled={otp.length !== 6}
                >
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => phoneInContext && handleResend(phoneInContext)}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => replace('SignInScreen')}>
                    <Text style={styles.changePhoneText}>Change phone number</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};



export default OtpScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 16, marginBottom: 8, textAlign: 'center', color: '#666' },
    refText: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 16,
        fontSize: 13,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 18,
        marginBottom: 24,
        textAlign: 'center',
        letterSpacing: 4,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 12,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
    },
    resendText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 14,
        color: '#888',
    },
    changePhoneText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
        marginTop: 16,
        textDecorationLine: 'underline',
    }
});