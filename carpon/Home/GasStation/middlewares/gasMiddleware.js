import {GET_LIST_GAS_STATION} from "../actions/gasAction";
import {myCarService} from "../../../services";
import {Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {addTrackerEvent} from "../../../Tracker";
import Geolocation from '@react-native-community/geolocation';

const gasMiddleware = store => next => action => {

    switch (action.type) {
        case GET_LIST_GAS_STATION:
            store.dispatch({
                type: 'GET_LIST_GAS_$PROGRESS'
            });
            return request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                }),
            ).then(response => {
                if (response === 'denied' || response === 'restricted') {
                    addTrackerEvent('gps_status_change', {
                        user_permits_gps: false
                    });
                    return myCarService.getGasStationList(action.range, null)
                        .then((data) => {
                            let listGasStation = data[0].data || [];
                            let lowestThreeStation = data[1].data || [];
                            if (listGasStation.length > 0) {
                                let ItemPriceMin = lowestThreeStation[0];
                                next({
                                    ...action,
                                    listGasStation: listGasStation,
                                    lowestThreeStation, ItemPriceMin,
                                    range: action.range
                                });
                                store.dispatch({
                                    type: 'STOP_LOADING'
                                });
                            } else {
                                next({
                                    ...action,
                                    lowestThreeStation: [],
                                    listGasStation: [],
                                    ItemPriceMin: {},
                                    range: action.range
                                });
                                store.dispatch({
                                    type: 'STOP_LOADING'
                                });
                            }
                        }).catch(() => {
                            next({
                                ...action,
                                listGasStation: [],
                                lowestThreeStation: [],
                                ItemPriceMin: {},
                                range: action.range
                            });
                            store.dispatch({
                                type: 'STOP_LOADING'
                            });
                        });
                } else {
                    addTrackerEvent('gps_status_change', {
                        user_permits_gps: true
                    });
                    Geolocation.getCurrentPosition(
                        (position) => {
                            const cor = position.coords;
                            return myCarService.getGasStationList(action.range, cor)
                                .then((data) => {
                                    let listGasStation = data[0].data || [];
                                    let lowestThreeStation = data[1].data || [];
                                    if (listGasStation.length > 0) {
                                        let ItemPriceMin = lowestThreeStation[0];
                                        next({
                                            ...action, lowestThreeStation,listGasStation,ItemPriceMin,
                                            range: action.range
                                        });
                                        store.dispatch({
                                            type: 'STOP_LOADING'
                                        });
                                    } else {
                                        next({
                                            ...action,
                                            lowestThreeStation: [],
                                            listGasStation: [],
                                            ItemPriceMin: {},
                                            range: action.range
                                        });
                                        store.dispatch({
                                            type: 'STOP_LOADING'
                                        });
                                    }
                                }).catch(() => {
                                    next({
                                        ...action,
                                        lowestThreeStation: [],
                                        listGasStation: [],
                                        ItemPriceMin: {},
                                        range: action.range
                                    });
                                    store.dispatch({
                                        type: 'STOP_LOADING'
                                    });
                                });
                        },
                        () => {
                            return myCarService.getGasStationList(action.range, null)
                                .then((data) => {
                                    let listGasStation = data[0].data || [];
                                    let lowestThreeStation = data[1].data || [];
                                    if (listGasStation.length > 0) {
                                        let ItemPriceMin = lowestThreeStation[0];
                                        next({
                                            ...action, lowestThreeStation,listGasStation,ItemPriceMin,
                                            range: action.range
                                        });
                                        store.dispatch({
                                            type: 'STOP_LOADING'
                                        });
                                    } else {
                                        next({
                                            ...action,
                                            lowestThreeStation: [],
                                            listGasStation: [],
                                            ItemPriceMin: {},
                                            range: action.range
                                        });
                                        store.dispatch({
                                            type: 'STOP_LOADING'
                                        });
                                    }
                                }).catch(() => {
                                    next({
                                        ...action,
                                        lowestThreeStation: [],
                                        listGasStation: [],
                                        ItemPriceMin: {},
                                        range: action.range
                                    });
                                    store.dispatch({
                                        type: 'STOP_LOADING'
                                    });
                                });
                        },
                        {
                            enableHighAccuracy: Platform.OS === 'ios', timeout: 5000, maximumAge: 3600000
                        }
                    );
                }
            }).catch(error => console.log(error));
        default :
            return next(action);
    }
};

export default gasMiddleware;
