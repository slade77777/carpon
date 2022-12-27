import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Dimensions, InputAccessoryView, Platform, SafeAreaView, Text, View, Alert} from 'react-native';
import {HeaderCarpon, InputText} from '../../../../components/index';
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {apiSMSService, navigationService} from "../../../services";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import JapaneseText from "../../../../components/JapaneseText";
import firebase from "@react-native-firebase/app";
import '@react-native-firebase/messaging';
import {viewPage} from "../../../Tracker";

const {width} = Dimensions.get('window');

const PHONE_REGEX = /^(\d{3})(\d{4})(\d{4})$/;

@screen('RegisterPhoneNumber', {header: <HeaderCarpon title="SMS認証"/>})
export class RegisterPhoneNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileFormat: '',
            mobile: '',
            disabled: true,
            isLoading: false
        };
    }

    handleChangeText = (text) => {
        let cleaned = ('' + text).replace(/\D/g, '');
        let match = cleaned.match(PHONE_REGEX);

        if (match) {
            let mobileText = match[0];
            this.setState({
                mobileFormat: match[1] + '-' + match[2] + '-' + match[3],
                mobile: mobileText,
                disabled: false
            });
        } else {
            this.setState({mobileFormat: text, mobile: text, disabled: true})
        }
    };

    componentDidMount() {
        firebase.messaging().getToken().then(fcmToken => {
            this.setState({
                deviceToken: fcmToken
            })
        });
        viewPage('input_phonenumber', 'SMS認証電話番号入力');
    }

    handleGetAuthOTP() {

        this.setState({
            isLoading: true,
            disabled: true,
        });

        let params = {
            mobile: this.state.mobile,
            device_token: this.state.deviceToken,
            platform: Platform.OS
        };
        apiSMSService.getAuthOTP(params).then((response) => {
            this.setState({disabled: false, isLoading: false});
            navigationService.navigate('VerifySMSCode', {
                mobile: this.state.mobile,
                id: response.profile_id,
                ivrNumber: response.ivr_number,
                code: response.code
            });
        }).catch(() => {
            this.setState({disabled: false, isLoading: false});
            Alert.alert(
                'エラー',
                '既に利用されている番号です'
            )
        })
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryRegisterViewID';
        return (
            <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
                {
                    this.state.isLoading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>
                }
                <View style={{height: '100%', backgroundColor: 'white'}}>
                    <View style={{padding: 15}}>
                        <JapaneseText style={{
                            fontSize: 16,
                            lineHeight: 24
                        }} value={'携帯電話のSMS（ショートメッセージ）を利用して本人確認を行います。ご利用中の携帯電話番号を入力してください。'}/>
                    </View>
                    <View>
                        <View style={{padding: 15, paddingBottom: 40}}>
                            <InputText
                                style={{fontSize: 18}}
                                inputAccessoryViewID={inputAccessoryViewID}
                                placeholder='携帯電話番号'
                                autoFocus={true}
                                keyboardType={'numeric'}
                                value={this.state.mobileFormat}
                                dataDetectorTypes={'phoneNumber'}
                                onChangeText={this.handleChangeText}
                                maxLength={this.state.mobileFormat.length >= 11 ? 13 : 12}
                            />
                        </View>
                    </View>
                    {
                        Platform.OS === 'ios'
                            ?
                            <View style={{alignItems: 'flex-end'}}>
                                <InputAccessoryView nativeID={inputAccessoryViewID}>
                                    <View style={{
                                        backgroundColor: this.state.disabled ? 'transparent' : `rgba(38,37,37,0.32)`,
                                        alignItems: 'center',
                                        padding: 15,
                                        height: 70,
                                    }}>
                                        {
                                            !this.state.disabled ?
                                                <ButtonCarpon disabled={this.state.disabled}
                                                              style={{backgroundColor: '#F37B7D'}}
                                                              onPress={this.handleGetAuthOTP.bind(this)}>
                                                    <Text style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 14,
                                                        color: '#FFFFFF'
                                                    }}>SMSに認証番号を送信</Text>
                                                </ButtonCarpon>
                                                : null
                                        }
                                    </View>
                                </InputAccessoryView>
                            </View>
                            :
                            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                <View style={{
                                    backgroundColor: this.state.disabled ? 'transparent' : `rgba(38,37,37,0.32)`,
                                    padding: 15,
                                    height: 70,
                                    width: width
                                }}>
                                    {
                                        !this.state.disabled ?
                                            <ButtonCarpon disabled={this.state.disabled}
                                                          style={{backgroundColor: '#F37B7D'}}
                                                          onPress={this.handleGetAuthOTP.bind(this)}>
                                                <Text style={{
                                                    fontWeight: 'bold',
                                                    fontSize: 14,
                                                    color: '#FFFFFF'
                                                }}>SMSに認証番号を送信</Text>
                                            </ButtonCarpon>
                                            : null
                                    }
                                </View>
                            </View>
                    }
                </View>
            </SafeAreaView>
        )
    }
}

