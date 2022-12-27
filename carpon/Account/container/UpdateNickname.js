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
import {updateReview} from "../../Home/Review/action/ReviewAction";
import {viewPage} from "../../Tracker";

@screen('UpdateNickname', {header: <HeaderOnPress title={'ニックネーム'}/>})
@connect(
    state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }),
    dispatch => ({
        getUserProfile: () => {
            dispatch(getUserProfile())
        },
        updateReview: () => dispatch(updateReview()),
    })
)
export class UpdateNickname extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: this.props.userProfile ? this.props.userProfile.nick_name : null,
            loading: false
        };
    }

    componentDidMount() {
        viewPage('edit_nickname', 'ニックネーム変更');
    }

    async handleUpdate() {
        this.setState({loading: true});
        const {nickname} = this.state;
        userProfileService.updateUserProfile({nick_name: nickname}).then(response => {
            this.props.getUserProfile();
            this.props.updateReview();
            if (!this.props.navigation.getParam('fromReview')) {
                Alert.alert(
                    '更新完了',
                    '登録情報を更新しました。',
                    [
                        {text: 'OK', onPress: () => navigationService.goBack()},
                    ],
                    {cancelable: false}
                );
            } else {
                Alert.alert(
                    'ニックネーム登録完了',
                    'ニックネームを登録しました。',
                    [
                        {text: 'OK', onPress: () => {
                            this.setState({loading: false})
                            navigationService.clear('MainTab', {tabNumber: 3})}
                        },
                    ],
                    {cancelable: false}
                );
            }
        }).catch(error => {
            Alert.alert(
                'エラー',
                'エラー',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                    }},
                ],
                {cancelable: false}
            );
        })
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
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
                        <View style={{paddingHorizontal: 15, marginVertical: 15}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='ニックネーム'
                                value={this.state.nickname}
                                onChangeText={(val) => this.setState({nickname: val})}
                                validationIcon={this.state.nickname ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                    </View>
                }
                bottomContent={
                    Platform.OS === 'ios' ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={{ padding: 15}}>
                                <ButtonText disabled={false} title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                            </View>
                        </InputAccessoryView>
                   :  <View style={{paddingHorizontal: 15, marginBottom: 15}}>
                            <ButtonText disabled={false} title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                        </View>
                }
            />
        )
    }
}

