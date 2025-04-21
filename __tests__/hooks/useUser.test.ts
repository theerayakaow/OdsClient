import useUser from '@/hooks/useUser';
import { userService } from '@/services/userService';
import { act, renderHook } from '@testing-library/react-native';

jest.mock('@/services/userService', () => ({
    userService: {
        getProfile: jest.fn(),
        getTrans: jest.fn(),
        withdraw: jest.fn(),
    },
}));

describe('useUser', () => {
    const mockProfile = {
        data: {
            user: {
                uid: 'john_uid',
                email: 'john@example.com',
                firstname: 'John',
                lastname: 'Doe',
                avatar: 'http://example.com/avatar.jpg',
            },
        },
    };

    const mockTrans = {
        data: {
            trans: {
                available: 5000,
                transactions: [
                    {
                        uid: 1,
                        amount: 1000,
                        date: '01/01/2023',
                        formattedDate: 'Jan 1, 2023',
                    },
                ],
            },
        },
    };

    const mockWithdraw = {
        data: {
            message: 'Withdraw successful',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch user profile', async () => {
        (userService.getProfile as jest.Mock).mockResolvedValueOnce(mockProfile);

        const { result } = renderHook(() => useUser());
        const response = await act(() => result.current.getProfile());

        expect(userService.getProfile).toHaveBeenCalled();
        expect(response.isSuccess).toBe(true);
        expect(response.data?.user.firstname).toBe('John');
    });

    it('should fetch user transactions', async () => {
        (userService.getTrans as jest.Mock).mockResolvedValueOnce(mockTrans);

        const { result } = renderHook(() => useUser());
        const response = await act(() => result.current.getTrans());

        expect(userService.getTrans).toHaveBeenCalled();
        expect(response.isSuccess).toBe(true);
        expect(response.data?.trans.available).toBe(5000);
    });

    it('should handle withdraw correctly', async () => {
        (userService.withdraw as jest.Mock).mockResolvedValueOnce(mockWithdraw);

        const { result } = renderHook(() => useUser());
        const response = await act(() => result.current.withdraw(3000));

        expect(userService.withdraw).toHaveBeenCalledWith(3000);
        expect(response.isSuccess).toBe(true);
        expect(response.data?.message).toBe('Withdraw successful');
    });
});
