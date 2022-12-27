import AsyncStorage from '@react-native-community/async-storage';
import configScreens from "../configScreens";
import {dialogService, loadingService} from '../services'
import {$$_CARPON_INITIAL_STATE} from "./Storage";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/crashlytics';
import '@react-native-firebase/analytics';

let Analytics = firebase.analytics();
let Crashlytics = firebase.crashlytics();

import store from './../store';

export default class AxiosProvider {

    constructor(config, axios, navigationService) {
        this.config = config;
        this.navigationService = navigationService;
        Analytics.setAnalyticsCollectionEnabled(true);

        this.instanceDefault = axios.create(config.axios);
        this.mapInterceptorsWithLoading(this.instanceDefault, null, this.handleRequestError);

        this.instanceAuth = axios.create(config.axios);
        this.mapInterceptorsWithLoading(this.instanceAuth, this.handleRequestAuthConfig, this.handleRequestError, this.handleResponseError);
    }


    get request() {
        return this.instanceDefault;
    }

    get requestWithAuth() {
        return this.instanceAuth;
    }

    handleRequestAuthConfig = async (config) => {
        config.headers['Authorization'] = `Bearer ${store.getState().registration.credential.token}`;
        return config;
    };

    handleResponseError = (error) => {
        // loadingService.hide();
        if (error.response && error.response.status === 401) {
            this.handleRequestTokenExpired();
        } else if (error.response && error.response.status >= 500) {
            dialogService.showNetworkError();
        }
        // if (config.debug) console.log(error.response, error);
        return Promise.reject(error)
    };

    handleRequestTokenExpired() {
        return AsyncStorage.removeItem($$_CARPON_INITIAL_STATE).then(() => {
            this.navigationService.clear(configScreens.initialRouteName)
        });
    }

    handleRequestError = (error) => {
        // loadingService.hide();
        // if (config.debug) console.log(error);
        dialogService.showNetworkError();
        return Promise.reject(error)
    };

    mapInterceptorsWithLoading(axiosInstance, handleRequestConfig, handleRequestError, handleResponseError) {
        axiosInstance.interceptors.request.use((config) => {
            const user = store.getState().registration ? store.getState().registration.userProfile.myProfile : null;
            if (user && user.id && config) {
                const id = user.id;
                Crashlytics.setUserId(id.toString());
                Crashlytics.log('client request' + config.url);
                Analytics.setUserId(id.toString());
                Analytics.logEvent('client_request', {
                    url: config.url || '',
                    user_id: id,
                });
            }
            if (!config.hide_loading) {
                // loadingService.show();
            }
            return config;
        }, handleRequestError);

        if (handleRequestConfig) {
            axiosInstance.interceptors.request.use(handleRequestConfig, handleRequestError);
        }

        axiosInstance.interceptors.response.use(function(response) {
            // loadingService.hide();
            return response;
        }, handleResponseError || (error => {
            // loadingService.hide();
            // if (config.debug) console.log(error.response, error);
            if (error.response && error.response.status >= 500) {
                dialogService.showNetworkError();
            }
            return Promise.reject(error)
        }));
    }
}
