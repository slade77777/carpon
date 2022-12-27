import {NavigationActions, StackActions} from 'react-navigation';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/analytics';
import '@react-native-firebase/crashlytics';
import store from '../store'
import { Keyboard } from 'react-native';

let Analytics = firebase.analytics();
let Crashlytics = firebase.crashlytics();

export default class NavigationService {

    constructor() {
        this.navigator = {};
        Analytics.setAnalyticsCollectionEnabled(true);
    }

    navigate(routeName, params) {
        Keyboard.dismiss();
        this.navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
            })
        );
        this.logScreen(routeName);
    }

    clear(screen, params) {
        Keyboard.dismiss();
        this.navigator.dispatch(
            StackActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({routeName: screen, params})
                ]
            })
        );
        this.logScreen(screen);
    }

    push(routeName, params) {
        Keyboard.dismiss();
        this.navigator.dispatch(
            StackActions.push({
                routeName,
                params,
                actions: [
                    NavigationActions.navigate({routeName: routeName, params})
                ]
            })
        );
        this.logScreen(routeName);
    }

    logScreen(screen = "MainTab") {
        const user = store.getState().registration ? store.getState().registration.userProfile.myProfile : null;
        Analytics.setCurrentScreen(screen);
        if (user && user.id) {
            const id = user.id;
            Analytics.setUserId(id.toString());
            Analytics.logEvent('navigate_screen', {
                screen_name: screen,
                user_id: id
            });
            Crashlytics.setUserId(id.toString());
            screen && Crashlytics.log('navigate_screen' + screen);
        }
    }

    goBack() {
        Keyboard.dismiss();
        this.navigator.dispatch(
            NavigationActions.back({})
        );
    }

    pop(n) {
        Keyboard.dismiss();
        const popAction = StackActions.pop({n});
        this.navigator.dispatch(popAction);
    }

    popToTop() {
        Keyboard.dismiss();
        this.navigator.dispatch(StackActions.popToTop());
    }

    setTopLevelNavigator(navigatorRef) {
        this.navigator = navigatorRef;
    }
}
