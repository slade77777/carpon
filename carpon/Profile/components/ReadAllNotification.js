import React                             from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import { connect }                       from "react-redux";
import { notificationService }           from "../../services";
import {_readAllNotification} from "../../common/actions/notification";
import notifee from '@notifee/react-native';

function readAllNotification(props) {

    const readAll = () => {
        notificationService.ReadAllNotification().then(response => {
            props._readAllNotification();
        });
    };

    return(
        <TouchableOpacity
            disabled={props.unreadNotificationNumber === 0}
            onPress={() => {
                Alert.alert(
                    'すべて既読にします',
                    '未読のお知らせをすべて既読にします。よろしいですか?',
                    [
                        {
                            text: 'はい', onPress: () => {
                                readAll();
                            }
                        },
                        {
                            text: 'いいえ'
                        },
                    ],
                    {cancelable: false}
                )
            }}
        >
            <Text style={{ color: props.unreadNotificationNumber === 0 ? '#909090' : props.color, fontWeight: props.bold, paddingTop: 19, paddingBottom: 20, fontSize: 15 }}>{props.name}</Text>
        </TouchableOpacity>
    );
}

export default connect((state) => ({
    unreadNotificationNumber: state.notification ? state.notification.unreadNumber : 0
}),(dispatch) => ({
    _readAllNotification: ()=> dispatch(_readAllNotification())
}))
(readAllNotification)
