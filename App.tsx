import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '@/context/AuthContext';
import { StatusBar } from 'react-native';
import { PinProvider } from '@/context/PinContext';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <PinProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <RootNavigator />
            <Toast position="top" />
          </PinProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;