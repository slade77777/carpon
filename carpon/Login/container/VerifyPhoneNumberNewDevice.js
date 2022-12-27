import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {View, InputAccessoryView, Platform, Text} from 'react-native';
import {InputText, ButtonText} from '../../../components';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {SingleColumnLayout} from "../../layouts";
import {connect} from 'react-redux'
import {verifyPhoneNumber} from "../../FirstLoginPhase/actions/registration";
import JapaneseText from "../../../components/JapaneseText";
import {viewPage} from "../../Tracker";

@screen('VerifyPhoneNumberNewDevice', {header: <HeaderOnPress title={'認証番号の入力'}/>})
@connect(state => ({
        email: state.registration.credential.email,
        loading: state.registration.credential.loading
    }),
    dispatch => ({
        verifyPhoneNumber: (info)=> dispatch(verifyPhoneNumber(info))
    })
)
export class VerifyPhoneNumberNewDevice extends Component {

    state = {
        code: ''
    };

    componentDidMount() {
        viewPage('input_phonenumber_new_device', 'SMS認証電話番号入力_新規デバイス');
    }

    handleConfirmCode() {
        const emailInformation = {
            email: this.props.email,
            code: this.state.code,
            target: 'login'
        };
        this.props.verifyPhoneNumber(emailInformation)
    }

    handleChange(code) {
        this.setState({
            code: code
        })
    }

    render() {
        const inputAccessoryViewID = 'verifyPhoneNumber';
        return (
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                <View style={{
                    backgroundColor: '#fff',
                    height: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <View style={{margin: 15}}>
                        <Text style={{fontSize: 16, lineHeight: 24}}>
                            携帯電話のSMS（ショートメッセージ）に届いた4桁の認証番号を入力してください。
                        </Text>
                        <View style={{marginTop: 40}}>
                            <InputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                style={{fontSize: 18}}
                                title='認証コード'
                                value={this.state.code}
                                autoFocus={true}
                                placeholder={'認証コード'}
                                keyboardType={'numeric'}
                                maxLength={4}
                                onChangeText={(code) => this.handleChange(code)}
                            />
                        </View>
                    </View>
                </View>
            }
            bottomContent={
                Platform.OS === 'ios' ?
                    <InputAccessoryView nativeID={inputAccessoryViewID}>
                        <View style={{backgroundColor: (!this.state.code) ? 'white' : 'rgba(112, 112, 112, 0.5)', padding: 15}}>
                            <ButtonText disabled={!this.state.code} title={'ログイン'} onPress={() => this.handleConfirmCode()}/>
                        </View>
                    </InputAccessoryView>
                    :  <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                        <ButtonText disabled={!this.state.code} title={'ログイン'} onPress={() => this.handleConfirmCode()}/>
                    </View>
                }
            />

        )
    }
}
