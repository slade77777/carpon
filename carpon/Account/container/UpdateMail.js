import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, Keyboard, View, Alert, Platform, InputAccessoryView, ScrollView, Dimensions} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import {navigationService, userProfileService} from "../../../carpon/services";
import Spinner from 'react-native-loading-spinner-overlay';
import UpdateInputText from "../../../components/UpdateInputText";
import Icon from 'react-native-vector-icons/FontAwesome';
import {viewPage} from "../../Tracker";


const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@screen('UpdateMail', {header: <HeaderOnPress title={'メールアドレス'}/>})
@connect(
    state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    })
)
export class UpdateMail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.userProfile ? this.props.userProfile.email : null,
            loading: false,
            spaceBottom: 0
        };
    }

    componentDidMount() {
        viewPage('edit_email', 'メールアドレス変更')
    }

    validateEmail() {
        return EMAIL_REGEXP.test(this.state.email);
    }

    handleUpdate() {
        this.setState({loading: true});
        const {email} = this.state;
        userProfileService.updateUserMail({email}).then(response => {
            Alert.alert(
                '送信完了',
                'ご入力メールアドレスにメールアドレス変更用認証番号を送信しました。',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                        navigationService.navigate('ConfirmCode', {email: this.state.email})
                    }},
                ],
                {cancelable: false}
            );
        }).catch(error => {
            Alert.alert(
                'エラー',
                error.response.data.message === 'ERROR_EMAIL_REGISTERED' ? 'すでに使われている Email アドレスです' : 'ネットワークに接続できません',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                    }},
                ],
                {cancelable: false});
            }
        );
    }

    render() {
        const inputAccessoryViewID ='inputAccessoryViewID';
        return (
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <ScrollView scrollIndicatorInsets={{right: 1}} style={{height: '100%' , backgroundColor: '#FFF'}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={null}
                            textStyle={{color: '#FFF'}}
                        />
                        <View style={{paddingHorizontal: 25, marginTop: 20}}>
                            <Text style={{ fontSize: 16, lineHeight: 24}}>
                                メールアドレスを変更する場合は、アドレスが有効であることを確認するため、新しいアドレスに認証番号をお送りします。アドレスの変更後に「変更申請」ボタンをタップしてください。
                            </Text>
                            <Text style={{ fontSize: 16, marginTop: 10, lineHeight: 20 }}>
                                ※しばらく経ってもメールが届かない場合は、迷惑メールに振り分けられていないかご確認ください。
                            </Text>
                        </View>
                        <View style={{paddingHorizontal: 25, marginTop: 20}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='メールアドレス'
                                value={this.state.email}
                                autoCompleteType={'email'}
                                autoCapitalize={'none'}
                                keyboardType='email-address'
                                onChangeText={(val) => this.setState({email: val})}
                                validationIcon={this.state.email && this.validateEmail() ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                    </ScrollView>
                }
                bottomContent={
                    Platform.OS === 'ios' ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={{padding: 15}}>
                                <ButtonText disabled={!this.validateEmail()} title={'変更申請'} onPress={() => this.handleUpdate()}/>
                            </View>
                        </InputAccessoryView>
                        :  <View style={{paddingHorizontal: 15, marginBottom: 15}}>
                            <ButtonText disabled={!this.validateEmail()} title={'変更申請'} onPress={() => this.handleUpdate()}/>
                        </View>
                }
            />
        )
    }
}

