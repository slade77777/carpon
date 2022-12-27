import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {
    Alert,
    InputAccessoryView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {connect} from "react-redux";
import _ from 'lodash';
import UserProfileInputText from "../../../../components/UserProfileInputText";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {userProfileService, navigationService} from "../../../services";
import {getCarPriceEstimate, getCarSellEstimate} from "../actions/getCar";
import regexPostCode from '../../../postCodeRegex';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {JP_NAME_REGEX} from "../../../Account/container/UpdateName";
import {addTrackerEvent, viewPage} from "../../../Tracker";
import {submitAppFlyer} from "../../../../App";

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@screen('CarPriceAssessment', {header: <HeaderOnPress title='お申し込み情報'/>})
@connect((state) => ({
        carProfile: state.registration.carProfile,
        myProfile: state.registration.userProfile.myProfile,
    }),
    dispatch => ({
        getCarPriceEstimate: () => dispatch(getCarPriceEstimate()),
        getCarSellEstimate: () => dispatch(getCarSellEstimate()),
    }))
export class CarPriceAssessment extends Component {
    constructor(props) {
        super(props);
        const myProfile = props.myProfile;
        this.state = {
            lastName: myProfile.last_name,
            firstName: myProfile.first_name,
            phone: myProfile.phone,
            postalCode: myProfile.post_code,
            address: myProfile.address,
            mansionRoomNumber: myProfile.mansion_room_number,
            apartmentNumber: myProfile.apartment_number,
            mailAddress: myProfile.email,
            disabled: true,
            loading: false
        };
        this.handleSubmit = _.debounce(this.handleSubmit, 500, {leading: true, trailing: false});
    }

    validateEmail() {
        return EMAIL_REGEXP.test(this.state.mailAddress);
    }

    componentDidMount() {
        viewPage('submit_car_estimation', '買取査定の申し込み');
        this.validateField();
    }

    validateField() {
        const {
            firstName, lastName, phone, postalCode,
            address, apartmentNumber
        } = this.state;
        if (firstName
            && lastName
            && postalCode && regexPostCode.test(postalCode)
            && address
            && apartmentNumber
            && phone
            && this.validateEmail()
            && JP_NAME_REGEX.test(firstName)
            && JP_NAME_REGEX.test(lastName)
        ) {
            this.setState({disabled: false});
        } else {
            this.setState({disabled: true});
        }
    }

    handleOnChangeText = (text, field) => {
        this.setState({[field]: text});
        this.validateField();
    };

    confirmSend() {
        Alert.alert(
            '査定を申し込む',
            '登録されているユーザー情報とマイカー情報を査定店舗に送信します。',
            [
                {
                    text: 'キャンセル',
                },
                {
                    text: '送信する',
                    onPress: () => this.handleSubmit()
                }
            ])
    }

    async handleSubmit() {
        if (this.state.disabled) {
            Alert.alert('すべてのフィールドを入力してください');
            return;
        } else {
            this.setState({loading: true});
            const profile = {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                post_code: this.state.postalCode,
                email: this.state.mailAddress,
                apartment_number: this.state.apartmentNumber,
                mansion_room_number: this.state.mansionRoomNumber,
                address: this.state.address,
                phone: this.state.phone,
            };
            userProfileService.updateCarSelling({
                ...this.props.navigation.state.params,
                profile
            }).then((response) => {
                const user = this.props.myProfile;
                if (user && user.id) {
                    const id = user.id;
                    submitAppFlyer('KAITORI_ASSESS',
                        {
                            user_id: id,
                            car_id: this.props.carProfile.id,
                        },
                        id
                    )
                    addTrackerEvent('kaitori_submit', {
                        ...this.props.navigation.state.params
                    })
                }
                if (response.data && response.data.status === 'failed') {
                    this.setState({loading: false});
                    Alert.alert('エラー', response.data.message)
                } else {
                    this.props.getCarPriceEstimate();
                    this.props.getCarSellEstimate();
                    this.setState({loading: false});
                    Alert.alert(
                        '査定依頼完了',
                        'ありがとうございます。\n' +
                        '店舗よりメールまたは電話でご連絡がありますのでご対応ください。',
                        [
                            {
                                text: 'OK',
                                onPress: () => navigationService.pop(2)
                            },
                        ])
                }
            }).catch(() => {
                this.setState({loading: false});
                alert('エラー');
            })
        }
    };

    generateAddress(text) {
        this.state.postalCode = text;
        this.validateField();
        if (regexPostCode.test(text)) {
            fetch('https://www.kurumaerabi.com/api/postal.php?v=2&zip1=' + text.substring(0, 3) + '&zip2=' + text.substring(3, 7))
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.address1 && responseJson.address2) {
                        this.setState({address: responseJson.address1 + responseJson.address2})
                        this.child.focus();
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
                {this.state.loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'}>
                    <ScrollView contentInset={{ bottom: 25 }}
                                scrollIndicatorInsets={{right: 1}} style={{ height: '100%', backgroundColor: 'white'}} ref={(ref) => this.myScroll = ref}>
                        <View style={{backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingTop: 25}}>
                            <Text style={{
                                fontSize: 15,
                                color: '#666666',
                                textAlign: 'left',
                            }}>正確な査定を行うため、以下のお客様情報を査定時に利用します。</Text>
                        </View>
                        <View style={{backgroundColor: 'white', padding: 15}}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: '6%'
                            }}>
                                <View style={{width: '47%'}}>
                                    <UserProfileInputText
                                        lineNumber={2}
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        title={'姓'}
                                        value={this.state.lastName}
                                        onSubmitEditing={() => this.child1.focus()}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'lastName')}
                                        validateMark={!!this.state.lastName && JP_NAME_REGEX.test(this.state.lastName)}
                                    />
                                </View>
                                <View style={{width: '47%'}}>
                                    <UserProfileInputText
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        lineNumber={2}
                                        title={'名'}
                                        ref={child => {this.child1 = child}}
                                        value={this.state.firstName}
                                        onSubmitEditing={() => this.child2.focus()}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'firstName')}
                                        validateMark={!!this.state.firstName && JP_NAME_REGEX.test(this.state.firstName)}
                                    />
                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: '6%'
                            }}>
                                <View style={{width: '47%'}}>
                                    <UserProfileInputText
                                        lineNumber={2}
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        title={'携帯電話番号'}
                                        value={this.state.phone}
                                        ref={child => {this.child2 = child}}
                                        onSubmitEditing={() => this.child3.focus()}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'phone')}
                                        validateMark={!!this.state.phone}
                                    />
                                </View>
                                <View  style={{width: '47%'}}>
                                    <UserProfileInputText
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        title='郵便番号'
                                        lineNumber={2}
                                        maxLength={7}
                                        ref={child => {this.child3 = child}}
                                        keyboardType={'numeric'}
                                        value={this.state.postalCode}
                                        onChangeText={(text) => this.generateAddress(text)}
                                        validateMark={!!this.state.postalCode && regexPostCode.test(this.state.postalCode)}
                                    />
                                </View>
                            </View>
                            <View style={{paddingBottom: '6%'}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title={'市区町村'}
                                    value={this.state.address}
                                    onChangeText={(text) => this.handleOnChangeText(text, 'address')}
                                    validateMark={!!this.state.address}
                                />
                            </View>
                            <View style={{paddingBottom: '6%'}} ref={child => {this.apartmentNumber = child}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title={'番地以下'}
                                    lineNumber={1}
                                    ref={child => {this.child = child}}
                                    onSubmitEditing={() => this.child4.focus()}
                                    value={this.state.apartmentNumber}
                                    onChangeText={(text) => this.handleOnChangeText(text, 'apartmentNumber')}
                                    onFocus={() => this.scrollToCenter('apartmentNumber')}
                                    validateMark={!!this.state.apartmentNumber}
                                />
                            </View>
                            <View style={{paddingBottom: '6%'}} ref={child => {this.mansionRoomNumber = child}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title={'マンション名・号室（任意）'}
                                    lineNumber={1}
                                    value={this.state.mansionRoomNumber}
                                    ref={child => {this.child4 = child}}
                                    onSubmitEditing={() => this.child5.focus()}
                                    onChangeText={(text) => this.handleOnChangeText(text, 'mansionRoomNumber')}
                                    validateMark={true}
                                    onFocus={() => this.scrollToCenter('mansionRoomNumber')}
                                />
                            </View>
                            <View ref={child => {this.mailAddress = child}}>
                                <UserProfileInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    style={{fontSize: 16}}
                                    title={'メールアドレス（認証番号を送信します）'}
                                    value={this.state.mailAddress}
                                    autoCompleteType={'email'}
                                    autoCapitalize={'none'}
                                    ref={child => {this.child5 = child}}
                                    onChangeText={(text) => this.handleOnChangeText(text, 'mailAddress')}
                                    placeholder={'メールアドレス（認証番号を送信します）'}
                                    keyboardType='email-address'
                                    onFocus={() => this.scrollToCenter('mailAddress')}
                                    validateMark={!!this.state.mailAddress}
                                />
                            </View>
                            <Text style={{ marginVertical: 15, color: '#666666', lineHeight: 24}}>個人情報の取り扱い並びに利用規約にご同意の上、お申し込みください。</Text>
                        </View>
                        <View style={{margin: 15}}>
                            <ButtonCarpon disabled={this.state.disabled}
                                          style={{backgroundColor: '#F37B7D', height: 50}}
                                          onPress={() => this.confirmSend()}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>一括査定を申し込む</Text>
                            </ButtonCarpon>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                { Platform.OS === 'ios' &&
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View>
                        {
                            !this.state.disabled &&
                            <View style={{padding: 10, backgroundColor: 'rgba(112, 112, 112 ,0.6)', alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={{width: '100%', backgroundColor: '#F06A6D', padding: 15, borderRadius: 5}}
                                    onPress={() => this.confirmSend()}>
                                    <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 14}}>
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
