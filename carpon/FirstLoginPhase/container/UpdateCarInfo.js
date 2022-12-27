import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Alert} from "react-native";
import {navigationService} from "../../services";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {UpdateCarInfoComponent} from "../components/UpdateCarInfoComponent";
import store from '../../store';
import {viewPage} from "../../Tracker";

@screen('UpdateCarInfo', () => ({
    header: <HeaderOnPress onPress={() =>{
        let registrationCount = store.getState().registration.carProfile.profile.count_update_car ? store.getState().registration.carProfile.profile.count_update_car : 1;
        Alert.alert(
            `やり直す（残り：${3 - registrationCount}回）`,
            'ナンバー読み込みによる登録には回数制限があります。（制限後は、車検証QRスキャンによる車両登録のみ利用可）',
            [
                {
                    text: '車両登録をやり直す',
                    onPress: () => {
                        navigationService.clear('CarType', {registerCarAgain: true})
                    }, style: 'destructive',
                },
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false}
        );
    }} title={'マイカーについて'}/>
}))
export class UpdateCarInfo extends Component {

    componentDidMount() {
        viewPage('select_car_information', '車両情報選択')
    }

    render() {
        return (
            <UpdateCarInfoComponent navigation={this.props.navigation}/>
        )
    }
}
