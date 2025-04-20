import { useState, useCallback } from 'react';
import { AxiosResponse } from 'axios';

export interface OperationResult<T> {
    isSuccess: boolean;
    data: T | null;
    error: any | null;
}

interface UseApiCallOptions<TParams extends any[]> {
    auto?: boolean;
    defaultParams?: TParams;
}

export function useApiCall<TParams extends any[], TResponse>(
    apiFunction: (...args: TParams) => Promise<AxiosResponse<TResponse>>,
    options?: UseApiCallOptions<TParams>
) {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<TResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const callApi = useCallback(
        async (...args: TParams): Promise<OperationResult<TResponse>> => {
            setLoading(true);
            setError(null);

            try {
                const result = await apiFunction(...args);
                const responseData = result?.data ?? null;
                setData(responseData);

                return {
                    isSuccess: true,
                    data: responseData,
                    error: null,
                };
            } catch (err: any) {
                const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
                setError(msg);

                return {
                    isSuccess: false,
                    data: null,
                    error: msg,
                };
            } finally {
                setLoading(false);
            }
        },
        [apiFunction]
    );

    return { loading, data, error, callApi };
}
