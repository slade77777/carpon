import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, Keyboard, View, Alert, Platform, InputAccessoryView} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import {navigationService, userProfileService} from "../../../carpon/services";
import {getUserProfile} from "../actions/accountAction";
import Spinner from 'react-native-loading-spinner-overlay';
import UpdateInputText from '../../../components/UpdateInputText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {viewPage} from "../../Tracker";

export const JP_KATAKANA_REGEX = /^([\u30A0-\u30FF])*$/;
export const JP_NAME_REGEX = /^([\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u3005-\u3006])*$/;

@screen('UpdateName', {header: <HeaderOnPress title={'お名前'}/>})
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
export class UpdateName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: this.props.userProfile ? this.props.userProfile.first_name : null,
            last_name: this.props.userProfile ? this.props.userProfile.last_name : null,
            first_name_katakana: this.props.userProfile ? this.props.userProfile.first_name_katakana : null,
            last_name_katakana: this.props.userProfile ? this.props.userProfile.last_name_katakana : null,
            loading: false
        };
    }

    componentDidMount() {
        viewPage('edit_name','お名前の変更');
    }

    handleUpdate() {
        if(
            JP_NAME_REGEX.test(this.state.first_name)
            && JP_NAME_REGEX.test(this.state.last_name)
            && JP_KATAKANA_REGEX.test(this.state.first_name_katakana)
            && JP_KATAKANA_REGEX.test(this.state.last_name_katakana)
        ) {
            this.setState({loading: true});
            const {first_name, last_name, first_name_katakana, last_name_katakana} = this.state;
            userProfileService.updateUserProfile({
                first_name, last_name, first_name_katakana, last_name_katakana
            }).then(response => {
                this.props.getUserProfile();
                Alert.alert(
                    '更新完了',
                    '登録情報を更新しました。',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({loading: false});
                                navigationService.goBack()
                            }
                        },
                    ],
                    {cancelable: false}
                );
            }).catch(error => {
                    Alert.alert(
                        'エラー',
                        'エラー',
                        [
                            {
                                text: 'OK', onPress: () => {
                                    this.setState({loading: false});
                                }
                            },
                        ],
                        {cancelable: false});
                }
            );
        }else{
            Alert.alert('間違ったフォーマット');
            return false;
        }
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        let formatValue = {
            firstName: JP_NAME_REGEX.test(this.state.first_name),
            lastName: JP_NAME_REGEX.test(this.state.last_name),
            firstNameKatakana: JP_KATAKANA_REGEX.test(this.state.first_name_katakana),
            lastNameKatakana: JP_KATAKANA_REGEX.test(this.state.last_name_katakana),
        };
        let {first_name, last_name, first_name_katakana, last_name_katakana} = this.state;
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
                        <View style={{flexDirection: 'row'}}>
                            <View style={{paddingHorizontal: 15, marginVertical: 20, width: '50%'}}>
                                <UpdateInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='姓'
                                    value={this.state.last_name}
                                    onSubmitEditing={() => this.child2.focus()}
                                    onChangeText={(val) => this.setState({last_name: val})}
                                    validationIcon={last_name && formatValue.lastName ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                        : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                                />
                            </View>
                            <View style={{paddingHorizontal: 15, marginVertical: 20, width: '50%'}}>
                                <UpdateInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='名'
                                    ref={child => {this.child2 = child}}
                                    onSubmitEditing={() => this.child3.focus()}
                                    value={this.state.first_name}
                                    onChangeText={(val) => this.setState({first_name: val})}
                                    validationIcon={first_name && formatValue.firstName ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                        : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{paddingHorizontal: 15, width: '50%'}}>
                                <UpdateInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='セイ'
                                    ref={child => {this.child3 = child}}
                                    onSubmitEditing={() => this.child4.focus()}
                                    value={this.state.last_name_katakana}
                                    onChangeText={(val) => this.setState({last_name_katakana: val})}
                                    validationIcon={last_name_katakana && formatValue.lastNameKatakana ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                        : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                                />
                            </View>
                            <View style={{paddingHorizontal: 15, width: '50%'}}>
                                <UpdateInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='メイ'
                                    ref={child => {this.child4 = child}}
                                    value={this.state.first_name_katakana}
                                    onChangeText={(val) => this.setState({first_name_katakana: val})}
                                    validationIcon={first_name_katakana && formatValue.firstNameKatakana ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                        : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                                />
                            </View>
                        </View>
                    </View>
                }
                bottomContent={
                    Platform.OS === 'ios' ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={{ padding: 15}}>
                                <ButtonText
                                    disabled={!this.state.first_name || !this.state.last_name || !this.state.first_name_katakana || !this.state.last_name_katakana}
                                    title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                            </View>
                        </InputAccessoryView>
                        : <View style={{paddingHorizontal: 15, marginBottom: 15}}>
                            <ButtonText
                                disabled={!this.state.first_name || !this.state.last_name || !this.state.first_name_katakana || !this.state.last_name_katakana}
                                title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                        </View>
                }
            />
        )
    }
}
