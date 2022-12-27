import React, {Component} from 'react';
import {Alert} from "react-native";
import {navigationService} from "../../services";
import store from "../../../carpon/store";
import {GET_USER_PROFILE} from "../../Account/actions/accountAction";
import {UPDATE_HOYU_NOT_FOUND} from "../actions/registration";

export class AlertsCarNotHOYU extends Component{

    register() {
        Alert.alert(
            'マイカー登録できません',
            'データベース未登録車両のためマイカー登録出来ませんでした。手動での登録をお試しください。',
            [
                {text: 'OK', onPress: () => {
                    store.dispatch({
                        type: UPDATE_HOYU_NOT_FOUND
                    });
                }},
            ],
            {cancelable: false}
        );
    }

    changeOrAdd() {
        store.dispatch({
            type: GET_USER_PROFILE
        });
        Alert.alert(
            'マイカー登録できません',
            'データベース未登録車両のためマイカー登録出来ませんでした。登録準備が整いましたらメッセージでお知らせしますので今しばらくお待ち下さい。',
            [
                {text: 'OK', onPress: () => navigationService.popToTop()},
            ],
            {cancelable: false}
        );
    }
}
