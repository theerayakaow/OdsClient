import * as Keychain from 'react-native-keychain';

const ACCESS_TOKEN_KEY = 'accessToken';
const ACCESS_TOKEN_EXPIRY_KEY = 'accessTokenExpiry';

export const saveAccessToken = async (token: string, expiry: Date): Promise<void> => {
    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, token, {
        service: ACCESS_TOKEN_KEY,
    });
    await Keychain.setGenericPassword(ACCESS_TOKEN_EXPIRY_KEY, expiry.toISOString(), {
        service: ACCESS_TOKEN_EXPIRY_KEY,
    });
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
