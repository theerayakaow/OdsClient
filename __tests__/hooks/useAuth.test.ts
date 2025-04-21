import useAuth from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { act, renderHook } from '@testing-library/react-native';

jest.mock('@/services/authService', () => ({
    authService: {
        requestOtp: jest.fn(),
        getPhoneInfo: jest.fn(),
        verifyOtp: jest.fn(),
    },
}));

describe('useAuth', () => {
    const mockOtpRes = { data: { phone: '0800000000', otp: '123456' } };
    const mockPhoneInfo = {
        data: {
            phone_number: '0800000000',
            otp_ref_id: 'ref-123',
            is_verified: false,
            last_sent_at: new Date().toISOString(),
            otp_expire_at: new Date().toISOString(),
            formatted_otp_expire_at: 'Apr 21, 2025',
            cooldown: 0,
        },
    };
    const mockVerifyRes = { data: { token: 'mock-token' } };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call requestOtp and return success response', async () => {
        (authService.requestOtp as jest.Mock).mockResolvedValueOnce(mockOtpRes);

        const { result } = renderHook(() => useAuth());
        const response = await act(() => result.current.requestOtp('0800000000'));

        expect(authService.requestOtp).toHaveBeenCalledWith('0800000000');
        expect(response.isSuccess).toBe(true);
        expect(response.data).toEqual(mockOtpRes.data);
    });

    it('should call getPhoneInfo and return otp info', async () => {
        (authService.getPhoneInfo as jest.Mock).mockResolvedValueOnce(mockPhoneInfo);

        const { result } = renderHook(() => useAuth());
        const response = await act(() => result.current.getPhoneInfo('0800000000'));

        expect(authService.getPhoneInfo).toHaveBeenCalledWith('0800000000');
        expect(response.isSuccess).toBe(true);
        expect(response.data?.otp_ref_id).toBe('ref-123');
    });

    it('should call verifyOtp and return token', async () => {
        (authService.verifyOtp as jest.Mock).mockResolvedValueOnce(mockVerifyRes);

        const { result } = renderHook(() => useAuth());
        const response = await act(() => result.current.verifyOtp('0800000000', '123456'));

        expect(authService.verifyOtp).toHaveBeenCalledWith('0800000000', '123456');
        expect(response.isSuccess).toBe(true);
        expect(response.data?.token).toBe('mock-token');
    });
});
