import { navigate } from '@/navigation/navigationService';
import { getAccessToken } from '@/utils/tokenStorage';

import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = 'http://10.0.2.2:3000/api/v1';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
});

const setHeaders = async (
    config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
    const token = await getAccessToken();

    config.headers.set('Content-Type', 'application/json');
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
};

axiosInstance.interceptors.request.use(
    (config) => setHeaders(config),
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {

        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.warn('Unauthorized.');
                navigate('AccessDeniedScreen');
            }


            if (status === 403) {
                console.warn('Access denied.');
                navigate('AccessDeniedScreen');
            }

            if (status >= 500) {
                console.error('Server error:', error.message);
            }
        } else {
            console.error('[Network error]', error.message);
        }

        return Promise.reject(error);
    }
);

export const apiService = {
    get: async <T = any>(url: string, params?: any): Promise<AxiosResponse<T>> =>
        axiosInstance.get(url, { params }),

    post: async <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> =>
        axiosInstance.post(url, data),

    put: async <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> =>
        axiosInstance.put(url, data),

    delete: async <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> =>
        axiosInstance.delete(url, { data }),
};
