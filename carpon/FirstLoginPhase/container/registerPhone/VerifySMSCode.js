import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {
    View, Text, Platform, Keyboard, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, Dimensions
} from 'react-native';
import {InputText, HeaderOnPress} from '../../../../components/index';
import {connect} from "react-redux";
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import {apiSMSService, apiVerifySMS} from '../../../services/index';
import _ from 'lodash';
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import call from 'react-native-phone-call'
import JapaneseText from "../../../../components/JapaneseText";
import {resetModalStatus, waitForIVRConfirmation} from "../../actions/registration";
import Overlay from "react-native-modal-overlay";
import {addTrackerEvent, viewPage} from "../../../Tracker";
import {submitAppFlyer} from "../../../../App";

const PHONE_REGEX = /^(\d{3})(\d{4})(\d{4})$/;

@screen('VerifySMSCode', {header: <HeaderOnPress title='認証番号の入力'/>})
@connect(state => ({
    modalStatus: state.registration.modalStatus
}), dispatch => ({
    verifyCodeSuccess: credential => {
        dispatch({
            type: 'VERIFY_CODE_SUCCESS',
            credential
        })
    },
    waitForIVR: (params) => {
        waitForIVRConfirmation({
            timeout: 5 * 60 * 1000,
            delay: 1000,
            onTaskFailed: (error) => {
                console.log(error);
            }
        }, params)(dispatch)
    },
    resetModalStatus: () => dispatch(resetModalStatus()),
}))
export class VerifySMSCode extends Component {
    constructor(props) {
        super(props);
        this.resendCode = _.debounce(this.resendCode, 1000);
    }

    state = {
        code: null,
        isHovered: false,
        isLoading: false,
        LoadingCall: false,
        ivrNumber: NaN,
        mobile: NaN,
        id: NaN,
        showModal: false
    };

    componentDidMount() {
        this.setState({
            ivrNumber: this.props.navigation.getParam('ivrNumber'),
            mobile: this.props.navigation.getParam('mobile'),
            id: this.props.navigation.getParam('id'),
            authCode: this.props.navigation.getParam('code')
        });
        viewPage('input_sms_verification', 'SMS認証コード入力');
    }

    handleAutoCloseModal() {
        this.setState({showModal: false});
        this.props.resetModalStatus()
    }

    componentWillReceiveProps(props) {
        props.modalStatus && this.handleAutoCloseModal()
    }

    handleShowIvrPhone() {
        let cleaned = ('' + this.state.ivrNumber).replace(/\D/g, '');
        let match = cleaned.match(PHONE_REGEX);
        if (match) {
            return match[1] + '-' + match[2] + '-' + match[3];
        }
    }

    handleChangeText = (code) => {
        if (code.length === 4) {
            const mobile = this.state.mobile;
            const id = this.state.id;
            this.setState({
                isLoading: true
            }, () => {
                apiVerifySMS.postCode(mobile, code, id).then(res => {
                    submitAppFlyer('WIZ_SMS_COMP',
                        {
                            phone: this.props.navigation.getParam('mobile'),
                        },
                        null
                    );
                    this.props.verifyCodeSuccess({
                        ...res,
                        mobile,
                        code
                    });
                    addTrackerEvent('wiz_sms_complete', {
                        complete: true
                    })
                }).catch(() => {
                    Alert.alert('OTPコードが正しくありません。再入力してください。');
                }).finally(() => {
                    this.setState({isLoading: false});
                })
            });
        }
    };

    callPhone() {
        this.setState({showModal: true});
        let params = {
            mobilenumber: this.state.mobile,
            profile_id: this.state.id
        };
        let registerInformation = {
            id: this.state.id,
            mobile: this.state.mobile
        };
        apiVerifySMS.ivrCall(params)
            .then(() => {
                this.props.waitForIVR(registerInformation);
            })
    }

    callIVR() {
        this.setState({LoadingCall: true});
        const args = {
            number: this.state.ivrNumber,
            prompt: false
        };
        call(args).catch(console.error);
    }

    renderOtpInput() {
        return <InputText
            style={{fontSize: 18}}
            title='認証番号'
            value={this.state.code}
            autoFocus={true}
            placeholder={'認証番号'}
            keyboardType={'numeric'}
            maxLength={4}
            onChangeText={this.handleChangeText.bind(this)}
        />
    }

    resendCode() {
        const phone = this.props.navigation.getParam('mobile');
        apiSMSService.getAuthOTP(phone).then((response) => {
            if (response.status === 200) {
                Alert.alert(
                    'SMSを再送信しました',
                    '認証番号をご確認ください',
                    {cancelable: false}
                );
            }

        });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}
                          onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                {this.state.isLoading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                <JapaneseText style={{
                    fontSize: 16,
                    paddingHorizontal: 15,
                    marginTop: 15,
                    lineHeight: 25
                }} value={'携帯電話のSMS（ショートメッセージ）に届いた4桁の認証番号を入力してください。'}/>
                <View>
                    <View style={{paddingVertical: 20, paddingHorizontal: 15}}>
                        {this.renderOtpInput()}
                    </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#666', fontSize: 13}}>認証番号が届かない場合は<Text
                        onPress={() => this.callPhone()}
                        style={{textDecorationLine: 'underline', color: '#4b9fa5'}}>こちら</Text></Text>
                </View>

                <Overlay visible={this.state.showModal}
                         onClose={() => this.setState({showModal: false})}
                         childrenWrapperStyle={{borderRadius: 20}}
                         closeOnTouchOutside={true}>
                    <View style={{borderColor: '#E5E5E5', width: '100%'}}>
                        <View>
                            <Text style={{textAlign: 'center', fontSize: 14, color: '#333', lineHeight: 15}}>
                                認証番号が届かない場合は番号通知をオンにして下記番号に電話してください。
                            </Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => this.callIVR()}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 15
                                }}>
                                {this.state.LoadingCall ? <ActivityIndicator size={'small'}/> :
                                    <SvgImage source={SvgViews.Phone}/>}

                                <Text style={{color: '#666', fontSize: 26, textAlign: 'center', marginLeft: 10}}>
                                    {this.handleShowIvrPhone()}
                                </Text>
                            </TouchableOpacity>

                            <Text style={{textAlign: 'center', fontSize: 14, color: '#333', marginTop: 10}}>
                                ガイドに従って
                            </Text>
                            <Text style={{color: '#666', fontSize: 26, textAlign: 'center'}}>
                                {this.state.authCode}#
                            </Text>
                            <Text style={{textAlign: 'center', fontSize: 14, color: '#333'}}>
                                を押してください。
                            </Text>
                        </View>
                    </View>
                </Overlay>
            </SafeAreaView>
        )
    }
}
