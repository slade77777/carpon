import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Alert, Dimensions, InputAccessoryView, Platform, SafeAreaView, Text, View} from 'react-native';
import {HeaderCarpon, InputText} from '../../../components/index';
import LoadingComponent from "../../../components/Common/LoadingComponent";
import {apiSMSService, navigationService} from "../../services/index";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import JapaneseText from "../../../components/JapaneseText";
import {connect} from 'react-redux';
import {viewPage} from "../../Tracker";

const {width, height} = Dimensions.get('window');

const PHONE_REGEX = /^(\d{3})(\d{4})(\d{4})$/;

@screen('ConfirmPhone', {header: <HeaderCarpon title="SMS認証"/>})
@connect(state => ({
        email: state.registration.credential.email
    })
)
export class ConfirmPhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileFormat: '',
            mobile: '',
            disabled: true,
            isLoading: false
        };
    }

    componentDidMount() {
        viewPage('input_sms_verification_new_device', 'SMS認証コード入力_新規デバイス');
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


    handleGetAuthOTP() {
        this.setState({
            isLoading: true,
            disabled: true,
        });
        apiSMSService.getAuthOTPForDevice({
            mobile: this.state.mobile,
            email: this.props.email
        }).then(() => {
            navigationService.navigate('VerifyPhoneNumberNewDevice')
        }).catch(() => {
            Alert.alert('エラー', 'ご利用できない番号です')
        }).finally(() => {
            this.setState({disabled: false, isLoading: false})
        });
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryPhoneViewID';
        return (
            <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
                <View style={{height: '100%', backgroundColor: 'white'}}>
                    {
                        this.state.isLoading ?
                            <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '120%'}}/> : null
                    }
                    <View style={{padding: 15}}>
                        <Text style={{fontSize: 16, lineHeight: 24}}>携帯電話のSMS（ショートメッセージ）を利用して本人確認を行います。ご利用中の携帯電話番号を入力してください。</Text>
                    </View>
                    <View>
                        <View style={{padding: 15, paddingBottom: 40}}>
                            <InputText
                                style={{fontSize: 18}}
                                labelBold={true}
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

