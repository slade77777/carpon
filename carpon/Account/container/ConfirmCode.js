import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, Keyboard, View, Alert, Platform, InputAccessoryView} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import {navigationService, userProfileService} from "../../../carpon/services";
import {getUserProfile} from "../actions/accountAction";
import Spinner from 'react-native-loading-spinner-overlay';
import color from "../../color";
import moment from 'moment';
import {viewPage} from "../../Tracker";

@screen('ConfirmCode', {header: <HeaderOnPress title={'メールアドレス'}/>})
@connect(
    state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }),
    dispatch => ({
        getUserProfile: () => {
            dispatch(getUserProfile())
        }
    })
)
export class ConfirmCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: null,
            loading: false
        };
    }

    componentDidMount() {
        viewPage('change_email_verification', 'メールアドレス変更コード入力');
    }

    handleUpdateCode() {
        this.setState({loading: true});
        const code = this.state.code;
        userProfileService.confirmEmail({code, email: this.props.navigation.getParam('email')}).then(response => {
            Alert.alert(
                'メールアドレス変更完了',
                'メールアドレスを変更しました。',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                        this.props.getUserProfile();
                        this.props.navigation.pop(2);
                    }},
                ],
                {cancelable: false}
            );
        })
            .catch(error => {
                Alert.alert(
                'エラー',
                (error.response.data && error.response.data.message === 'ERROR_CODE_INVALID') ? 'コードが正しくありません。再入力してください。' : 'エラー',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                    }},
                ],
                {cancelable: false}
            );
            }
        );
    }

    render() {
        const inputAccessoryViewID ='inputAccessoryID';
        return (
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <View style={{height: '100%', backgroundColor: 'white'}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={null}
                            textStyle={{color: 'white'}}
                        />
                        <View style={{ marginHorizontal: 15, marginVertical: 30, borderWidth: 3, borderColor: color.active }}>
                            <View style={{padding: 10}}>
                                <Text>
                                    {moment(new Date()).format('YYYY/M/D HH:mm')}
                                </Text>
                                <Text style={{ marginTop: 10}}>
                                    {this.props.navigation.getParam('email')}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginHorizontal: 15}}>
                            <Text style={{ lineHeight: 25}}>
                                上記のアドレスにメールを送信しました。内容をご確認いただき、記載されている認証番号を以下に記入し「メールアドレス変更」ボタンをタップしてください。
                            </Text>
                        </View>
                        <View style={{paddingHorizontal: 15, marginVertical: 20}}>
                            <InputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='認証番号入力'
                                value={this.state.code}
                                onChangeText={(val) => this.setState({code: val})}
                            />
                        </View>
                    </View>
                }
                bottomContent={
                    Platform.OS === 'ios' ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={{backgroundColor: !this.state.code ? 'white' : 'rgba(112, 112, 112, 0.5)', padding: 10}}>
                                <ButtonText disabled={!this.state.code} title={'変更申請'} onPress={() => this.handleUpdateCode()}/>
                            </View>
                        </InputAccessoryView>
                        :  <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                            <ButtonText disabled={!this.state.code} title={'変更申請'} onPress={() => this.handleUpdateCode()}/>
                        </View>
                }
            />
        )
    }
}

