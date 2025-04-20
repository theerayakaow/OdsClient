import { apiService } from './apiService';

export const authService = {

    requestOtp: (phone: string) =>
        apiService.post('/request-otp', { phone }),

    getPhoneInfo: (phone: string) =>
        apiService.post('/otp-info', { phone }),

    verifyOtp: (phone: string,otp: string) =>
        apiService.post('/verify-otp', { phone, otp })

};

