import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, View, TouchableOpacity, InputAccessoryView, Platform, Alert} from 'react-native';
import {InputText, ButtonText} from '../../../components';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {apiVerifySMS, navigationService} from "../../services/index";
import {SingleColumnLayout} from "../../layouts";

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@screen('ConfirmEmailForm', {header: <HeaderOnPress title={'パスワード再設定'}/>})
export class ConfirmEmailForm extends Component {
    state = {
        email: null,
    };

    validateEmail() {
        return EMAIL_REGEXP.test(this.state.email);
    }

    handleUpdate() {
        apiVerifySMS.forgotPassword(this.state.email).then(() => {
            navigationService.navigate('ResetPassword', {email: this.state.email});
        }).catch(() => {
            Alert.alert('このメールアドレスは存在しません');
        })
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryEmailID';
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
                            <View style={{ marginTop: 20}}>
                                <Text style={{ fontSize: 16, lineHeight: 24}}>パスワードを再設定します。登録したメールアドレスを入力し、送信してください。</Text>
                            </View>
                            <View style={{marginTop: 40}}>
                                <InputText
                                    keyboardType='email-address'
                                    autoCapitalize={'none'}
                                    style={{fontSize: 18}}
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title={'メールアドレス'}
                                    value={this.state.email}
                                    onChangeText={(text) => this.setState({email: text})}
                                />
                            </View>
                            <View style={{padding: 15, borderWidth: 1, borderColor: '#E5E5E5', margin: 15, borderRadius: 3, marginTop: 30}}>
                                <Text style={{textAlign: 'center', fontSize: 12, color: '#666666', lineHeight: 15, marginHorizontal: 30}}>
                                    その他ご不明点等ございましたら
                                    以下よりお問い合わせください。
                                </Text>
                                <TouchableOpacity onPress={() => navigationService.navigate('Contact')} style={{ margin: 15, height: 44, backgroundColor: '#EFEFEF', justifyContent: 'center'}}>
                                    <Text style={{ fontSize: 14, textAlign: 'center', fontWeight: 'bold', color: '#666666'}}>お問い合わせ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    }
                bottomContent={
                Platform.OS === 'ios' ?
                    <InputAccessoryView nativeID={inputAccessoryViewID}>
                        <View style={{backgroundColor: !this.validateEmail() ? 'white' : 'rgba(112, 112, 112, 0.5)', padding: 10, marginBottom: 40}}>
                            <ButtonText disabled={!this.validateEmail()} title={'送信する'} onPress={() => this.handleUpdate()}/>
                        </View>
                    </InputAccessoryView>
                    :  <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                        <ButtonText disabled={!this.validateEmail()} title={'送信する'} onPress={() => this.handleUpdate()}/>
                    </View>
            }
            />
        )
    }
}
