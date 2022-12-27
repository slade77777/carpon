import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {InputAccessoryView, Keyboard, Platform, View, SafeAreaView, Linking} from 'react-native';
import {HeaderOnPress, InputText} from '../../../components/index';
import {connect} from "react-redux";
import LoadingComponent from "../../../components/Common/LoadingComponent";
import JapaneseText from "../../../components/JapaneseText";
import {verifyEmail} from "../../FirstLoginPhase/actions/registration";
import ButtonText from "../../../components/ButtonText";
import firebase from "@react-native-firebase/app";
import '@react-native-firebase/messaging';
import {viewPage} from "../../Tracker";

@screen('VerifyLoginCode', {header: <HeaderOnPress title='パスワードの入力'/>})
@connect(state => ({
    email: state.registration.credential.email,
    loading: state.registration.credential.loading
}), dispatch => ({
    verifyEmail: (emailInformation) => dispatch(verifyEmail(emailInformation))
}))
export class VerifyLoginCode extends Component {

    state = {
        code: null,
        isHovered: false,
        validateOPT: false
    };

    componentDidMount() {
        viewPage('input_login_code', 'ログイン_認証コード入力');
        Linking.getInitialURL().then(url => {
            this._handleOpenURL({url})
        });
        Linking.addEventListener('url', (event) => this._handleOpenURL(event));
        if (this.props.navigation.getParam('code')) {
            this.handleChangeText(this.props.navigation.getParam('code'));
        }

        firebase.messaging().getToken()
            .then(fcmToken => {
            this.setState({
                deviceToken: fcmToken
            })
        }).catch(error => {
            console.log(error);
        })
        ;
    }

    _handleOpenURL(event) {
        let loginUrl = null;
        if (Platform.OS === 'android') {
            loginUrl = 'http://carponapp.main/login/verify/';
        } else {
            loginUrl = 'carpon://login/verify/';
        }
        const url = event.url;
        if (url.includes(loginUrl)) {
            const code = url.replace(loginUrl, '');
            if (code.length === 6) {
                this.handleChangeText(code);
            }
        }
    }

    handleOTPCode() {
        const emailInformation = {
            email: this.props.email,
            code: this.state.code,
            device_token: this.state.deviceToken,
            platform: Platform.OS,
            target: 'login'
        };
        this.state.validateOPT && this.props.verifyEmail(emailInformation);
        Keyboard.dismiss()
    };

    handleChangeText(text) {
        this.setState({
            code: text,
            validateOPT: text.length > 5
        })
    }

    renderOtpInput() {
        return <InputText
            secureTextEntry={true}
            inputAccessoryViewID={'OTP'}
            style={{fontSize: 18}}
            title='パスワード'
            value={this.state.code}
            autoFocus={true}
            placeholder={'パスワード'}
            maxLength={6}
            onChangeText={(text) => this.handleChangeText(text)}
        />
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: '#212121', flex: 1}}>
                {this.props.loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                <View style={{height: '100%', backgroundColor: 'white'}}>
                    <JapaneseText style={{
                        color: '#666',
                        fontSize: 17,
                        paddingHorizontal: 15,
                        paddingTop: 30,
                        lineHeight: 25
                    }} value={'メールアドレスにパスワードを送信しました。ご確認の上、以下にパスワードを入力し、ログインしてください。'}
                                  onStartShouldSetResponderCapture={() => Keyboard.dismiss()}
                    />
                    <View>
                        <View style={{paddingTop: 20, paddingHorizontal: 15}}>
                            {this.renderOtpInput()}
                        </View>
                    </View>
                </View>
                <View>
                    {Platform.OS === 'ios'
                    && (
                        <InputAccessoryView nativeID={'OTP'}>
                            <View style={{backgroundColor: '#BBB', padding: 15}}>
                                <ButtonText title={'ログイン'}
                                            style={{backgroundColor: this.state.validateOPT ? '#F37B7D' : '#E5E5E5'}}
                                            onPress={() => this.handleOTPCode()}/>
                            </View>
                        </InputAccessoryView>)
                    }
                    {Platform.OS === 'android' &&
                    <View
                        style={{width: '100%', position: 'absolute', bottom: 0, backgroundColor: '#BBB', padding: 15}}>
                        <ButtonText title={'次へ'}
                                    style={{backgroundColor: this.state.validateOPT ? '#F37B7D' : '#E5E5E5'}}
                                    onPress={() => this.handleOTPCode()}/>
                    </View>
                    }
                </View>
            </SafeAreaView>
        )
    }
}
