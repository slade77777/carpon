import {Easing, Animated} from 'react-native'
import store from "./carpon/store";

function setCurrentScreen(screen) {
    store.dispatch({type: 'SET_CURRENT_SCREEN', currentScreen: screen});
}

export function transitionConfig(){

    return {
        transitionSpec: {
            duration: 450,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const screenName = scene.route.routeName;
            setCurrentScreen(screenName);
            const thisSceneIndex = scene.index;
            const width = layout.initWidth;

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
                outputRange: [width, 0, 0],
            });

            const opacity = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [0, 1],
            });

            const slideFromRight = { transform: [{ translateX }] };
            const scaleWithOpacity = { opacity };

            const OpacityScreenList =['ConfirmedAccountInfo', 'LoadingMetaData'];
            const scaleWithOpacityScreen = OpacityScreenList.find((element)=> {
                return element === screenName;
            });
            return !!scaleWithOpacityScreen ? scaleWithOpacity: slideFromRight
        },
    }
}
