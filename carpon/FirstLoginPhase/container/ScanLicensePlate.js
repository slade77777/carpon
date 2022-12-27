import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {View, Text, StyleSheet, Alert, TouchableOpacity, Image, Dimensions, StatusBar, Platform, Linking, PermissionsAndroid} from 'react-native';
import stylesGeneral from '../../../style';
import {connect} from "react-redux";
import {navigationService} from "../../services/index";
import {loadCarProfileFromPlate} from "../actions/registration";
import color from "../../color";
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import { RNCamera } from 'react-native-camera';
import LoadingComponent from "../../../components/Common/LoadingComponent";
import LottieView from 'lottie-react-native';
import Area from '../../../area';
import _ from 'lodash';
import Config from 'react-native-config';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {PERMISSIONS, request} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import {addTrackerEvent, viewPage} from "../../Tracker";
import {isIphoneX} from "react-native-iphone-x-helper";

const {height, width} = Dimensions.get('window');

@screen('ScanLicensePlate', {header: null})
@connect((state) => ({
    ready: state.registration ? state.registration.loadingFinish : true
}), dispatch => ({
    loadCarProfileFromPlate: plateNumber => dispatch(loadCarProfileFromPlate(plateNumber))
}))
export class ScanLicensePlate extends Component {
    constructor(props) {
        super(props);

        this.camera = null;
        this.state = {
            plate: null,
            region: null,
            number1: null,
            number2: null,
            hiragana: null,
            disable: true,
            loading: false,
            imageSource: null,
            carmeraReady: false
        };
    }

