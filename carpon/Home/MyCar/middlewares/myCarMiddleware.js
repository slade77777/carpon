import {carInformationService} from "../../../services/index";
import {GET_CAR, GET_RECALL, UPDATE_GRADE, GET_CAR_FAILED, GET_CAR_PRICE_ESTIMATE, GET_CAR_SELL_ESTIMATE} from "../actions/getCar";
import {myCarService} from "../../../services/index";
import {
    UPDATE_OIL, UPDATE_MILEAGE, UPDATE_LICENSE, GET_CAMPAIGN,
    GET_MILEAGE, CONFIRM_RECALL, UPDATE_INSURANCE, UPDATE_CAR, UPDATE_TIRE, UNCONFIRM_RECALL,
    UPDATE_CAR_IMAGE, REMOVE_CAR_IMAGE, UPDATE_CAR_LOOKUP, REMOVE_MILEAGE, UPDATE_ADVERTISING
} from "../actions/myCarAction";
import {getRecall} from "../../MyCar/actions/getCar";
import {Alert}  from "react-native";

const carInformationMiddleware = store => next => action => {
    switch (action.type) {
        case GET_CAR :
            return carInformationService.getProfileMyCar()
                .then(response => {
                return next({
                    type: GET_CAR,
                    myCarInformation: response
                    });
                })
                .catch((error) => {
                    if (error.response.status === 404 || error.response.status === 422) {
                        next({
                            type: GET_CAR_FAILED
                        })
                    }
                });

        case UPDATE_GRADE:
            store.dispatch({
                type: 'UPDATE_GRADE_$PROGRESS'
            });
            return carInformationService.updateGrade(action.hoyu_id).then(response => {
                store.dispatch({
                    type: 'GET_USER_PROFILE'
                });
                return next({...action, grade: response})
            }).catch(()=> {
                store.dispatch({
                    type: 'UPDATE_GRADE_FAILED'
                })
            });

        case UPDATE_LICENSE:
            store.dispatch({
                type: 'UPDATE_LICENSE_$PROGRESS'
            });
            return myCarService.updateLicense(action.params)
                .then((response) => {
                    store.dispatch({
                        type: 'GET_USER_PROFILE'
                    });
                    next({
                        ...action,
                        response: response,
                    });
                }).catch(() => {
                    store.dispatch({
                        type: 'UPDATE_LICENSE_FAILED'
                    });
                });

        case UPDATE_MILEAGE:
            store.dispatch({
                type: 'UPDATE_MILEAGE_$PROGRESS'
            });
            return myCarService.updateMileage(action.params)
                .then((response) => {
                    store.dispatch({
                        type: 'GET_CAR'
                    });
                    store.dispatch({
                        type: 'GET_MILEAGE'
                    });
                    next({
                        ...action,
                        response: response,
                    });
                }).catch(() => {
                    store.dispatch({
                        type: 'UPDATE_MILEAGE_FAILED'
                    });
                });
        case REMOVE_MILEAGE:
            store.dispatch({
                type: 'REMOVE_MILEAGE_$PROGRESS'
            });
            return myCarService.removeMileage(action.mileage.id)
                .then(response => {
                    store.dispatch({
                        type: 'GET_CAR'
                    });
                    store.dispatch({
                        type: 'GET_MILEAGE'
                    });
                    next({
                        ...action,
                        response: response,
                    });
                }).catch(()=> {
                    store.dispatch({
                        type: 'REMOVE_MILEAGE_FAILED'
                    });
                });

        case UPDATE_OIL:
            store.dispatch({
                type: 'UPDATE_OIL_$PROGRESS'
            });
            return myCarService.updateOil(action.params)
                .then(response => {
                    store.dispatch({
                        type: 'GET_CAR'
                    });
                    next({
                        ...action,
                        response: response,
                    })
                }).catch(() => {
                    store.dispatch({
                        type: 'UPDATE_OIL_FAILED'
                    });
                });

        case GET_CAR_PRICE_ESTIMATE :
            const currentUser = store.getState().registration.userProfile.myProfile;
            return carInformationService.estimateCarPrice().then(response => {
                return next({
                    type: GET_CAR_PRICE_ESTIMATE,
                    carPriceEstimation: response ? response.data : {},
                });
            }).catch(() => {
                return next({
                    type: GET_CAR_PRICE_ESTIMATE,
                    carPriceEstimation: {},
                });
            });

        case GET_CAR_SELL_ESTIMATE :
            return carInformationService.estimateCarSell().then(response => {
                return next({
                    type: GET_CAR_SELL_ESTIMATE,
                    carSellEstimation: response ? response.data : {},
                });
            });

        case GET_RECALL :
            return carInformationService.getMyCarRecall(action.car_id, action.car_form).then(response => {
                return next({
                    type: GET_RECALL,
                    recall: response.data ? response.data.data : [],
                    totalConfirm: response.data ? response.data.total_confirm : 0
                });
            });

        case GET_MILEAGE:
            return myCarService.getMileage().then(response => {
                    next({
                        ...action,
                        mileageHistory: response
                    })
                });

        case CONFIRM_RECALL:
            return myCarService.confirmRecall(action.params)
                .then((response) => {
                    store.dispatch(getRecall(action.params.id, action.params.form));
                    next({
                        ...action,
                        response: response,
                    });
                });

        case UNCONFIRM_RECALL:
            return myCarService.unconfirmRecall(action.params)
                .then((response) => {
                    store.dispatch(getRecall(action.params.id, action.params.form));
                    next({
                        ...action,
                        response: response,
                    });
                });

        case UPDATE_INSURANCE:
            store.dispatch({
                type: 'UPDATE_INSURANCE_$PROGRESS'
            });
            return myCarService.updateInsurance(action.params)
                .then((response) => {
                    store.dispatch({
                        type: 'GET_USER_PROFILE'
                    });
                    next({
                        ...action,
                        response: response,
                    });
                }).catch(() => {
                    Alert.alert('アップデートに失敗しました');
                    store.dispatch({
                        type: 'UPDATE_INSURANCE_FAILED'
                    });
                });

        case UPDATE_CAR:
            store.dispatch({
                type: 'UPDATE_CAR_$PROGRESS'
            });
            return myCarService.updateCar(action.params)
                .then((response) => {
                    store.dispatch({
                        type: 'GET_CAR'
                    });
                    next({
                        ...action,
                        response: response,
                    });
                }).catch(() => {
            Alert.alert('アップデートに失敗しました');
            store.dispatch({
                type: 'UPDATE_CAR_FAILED'
            });
        });
        case UPDATE_TIRE:
            store.dispatch({
                type: 'UPDATE_TIRE_$PROGRESS'
            });
            return myCarService.updateTire(action.tire, action.id)
                .then(()=>{
                    next({...action})
                })
                .catch(() => {
                    Alert.alert('アップデートに失敗しました');
                    store.dispatch({
                        type: 'UPDATE_TIRE_FAILED'
                    });
                });

        case UPDATE_CAR_IMAGE:
            return myCarService.updateCarImage(action.params)
                .then(()=>{
                    store.dispatch({
                        type: 'GET_CAR'
                    });
                    store.dispatch({
                        type: 'GET_USER_PROFILE'
                    });
                    next({
                        ...action
                    })
                })
                .catch(() => {
                    Alert.alert('アップデートに失敗しました');
                });

        case REMOVE_CAR_IMAGE:
            return myCarService.removeCarImage(action.id)
                .then(()=>{
                    store.dispatch({
                        type: 'GET_CAR'
                    });
                    store.dispatch({
                        type: 'GET_USER_PROFILE'
                    });
                    next({
                        ...action
                    })
                })
                .catch(() => {
                    Alert.alert('エラー');
                });

        case UPDATE_CAR_LOOKUP:
            return myCarService.updateCarLookup()
                .then(response => {
                    if (response.status === 'confirm') {
                        Alert.alert(
                            '車検証更新',
                            response.message,
                            [
                                {text: 'はい', onPress: () => {
                                    myCarService.confirmCarLookup(true).then(response => {
                                        next({...action, myCarInformation: response.result ? response.result : {}})
                                    });
                                }},
                                {text: 'いいえ', onPress: () => {
                                    myCarService.confirmCarLookup(false);
                                }},
                            ],
                            {cancelable: false}
                        )
                    }
                    if (response.status === 'success'){
                        next({...action, myCarInformation: response.result ? response.result : {}})
                    }
                });

        case UPDATE_ADVERTISING:
            store.dispatch({
                type: 'UPDATE_ADVERTISING_$PROGRESS'
            });
            return myCarService.getTireAdvertising(action.tire ? action.tire : 'all')
                .then(response =>next({...action, advertising: response}))
                .catch(()=> {
                    return store.dispatch({
                        type: 'UPDATE_ADVERTISING_FAILED'
                    })
                });

        case GET_CAMPAIGN:
            return myCarService.getCampaign()
                .then((response) => {
                    next({
                        ...action,
                        response: response,
                    });
                }).catch(() => {
                    store.dispatch('GET_CAMPAIGN_FAIL')
                });

        default :
            next(action)
    }
};
export default carInformationMiddleware
