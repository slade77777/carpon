import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {SafeAreaView, Text, View} from 'react-native';
import HeaderCarpon from "../../../components/HeaderCarpon";
import ImageLoader from '../../../components/ImageLoader';
import {images} from "../../../assets/index";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import {navigationService} from "../../services/index";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";

@screen('RegistrationNotification', {header: <HeaderCarpon title={'通知の許可設定'}/>})

export class RegistrationNotification extends Component {
    constructor(props) {
        super(props);
        this.onPressView = this.onPressView.bind(this);
    }

    onPressView() {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    // this.registerListener();
                    navigationService.clear('RegisterPhoneNumber');
                } else {
                    // Linking.openURL('app-settings:notifications');
                    firebase.messaging().requestPermission()
                        .then(() => {
                            navigationService.clear('RegisterPhoneNumber');
                        })
                        .catch(error => {
                            navigationService.clear('RegisterPhoneNumber');
                            // console.log(error);
                        });
                }
            });
    };

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: '#FFFFFF'
            }}>
                <View
                    style={{backgroundColor: '#FFFFFF', height: '100%', justifyContent: 'space-between', padding: 15}}>
                    <View style={{flex : 1}}>
                        <Text style={{fontSize: 17, fontWeight: 'bold', color: '#333333'}}>おクルマ情報をプッシュ通知でお届け</Text>
                        <Text style={{
                            lineHeight: 20,
                            fontSize: 16,
                            color: '#333333',
                            marginTop: 10
                        }}>車検や任意保険、免許証の更新など、カーライフに関する大切な情報をタイムリーにお届けします。</Text>
                        <View style={{flex: 0, width: '100%', height: '50%', alignItems : 'center', justifyContent : 'center', marginTop : 20}}>
                            <ImageLoader style={{flex: 1, width : '100%'}} source={images.notification}/>
                        </View>
                    </View>
                    <View>
                        <ButtonCarpon onPress={() => this.onPressView()} style={{backgroundColor: '#F06A6D'}}>
                            <Text style={{
                                color: 'white',
                                fontSize: 14,
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}>通知の許可設定</Text>
                        </ButtonCarpon>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
