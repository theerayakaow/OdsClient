import {
    createNavigationContainerRef,
    CommonActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<Record<string, object | undefined>>();

export const navigate = (name: string, params?: object) => {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    } else {
        console.warn('[Navigation] Tried to navigate before ready');
    }
};

export const replace = (name: string, params?: object) => {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name, params }],
            })
        );
    } else {
        console.warn('[Navigation] Tried to replace before ready');
    }
};
