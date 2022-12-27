import {
    apiSMSService,
    carInformationService,
    myCarService,
    navigationService,
    userProfileService
} from "../../../carpon/services/index";
import config from '../../../carpon/config';
import {Alert} from 'react-native'
import {
    ADD_CAR_QR, LOAD_CAR, COME_BACK_REGISTER_CAR, LOAD_CAR_AFTER_SWITCH, LOAD_CAR_FOR_USER_LOGIN, LOAD_USER,
    LOGIN_EMAIL, REGISTER_LOAD_CAR_PROFILE_FROM_PLATE, REGISTER_PLATFORM_NUMBER, REMOVE_CAR, VERIFY_EMAIL,
    VERIFY_PHONE_NUMBER, REGISTER_CAR_OUT_OF_WORKING_TIME,
    REGISTER_CAR_PROFILE_CONFIRMED, REGISTER_CAR_PROFILE_UPDATED, REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE,
    REGISTER_USER_PROFILE, REGISTER_USER_PROFILE_CONFIRMED, LOADING_DATA,
    UPDATE_HOYU_NOT_FOUND,
    callAPIFailed, callAPIProgress, loadCarProfile, pendingSmallCar
}                         from "../actions/registration";
import {getCar}           from "../../Home/MyCar/actions/getCar";
import {apiVerifySMS}     from "../../services";
import {alertsCarNotHOYU} from "../provider";
import {addTrackerEvent}  from "../../Tracker";
import { submitAppFlyer } from "../../../App";

const {flow} = config.registrationFlow;

function isRegistrationAction(action) {
    return !!flow.find(step => step.doneAction === action.type);
}

