import React, {Component} from 'react';
import {screen} from "../../navigation";
import {
    View,
    Text,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Alert,
    TouchableOpacity,
    InputAccessoryView
} from 'react-native';
import {UserProfileInputText} from '../../components';
import RadioForm from 'react-native-simple-radio-button';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {connect} from "react-redux";
import {registerUserProfile, resetLoading} from "../FirstLoginPhase/actions/registration";
import color from '../color';
import HeaderOnPress from "../../components/HeaderOnPress";
import LoadingComponent from "../../components/Common/LoadingComponent";
import _ from 'lodash';
import {userProfileService} from "../services/index";
import Icon from 'react-native-vector-icons/FontAwesome';
import {insuranceService} from "../services/index";
import {DropdownOfUserScreen} from "../../components/DropdownOfUserScreen";
import {JP_NAME_REGEX, JP_KATAKANA_REGEX} from "../Account/container/UpdateName";

import regexPostCode from '../postCodeRegex';
import {viewPage} from "../Tracker";
const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const now = new Date();
const fortyYear = new Date();

@screen('UserProfile', {header: <HeaderOnPress title='ユーザー登録'/>})
@connect((state) => ({
        carProfile: state.registration.carProfile,
        userProfile: state.registration.userProfile,
        ready: state.registration ? state.registration.loadingFinish : true
    }),
    dispatch => ({
        registerUserProfile: profile => dispatch(registerUserProfile(profile)),
        resetLoading: () => dispatch(resetLoading())
    }))
export class UserProfile extends Component {
    constructor(props) {
        super(props);
        fortyYear.setYear(now.getYear() - 40);
        this.state = {
            genders: [
                {label: '男性  ', value: 0},
                {label: '女性', value: 1},
            ],
            provinceList: [],
            isDateTimePickerVisible: false,
            firstName: null,
            lastName: null,
            postalCode: null,
            firstNameKatakana: null,
            lastNameKatakana: null,
            nickName: null,
            address: '',
            apartmentNumber: '',
            mansionRoomNumber: null,
            birthday: null,
            selectedGender: 'm',
            invitationCode: null,
            mailAddress: null,
            province: null,
            province_katakana: null,
            address_katakana: null,
            disabled: true,
            spaceBottom: 20,
            showButton: false,
        };
        this.handleSubmit = _.debounce(this.handleSubmit, 500, {leading: true, trailing: false});
    }

    componentWillMount() {
        const {userProfile} = this.props;
        this.props.resetLoading();
        this.loadProvinceList();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.focusListener = this.props.navigation.addListener('didFocus', () => this.child0.focus());
        userProfile.myProfile && this.setState({
            firstName: userProfile.myProfile.first_name,
            lastName: userProfile.myProfile.last_name,
            firstNameKatakana: userProfile.myProfile.first_name_katakana,
            lastNameKatakana: userProfile.myProfile.last_name_katakana,
            postalCode: userProfile.myProfile.post_code,
            mailAddress: userProfile.myProfile.email,
            address: userProfile.myProfile.address,
            apartmentNumber: userProfile.myProfile.apartment_number,
            mansionRoomNumber: userProfile.myProfile.mansion_room_number,
            birthday: userProfile.myProfile.birthday,
            selectedGender: userProfile.myProfile.gender || 'm',
            invitationCode: userProfile.myProfile.invited_code,
            nickName: userProfile.myProfile.nick_name,
            province_katakana: userProfile.myProfile.province_katakana,
            address_katakana: userProfile.myProfile.address_katakana,
            province: userProfile.myProfile.province
        })
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.focusListener.remove();
    }

