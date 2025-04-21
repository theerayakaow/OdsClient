import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WithdrawScreen from '@/screens/WithdrawScreen';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { navigate } from '@/navigation/navigationService';

jest.mock('@/hooks/useUser', () => () => ({
    withdraw: jest.fn((amount) => {
        if (amount === 999) {
            return Promise.resolve({ isSuccess: false, error: 'Insufficient funds' });
        }
        return Promise.resolve({ isSuccess: true, data: { message: 'Withdraw success' } });
    }),
    getTrans: jest.fn(() =>
        Promise.resolve({
            isSuccess: true,
            data: { trans: { available: 10000, transactions: [] } },
        })
    ),
}));

jest.mock('react-native-toast-message', () => ({
    show: jest.fn(),
}));

jest.mock('@/navigation/navigationService', () => ({
    navigate: jest.fn(),
}));

describe('WithdrawScreen', () => {
    const renderWithNav = () => {
        return render(
            <NavigationContainer>
                <WithdrawScreen />
            </NavigationContainer>
        );
    };

    it('renders correctly with static texts', async () => {
        const { getByText } = renderWithNav();

        await waitFor(() => {
            expect(getByText('Withdraw Money')).toBeTruthy();
            expect(getByText(/Available:/)).toBeTruthy();
        });
    });

    it('handles invalid amount and shows error toast', async () => {
        const { getByPlaceholderText, getByText } = renderWithNav();
        const input = getByPlaceholderText('Enter amount');
        const button = getByText('Withdraw');

        fireEvent.changeText(input, '0');
        fireEvent.press(button);

        await waitFor(() => {
            expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({
                type: 'error',
                text1: 'Invalid amount',
            }));
        });
    });

    it('calls withdraw and shows success toast on success', async () => {
        const { getByPlaceholderText, getByText } = renderWithNav();
        const input = getByPlaceholderText('Enter amount');
        const button = getByText('Withdraw');

        fireEvent.changeText(input, '1000');
        fireEvent.press(button);

        await waitFor(() => {
            expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({
                type: 'success',
                text1: 'Withdraw success',
            }));
            expect(navigate).toHaveBeenCalledWith('MainAppTabs', {
                screen: 'MainScreen',
            });
        });
    });

    it('shows error toast on withdraw failure', async () => {
        const { getByPlaceholderText, getByText } = renderWithNav();
        const input = getByPlaceholderText('Enter amount');
        const button = getByText('Withdraw');

        fireEvent.changeText(input, '999'); // trigger failure case
        fireEvent.press(button);

        await waitFor(() => {
            expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({
                type: 'error',
                text1: 'Withdrawal failed',
                text2: 'Insufficient funds',
            }));
        });
    });
});
