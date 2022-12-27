let navigation = {};

export const screen = (screenName = null, options = {}) => Component => {
    navigation[screenName || Component.name] = {
        screen: Component,
        navigationOptions: options
    };
};

export default () => navigation;
