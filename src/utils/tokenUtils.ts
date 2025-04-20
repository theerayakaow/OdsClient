import { jwtDecode } from 'jwt-decode';
import {
    getAccessToken,
    getAccessTokenExpiry,
    saveAccessToken,
    clearAccessToken,
} from './tokenStorage';

type DecodedToken = {
    exp: number;
    [key: string]: any;
};

export const decodeToken = (token: string): DecodedToken => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export const getExpiryDateFromToken = (token: string): Date => {
    if (!token) throw new Error('Token is missing');

    const decoded = decodeToken(token);
    if (!decoded.exp) throw new Error('Token does not contain exp field');

    return new Date(decoded.exp * 1000);
};

export const isTokenExpired = async (): Promise<boolean> => {
    try {
        const expiryStr = await getAccessTokenExpiry();
        if (!expiryStr) return true;

        const expiry = new Date(expiryStr);
        return Date.now() > expiry.getTime();
    } catch (error) {
        console.warn('Token expiry check failed:', error);
        return true;
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const token = await getAccessToken();
        if (!token) return false;

        const expired = await isTokenExpired();
        return !expired;
    } catch (error) {
        console.warn('Authentication check failed:', error);
        return false;
    }
};

export const storeTokenWithDecodedExpiry = async (token: string): Promise<void> => {
    if (!token) return;

    try {
        const expiry = getExpiryDateFromToken(token);
        await saveAccessToken(token, expiry);
    } catch (error) {
        console.error('Failed to decode or store token:', error);
        await clearAccessToken(); // เพิ่มความปลอดภัย ล้าง token ที่ decode ไม่ได้
    }
};

export const getDecodedToken = async (): Promise<DecodedToken | null> => {
    try {
        const token = await getAccessToken();
        if (!token) return null;

        return decodeToken(token);
    } catch (error) {
        console.warn('Failed to decode token:', error);
        return null;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await clearAccessToken();
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
