import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text,
    Image,
} from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('@assets/user-interface.png')} style={styles.logo} />

            <Text style={styles.appName}>MyFinance</Text>

            <ActivityIndicator size="large" color="#1976d2" style={styles.loader} />

            <Text style={styles.text}>Getting things ready...</Text>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    appName: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 24,
        color: '#333',
    },
    loader: {
        marginBottom: 12,
    },
    text: {
        fontSize: 14,
        color: '#666',
    },
});