    componentDidMount() {
        viewPage('capture_numberplate', 'ナンバープレート撮影');
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
                this.setState({carmeraReady: true})
            }
        })
    }

    takePicture = async function () {
        if (!this.state.plate && this.camera) {
            this.setState({loading: true});
            const options = {
                quality: 0.5,
                width: 300,
                fixOrientation: true,
                forceUpOrientation: true
            };
            await this.camera.takePictureAsync(options).then((picture) => {
                if (picture.uri) {
                    const data = new FormData();
                    data.append('image', {
                        uri: picture.uri,
                        type: 'image/jpeg',
                        name: 'avatar'
                    });
                    fetch(Config.OPENALPR_LINK, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'multipart/form-data',
                        },
                        body: data
                    })
                        .then(response => response.json())
                        .then(responseData => {
                            if (responseData.results && responseData.results[0]) {
                                const result = responseData.results[0];
                                if (result) {
                                    const plate = result.plate;
                                    const region = result.region.replace('jp-', '') + this.getRegionSpace(result.region.length - 3);
                                    let hiraganaRaw = plate.match(/[\u3040-\u309Fー]/)[0];
                                    const hiragana = !!_.findIndex(Area.hiragana, (item)=> {return item.value === hiraganaRaw}) ? hiraganaRaw : Area.hiragana[0].value;
                                    let number1 = plate.split(/[\u3040-\u309Fー]/)[0];
                                    let number2 = plate.split(/[\u3040-\u309Fー]/)[1];
                                    this.setState({
                                        imageSource: picture.uri,
                                        plate: region + plate,
                                        region, number1, hiragana, number2,
                                        loading: false
                                    });
                                }
                            } else {
                                this.handleErrorScan();
                            }
                        })
                        .catch(() => {
                            this.handleErrorScan();
                        })
                        .finally(() => this.setState({loading:false}));
                } else {
                    this.setState({loading: false})
                }
            });
        }
    };

    handleErrorScan() {
        Alert.alert(
            '認識エラー',
            '何らかの理由でナンバープレートを認識できませんでした。再度お試しいただくか、お手数をおかけしますが、手入力にてご登録ください。',
            [
                {
                    text: 'OK',
                    onPress: () => this.props.navigation.goBack()
                },
            ],
            {cancelable: false})
    }

    handleShowNumber(number) {
        const numberLength = number ? number.length : 0;
        const PLATE_REGEX = /^(\d{2})(\d{2})$/;
        const THREE_DIGITS_REGEX = /^(\d)(\d{2})$/;
        let createSpace = ('' + number).replace(/\D/g, '');
        let cleaned = ('' + number).replace(/\D/g, '');
        switch(numberLength) {
            case 0:
                return " ・・・・ ";
            case 1:
                return " ・・ ・" + number;
            case 2:
                return " ・・ " + number;
            case 3:
                let matchedNumber = createSpace.match(THREE_DIGITS_REGEX);
                if (matchedNumber) {
                    return " ・" + matchedNumber[1] + ' ' + matchedNumber[2];
                } else {
                    return number;
                }
            case 4:
                let match = cleaned.match(PLATE_REGEX);
                if (match) {
                    return  match[1] + '-' + match[2];
                }
                return number;
        }
    }
    getRegionSpace(length) {

        switch (length) {
            case 1:
                return '   ';
            case 2:
                return '  ';
            case 3:
                return ' ';
            case 4:
                return '';
        }
    }
    getNumberSpace(number, numberName) {
            let NumberLength = number ?number.length : 0;
        switch (NumberLength) {
            case 1:
                return numberName === 'number1' ? '  ': '   ';
            case 2:
                return numberName === 'number1' ? ' ': '  ';
            case 3:
                return numberName === 'number1' ? '': ' ';
            case 4:
                return numberName === 'number1' ? '': '';
        }
    }

    buildPlate() {
        const {number1, number2, hiragana, region} = this.state;
        return region + this.getRegionSpace(region.length) + this.getNumberSpace(number1, 'number1') + number1 + hiragana + this.getNumberSpace(number2, 'number2') + number2;
    };

    render() {
        const infoPlate = {
            plate: this.state.plate,
            region: this.state.region,
            number1: this.state.number1,
            number2: this.state.number2,
            hiragana: this.state.hiragana,
        };
        return (
            <View style={Styles.body}>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                />
                {
                    !this.state.plate ?
                        <View>
                            <View style={{height: height * 0.7}}>
                                {this.state.loading && <LoadingComponent opacity={0.9} backgroundColor={color.active} loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                                {
                                    this.state.carmeraReady && <RNCamera
                                        ref={ref => {
                                            this.camera = ref;
                                        }}
                                        style={{ width: '100%', height: '100%' }}
                                        type={RNCamera.Constants.Type.back}
                                        playSoundOnCapture={false}
                                        captureAudio={false}
                                        notAuthorizedView={<View/>}
                                        flashMode={RNCamera.Constants.FlashMode.off}
                                        permissionDialogTitle={'Permission to use camera'}
                                        permissionDialogMessage={'We need your permission to use your camera phone'}
                                    />
                                }
                                <View style={{ position: 'absolute', height: height * 0.7, width}}>
                                    <View style={{height: (height * 0.7 - 115)/2, backgroundColor: 'black', opacity: 0.5 }}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
                                            <View style={{alignItems : 'flex-start', marginTop : isIphoneX() ? 50 : 15, marginLeft : 15}}>
                                                <Icon name="md-close" size={30} color="#FFFFFF"/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', height: 115, width}}>
                                        <View style={{ height: 115, width: (width - 230)/ 2, backgroundColor: 'black', opacity: 0.5 }}/>
                                        <View style={{ height: 115, width: 230}}>
                                            <SvgImage style={{position: 'absolute', top: 0, left: 0}} source={SvgViews.TopLeft}/>
                                            <SvgImage style={{position: 'absolute', bottom: 0, left: 0}} source={SvgViews.BottomLeft}/>
                                            <SvgImage style={{position: 'absolute', top: 0, right: 0}} source={SvgViews.TopRight}/>
                                            <SvgImage style={{position: 'absolute', bottom: 0, right: 0}} source={SvgViews.BottomRight}/>
                                            <SvgImage style={{position: 'absolute', top: 20, left: 40}} source={SvgViews.PlateForm}/>
                                        </View>
                                        <View style={{ height: 115, width: (width - 230)/ 2, backgroundColor: 'black', opacity: 0.5 }}/>
                                    </View>
                                    <View style={{ height: (height * 0.7 - 115)/2, backgroundColor: 'black', opacity: 0.5 }}/>
                                    {this.state.loading === false ?
                                        <View style={{position: 'absolute', bottom: 20, left: 0, right: 0, zIndex: 20}}>
                                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>ガイドに合わせ、</Text>
                                            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginTop: 3}}>ナンバープレートを撮影してください</Text>
                                        </View> : <View/>
                                    }
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{height: (height * 2/ 3) - 20}}>
                            <Image
                                source={{uri: this.state.imageSource}}
                                style={{width: '100%', height: '100%'}}
                            />
                            <View style={{position: 'absolute', top: 30, left: 0, right: 0, bottom: 0}}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
                                    <View style={{alignItems : 'flex-start', marginTop : 15, marginLeft : 15}}>
                                        <SvgImage source={SvgViews.Remove}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
                {
                    this.state.plate ?
                    <View style={{paddingHorizontal: 15, height: height/3, flexDirection: 'column', justifyContent: 'space-between',}}>
                        <View style={{
                            marginTop: 25,
                            height: height/3 - 100,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{
                                    width: 200,
                                    height: 100,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#CCCCCC',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: (width - 230)/2
                                }}>
                                    <Text style={{
                                        fontSize: 19,
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}>{this.state.region + this.state.number1}</Text>
                                    <View style={{ flexDirection: 'row'}}>
                                        <Text style={{
                                            fontSize: 19,
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            marginTop: 13
                                        }}>{this.state.hiragana}</Text>
                                        <Text style={{
                                            fontSize: 41,
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            marginLeft: 6
                                        }}>{
                                            this.handleShowNumber(this.state.number2)
                                        }
                                        </Text>
                                    </View>
                                </View>
                                <View style={{width: 56, marginLeft: 15, marginTop: 32}}>
                                    <ButtonCarpon style={Styles.buttonEdit}
                                                  onPress={() => navigationService.navigate('LicensePlateManual', {infoPlate})}>
                                        <Text style={Styles.editText}>修正</Text>
                                    </ButtonCarpon>
                                </View>
                            </View>
                            <View style={{ marginTop: 15}}>
                                <Text style={{ textAlign: 'center', color: color.active, fontSize: 17, fontWeight: 'bold'}}>正しく読み取れているか確認してください</Text>
                            </View>
                        </View>
                        <View style={{display: 'flex', alignItems: 'flex-end', flexDirection: 'row',marginBottom: 20}}>
                            <ButtonCarpon style={{backgroundColor: '#EFEFEF', flex: 1}}
                                          onPress={() => this.setState({plate: null})}>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#666666',
                                    fontWeight: 'bold'
                                }}>撮り直す</Text>
                            </ButtonCarpon>
                            <ButtonCarpon disabled={!this.props.ready} style={{backgroundColor: '#F06A6D', flex: 1, marginLeft: 15}} onPress={() => this.confirm()}>
                                <Text style={{fontSize: 14, color: '#FFFFFF', fontWeight: 'bold'}}>OK</Text>
                            </ButtonCarpon>
                        </View>
                    </View>
                    :
                    this.state.loading ?  <View style={{justifyContent: 'center', alignItems: 'center', height: height * 0.3}}>
                        <Text style={{color: '#707070', fontSize: 14}}>ナンバープレートを検出中…</Text>
                        <LottieView
                            source={require('../../../assets/loadingPlate.json')}
                            style={{ width: 120, height: 50 }}
                            autoPlay
                            loop
                        />
                    </View>
                    :
                    <View style={{alignItems: 'center', justifyContent: 'center', height: height * 0.3}}>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.takePicture()} style={Styles.mid}>
                            <View style={Styles.round}>
                                <SvgImage source={SvgViews.Camera} />
                            </View>
                        </TouchableOpacity>
                    </View>

                }
            </View>
        )
    }

    confirm() {
        Alert.alert(
            'ご確認ください',
            `「${this.buildPlate()}」` +
            'で車両情報を登録します。',
            [
                {
                    text: 'このまま登録',
                    style: 'destructive',
                    onPress: () => {
                        this.props.loadCarProfileFromPlate(this.buildPlate());
                        addTrackerEvent('wiz_regist_method', {method: 'number'})
                    }
                },
                {text: '入力内容を確認する'},
            ],
            {cancelable: false}
        );
    }
}

const Styles = StyleSheet.create({
    title: {
        fontSize: 15,
        textAlign: 'center',
    },
    main: {
        paddingHorizontal: 15,
    },
    header: {
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        paddingTop: 160,
        paddingBottom: 160,
    },
    bottom: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        height: 50,
    },
    buttonEdit: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#EFEFEF',
        height: 40
    },
    col4: {
        width: '33.3333%',
        alignItems: 'center',
    },
    group: {
        marginTop: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    content: {
        textAlign: 'center'
    },
    body: {
        height: '100%',
        backgroundColor: stylesGeneral.backgroundColor
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    textContainer: {
        position: 'absolute',
        top: 100,
        left: 50,
    },
    activeText: {
        fontSize: 17,
        color: '#909090',
        padding: 15,
        textAlign: 'center'
    },
    editText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'black',
        paddingVertical: 10,
        textAlign: 'center',
    },
    mid: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: color.active,
        justifyContent: 'center',
        alignItems: 'center'
    },
    round: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: color.active,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
