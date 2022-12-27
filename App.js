/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './carpon/index';
import React, {useEffect} from 'react';
import {createStackNavigator} from 'react-navigation';
import getNavigationConfig from './navigation';
import {navigationService} from "./carpon/services";
import configScreens from './carpon/configScreens';
import SplashScreen from 'react-native-splash-screen';
import {transitionConfig} from './transitionConfig'
import {Platform, Linking, Alert, Text, TextInput, AppState} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import store from "./carpon/store";
import Config from 'react-native-config';
import notifee, {EventType} from '@notifee/react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import SNSContextProvider from "./carpon/Home/SNS/SNSContext";
import appsFlyer from 'react-native-appsflyer';

Text.defaultProps = {...(Text.defaultProps || {}), allowFontScaling: false};
TextInput.defaultProps = {...(TextInput.defaultProps || {}), allowFontScaling: false};

if (Config.crashlytic_enable) {
    crashlytics().setCrashlyticsCollectionEnabled(true)
}

appsFlyer.initSdk(
    {
        devKey: 'gfQM2fQGuFhhs3GgZbizWY',
        isDebug: false,
        appId: '1473367518',
    },
    (result) => {
        console.log(result);
    },
    (error) => {
        console.error(error);
    }
);

export const submitAppFlyer = (eventName, eventValues, userId) => {
    if (userId) {
        appsFlyer.setCustomerUserId(userId.toString(), (result) => {
            console.log(result)
        });
    }
    appsFlyer.trackEvent(
        eventName,
        {},
        (result) => {
            console.log(result);
        },
        (error) => {
            console.error(error);
        }
    );
};

const RootStack = createStackNavigator(
    getNavigationConfig(),
    {
        initialRouteName: configScreens.firstScreen,
        transitionConfig,
        mode: 'modal'
    }
);

export default function App() {

    function _handleOpenURL(event) {
        const appUrl = 'carpon://app/';
        const url = event.url;
        if (url && isDataReady()) {
            if (url.includes(appUrl)) {
                const path = url.replace(appUrl, '');
                if (path) {
                    const pathValue = path.split('/');
                    if (pathValue[0]) {
                        const params = {};
                        if (pathValue.length >= 2) {
                            for (let i = 1; i < pathValue.length; i++) {
                                if (i % 2 === 1) {
                                    params[pathValue[i]] = pathValue[i + 1];
                                }
                            }
                        }
                        if (AppState.currentState === 'background') {
                            switch (pathValue[0]) {
                                case 'MainTab':
                                    navigationService.clear(pathValue[0], params);
                                    break;
                                case 'ScoreQuestion':
                                    navigationService.clear('MainTab', {nextScreen: pathValue[0], ...params});
                                    break;
                                default:
                                    navigationService.push(pathValue[0], params);
                            }
                        } else {
                            navigationService.navigate('SplashScreen', {nextScreen: pathValue[0], ...params})
                        }
                    }
                }
            }
        }
    }

    function isDataReady() {
        const state = store.getState();
        return state.metadata && state.metadata.ready &&
            state.news && state.news.update &&
            state.registration && state.registration.userProfile && state.registration.userProfile.confirmed;
    }

    useEffect(() => {
        SplashScreen.hide();
        notifee.getInitialNotification().then(r => r);
        Linking.getInitialURL().then(url => {
            _handleOpenURL({url})
        });
        Linking.addEventListener('url', (url) => _handleOpenURL(url));
        const unsubscribe = NetInfo.addEventListener(state => {
            if (Platform.OS === 'ios' && state.isInternetReachable === false) {
                Alert.alert('ネットワークに接続できません')
            }
            if (Platform.OS === 'android' && state.isInternetReachable === false && !state.isConnected) {
                Alert.alert('ネットワークに接続できません')
            }
        });

        return function cleanup() {
            Linking.removeEventListener('url', this._handleOpenURL);
            unsubscribe();
        }
    }, []);

    return (
        <SNSContextProvider>
            <RootStack
                ref={navigatorRef => {
                    navigationService.setTopLevelNavigator(navigatorRef);
                }}
            />
        </SNSContextProvider>
    )
}
