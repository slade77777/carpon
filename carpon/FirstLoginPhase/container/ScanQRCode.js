import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Dimensions, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert, Linking} from 'react-native';
import stylesGeneral from '../../../style';
import {connect} from "react-redux";
import {SvgImage, SvgViews} from '../../../components/Common/SvgImage';
import {
    addQRCode,
    loadCarAfterSwitchBy,
    loadCarProfileFromCertificate,
    registerCarOutOfWorkingTimeBy, UPDATE_HOYU_NOT_FOUND
} from "../actions/registration";
import Camera, {RNCamera} from 'react-native-camera';
import {navigationService} from "../../services";
import BarcodeScannerView from 'react-native-scan-barcode';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {PERMISSIONS, request} from 'react-native-permissions';
import _ from 'lodash';
import {viewPage} from "../../Tracker";
import Overlay from 'react-native-modal-overlay';
import {isIphoneX} from "react-native-iphone-x-helper";
import store from "../../store";

const {width, height} = Dimensions.get('window');
const QR5_REGEX1 = /^[^\x01-\x7E\xA1-\xDF]+/;
const QR5_REGEX2 = /^\/[12345678ABCDEFGH\-]\/.*\/.*\/[12345]$/;

@screen('ScanQRCode', {header: null})
@connect(state => ({
    plateNumber: (state.registration.carProfile && state.registration.carProfile.profile) ? state.registration.carProfile.profile.number : false,
    carProfile: state.registration.carProfile,
    resetQR: state.registration.shouldResetQR,
    turnOffCamera: state.registration.turnOffCamera,
    isHoyuNotFound: state.registration.isHoyuNotFound
}), dispatch => ({
    loadCarProfileFromCertificate: qrCode => dispatch(loadCarProfileFromCertificate(qrCode)),
    loadCarAfterSwitch: QR => dispatch(loadCarAfterSwitchBy(QR)),
    addQRCode: QR => dispatch(addQRCode(QR)),
    registerCarOutOfWorkingTime: plateNumber => dispatch(registerCarOutOfWorkingTimeBy(plateNumber)),
    resetQRState: () => {
        dispatch({
            type: 'RESET_QR_STATE'
        })
    },
}))
export class ScanQRCode extends Component {
    constructor(props) {
        super(props);
        this.handleNavigate = _.debounce(this.handleNavigate, 1000, {leading: true, trailing: false});
    }

    state = {
        part1: null,
        part2: null,
        part3: null,
        part4: null,
        part5: null,
        reactivate: true,
        turnOffCamera: false,
        cameraReady: false,
        isShow: false,
        isShowHoyuNotfound: false
    };