    componentDidMount() {
        viewPage('user_registration', 'ユーザ登録');
        if (this.props.navigation.getParam('userFBInfo')) {
            const fbInfo = this.props.navigation.getParam('userFBInfo');
            this.setState({
                nickName: fbInfo.short_name,
                mailAddress: fbInfo.email,
                firstName: (fbInfo.first_name && JP_NAME_REGEX.test(fbInfo.first_name)) ? fbInfo.first_name : null,
                lastName: (fbInfo.last_name && JP_NAME_REGEX.test(fbInfo.last_name)) ? fbInfo.last_name : null
            });
        }
        if (this.props.navigation.getParam('userGoogleInfo')) {
            const ggInfo = this.props.navigation.getParam('userGoogleInfo');
            this.setState({
                mailAddress: ggInfo.email,
                firstName: (ggInfo.givenName && JP_NAME_REGEX.test(ggInfo.givenName)) ? ggInfo.givenName : null,
                lastName: (ggInfo.familyName && JP_NAME_REGEX.test(ggInfo.familyName)) ? ggInfo.familyName : null,
            })
        }

        if (this.props.navigation.getParam('userYahooInfo')) {
            const yahooInfo = this.props.navigation.getParam('userYahooInfo');
            this.setState({
                gender: yahooInfo.gender === 'male' ? 'm' : 'f',
                firstName: (yahooInfo['given_name#ja-Hani-JP'] && JP_NAME_REGEX.test(yahooInfo['given_name#ja-Hani-JP'])) ? yahooInfo['given_name#ja-Hani-JP'] : null,
                lastName: (yahooInfo['family_name#ja-Hani-JP'] && JP_NAME_REGEX.test(yahooInfo['family_name#ja-Hani-JP'])) ? yahooInfo['family_name#ja-Hani-JP'] : null,
                firstNameKatakana: (yahooInfo['given_name#ja-Kana-JP'] && JP_KATAKANA_REGEX.test(yahooInfo['given_name#ja-Kana-JP'])) ? yahooInfo['given_name#ja-Kana-JP'] : null,
                lastNameKatakana: (yahooInfo['family_name#ja-Kana-JP'] && JP_KATAKANA_REGEX.test(yahooInfo['family_name#ja-Kana-JP'])) ? yahooInfo['family_name#ja-Kana-JP'] : null,
                nickName: yahooInfo.nickname,
                mailAddress: yahooInfo.email,
                postalCode: (yahooInfo.address && yahooInfo.address.postal_code && yahooInfo.address.postal_code.length === 7) ? yahooInfo.address.postal_code : null
            }, () => {
                if (yahooInfo.address && yahooInfo.address.postal_code && yahooInfo.address.postal_code.length === 7) {
                    setTimeout(() => {
                        this.generateAddress(yahooInfo.address.postal_code);
                    }, Platform.OS === 'ios' ? 0 : 500)

                }
            });
        }
        this.validateField();
    }

    loadProvinceList() {
        insuranceService.getOptions().then(res => {
            this.setState({provinceList: [{label: '', value: null}, ...res.driving_area]});
        })
    }

    keyboardWillShow(e) {
        this.setState({spaceBottom: e.endCoordinates.height / 2, showButton: false});
    }

    keyboardWillHide(e) {
        this.setState({spaceBottom: 0, showButton: true});
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({
            birthday: date
        });
        this._hideDateTimePicker();
        this.handleOnChangeText(date, 'birthday');
        setTimeout(() => {
            this.child4.focus()
        }, 500);
    };

    handleOnSelected = (value) => {
        this.setState({
            selectedGender: value === 0 ? 'm' : 'f'
        })
    };

    validateField() {
        const {
            firstName, lastName, mailAddress, address, lastNameKatakana,
            firstNameKatakana, birthday, postalCode, apartmentNumber, province
        } = this.state;
        if (firstName
            && lastName
            && mailAddress
            && postalCode
            && firstNameKatakana
            && lastNameKatakana
            && birthday
            && address
            && province
            && apartmentNumber
            && this.validateEmail()
            && JP_NAME_REGEX.test(firstName)
            && JP_NAME_REGEX.test(lastName)
            && JP_KATAKANA_REGEX.test(firstNameKatakana)
            && JP_KATAKANA_REGEX.test(lastNameKatakana)
            && regexPostCode.test(postalCode)
        ) {
            this.setState({disabled: false});
        } else {
            this.setState({disabled: true});
        }
    }

    handleCheckEmailAvailable(email) {
        return userProfileService.checkEmailAvailable({email})
            .then(response => {
                return response.status;
            })
    }

    validateEmail() {
        return EMAIL_REGEXP.test(this.state.mailAddress,);
    }

    handleOnChangeText = (text, field) => {
        this.state[field] = text;
        this.validateField();
    };

