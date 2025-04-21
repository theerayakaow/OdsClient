import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import MainScreen from '@/screens/MainScreen';

jest.mock('@/hooks/useUser', () => () => ({
    getProfile: jest.fn(() => Promise.resolve({
        isSuccess: true,
        data: {
            user: {
                uid: '1',
                email: 'test@example.com',
                firstname: 'Test',
                lastname: 'User',
                avatar: '',
            },
        },
    })),
    getTrans: jest.fn(() => Promise.resolve({
        isSuccess: true,
        data: {
            trans: {
                available: 10000,
                transactions: [],
            },
        },
    })),
}));

jest.mock('@/context/AuthContext', () => ({
    useAuthContext: () => ({
        logout: jest.fn(),
    }),
}));

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useFocusEffect: (cb: any) => cb(), // เรียก callback เลยทันที
    };
});

describe('MainScreen', () => {
    it('renders balance and empty transactions', async () => {
        const { getByText } = render(<MainScreen />);

        await waitFor(() => {
            expect(getByText('Available Balance')).toBeTruthy();
            expect(getByText('Transaction History')).toBeTruthy();
            expect(getByText('No transactions yet.')).toBeTruthy();
        });
    });
});
