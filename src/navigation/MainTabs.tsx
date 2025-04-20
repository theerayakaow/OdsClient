import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MainScreen from '@/screens/MainScreen';
import WithdrawScreen from '@/screens/WithdrawScreen';
import SettingScreen from '@/screens/SettingScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName = 'home-outline';

                    if (route.name === 'MainScreen') {
                        iconName = 'home-outline';
                    } else if (route.name === 'WithdrawScreen') {
                        iconName = 'wallet-outline';
                    } else if (route.name === 'SettingScreen') {
                        iconName = 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="MainScreen" component={MainScreen} options={{ title: 'Home' }} />
            <Tab.Screen name="WithdrawScreen" component={WithdrawScreen} options={{ title: 'Withdraw' }} />
            <Tab.Screen name="SettingScreen" component={SettingScreen} options={{ title: 'Settings' }} />
        </Tab.Navigator>
    );
};

export default MainTabs;
