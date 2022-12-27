import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, Keyboard, View, Alert, Platform, InputAccessoryView} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import {navigationService, userProfileService} from "../../../carpon/services";
import {getUserProfile} from "../actions/accountAction";
import Spinner from 'react-native-loading-spinner-overlay';
import UpdateInputText from "../../../components/UpdateInputText";
import Icon from 'react-native-vector-icons/FontAwesome';
import {viewPage} from "../../Tracker";

@screen('UpdatePassword', {header: <HeaderOnPress title={'パスワード'}/>})
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
export class UpdatePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: null,
            password: null,
            password_confirm: null,
            loading: false,
            disable: true,
            passwordMatched: false
        };
    }

    componentDidMount() {
        viewPage('edit_password', 'パスワード変更');
    }

    handleUpdate() {
        this.setState({loading: true});
        const {password, old_password} = this.state;
        userProfileService.updatePassword({old_password, password}).then(response => {
            this.props.getUserProfile();
            Alert.alert(
                '更新完了',
                '登録情報を更新しました。',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                        navigationService.goBack()
                    }},
                ],
                {cancelable: false}
            );
        }).catch(error => {
            Alert.alert(
                'エラー',
                (error.response.data && error.response.data.message === 'ERROR_OLD_PASSWORD_WRONG') ? '古いパスワードが間違っています' : 'エラー',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                    }},
                ],
                {cancelable: false});
            }
        );
    }

    handleOnChangeText = (text, field) => {
        this.state[field] = text;
        if (field !== 'old_password') {
            const {password, password_confirm} = this.state;
            if(field === 'password_confirm') {
                password && password_confirm && password === text && text.length >= 6 ? this.state.passwordMatched = true
                    : this.state.passwordMatched = false;
            }else if(field === 'password') {
                password && password_confirm && text === password_confirm && text.length >=6 ? this.state.passwordMatched = true
                    : this.state.passwordMatched = false;
            }
        }
        if (this.state.old_password && this.state.passwordMatched) {
            this.setState({disable: false})
        } else {
            this.setState({disable: true})
        }
    };

    render() {
        const inputAccessoryViewID ='inputAccessoryViewID';
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
                        <View style={{paddingHorizontal: 15, marginBottom: 10, marginTop: 20}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='以前のパスワード'
                                secureTextEntry
                                value={this.state.old_password}
                                onChangeText={(val) => this.handleOnChangeText(val, 'old_password')}
                                validationIcon={this.state.old_password ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginVertical: 10}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='パスワード'
                                secureTextEntry
                                value={this.state.password}
                                onChangeText={(val) => this.handleOnChangeText(val, 'password')}
                                validationIcon={this.state.password ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginVertical: 10}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='パスワード（確認用）'
                                secureTextEntry
                                value={this.state.password_confirm}
                                onChangeText={(val) => this.handleOnChangeText(val, 'password_confirm')}
                                validationIcon={(this.state.password_confirm && this.state.passwordMatched) ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                    </View>
                }
                bottomContent={
                    Platform.OS === 'ios' ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={{backgroundColor: !this.state.passwordMatched ? 'transparent' : 'rgba(112, 112, 112, 0.5)', padding: 10,marginBottom: '15%'}}>
                                <ButtonText disabled={!this.state.passwordMatched} title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                            </View>
                        </InputAccessoryView>
                        :  <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                            <ButtonText disabled={!this.state.passwordMatched} title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                        </View>
                }
            />
        )
    }
}

