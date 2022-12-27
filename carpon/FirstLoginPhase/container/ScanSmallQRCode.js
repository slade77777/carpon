import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, Alert, Linking} from 'react-native';
import {connect} from "react-redux";
import {
    loadCarProfileFromCertificate,
    loadCarAfterSwitchBy,
    addQRCode,
    registerCarOutOfWorkingTimeBy, UPDATE_HOYU_NOT_FOUND
} from "../actions/registration";
import _ from 'lodash';
import {SvgImage, SvgViews} from '../../../components/Common/SvgImage';
import BarcodeScannerView from 'react-native-scan-barcode';
import Camera, {RNCamera} from 'react-native-camera';
import {navigationService} from "../../services";
import AndroidOpenSettings from 'react-native-android-open-settings';
import {PERMISSIONS, request} from 'react-native-permissions';
import {viewPage} from "../../Tracker";
import Overlay from 'react-native-modal-overlay';
import {isIphoneX} from "react-native-iphone-x-helper";
import store from "../../store";

const {width, height} = Dimensions.get('window');

@screen('ScanSmallQRCode', {header: null})
@connect((state) => ({
    carProfile: state.registration.carProfile,
    resetQR: state.registration.shouldResetQR,
    turnOffCamera: state.registration.turnOffCamera,
    isHoyuNotFound: state.registration.isHoyuNotFound
}), dispatch => ({
    loadCarProfileFromCertificate: qrCode => dispatch(loadCarProfileFromCertificate(qrCode)),
    loadCarAfterSwitch: QR =>dispatch(loadCarAfterSwitchBy(QR)),
    addQRCode: QR =>dispatch(addQRCode(QR)),
    registerCarOutOfWorkingTime: plateNumber => dispatch(registerCarOutOfWorkingTimeBy(plateNumber)),
    resetQRState: () => {
        dispatch({
            type: 'RESET_QR_STATE'
        })
    },
}))
export class ScanSmallQRCode extends Component {

    constructor(props) {
        super(props);
        this.onNextScreen = _.debounce(this.onNextScreen, 1000, {leading: true, trailing: false});
    }

    state = {
        part1: null,
        part2: null,
        part3: null,
        turnOffCamera: false,
        cameraReady: false,
        isShow: false,
        isShowHoyuNotfound: false
    };

