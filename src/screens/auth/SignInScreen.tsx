import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuthContext } from '@/context/AuthContext';
import { navigate } from '@/navigation/navigationService';

const SignInScreen = () => {
    const { phoneNumber: phoneInContext, setPhoneNumber: setPhoneInContext } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [phoneInput, setPhoneInput] = useState(phoneInContext);

    const delay = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

    const handleNext = async () => {
        if (!phoneInput || phoneInput.length !== 10) {
            Toast.show({
                type: 'error',
                text1: 'Invalid phone number',
                text2: 'Please enter a 10-digit phone number.',
            });
            return;
        }

        setLoading(true);
        await delay(500);
        setLoading(false);

        setPhoneInContext(phoneInput)
        navigate('OtpScreen')

    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>Sign In</Text>

                <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    placeholder="Enter your phone number"
                    value={phoneInput ?? ''}
                    onChangeText={text => {
                        const cleaned = text.replace(/[^0-9]/g, '');
                        setPhoneInput(cleaned);
                    }}
                    maxLength={10}
                />


                <TouchableOpacity
                    style={[styles.button, phoneInput?.length !== 10 && styles.buttonDisabled]}
                    onPress={handleNext}
                    disabled={phoneInput?.length !== 10 || loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Checking...' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};


export default SignInScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inner: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
