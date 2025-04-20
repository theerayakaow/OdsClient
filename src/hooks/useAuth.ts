import { authService } from '@/services/authService';
import { useApiCall } from './useApiCall';

export interface OtpInfo {

    phone_number: string;
    otp_ref_id: string;
    // otp_code: string;//dev only
    is_verified: boolean;
    last_sent_at: string;
    otp_expire_at: string;
    formatted_otp_expire_at: string;
    cooldown: number;

}

export default function useAuth() {
    const api = authService;

    const requestOtp = useApiCall<[string], { phone: string; otp: string }>(api.requestOtp);
    const getPhoneInfo = useApiCall<[string], OtpInfo>(api.getPhoneInfo);
    const verifyOtp = useApiCall<[string, string], { token: string }>(api.verifyOtp);

    return {
        requestOtp: requestOtp.callApi,
        verifyOtp: verifyOtp.callApi,
        getPhoneInfo: getPhoneInfo.callApi,

        loading:
            requestOtp.loading ||
            verifyOtp.loading ||
            getPhoneInfo.loading ,

        error:
            requestOtp.error ||
            verifyOtp.error ||
            getPhoneInfo.error
    };

}