import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, Keyboard, View, Alert, Platform, InputAccessoryView, ScrollView, SafeAreaView} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../../components';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import UpdateInputText from '../../../../components/UpdateInputText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getUserProfile} from "../../../Account/actions/accountAction";
import color from "../../../color";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {updateOilProfile} from "../actions/oilAction";
import {navigationService} from "../../../services/index";
import {JP_NAME_REGEX, JP_KATAKANA_REGEX} from "../../../Account/container/UpdateName";
import {viewPage} from "../../../Tracker";

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@screen('UpdateOilUser', {header: <HeaderOnPress title={'送信内容の修正'}/>})
@connect(
    state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        oilUser: state.oilReducer ? state.oilReducer.profile : {}
    }),
    dispatch => ({
        getUserProfile: () => {
            dispatch(getUserProfile())
        },
        updateOilProfile: (params) => {
            dispatch(updateOilProfile(params))
        },
    })
)
export class UpdateOilUser extends Component {
    constructor(props) {
        super(props);
        const oilUser = this.props.oilUser;
        const user = this.props.userProfile;
        this.state = {
            first_name: oilUser.first_name || user.first_name,
            last_name: oilUser.last_name || user.last_name,
            first_name_katakana: oilUser.first_name_katakana || user.first_name_katakana,
            last_name_katakana: oilUser.last_name_katakana || user.last_name_katakana,
            email: oilUser.email || user.email,
            phone: oilUser.phone || user.phone,
            loading: false
        };
    }

    componentDidMount() {
        viewPage('edit_oil_exchange_reservation_user', 'オイル交換予約ユーザ情報編集');
    }

    handleUpdate() {
        if(
            JP_NAME_REGEX.test(this.state.first_name)
            && JP_NAME_REGEX.test(this.state.last_name)
            && JP_KATAKANA_REGEX.test(this.state.first_name_katakana)
            && JP_KATAKANA_REGEX.test(this.state.last_name_katakana)
            && this.validateEmail()
            && this.state.phone
        ) {
            const {first_name, last_name, first_name_katakana, last_name_katakana, phone, email} = this.state;
            this.props.updateOilProfile({
                first_name, last_name, first_name_katakana, last_name_katakana, phone, email
            });
            navigationService.goBack();
        } else {
            Alert.alert('間違ったフォーマット');
            return false;
        }
    }

    validateEmail() {
        return EMAIL_REGEXP.test(this.state.email);
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        let formatValue = {
            firstName: JP_NAME_REGEX.test(this.state.first_name),
            lastName: JP_NAME_REGEX.test(this.state.last_name),
            firstNameKatakana: JP_KATAKANA_REGEX.test(this.state.first_name_katakana),
            lastNameKatakana: JP_KATAKANA_REGEX.test(this.state.last_name_katakana),
        };
        let {first_name, last_name, first_name_katakana, last_name_katakana, phone, email} = this.state;
        const validate = first_name && JP_NAME_REGEX.test(first_name)
            && last_name && JP_NAME_REGEX.test(last_name)
            && first_name_katakana && JP_KATAKANA_REGEX.test(first_name_katakana)
            && last_name_katakana && JP_KATAKANA_REGEX.test(last_name_katakana)
            && email && this.validateEmail()
            && phone;
        return (
            <View style={{flex: 1}}>
                <ScrollView contentInset={{ bottom: 25 }}
                            scrollIndicatorInsets={{right: 1}} style={{height: '100%', backgroundColor: 'white'}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={null}
                        textStyle={{color: 'white'}}
                    />
                    <View style={{
                        marginTop: 20,
                        paddingTop: 15,
                        paddingBottom: 15,
                        paddingHorizontal: 15,
                        backgroundColor: '#F2F8F9',
                        borderBottomWidth: 1,
                        borderBottomColor: color.active
                    }}>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: color.active}}>お客様情報</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{paddingHorizontal: 15, marginVertical: 20, width: '50%'}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='姓'
                                value={last_name}
                                onChangeText={(val) => this.setState({last_name: val})}
                                validationIcon={last_name && formatValue.lastName ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginVertical: 20, width: '50%'}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='名'
                                value={first_name}
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
                                value={last_name_katakana}
                                onChangeText={(val) => this.setState({last_name_katakana: val})}
                                validationIcon={last_name_katakana && formatValue.lastNameKatakana ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, width: '50%'}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='メイ'
                                value={first_name_katakana}
                                onChangeText={(val) => this.setState({first_name_katakana: val})}
                                validationIcon={first_name_katakana && formatValue.firstNameKatakana ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <View style={{paddingHorizontal: 15, width: '50%'}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='電話番号'
                                value={phone}
                                keyboardType='numeric'
                                maxLength={11}
                                onChangeText={(val) => this.setState({phone: val})}
                                validationIcon={phone ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, width: '50%'}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='メールアドレス'
                                keyboardType='email-address'
                                autoCapitalize={'none'}
                                autoCompleteType={'email'}
                                value={email}
                                onChangeText={(val) => this.setState({email: val})}
                                validationIcon={(email && this.validateEmail()) ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                    </View>
                    <View style={{margin: 15}}>
                        <ButtonCarpon disabled={!validate}
                                      style={{backgroundColor: '#F37B7D', height: 50}}
                                      onPress={() => this.handleUpdate()}>
                            <View>
                                <Text style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>保存する</Text>
                            </View>
                        </ButtonCarpon>
                    </View>
                    <Text style={{ marginHorizontal: 15, fontSize: 17, color: '#333333'}}>
                        ※アプリに登録されているユーザー情報は更新されません
                    </Text>
                </ScrollView>
            </View>
        )
    }
}