    handleSubmit() {
        if (this.state.disabled) {
            Alert.alert('すべてのフィールドを入力してください');
            return;
        } else if (!this.handleCheckEmailAvailable(this.state.mailAddress)) {
            Alert.alert('この メールアドレスは既に登録されています。');
            return;
        } else {
            const profile = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                first_name_katakana: this.state.firstNameKatakana,
                last_name_katakana: this.state.lastNameKatakana,
                post_code: this.state.postalCode,
                email: this.state.mailAddress,
                address: this.state.address,
                apartment_number: this.state.apartmentNumber,
                mansion_room_number: this.state.mansionRoomNumber,
                birthday: moment(this.state.birthday).toISOString(),
                gender: this.state.selectedGender ? this.state.selectedGender : 'm',
                invited_code: this.state.invitationCode,
                nick_name: this.state.nickName,
                province: this.state.province,
                address_katakana: this.state.address_katakana,
                province_katakana: this.state.province_katakana,
            };
            this.props.registerUserProfile(profile);
        }
    };

    generateAddress(text) {
        this.state.postalCode = text;
        this.validateField();
        if (regexPostCode.test(text)) {
            fetch('https://www.kurumaerabi.com/api/postal.php?v=2&zip1=' + text.substring(0, 3) + '&zip2=' + text.substring(3, 7))
                .then((response) => response.json())
                .then((responseJson) => {
                    // alert(JSON.stringify(responseJson))
                    if (responseJson.address1 && responseJson.address2) {
                        const provinceChoice = this.state.provinceList.find((item) => item.label === responseJson.address1);
                        this.setState({
                            province: provinceChoice ? provinceChoice.value : null,
                            address: responseJson.address2,
                            province_katakana: responseJson.address_kana1,
                            address_katakana: responseJson.address_kana2,
                        });
                    }
                }).catch((error) => {
                console.error(error);
            });
        }
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <View style={{flex: 1}}>
                <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'}
                                      style={{backgroundColor: '#FFFFFF'}}>
                    {!this.props.ready &&
                    <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                    <ScrollView contentInset={{ bottom: 25 }}
                                scrollIndicatorInsets={{right: 1}}
                                style={{ height: '100%'}} ref={(ref) => this.myScroll = ref}>
                        <View style={{backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingTop: 25}}>
                            <Text style={{
                                fontSize: 15,
                                color: 'black',
                                textAlign: 'left',
                            }}>ユーザー情報を登録してください。</Text>
                        </View>
                        <View style={{backgroundColor: 'white', padding: 15}}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: 15
                            }}>
                                <View style={{width: '47%'}}>
                                    <UserProfileInputText
                                        lineNumber={2}
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        title={'姓'}
                                        ref={child => {
                                            this.child0 = child
                                        }}
                                        autoFocus={true}
                                        returnKeyType='next'
                                        onSubmitEditing={() => this.child1.focus()}
                                        value={this.state.lastName}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'lastName')}
                                        validateMark={!!this.state.lastName && JP_NAME_REGEX.test(this.state.lastName)}
                                    />
                                </View>
                                <View style={{width: '47%'}}>
                                    <UserProfileInputText
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        lineNumber={2}
                                        title={'名'}
                                        ref={child => {
                                            this.child1 = child
                                        }}
                                        returnKeyType='next'
                                        onSubmitEditing={() => this.child2.focus()}
                                        value={this.state.firstName}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'firstName')}
                                        validateMark={!!this.state.firstName && JP_NAME_REGEX.test(this.state.firstName)}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: 15
                            }}>
                                <View style={{width: '47%'}}>
                                    <UserProfileInputText
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        title={'セイ'}
                                        value={this.state.lastNameKatakana}
                                        ref={child => {
                                            this.child2 = child
                                        }}
                                        returnKeyType='next'
                                        onSubmitEditing={() => this.child3.focus()}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'lastNameKatakana')}
                                        validateMark={!!this.state.lastNameKatakana && JP_KATAKANA_REGEX.test(this.state.lastNameKatakana)}
                                    />
                                </View>
                                <View style={{width: '47%'}}>
                                    <UserProfileInputText
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        title={'メイ'}
                                        value={this.state.firstNameKatakana}
                                        ref={child => {
                                            this.child3 = child
                                        }}
                                        returnKeyType='next'
                                        onChangeText={(text) => this.handleOnChangeText(text, 'firstNameKatakana')}
                                        validateMark={!!this.state.firstNameKatakana && JP_KATAKANA_REGEX.test(this.state.firstNameKatakana)}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: 15
                            }}>
                                <View style={{width: '47%'}}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{marginBottom: 10, fontWeight: 'bold', color: color.active}}>性別</Text>
                                        <View>
                                            <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                        </View>
                                    </View>
                                    <View style={{width: '100%', marginTop: 10}}>
                                        <RadioForm
                                            radio_props={this.state.genders}
                                            initial={this.state.selectedGender === 'm' ? 0 : 1}
                                            buttonColor={'#83C0C5'}
                                            labelColor={'black'}
                                            formHorizontal={true}
                                            onPress={(value) => {
                                                this.handleOnSelected(value);
                                            }}
                                            buttonInnerColor={'#83C0C5'}
                                            selectedButtonColor={'#83C0C5'}
                                            buttonSize={15}
                                        />
                                    </View>
                                </View>
                                <View style={{width: '47%'}}>
                                    <View style={{
                                        flexDirection: 'row', justifyContent: 'space-between'
                                    }}>
                                        <Text style={{
                                            marginBottom: 10,
                                            fontWeight: 'bold',
                                            color: color.active
                                        }}>{this.state.birthday && '生年月日'}</Text>
                                        <View>
                                            {
                                                this.state.birthday ?
                                                    <Icon name='check-circle' color='#4B9FA5' size={16}/> :
                                                    null
                                            }
                                        </View>
                                    </View>
                                    <View style={{
                                        borderBottomWidth: this.state.birthday ? 0.5 : 1,
                                        borderColor: this.state.birthday ? '#CCCCCC' : '#f37b7d',
                                        width: '100%',
                                        height: 40,
                                        justifyContent: 'center'
                                    }}>
                                        <TouchableOpacity activeOpacity={1}
                                                          onPress={this._showDateTimePicker}>
                                            <Text style={{
                                                fontSize: 16,
                                                color: 'black',
                                            }}>
                                                {this.state.birthday ? moment(this.state.birthday).format('YYYY年M月D日'): <Text style={{color: '#CCCCCC'}}>生年月日</Text> }
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
                                        maximumDate={new Date(new Date())}
                                        date={this.state.birthday ? new Date(this.state.birthday) : fortyYear}
                                    />
                                </View>
                            </View>
                            <View style={{paddingBottom: 15}} ref={child => {this.email = child}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    style={{fontSize: 16}}
                                    title={'メールアドレス'}
                                    value={this.state.mailAddress}
                                    ref={child => {
                                        this.child4 = child
                                    }}
                                    onSubmitEditing={() => this.child5.focus()}
                                    onChangeText={(text) => this.handleOnChangeText(text, 'mailAddress')}
                                    placeholder={'メールアドレス'}
                                    autoCapitalize='none'
                                    returnKeyType='next'
                                    autoCompleteType={'email'}
                                    keyboardType='email-address'
                                    onFocus={() => this.scrollToCenter('email')}
                                    validateMark={!!this.state.mailAddress && this.validateEmail()}
                                />
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: 15
                            }} ref={child => {this.postalCode = child}}>
                                <View style={{width: '60%', marginTop: 15}} >
                                    <UserProfileInputText
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        title='郵便番号'
                                        lineNumber={1}
                                        maxLength={7}
                                        ref={child => {
                                            this.child5 = child
                                        }}
                                        style={{height: 35}}
                                        keyboardType={'numeric'}
                                        value={this.state.postalCode}
                                        returnKeyType='next'
                                        onChangeText={(text) => this.generateAddress(text)}
                                        onFocus={() => this.scrollToCenter('postalCode')}
                                        validateMark={this.state.postalCode && regexPostCode.test(this.state.postalCode)}
                                    />
                                </View>
                                <View style={{width: '35%', marginTop: 6}}>
                                    <DropdownOfUserScreen
                                        validate={this.state.province}
                                        label={'都道府県'}
                                        containerStyle={{height: 60}}
                                        baseColor={this.state.province ? color.active : '#CACACA'}
                                        value={this.state.province || (this.state.provinceList[0] && this.state.provinceList[0].value)}
                                        data={this.state.provinceList}
                                        fontSize={14}
                                        labelTextStyle={{
                                            fontWeight: this.state.province ? 'bold' : 'normal',
                                            bottom: this.state.province ? 5 : 1
                                        }}
                                        onChangeText={(value) => {
                                            this.setState({province: value});
                                            this.validateField()
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{paddingBottom: 15}} ref={child => {this.address = child}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title={'市区町村'}
                                    value={this.state.address}
                                    returnKeyType='next'
                                    onChangeText={(text) => this.handleOnChangeText(text, 'address')}
                                    onSubmitEditing={() => this.child6.focus()}
                                    onFocus={() => this.scrollToCenter('address')}
                                    validateMark={!!this.state.address}
                                />
                            </View>
                            <View style={{paddingBottom: 15}} ref={child => {this.apartment = child}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title={'番地以下'}
                                    lineNumber={1}
                                    ref={child => {
                                        this.child6 = child
                                    }}
                                    returnKeyType='next'
                                    onSubmitEditing={() => this.child7.focus()}
                                    value={this.state.apartmentNumber}
                                    onChangeText={(text) => this.handleOnChangeText(text, 'apartmentNumber')}
                                    onFocus={() => this.scrollToCenter('apartment')}
                                    validateMark={!!this.state.apartmentNumber}
                                />
                            </View>
                            <View style={{paddingBottom: 15}} ref={child => {this.mansion = child}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title={'マンション名・号室（任意）'}
                                    ref={child => {
                                        this.child7 = child
                                    }}
                                    returnKeyType='next'
                                    lineNumber={1}
                                    onSubmitEditing={() => this.child8.focus()}
                                    value={this.state.mansionRoomNumber}
                                    validateMark={true}
                                    onFocus={() => this.scrollToCenter('mansion')}
                                    onChangeText={(text) => this.handleOnChangeText(text, 'mansionRoomNumber')}
                                />
                            </View>
                            <View style={{
                                paddingBottom: 15
                            }} ref={child => {this.nickname = child}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    lineNumber={1}
                                    title={'ニックネーム（任意）'}
                                    ref={child => {
                                        this.child8 = child
                                    }}
                                    returnKeyType='next'
                                    value={this.state.nickName}
                                    validateMark={true}
                                    onFocus={() => this.scrollToCenter('nickname')}
                                    onChangeText={(text) => this.handleOnChangeText(text, 'nickName')}
                                />
                            </View>
                            {Platform.OS === 'ios' && <View style={{ height: 50}}/>}
                            {
                                !this.state.disabled && Platform.OS === 'android' ?
                                    <TouchableOpacity activeOpacity={1}
                                                      style={{
                                                          width: '100%',
                                                          marginTop: 15,
                                                          backgroundColor: '#F06A6D',
                                                          padding: 15,
                                                          borderRadius: 5,
                                                      }}
                                                      onPress={() => this.handleSubmit()}>
                                        <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 20}}>
                                            OK
                                        </Text>
                                    </TouchableOpacity> : <View style={{height: 50}}/>
                            }
                            </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {Platform.OS === 'ios' &&
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View>
                        {
                            !this.state.disabled &&
                            <View style={{
                                padding: 10,
                                backgroundColor: 'rgba(112, 112, 112 ,0.6)',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity activeOpacity={1}
                                                  style={{
                                                      width: '100%',
                                                      backgroundColor: '#F06A6D',
                                                      padding: 15,
                                                      borderRadius: 5
                                                  }}
                                                  onPress={() => this.handleSubmit()}>
                                    <Text
                                        style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 14}}>
                                        OK
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </InputAccessoryView>
                }
            </View>
        )
    }

    scrollToCenter(target) {
        if (Platform.OS === 'ios') {
            this[target].measure((fx, fy, width, height, px, py) => {
                this.myScroll.scrollTo({x: 0, y: fy, animated: true})
            })
        }
    }
}
