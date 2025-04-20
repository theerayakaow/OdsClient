import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthContext } from '@/context/AuthContext';

const AccessDeniedScreen = () => {

    const { logout } = useAuthContext();

    const handleGoHome = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Access Denied</Text>
            <Text style={styles.message}>
                You do not have permission to access this page or your session has expired.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleGoHome}>
                <Text style={styles.buttonText}>Go to Sign In</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AccessDeniedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
        color: '#d32f2f',
    },
    message: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#1976d2',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