const registrationMiddleware = store => next => action => {
    let carProfile = store.getState().registration ? store.getState().registration.carProfile : {};
    this.carType = carProfile.carType;

    switch (action.type) {
        case REGISTER_LOAD_CAR_PROFILE_FROM_PLATE:
            store.dispatch({type: 'ACTIVE_LOADING'});
            return carInformationService.getCarInformation({
                number: action.plateNumber,
                type: this.carType,
                mini_car: !!this.carType
            })
                .then(response => response.data)
                .then(profile => {
                    store.dispatch({type: 'RESET_LOADING'});
                    switch (profile.status) {
                        case "success":
                            return next(loadCarProfile(profile.result));
                        case "pending":
                            return next(pendingSmallCar(profile.result));
                        case "errors":
                            return Alert.alert(profile.error_message);
                    }
                })
                .catch(error => {
                    store.dispatch({type: 'RESET_LOADING'});
                    switch (error.response.status) {
                        case 406:
                            return next(loadCarProfile({number: action.plateNumber}));
                        case 422:
                            return next(loadCarProfile({HOYO_not_found: true}));
                        case 429:
                            return Alert.alert(
                                'やり直す',
                                'ナンバーによる車両登録の上限回数に達しました。こちらの端末ではナンバーによる登録機能はご利用いただけません。',
                                [
                                    {
                                        text: 'ユーザ登録に進む',
                                        onPress: () => {
                                            store.dispatch({type: 'SKIP_CAR_WHEN_LIMIT'});
                                            navigationService.clear('AuthenticationScreen')
                                        }, style: 'destructive',
                                    },
                                    {text: 'キャンセル', style: 'cancel'},
                                ],
                                {cancelable: false}
                            );
                        default :
                            return Alert.alert('ナンバープレートが見つかりません');
                    }
                });

        case REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE:
            return carInformationService.getCarCertificate({...action.qrCode})
                .then(response => response.data)
                .then(profile => {
                    next({...action, profile: profile});
                })
                .catch(error => {
                    switch (error.response.status) {
                        case 422:
                            return store.dispatch({
                                type: 'HOYU_NOT_FOUND'
                            })
                        default :
                            return Alert.alert('サーバーエラー');
                    }
                });

        case REGISTER_CAR_OUT_OF_WORKING_TIME:
            return carInformationService.getCarOutOfWorkingTime({number: action.plateNumber, type: this.carType})
                .then(() => {
                    next({...action});
                })
                .catch(() => {
                    return Alert.alert('サーバーエラー');
                });

        case LOAD_CAR_AFTER_SWITCH:
            return carInformationService.ChangeCarByCertificate({...action.QR})
                .then(profile => {
                    store.dispatch({
                        type: 'GET_USER_PROFILE'
                    })
                    next({...action, profile: profile.result});
                })
                .catch(error => {
                    switch (error.response.status) {
                        case 400 :
                            return Alert.alert('いくつかの間違い');
                        case 422:
                            return store.dispatch({
                                type: 'HOYU_NOT_FOUND'
                            })
                        default :
                            return Alert.alert('ナンバープレートが見つかりません');
                    }
                });

        case ADD_CAR_QR:
            return carInformationService.addCarQR({...action.QR})
                .then(() => {
                    carInformationService.getProfileMyCar()
                        .then((response) => {
                            const currentUser = store.getState().registration.userProfile.myProfile;
                            submitAppFlyer('SERIAL_REGIST',
                                {
                                    user_id: currentUser.id,
                                    car_name: response.car_name,
                                    platform_number: response.platform_number,
                                    car_id: response.id
                                },
                                currentUser.id
                            );
                            next({
                                ...action,
                                carProfile: response
                            })
                        });
                })
                .catch((error) => {
                    switch (error.response.status) {
                        case 422:
                            return alertsCarNotHOYU.changeOrAdd();
                        default :
                            return Alert.alert(
                                '登録できません',
                                'アプリに登録されているおクルマの車検証を登録してください',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            store.dispatch({
                                                type: 'RESET_QR_CODE'
                                            })
                                        }
                                    }
                                ],
                                {cancelable: false}
                            );
                    }

                });


        case REGISTER_CAR_PROFILE_UPDATED:
            store.dispatch({type: 'REGISTER_CAR_PROFILE_UPDATED_$PROGRESS'});
            return carInformationService.updateCarInformation(action.profile)
                .then(() =>
                    carInformationService.getProfileMyCar()
                        .then((response) => {
                            submitAppFlyer('WIZ_CARINFO_COMP',
                                {
                                    car_id: response.id,
                                    car_name: response.car_name,
                                    first_registration_date: response.first_registration_date
                                },
                                null
                            );
                            next({
                                ...action,
                                carProfile: response
                            })
                        })
                ).catch(() => {
                    store.dispatch({type: 'REGISTER_CAR_PROFILE_UPDATED_FAILED'});
                    return Alert.alert('車情報の更新に失敗しました');
                });

        case REGISTER_CAR_PROFILE_CONFIRMED:
            return next({
                ...action,
            });

        case REMOVE_CAR:
            return carInformationService.removeCar()
                .then(response => {
                    addTrackerEvent('user_car_status_change', {
                        user_has_car: false
                    });
                    store.dispatch({
                        type: 'GET_USER_PROFILE'
                    });
                    next({
                        ...action,
                        profile: response
                    });
                })
                .then(() => {
                    store.dispatch({
                        type: 'REMOVE_FIRST_TAP_NEWS'
                    });
                })
                .then(next(getCar()));

        case COME_BACK_REGISTER_CAR:
            return carInformationService.removeCar()
                .then(() => {
                    next({...action});
                });

        case REGISTER_USER_PROFILE:
            next(callAPIProgress(REGISTER_USER_PROFILE));
            return userProfileService.postUserProfile(action.profile)
                .then((response) => {
                    return next({
                        ...action,
                        profile: response
                    })
                })
                .catch((error) => {
                    if (error.response.data.message === 'ERROR_EMAIL_REGISTERED') {
                        Alert.alert('メールアドレスが使用されています。別のメールアドレスを使用してください。');
                        next(callAPIFailed('REGISTER_USER_PROFILE'))
                    } else {
                        Alert.alert('登録の処理中にエラーが発生しました。もう一度実行してください。');
                        next(callAPIFailed('REGISTER_USER_PROFILE'))
                    }
                });

        case REGISTER_USER_PROFILE_CONFIRMED:
            store.dispatch({type: 'LOGIN_ACTION_$PROGRESS'});
            return apiVerifySMS.verifyUser(action.emailInformation)
                .then(res => {
                    next({...action, token: res.token})
                })
                .catch(() => {
                    store.dispatch({type: 'LOGIN_ACTION_DONE'});
                    Alert.alert('OTPコードが正しくありません。再入力してください。');
                });

        case LOADING_DATA:
            return next({
                ...action,
            });

        case REGISTER_PLATFORM_NUMBER:
            return myCarService.updateCar(action.params).then(() =>
                carInformationService.getProfileMyCar().then((response) => {
                    next({
                        ...action,
                        carProfile: response
                    })
                })
            );

        case LOGIN_EMAIL:
            store.dispatch({type: 'LOGIN_ACTION_$PROGRESS'});
            return apiSMSService.login(action.loginInformation)
                .then(() => {
                    next({...action})
                }).catch(() => {
                    store.dispatch({type: 'LOGIN_ACTION_DONE'});
                    Alert.alert('エラー', 'メールアドレスをご確認ください')
                });

        case VERIFY_EMAIL:
            store.dispatch({type: 'LOGIN_ACTION_$PROGRESS'});
            return apiVerifySMS.verifyUser(action.emailInformation)
                .then(res => {
                    return next({...action, token: res.token, verifyUser: res.verify_user})
                })
                .catch(() => {
                    store.dispatch({type: 'LOGIN_ACTION_DONE'});
                    Alert.alert('OTPコードが正しくありません。再入力してください。');
                });

        case VERIFY_PHONE_NUMBER:
            store.dispatch({type: 'LOGIN_ACTION_$PROGRESS'});
            return apiVerifySMS.verifyUser(action.info)
                .then(res => {
                    return next({...action, token: res.token})
                })
                .catch(() => {
                    store.dispatch({type: 'LOGIN_ACTION_DONE'});
                    Alert.alert('OTPコードが正しくありません。再入力してください。');
                });

        case LOAD_CAR:
            return carInformationService.getProfileMyCar()
                .then((response) => {
                    next({
                        ...action,
                        carProfile: response
                    })
                });

        case 'SKIP_CAR_WHEN_LIMIT':
            return carInformationService.removeCar()
                .then(() => {
                    next({...action});
                });

        case LOAD_USER:
            const currentUser = store.getState().registration.userProfile.myProfile;
            return userProfileService.getUserProfile()
                .then((response) => {
                    store.dispatch({
                        type: 'LOAD_SCORE_HISTORY'
                    });
                    if (currentUser && currentUser.total_score < 500 && response.total_score >= 500 && !store.getState().registration.isSubmitScoreAppFlyer) {
                        submitAppFlyer('SCORE_500_UP',
                            {
                                user_id: response.id,
                                email: response.email,
                                total_score: response.total_score
                            },
                            currentUser.id
                        );
                        next({
                            ...action,
                            isSubmitScoreAppFlyer: true,
                            profile: response
                        })
                    } else {
                        next({
                            ...action,
                            profile: response
                        })
                    }
                });

        case LOAD_CAR_FOR_USER_LOGIN:
            return next({
                ...action,
                carProfile: store.getState().getCar.myCarInformation
            });

        case UPDATE_HOYU_NOT_FOUND:
            return carInformationService.getTemporaryCar().then(response => {
                next({
                    ...action,
                    carProfile: response
                })
            })

        default:
            return next(action)
    }
};

const registrationNavigatorMiddleware = store => next => action => {
    next(action);

    if (isRegistrationAction(action)) {
        const step = flow.find(step => step.doneAction === action.type);
        const nextScreen = step.nextScreen(store.getState().registration);
        const params = step.params ? step.params(store.getState().registration) : null;

        return navigationService[step.action](nextScreen, params);
    }
};

export {
    registrationMiddleware,
    registrationNavigatorMiddleware
};
