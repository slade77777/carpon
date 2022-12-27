import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, TouchableOpacity, View, Alert, Platform, InputAccessoryView} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import {navigationService, userProfileService} from "../../../carpon/services";
import {getUserProfile} from "../actions/accountAction";
import Spinner from 'react-native-loading-spinner-overlay';
import color from "../../color";
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {identifyUser, viewPage} from "../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('UpdateBirthday', {header: <HeaderOnPress title={'生年月日'}/>})
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
export class UpdateBirthday extends Component {
    constructor(props) {
        super(props);
        this.state = {
            birthday: this.props.userProfile ? this.props.userProfile.birthday : null,
            loading: false,
            isDateTimePickerVisible: false
        };
    }

    componentDidMount() {
        viewPage('edit_birthday', '生年月日変更')
    }

    handleUpdate() {
        this.setState({loading: true});
        const {birthday} = this.state;
        const profile = this.props.userProfile;
        identifyUser({
            user_id: profile.id,
            user_birthday_date: (new Date(birthday).getTime())/1000,
            user_birthday_month: (new Date(birthday)).getMonth() + 1,
        });
        userProfileService.updateUserProfile({birthday: birthday}).then(response => {
            this.props.getUserProfile();
            Alert.alert(
                '更新完了',
                '登録情報を更新しました。',
                [
                    {text: 'OK', onPress: () => navigationService.goBack()},
                ],
                {cancelable: false}
            );
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

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({birthday: date});
        this._hideDateTimePicker();
    };

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
                        <View style={{
                            marginHorizontal: 15,
                            borderBottomWidth: 0.5,
                            borderColor: '#CCCCCC',
                            height: 65,
                        }}>
                            <TouchableOpacity onPress={this._showDateTimePicker}>
                                <View>
                                    <Text style={{
                                        color: color.active,
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        marginTop: 15
                                    }}>{this.state.birthday && '生年月日'}</Text>
                                </View>
                                <Text style={{
                                    fontSize: 16,
                                    marginTop: 5,
                                    color: this.state.birthday ? 'black' : '#999999'
                                }}>
                                    {this.state.birthday ? moment(this.state.birthday).format('YYYY年M月D日') : '生年月日'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            confirmTextIOS={'設定'}
                            cancelTextIOS={'キャンセル'}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                            headerTextIOS={'生年月日'}
                            date={this.state.birthday ? new Date(this.state.birthday) : new Date()}
                        />
                    </View>
                }
                bottomContent={
                    <View style={{paddingHorizontal: 15, marginBottom: isIphoneX() ? getBottomSpace() + 20 : 15}}>
                        <ButtonText disabled={!this.state.birthday} title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                    </View>
                }
            />
        )
    }
}

