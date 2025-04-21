jest.mock('react-native-gesture-handler', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        GestureHandlerRootView: ({ children, testID }) => (
            <View testID={testID}>{children}</View>
        ),
    };
});
