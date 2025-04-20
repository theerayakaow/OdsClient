import { userService } from '@/services/userService';
import { useApiCall } from './useApiCall';

export interface UserInfo {
    uid: string;
    email: string;
    firstname: string;
    lastname: string;
    avatar: string;

}

export interface Transaction {
    uid: number;
    amount: number;
    date: string;
    formattedDate: string;
}

export interface CreditBalance {
    available: number;
    transactions: Transaction[];
}

export default function useUser() {
    const api = userService;

    const getProfile = useApiCall<[], { user: UserInfo }>(api.getProfile);
    const getTrans = useApiCall<[], { trans: CreditBalance }>(api.getTrans);
    const withdraw = useApiCall<[number], { message: string }>(api.withdraw);

    return {
        getProfile: getProfile.callApi,
        getTrans: getTrans.callApi,
        withdraw: withdraw.callApi,

        loading:
            getProfile.loading ||
            getTrans.loading ||
            withdraw.loading,

        error:
            getProfile.error ||
            getTrans.error ||
            withdraw.error
    };

}