    componentDidMount() {
        store.dispatch({
            type: 'HOYU_FOUND'
        });
        viewPage('capture_normal_qr', '普通車QR撮影');
        request(
            Platform.select({
                android: PERMISSIONS.ANDROID.CAMERA,
                ios: PERMISSIONS.IOS.CAMERA,
            }),
        ).then(response => {
            if (response === 'denied' || response === 'blocked' || response === 'unavailable') {
                if (Platform.OS === 'ios') {
                    Alert.alert(
                        'カメラへのアクセスを許可',
                        'カメラの利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                        [
                            {
                                text: 'いいえ',
                            },
                            {
                                text: 'はい',
                                onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : AndroidOpenSettings.appDetailsSettings()
                            }
                        ])
                }
            } else {
                this.setState({cameraReady: true})
            }
        })
    }

    handleQRCodeFails() {
        const carProfile = this.props.carProfile;
        let isAddQR = this.props.navigation.getParam('isAddQR');
        let isAddCarByQR = this.props.navigation.getParam('isAddCarByQR');
        if (carProfile.switchCar || isAddQR || isAddCarByQR) {
            return navigationService.navigate('SelectCarImage')
        }
        else {
            return this.setState({isShow: true})
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.resetQR) {
            this.setState({
                part1: null,
                part2: null,
                part3: null,
                part4: null,
                part5: null,
                reactivate: true
            });
            this.props.resetQRState();
        }
        if (newProps.turnOffCamera) {
            this.setState({turnOffCamera: true})
        }
        if (newProps.isHoyuNotFound) {
            this.setState({isShowHoyuNotfound: true})
        }
    }

    handleSelectCamera() {
        if (Platform.OS === 'ios') {
            return <RNCamera
                ref={(cam) => {
                    this.camera = cam;
                }}
                style={{...StyleSheet.absoluteFill}}
                type={RNCamera.Constants.Type.back}
                onBarCodeRead={this.onSuccessIos.bind(this)}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                zoom={0.5}
                playSoundOnCapture={false}
                captureAudio={false}
                notAuthorizedView={<View/>}
                flashMode={RNCamera.Constants.FlashMode.off}
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}
            />
        } else {
            return <BarcodeScannerView
                onBarCodeRead={this.onSuccessAndroid.bind(this)}
                viewFinderBorderLength={0}
                viewFinderBorderWidth={0}
                notAuthorizedView={<View/>}
                style={{flex: 1}}
                torchMode={'off'}
                cameraType={'back'}
            />
        }
    }

    render() {
        return (
            <View style={styles.body}>
                <StatusBar
                    backgroundColor="rgba(38, 37, 37, 1)"
                    barStyle="light-content"
                />
                {
                    this.state.cameraReady && <View style={{...StyleSheet.absoluteFill}}>
                        {
                            !this.state.turnOffCamera && this.handleSelectCamera()
                        }
                    </View>
                }
                <View style={{position: 'absolute', height, width}}>
                    <View style={{
                        height: 80,
                        width,
                        alignItems: 'flex-end',
                        paddingRight: 10,
                        backgroundColor: 'rgba(38, 37, 37, 1)',
                        opacity: 0.5
                    }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack(null)}>
                            <View
                                style={{alignItems: 'flex-start', marginTop: isIphoneX() ? 50 : 20, marginLeft: 15}}>
                                <SvgImage fill={'white'} source={SvgViews.Remove}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: height - 160, width: width, flexDirection: 'row'}}>
                        <View style={{
                            alignItems: 'flex-end',
                            height: height - 160,
                            width: width / 3,
                            justifyContent: 'center',
                            backgroundColor: 'rgba(38, 37, 37, 0.5)',
                            paddingRight: 10
                        }}>
                            <View>
                                {
                                    this.state.part1 ?
                                        <View style={styles.contentOk}>
                                            <SvgImage source={SvgViews.QRChecked}/>
                                        </View>
                                        :
                                        <View style={styles.content}>
                                            <SvgImage source={SvgViews.Qrcode}/>
                                        </View>
                                }
                                {
                                    this.state.part2 ?
                                        <View style={styles.contentOk}>
                                            <SvgImage source={SvgViews.QRChecked}/>
                                        </View>
                                        :
                                        <View style={styles.content}>
                                            <SvgImage source={SvgViews.Qrcode}/>
                                        </View>
                                }
                                {
                                    this.state.part3 ?
                                        <View style={styles.contentOk}>
                                            <SvgImage source={SvgViews.QRChecked}/>
                                        </View>
                                        :
                                        <View style={styles.content}>
                                            <SvgImage source={SvgViews.Qrcode}/>
                                        </View>
                                }
                            </View>
                            <View>
                                {
                                    this.state.part4 ?
                                        <View style={styles.contentOk}>
                                            <SvgImage source={SvgViews.QRChecked}/>
                                        </View>
                                        :
                                        <View style={styles.content}>
                                            <SvgImage source={SvgViews.Qrcode}/>
                                        </View>
                                }
                                {
                                    this.state.part5 ?
                                        <View style={styles.contentOk}>
                                            <SvgImage source={SvgViews.QRChecked}/>
                                        </View>
                                        :
                                        <View style={styles.content}>
                                            <SvgImage source={SvgViews.Qrcode}/>
                                        </View>
                                }
                            </View>
                        </View>
                        <View style={{height: height - 160, width: width * 2 / 3 - 100}}>
                            <SvgImage style={{position: 'absolute', top: 0, left: 0}} source={SvgViews.TopLeft}/>
                            <SvgImage style={{position: 'absolute', bottom: 0, left: 0}} source={SvgViews.BottomLeft}/>
                            <SvgImage style={{position: 'absolute', top: 0, right: 0}} source={SvgViews.TopRight}/>
                            <SvgImage style={{position: 'absolute', bottom: 0, right: 0}}
                                      source={SvgViews.BottomRight}/>
                            {/*<SvgImage style={{position: 'absolute', left: (width - 80)/2, top: height/8 - 10}} source={SvgViews.QrArrow}/>*/}
                        </View>
                        <View style={{
                            height: height - 160,
                            width: 100,
                            backgroundColor: 'rgba(38, 37, 37, 1)',
                            opacity: 0.5
                        }}/>
                    </View>
                    <View style={{height: 80, width, backgroundColor: 'rgba(38, 37, 37, 1)', opacity: 0.5}}/>
                    <View style={{position: 'absolute', top: height / 2, left: width / 2 - 65, height: height, width}}>
                        <Text
                            style={styles.activeText}>
                            左から順に枠内にかざしてください。
                        </Text>
                    </View>
                    <View style={{position: 'absolute', top: height / 2, left: width / 2 - 40, height: height, width}}>
                        <Text
                            style={{textAlign: 'center', color: 'white', fontSize: 15, transform: [{rotate: '90deg'}]}}>
                            車検証右下に記載されているQRコードを
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.handleQRCodeFails()} style={{
                        position: 'absolute',
                        justifyContent: 'center',
                        right: width / 2 - 30,
                        height,
                        width
                    }}>
                        <Text style={{...styles.activeText, textDecorationLine: 'underline'}}>
                            QRコードが読み取れない場合はこちら
                        </Text>
                    </TouchableOpacity>
                </View>
                <Overlay
                    visible={this.state.isShow}
                    onClose={() => this.setState({isShow: false})}
                    containerStyle={{
                        padding: 0,
                        backgroundColor: 'rgba(229, 229, 229, 0.1)',
                        height: 370,
                        width: 170,
                        marginLeft: (width - 170) / 2
                    }}
                    childrenWrapperStyle={{padding: 0, borderRadius: 10}}
                    closeOnTouchOutside={true}>
                    <View style={{height: 370, width: 170, backgroundColor: 'white', flexDirection: 'row', borderRadius: 10}}>
                        <View style={{height: 370, width: 44, left: 0, top: 0}}>
                            <TouchableOpacity style={{
                                height: '50%',
                                borderRightWidth: 0.5,
                                borderBottomWidth: 0.5,
                                borderColor: '#707070',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                                              onPress={() => {
                                                  this.setState({isShow: false});
                                              }}
                            >
                                <Text style={{
                                    transform: [{rotate: '90deg'}],
                                    textAlign: 'center',
                                    color: '#007AFF',
                                    fontSize: 17,
                                    fontWeight: '200', width: 70
                                }}>いいえ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    height: '50%',
                                    borderRightWidth: 0.5,
                                    borderColor: '#707070',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    this.setState({isShow: false}, () => {
                                        setTimeout(() => {
                                            this.props.registerCarOutOfWorkingTime(this.props.plateNumber)
                                        });
                                    });
                                }}
                            >
                                <Text style={{
                                    transform: [{rotate: '90deg'}],
                                    textAlign: 'center',
                                    color: '#007AFF',
                                    fontSize: 17,
                                    fontWeight: '200', width: 70
                                }}>はい</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 370, width: 83, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{
                                color: '#000000',
                                fontSize: 13,
                                textAlign: 'center',
                                marginVertical: 10, lineHeight: 18,
                                transform: [{rotate: '90deg'}],
                                width: 238,
                            }}>QRコードが読み取れないためマイカー登録出来ませんでした。先にユーザー登録を済ませ、ナンバープレートによる登録をお待ち下さい。</Text>
                        </View>
                        <View style={{height: 370, width: 40, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{
                                color: '#000000',
                                fontSize: 17,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                transform: [{rotate: '90deg'}],
                                width: 238
                            }}>QRコードが読み取れません</Text>
                        </View>
                    </View>
                </Overlay>
                <Overlay
                    visible={this.state.isShowHoyuNotfound}
                    onClose={() => this.setState({isShowHoyuNotfound: false})}
                    containerStyle={{
                        padding: 0,
                        backgroundColor: 'rgba(229, 229, 229, 0.1)',
                        height: 370,
                        width: 170,
                        marginLeft: (width - 170) / 2
                    }}
                    childrenWrapperStyle={{padding: 0, borderRadius: 10}}
                    closeOnTouchOutside={false}>
                    <View style={{height: 370, width: 170, backgroundColor: 'white', flexDirection: 'row', borderRadius: 10}}>
                        <View style={{height: 370, width: 44, left: 0, top: 0}}>
                            <TouchableOpacity style={{
                                height: '100%',
                                borderRightWidth: 0.5,
                                borderBottomWidth: 0.5,
                                borderColor: '#707070',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                                              onPress={() => {
                                                  this.setState({isShowHoyuNotFound: false});
                                                  const carProfile = this.props.carProfile;
                                                  let isAddQR = this.props.navigation.getParam('isAddQR');
                                                  let isAddCarByQR = this.props.navigation.getParam('isAddCarByQR');
                                                  if (carProfile.switchCar || isAddQR || isAddCarByQR) {
                                                      return navigationService.popToTop()
                                                  } else {
                                                      store.dispatch({
                                                          type: UPDATE_HOYU_NOT_FOUND
                                                      });
                                                  }
                                              }}
                            >
                                <Text style={{
                                    transform: [{rotate: '90deg'}],
                                    textAlign: 'center',
                                    color: '#007AFF',
                                    fontSize: 17,
                                    fontWeight: '200', width: 70
                                }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 370, width: 83, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{
                                color: '#000000',
                                fontSize: 13,
                                textAlign: 'center',
                                marginVertical: 10, lineHeight: 18,
                                transform: [{rotate: '90deg'}],
                                width: 238,
                            }}>データベース未登録車両のためマイカー登録出来ませんでした。手動での登録をお試しください。</Text>
                        </View>
                        <View style={{height: 370, width: 40, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{
                                color: '#000000',
                                fontSize: 17,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                transform: [{rotate: '90deg'}],
                                width: 238
                            }}>マイカー登録できません</Text>
                        </View>
                    </View>
                </Overlay>
            </View>
        )
    }

    checkQR2(qrCode) {
        if (qrCode.split('/').length > 3 && qrCode.split('/')[2] === '-   ' && qrCode.split('/')[3] === '-   ') {
            return true;
        }
        if (this.state.part1 && this.state.part3) {
            if ((qrCode !== this.state.part1) && (qrCode !== this.state.part3)) {
                const combinedQRCodeString = `${this.state.part1}${qrCode}${this.state.part3}`;
                const combinedQRCodeArray = combinedQRCodeString.split('/');
                if (combinedQRCodeArray.length === 19) {
                    if (
                        combinedQRCodeArray[0].length === 1
                        && combinedQRCodeArray[1].length === 3
                        && combinedQRCodeArray[3].length === 6
                        && combinedQRCodeArray[4].length === 4
                        && combinedQRCodeArray[6].length === 4
                        && combinedQRCodeArray[7].length === 4
                        && combinedQRCodeArray[8].length === 4
                        && combinedQRCodeArray[9].length === 4
                        && combinedQRCodeArray[10].length === 2
                        && combinedQRCodeArray[11].length === 3
                        && combinedQRCodeArray[12].length === 1
                        && combinedQRCodeArray[13].length === 1
                        && combinedQRCodeArray[14].length === 1
                        && combinedQRCodeArray[15].length === 4
                        && combinedQRCodeArray[16].length === 5
                        && combinedQRCodeArray[17].length === 6
                        && combinedQRCodeArray[18].length === 2
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    onSuccessAndroid(e) {
        let data = e.data;
        data = data.replace('[', '');
        data = data.replace(']', '');
        const InfoList = data ? data.split(',') : null;
        if (InfoList) InfoList.map(qrCode => {
            if (this.state.part1 && this.state.part2 && this.state.part3 && this.state.part4 && this.state.part5 && this.state.reactivate) {
                this.handleNavigate();
            } else {
                if (qrCode) {
                    if (qrCode.substring(0, 2) === '2/' && qrCode.charCodeAt(2) > 255) {
                        this.setState({part4: this.clearFirstSpace(qrCode)});
                        return true;
                    }
                    if (qrCode.substring(0, 2) === '2/' && qrCode.charCodeAt(2) <= 255) {
                        this.setState({part1: this.clearFirstSpace(qrCode)});
                        return true;
                    }
                    if (qrCode.substring(qrCode.length - 9, qrCode.length - 3).match("^[A-z0-9]+$") && qrCode.substring(qrCode.length - 2, qrCode.length).match("^[A-z0-9]+$") && qrCode.substring(qrCode.length - 3, qrCode.length - 2) === '/') {
                        this.setState({part3: this.clearFirstSpace(qrCode)});
                        return true;
                    }
                    if (qrCode.match(QR5_REGEX1) || qrCode.match(QR5_REGEX2)) {
                        this.setState({part5: this.clearFirstSpace(qrCode)});
                        return true;
                    }
                    if (this.checkQR2(qrCode)) {
                        this.setState({part2: this.clearFirstSpace(qrCode)});
                        return true;
                    }
                }
            }
        })
    }

    clearFirstSpace = (val) => {
        if (val.substring(0, 1) === ' ') {
            return val.slice(1)
        }
        return val;
    };

    onSuccessIos(e) {
        if (this.state.part1 && this.state.part2 && this.state.part3 && this.state.part4 && this.state.part5 && this.state.reactivate) {
            this.handleNavigate();
        } else {
            if (e.data) {
                if (e.data.substring(0, 2) === '2/' && e.data.charCodeAt(2) > 255) {
                    this.setState({part4: e.data});
                    return true;
                }
                if (e.data.substring(0, 2) === '2/' && e.data.charCodeAt(2) <= 255) {
                    this.setState({part1: e.data});
                    return true;
                }
                if (e.data.substring(e.data.length - 9, e.data.length - 3).match("^[A-z0-9]+$") && e.data.substring(e.data.length - 2, e.data.length).match("^[A-z0-9]+$") && e.data.substring(e.data.length - 3, e.data.length - 2) === '/') {
                    this.setState({part3: e.data});
                    return true;
                }
                if (e.data.match(QR5_REGEX1) || e.data.match(QR5_REGEX2)) {
                    this.setState({part5: e.data});
                    return true;
                }
                if (this.checkQR2(e.data)) {
                    this.setState({part2: e.data});
                    return true;
                }
            }
        }
    }

    handleNavigate() {
        const carProfile = this.props.carProfile;
        this.setState({reactivate: false});
        setTimeout(() => {
            const number = ((this.state.part4 + this.state.part5).split('/'))[1];
            const platform_number = this.state.part5.split('/')[2];
            const QR = {
                type: 0,
                qr_code_3: this.state.part1,
                qr_code_4: this.state.part2,
                qr_code_5: this.state.part3,
                qr_code_1: this.state.part4,
                qr_code_2: this.state.part5,
                number, platform_number
            };
            if (this.props.navigation.getParam('isAddQR')) {
                this.props.addQRCode(QR);
            } else if (carProfile.switchCar || this.props.navigation.getParam('isAddCarByQR')) {
                this.props.loadCarAfterSwitch(QR);
            } else {
                this.props.loadCarProfileFromCertificate(QR);
            }
        }, 500);
    }
}

const barcodePlaceHolder = {
    textAlign: 'center',
    width: width / 7,
    height: width / 7,
    borderRadius: 2,
    backgroundColor: 'white',
    margin: 5,
    opacity: 1,
};

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        textAlign: 'center',
    },
    main: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 23,
    },
    header: {
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        paddingTop: 115,
        paddingBottom: 115,
    },
    bottom: {
        width: 60,
        marginLeft: (width - 60) / 2,
        borderRadius: 40,
        backgroundColor: '#73BFBF'
    },

    group: {
        marginLeft: 40,
        marginRight: 40,
        marginTop: 15,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    body: {
        backgroundColor: stylesGeneral.backgroundColor,
        flex: 1,
        flexDirection: 'column',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    activeText: {textAlign: 'center', color: '#FFFFFF', fontSize: 17, transform: [{rotate: '90deg'}]},
    buttonCancel: {
        width: '100%',
        borderRadius: 5,
        borderWidth: 0.5,
        backgroundColor: '#EFEFEF',
        marginTop: 10
    },
    contentNormal: {
        ...barcodePlaceHolder
    },
    contentOk: {
        ...barcodePlaceHolder,
        alignItems: 'center',
        justifyContent: 'center', transform: [{rotate: '90deg'}]
    },
    content: {
        ...barcodePlaceHolder,
        alignItems: 'center', opacity: 0.5,
        justifyContent: 'center', transform: [{rotate: '90deg'}]
    }
});