    componentDidMount() {
        store.dispatch({
            type: 'HOYU_FOUND'
        });
        viewPage('capture_mini_qr', '軽自動車QR撮影');
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
                reactivate: true
            });
            this.props.resetQRState();
        }
        if(newProps.turnOffCamera){
            this.setState({turnOffCamera: true})
        }
        if (newProps.isHoyuNotFound) {
            this.setState({isShowHoyuNotfound: true})
        }
    }

    onNextScreen() {
        const carProfile = this.props.carProfile;
        const QR = {
            type: 1,
            qr_code_1: this.state.part1,
            qr_code_2: this.state.part2,
            qr_code_3: this.state.part3
        };
        const plateElement = this.state.part2.split('/');
        if (plateElement && plateElement.length > 2) {
            if (this.props.navigation.getParam('isAddQR')) {
                this.props.addQRCode(QR);
            } else if(carProfile.switchCar || this.props.navigation.getParam('isAddCarByQR')) {
                this.props.loadCarAfterSwitch(QR);
            }else {
                this.props.loadCarProfileFromCertificate(QR);
            }
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
                style={{ flex: 1 }}
                torchMode={'off'}
                cameraType={'back'}
            />
        }
    }

    render() {
        return (
            <View style={styles.body}>
                {
                    this.state.cameraReady && <View style={{height}}>
                        {
                            !this.state.turnOffCamera && this.handleSelectCamera()
                        }
                    </View>
                }
                <View style={{ position: 'absolute', height, width}}>
                    <View style={{height: 80, width, alignItems: 'flex-end', paddingRight: 10, backgroundColor: 'rgba(38, 37, 37, 1)', opacity: 0.5 }}>
                        <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack(null)}>
                            <View style={{alignItems : 'flex-start', marginTop : isIphoneX() ? 50 : 20, marginLeft : 15}}>
                                <SvgImage fill={'white'} source={SvgViews.Remove}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: height - 160, width, flexDirection: 'row'}}>
                        <View style={{alignItems: 'flex-end', height: height - 160, width: width/3, justifyContent: 'center', backgroundColor: 'rgba(38, 37, 37, 0.5)', paddingRight: 10}}>
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
                        </View>
                        <View style={{height: height - 160, width: width * 2/3 - 100}}>
                            <SvgImage style={{position: 'absolute', top: 0, left: 0}} source={SvgViews.TopLeft}/>
                            <SvgImage style={{position: 'absolute', bottom: 0, left: 0}} source={SvgViews.BottomLeft}/>
                            <SvgImage style={{position: 'absolute', top: 0, right: 0}} source={SvgViews.TopRight}/>
                            <SvgImage style={{position: 'absolute', bottom: 0, right: 0}} source={SvgViews.BottomRight}/>
                            {/*<SvgImage style={{position: 'absolute', left: (width - 80)/2, top: height/8 - 10}} source={SvgViews.QrArrow}/>*/}
                        </View>
                        <View style={{ height: height - 160, width: 100, backgroundColor: 'rgba(38, 37, 37, 1)', opacity: 0.5}}/>
                    </View>
                    <View style={{ height: 80, width, backgroundColor: 'rgba(38, 37, 37, 1)', opacity: 0.5}}/>
                    <View style={{position: 'absolute', top: height/2, left: width/2 - 115, height, width: width + 100}}>
                        <Text style={styles.activeText}>
                            ※QRが6つある車検証は「右側3個」がスキャン対象です。
                        </Text>
                    </View>
                    <View style={{position: 'absolute', top: height/2, left: width/2 - 40, height, width}}>
                        <Text style={styles.activeText}>
                            QRコードを枠内にかざしてください。
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.handleQRCodeFails()} style={{position: 'absolute', justifyContent: 'center', right: width/2 - 30, height, width}}>
                        <Text style={{...styles.activeText, textDecorationLine: 'underline'}}>
                            QRコードが読み取れない場合はこちら
                        </Text>
                    </TouchableOpacity>
                </View>
                <Overlay
                    visible={this.state.isShow}
                    onClose={() => this.setState({isShow: false})}
                    containerStyle={{padding: 0, backgroundColor: 'rgba(229, 229, 229, 0.1)'}}
                    childrenWrapperStyle={{padding: 0, borderRadius: 10, transform: [{rotate: '90deg'}]}}
                    closeOnTouchOutside={true}>
                    <View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', margin: 20}}>
                            <Text style={{
                                color: '#000000',
                                fontSize: 17,
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>QRコードが読み取れません</Text>
                            <Text style={{
                                color: '#000000',
                                fontSize: 13,
                                textAlign: 'center',
                                marginVertical: 10, lineHeight: 18
                            }}>QRコードが読み取れないためマイカー登録出来ませんでした。先にユーザー登録を済ませ、ナンバープレートによる登録をお待ち下さい。</Text>
                        </View>
                        <View style={{flexDirection: 'row', height: 44}}>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    borderTopWidth: 0.5,
                                    borderRightWidth: 0.5,
                                    borderColor: '#707070',
                                    justifyContent: 'center'
                                }}
                                onPress={() => {
                                    this.setState({isShow: false});
                                }}
                            >
                                <Text style={{
                                    textAlign: 'center',
                                    color: '#007AFF',
                                    fontSize: 17,
                                    fontWeight: '200'
                                }}>いいえ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: '50%',
                                    borderTopWidth: 0.5,
                                    borderColor: '#707070',
                                    justifyContent: 'center'
                                }}
                                onPress={() => {
                                    this.setState({isShow: false});
                                    return this.props.registerCarOutOfWorkingTime(this.props.plateNumber)
                                }}
                            >
                                <Text style={{
                                    textAlign: 'center',
                                    color: '#007AFF',
                                    fontSize: 17,
                                    fontWeight: '200'
                                }}>はい</Text>
                            </TouchableOpacity>
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

    onSuccessIos(e) {
        if (this.state.part1 && this.state.part2 && this.state.part3) this.onNextScreen();
        const data = e.data ? e.data.split("/") : null;
        if (data) {
            switch (data.length) {
                case 1:
                    this.setState({part3: e.data});
                    return true;
                case 7:
                    this.setState({part2: e.data});
                    return true;
                case 19:
                    this.setState({part1: e.data});
                    return true;
                default:
                    return true;
            }
        }
    }

    onSuccessAndroid(e) {
        let data = e.data;
        data = data.replace('[', '');
        data = data.replace(']', '');
        const InfoList = data ? data.split(',') : null;
        if(InfoList) InfoList.map(qrCode => {
            if (this.state.part1 && this.state.part2 && this.state.part3) this.onNextScreen();
            const data = qrCode.split("/");
            if (data) {
                switch (data.length) {
                    case 1:
                        this.setState({part3: qrCode});
                        return true;
                    case 7:
                        this.setState({part2: qrCode});
                        return true;
                    case 19:
                        this.setState({part1: qrCode});
                        return true;
                    default:
                        return true;
                }
            }
        })
    }
}

const barcodePlaceHolder = {
    textAlign: 'center',
    width: width/7,
    height: width/7,
    borderRadius: 4,
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
        height: '100%',
        backgroundColor: 'rgba(38, 37, 37, 1)',
        flex: 1,
        flexDirection: 'column',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    activeText: { textAlign: 'center', color: '#FFFFFF', fontSize: 17, transform: [{ rotate: '90deg'}]},
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
        justifyContent: 'center', transform: [{ rotate: '90deg'}]
    },
    content: {
        ...barcodePlaceHolder,
        alignItems: 'center', opacity: 0.5,
        justifyContent: 'center', transform: [{ rotate: '90deg'}]
    }
});
