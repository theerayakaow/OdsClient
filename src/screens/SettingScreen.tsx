import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthContext } from '@/context/AuthContext';
import { usePinContext } from '@/context/PinContext';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingScreen = () => {
    const { logout } = useAuthContext();
    const { clearPin } = usePinContext();

    const handleResetPin = async () => {
        await clearPin();
        Toast.show({
            type: 'info',
            text1: 'PIN has been reset',
            text2: 'Please create a new PIN to continue.',
        });
    };

    const handleLogout = async () => {
        Alert.alert(
            'Log out?',
            'You will need to sign in again to access your account.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        Toast.show({
                            type: 'success',
                            text1: 'Signed out',
                            text2: 'Hope to see you again soon!',
                        });
                    },
                },
            ]
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <TouchableOpacity style={styles.button} onPress={handleResetPin}>
                <View style={styles.buttonContent}>
                    <Ionicons name="lock-closed-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Reset PIN</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#FF3B30' }]} onPress={handleLogout}>
                <View style={styles.buttonContent}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Logout</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 16,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        textAlign: 'center',
    }
});
