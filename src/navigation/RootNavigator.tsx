import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { useAuthContext } from '@/context/AuthContext';


import SignInScreen from '@/screens/auth/SignInScreen';
import OtpScreen from '@/screens/auth/OtpScreen';
import SetPinScreen from '@/screens/pin/SetPinScreen';
import PasscodeScreen from '@/screens/pin/PasscodeScreen';
import SplashScreen from '@/screens/common/SplashScreen';
import { navigationRef } from './navigationService';
import { usePinContext } from '@/context/PinContext';
import MainTabs from './MainTabs';
import AccessDeniedScreen from '@/screens/error/AccessDeniedScreen';

export type RootStackParamList = {
    SignInScreen: undefined;
    OtpScreen: undefined;
    SetPinScreen: undefined;
    PasscodeScreen: undefined;
    MainAppTabs: undefined;
    AccessDeniedScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    const { isAuthenticated, authLoading } = useAuthContext();
    const { hasPin, pinLoading } = usePinContext();

    if (authLoading || pinLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="SignInScreen" component={SignInScreen} />
                        <Stack.Screen name="OtpScreen" component={OtpScreen} />
                    </>
                ) : !hasPin ? (
                    <Stack.Screen name="SetPinScreen" component={SetPinScreen} />
                ) : (
                    <>
                        <Stack.Screen name="PasscodeScreen" component={PasscodeScreen} />
                        <Stack.Screen name="MainAppTabs" component={MainTabs} />
                    </>
                )}
                <Stack.Screen name="AccessDeniedScreen" component={AccessDeniedScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
