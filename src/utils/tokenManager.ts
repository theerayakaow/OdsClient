import * as Keychain from 'react-native-keychain';
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'accessToken';
const ACCESS_TOKEN_EXPIRY_KEY = 'accessTokenExpiry';

type DecodedToken = {
    exp: number;
    [key: string]: any;
};

export const saveAccessToken = async (token: string, expiry: Date): Promise<void> => {
    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, token, { service: ACCESS_TOKEN_KEY });
    await Keychain.setGenericPassword(ACCESS_TOKEN_EXPIRY_KEY, expiry.toISOString(), { service: ACCESS_TOKEN_EXPIRY_KEY });
};

export const getAccessToken = async (): Promise<string | null> => {
    const credentials = await Keychain.getGenericPassword({ service: ACCESS_TOKEN_KEY });
    return credentials ? credentials.password : null;
};

export const getAccessTokenExpiry = async (): Promise<string | null> => {
    const credentials = await Keychain.getGenericPassword({ service: ACCESS_TOKEN_EXPIRY_KEY });
    return credentials ? credentials.password : null;
};

export const clearAccessToken = async (): Promise<void> => {
    await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_KEY });
    await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_EXPIRY_KEY });
};

export const decodeToken = (token: string): DecodedToken => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch {
        throw new Error('Invalid token');
    }
};

export const getExpiryDateFromToken = (token: string): Date => {
    const decoded = decodeToken(token);
    if (!decoded.exp) throw new Error('Token missing exp field');
    return new Date(decoded.exp * 1000);
};

export const isTokenExpired = async (): Promise<boolean> => {
    try {
        const expiryStr = await getAccessTokenExpiry();
        if (!expiryStr) return true;
        const expiry = new Date(expiryStr);
        return Date.now() > expiry.getTime();
    } catch {
        return true;
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
    const token = await getAccessToken();
    if (!token) return false;
    return !(await isTokenExpired());
};

export const storeTokenWithDecodedExpiry = async (token: string): Promise<void> => {
    try {
        const expiry = getExpiryDateFromToken(token);
        await saveAccessToken(token, expiry);
    } catch {
        await clearAccessToken(); // fallback
    }
};

export const logout = async (): Promise<void> => {
    await clearAccessToken();
};

export const getDecodedToken = async (): Promise<DecodedToken | null> => {
    try {
        const token = await getAccessToken();
        if (!token) return null;
        return decodeToken(token);
    } catch {
        return null;
    }
};
