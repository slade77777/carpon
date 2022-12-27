import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {InputAccessoryView, Platform, SafeAreaView, Text, TouchableOpacity, View, Keyboard} from 'react-native';
import {ButtonText, InputText} from '../../../components';
import {connect} from 'react-redux'
import {loginEmail} from "../../FirstLoginPhase/actions/registration";
import HeaderOnPress from "../../../components/HeaderOnPress";
import LoadingComponent from "../../../components/Common/LoadingComponent";
import {navigationService} from "../../services/index";
import {viewPage} from "../../Tracker";

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@screen('LoginFormFields', {header: <HeaderOnPress title={'ログイン'}/>})
@connect((state) => ({
        logged: state.registration ? state.registration.credential.login : false,
        loading: state.registration ? state.registration.credential.loading : false
    }),
    dispatch => ({
        loginEmail: (loginInformation) => dispatch(loginEmail(loginInformation))
    })
)
export class LoginFormFields extends Component {
    state = {
        email: null,
        validate: false
    };

    componentDidMount() {
        viewPage('input_email_for_login', 'ログイン_メールアドレス入力');
    }

    handleOnChangeText(text, fields) {
        this.setState({
            [fields]: text,
            validate: this.validateEmail(text)
        });
    }

    validateEmail(email) {
        return EMAIL_REGEXP.test(email);
    }

    handleLogin() {
        const {email} = this.state;
        const Email = email ? email.toLowerCase() : null;
        const loginInformation = {
            email: Email,
            platform: Platform.OS
        };
        this.state.validate && this.props.loginEmail(loginInformation);
        Keyboard.dismiss();
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <View style={{flex: 1}}>
                {
                    this.props.loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>
                }
                <View
                    style={{
                        backgroundColor: '#fff',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                    <View style={{margin: 15}}>
                        <View style={{marginTop: 10}}>
                            <Text style={{fontSize: 17, color: '#666', marginVertical: 18}}>登録したメールアドレスを入力してください。</Text>
                            <InputText
                                keyboardType='email-address'
                                autoCapitalize={'none'}
                                style={{fontSize: 18}}
                                autoCompleteType={'email'}
                                inputAccessoryViewID={inputAccessoryViewID}
                                title={'メールアドレス'}
                                value={this.state.email}
                                onChangeText={(text) => this.handleOnChangeText(text, 'email')}
                            />
                        </View>

                        <View style={{
                            padding: 15,
                            borderWidth: 0.5,
                            borderColor: '#E5E5E5',
                            borderRadius: 3,
                            marginTop: 35,
                        }}
                              onStartShouldSetResponderCapture={() => Keyboard.dismiss()}
                        >
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 17,
                                color: '#666666',
                                lineHeight: 25,
                                paddingVertical: 20
                            }}>
                                その他ご不明点等ございましたら
                                以下よりお問い合わせください。
                            </Text>
                            <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('Contact', {type: 'Account'})} style={{
                                height: 50,
                                backgroundColor: '#EFEFEF',
                                justifyContent: 'center',
                                borderRadius: 3
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: '#666666'
                                }}>お問い合わせ</Text>
                            </TouchableOpacity>
                        </View>
                        {Platform.OS === 'ios'
                        && (
                            <InputAccessoryView nativeID={inputAccessoryViewID}>
                                <View style={{
                                    backgroundColor: 'rgba(112, 112, 112, 0.5)',
                                    padding: 15,
                                    bottom: 0,
                                    width: '100%'}}>
                                    <ButtonText title={'次へ'}
                                                style={{backgroundColor: this.state.validate ? '#F37B7D' : '#E5E5E5'}}
                                                onPress={() => this.handleLogin()}/>
                                </View>
                            </InputAccessoryView>)
                        }
                    </View>
                    {Platform.OS === 'android' &&
                    <View
                        style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)',
                            padding: 15,
                            position: 'absolute',
                            bottom: 0,
                            width: '100%'}}>
                        <ButtonText title={'次へ'}
                                    style={{backgroundColor: this.state.validate ? '#F37B7D' : '#E5E5E5'}}
                                    onPress={() => this.handleLogin()}/>
                    </View>
                    }
                </View>
            </View>
        )
    }
}
