import React, {Component} from 'react';
import {screen} from "../../navigation";
import {HeaderOnPress, InputText} from '../../components';
import {
    Keyboard, Linking, Platform, SafeAreaView, ScrollView, Text, View, KeyboardAvoidingView,
    Dimensions
} from 'react-native';
import {connect} from "react-redux";
import {registerUserProfileConfirmed} from "../FirstLoginPhase/actions/registration";
import LoadingComponent from "../../components/Common/LoadingComponent";
import firebase from "@react-native-firebase/app";
import '@react-native-firebase/messaging';
import {SvgImage, SvgViews} from "../../components/Common/SvgImage";
import {viewPage} from "../Tracker";

const {width, height} = Dimensions.get('window');


@screen('EmailConfirmation', {header: <HeaderOnPress title='認証番号の入力'/>})
@connect(state => ({
        registration: state.registration,
        carProfile: state.registration.carProfile,
        myProfile: state.registration.userProfile.myProfile,
        loading: state.registration ? state.registration.credential.loading : false
    }),
    dispatch => ({
        registerUserProfileConfirmed: (emailInformation) => dispatch(registerUserProfileConfirmed(emailInformation)),
    }))
export class EmailConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null
        };
    }

    componentDidMount() {
        viewPage('input_email_verification', 'メールアドレス認証番号の入力');
        Linking.getInitialURL().then(url => {
            this._handleOpenURL({url})
        });
        Linking.addEventListener('url', (event) => this._handleOpenURL(event));
        const code = this.props.navigation.getParam('code');
        if (code) this.props.registerUserProfileConfirmed({
            code,
            email: this.props.myProfile.email
        });
    }

    _handleOpenURL(event) {
        let verifyUrl = null;
        if (Platform.OS === 'android') {
            verifyUrl = 'http://carponapp.main/register/verify/';
        } else {
            verifyUrl = 'carpon://register/verify/';
        }
        const url = event.url;
        if (url.includes(verifyUrl)) {
            const code = url.replace(verifyUrl, '');
            console.log(code);
            if (code.length === 6) {
                this.props.registerUserProfileConfirmed({
                    code,
                    email: this.props.myProfile.email
                });
            }
        }
    }

    handleChangeText = (code) => {
        this.setState({
                code: code
            },
            () => {
                if (code.length > 3) {
                    Keyboard.dismiss();
                    setTimeout(() => {
                        this.handleVerify();
                    }, 500)
                }
            }
        );
    };

    handleVerify() {
        const emailInformation = {
            code: this.state.code,
            email: this.props.myProfile.email,
            target: 'register',
            device_token: this.state.deviceToken,
            platform: Platform.OS,
        };
        this.props.registerUserProfileConfirmed(emailInformation)
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: '#FFF'}}>
                {this.props.loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '105%'}}/>}
                <KeyboardAvoidingView keyboardVerticalOffset={80} behavior="padding" enabled={Platform.OS === 'ios'}
                                      style={{backgroundColor: '#FFFFFF', height: '100%'}}>
                    <View style={{height: '100%', justifyContent: 'space-between', paddingHorizontal: 15}}
                          onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                        <Text style={{
                            textAlign: 'left',
                            fontSize: 16,
                            paddingBottom: 0,
                            paddingTop: 25,
                            lineHeight: 24,
                            color: '#333333'
                        }}>
                            ご入力いただいたメールアドレスに認証番号をお送りしました。届いたメールを確認し、認証番号を入力してください。
                        </Text>
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
                            <SvgImage source={SvgViews.SendOTPImage}/>
                        </View>

                        <View style={{paddingBottom: height / 3, paddingTop: 15}}>
                            <InputText
                                title={'認証番号'}
                                autoFocus={true}
                                value={this.props.navigation.getParam('code') || null}
                                keyboardType={'numeric'}
                                maxLength={4}
                                onChangeText={this.handleChangeText}
                            />

                            <View style={{flexDirection: 'row', marginTop: 15}}>
                                <View>
                                    <Text style={{
                                        fontSize: 15,
                                        bottom: 2,
                                        color: '#666666'
                                    }}>※
                                    </Text>
                                </View>
                                <View style={{marginLeft: 2}}>
                                    <Text style={{
                                        fontSize: 13,
                                        color: '#666666',
                                    }}>しばらく経ってもメールが届かない場合は、迷惑メールに振り分けられていないかご確認ください。
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}
