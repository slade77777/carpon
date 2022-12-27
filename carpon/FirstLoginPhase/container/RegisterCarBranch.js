import React, { Component } from 'react';
import { Text, View, Alert, BackHandler } from 'react-native';
import { screen } from '../../../navigation';
import { RegisterCarModel } from "./RegisterCarModel";
import HeaderCarpon from "../../../components/HeaderCarpon";
import {ManufacturerList} from "../../../components/ManufacturerList/index";
import {navigationService} from "../../services/index";

@screen('RegisterCarBranch', { header: <HeaderCarpon title={'メーカー'}/> })
export class RegisterCarBranch extends Component {

    handleBackButton() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                'キャンセルの確認',
                '車両登録申請はインストール端末ごとに2度までとなっています。あと1度だけ登録を行うことができます。',
                [
                    {
                        text: '他の車で登録し直す（残り1回）',
                        onPress: () => {
                            navigationService.clear('CarType', {register: 1});
                        }, style: 'destructive',
                    },
                    {text: 'このまま登録を進める', style: 'cancel'},
                ],
                {cancelable: false}
            );
            return true;
        });
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("willFocus", () => this.handleBackButton()),
            this.props.navigation.addListener("willBlur", () => this.backHandler.remove())
        ];
    }

    onPressView(data) {
        return navigationService.navigate('RegisterCarModel', { maker_code: data['maker_code'], maker_name: data['maker_name'] });
    }

    render() {
        return (
            <View>
                <View style={{ backgroundColor: 'white'}}>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 20}}>
                        メーカーが特定出来ませんでした。
                    </Text>
                    <Text style={{textAlign: 'center', marginTop: 5, marginBottom: 20}}>
                        該当するメーカーを選択してください。
                    </Text>
                </View>
                <ManufacturerList onPress={this.onPressView.bind(this)}/>
            </View>
        )
    }
}


