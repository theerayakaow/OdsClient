import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingScreen from '@/screens/SettingScreen';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

jest.mock('react-native-toast-message', () => ({
    show: jest.fn(),
}));

const mockClearPin = jest.fn();
const mockLogout = jest.fn();

jest.mock('@/context/PinContext', () => ({
    usePinContext: () => ({
        clearPin: mockClearPin,
    }),
}));

jest.mock('@/context/AuthContext', () => ({
    useAuthContext: () => ({
        logout: mockLogout,
    }),
}));

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    const logoutButton = buttons?.find(b => b.text === 'Log out');
    if (logoutButton && typeof logoutButton.onPress === 'function') {
        logoutButton.onPress(); // simulate press
    }
});

describe('SettingScreen', () => {
    it('renders correctly', () => {
        const { getByText } = render(<SettingScreen />);
        expect(getByText('Settings')).toBeTruthy();
        expect(getByText('Reset PIN')).toBeTruthy();
        expect(getByText('Logout')).toBeTruthy();
    });

    it('calls clearPin and shows toast when Reset PIN is pressed', async () => {
        const { getByText } = render(<SettingScreen />);
        fireEvent.press(getByText('Reset PIN'));

        await waitFor(() => {
            expect(mockClearPin).toHaveBeenCalled();
            expect(Toast.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'info',
                    text1: 'PIN has been reset',
                })
            );
        });
    });

    it('calls logout and shows toast when Logout is confirmed', async () => {
        const { getByText } = render(<SettingScreen />);
        fireEvent.press(getByText('Logout'));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
            expect(Toast.show).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'success',
                    text1: 'Signed out',
                })
            );
        });
    });
});
