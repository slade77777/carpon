import {SvgImage, SvgViews} from '../../../components/Common/SvgImage';
import React, {Component} from 'react';
import {Alert, Image, SafeAreaView, Text, TouchableOpacity, View, Linking, Platform, PermissionsAndroid} from 'react-native';
import {screen} from "../../../navigation";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {navigationService, uploadingService} from "../../services";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-picker";
import {connect} from 'react-redux';
import {updateCarImage} from "../../Home/MyCar/actions/myCarAction";
import {addImage} from "../../common/actions/addImage";
import JapaneseText from "../../../components/JapaneseText";
import AndroidOpenSettings from 'react-native-android-open-settings';
import {getUserProfile} from "../../Account/actions/accountAction";
import _ from 'lodash';
import ButtonCarpon from "../../../components/Common/ButtonCarpon";

@screen('SelectCarImage', {header: <HeaderOnPress title='車検証画像の送信'/>})

@connect(state => ({
    image: state.certificationImage,
    carProfile: state.registration.carProfile,
    userProfile: state.registration ? state.registration.userProfile : {},
}), dispatch => ({
    updateCarImage: (data) => {
        dispatch(updateCarImage(data))
    },
    addImage: (image) => {
        dispatch(addImage(image))
    },
    getUserProfile: () => dispatch(getUserProfile())
}))

export class SelectCarImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            imgSource: null,
            imgShow: null,
            cancelable: false,
            loading: false
        };
        this.handleUploadCarCertificate = _.debounce(this.handleUploadCarCertificate, 1000);
    }


    uploadImage(source) {
        if (source !== undefined) {
            const bodyFormData = new FormData();
            bodyFormData.append('image', {
                uri: source,
                type: 'image/jpeg',
                name: 'avatar'
            });
            uploadingService.uploadPrivateImage(bodyFormData).then((response) => {
                this.setState({uploading: false, imgShow: response.url, imgSource: response.key});
                this.props.addImage({uploading: false, imgSource: response.key, imgShow: response.url})
            })
                .catch((error) => {
                    // console.log(error);
                })
        }
        return false;
    }

    async requestCameraPermission() {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (!granted) {
            Alert.alert(
                'カメラへのアクセスを許可',
                'カメラの利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                [
                    {
                        text: 'いいえ',
                    },
                    {
                        text: 'はい',
                        onPress: () => AndroidOpenSettings.appDetailsSettings()
                    }
                ])
        }
    }

    handleCarPhoto(buttonIndex) {
        const options = {
            title: 'Select QR Image',
            maxWidth: 1500,
            maxHeight: 900,
            quality: 0.5,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        switch (buttonIndex) {
            case 0:
                Platform.OS === 'android' && this.requestCameraPermission();
                ImagePicker.launchCamera(options, (response) => {
                    if (Platform.OS === 'ios' && response.error === 'Camera permissions not granted') {
                        Alert.alert(
                            'カメラへのアクセスを許可',
                            'カメラの利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                            [
                                {
                                    text: 'いいえ',
                                },
                                {
                                    text: 'はい',
                                    onPress: () => Linking.openURL('app-settings:')
                                }
                            ])
                    } else {
                        const source = response.uri;
                        source ? this.uploadImage(source) : null;
                    }
                });
                break;
            case 1:
                if (this.state.imgShow) {
                    this.setState({imgSource: null, imgShow: null});
                }
                break;
            default:
                return true;
        }
    }

    launchCamera() {
        const options = {
            title: 'Select QR Image',
            maxWidth: 1500,
            maxHeight: 900,
            quality: 0.5,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        Platform.OS === 'android' && this.requestCameraPermission();
        ImagePicker.launchCamera(options, (response) => {
            if (Platform.OS === 'ios' && response.error === 'Camera permissions not granted') {
                Alert.alert(
                    'カメラへのアクセスを許可',
                    'カメラの利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                    [
                        {
                            text: 'いいえ',
                        },
                        {
                            text: 'はい',
                            onPress: () => Linking.openURL('app-settings:')
                        }
                    ])
            } else {
                const source = response.uri;
                source ? this.uploadImage(source) : null;
            }
        });
    }

    handleUploadCarCertificate() {
        this.setState({loading: true});
        uploadingService.uploadCarCertificate({'image-certificates': this.state.imgSource})
            .then(() => {
                this.setState({loading: false});
                setTimeout(() => {
                    Alert.alert(
                    '送信完了',
                    '車検証画像を送信しました。内容確認後、登録されます。今しばらくお待ち下さい。',
                    [
                        {
                            text: 'OK',
                            onPress: () => this.handleNavigate()
                        }
                    ])
                }, 100)
            })
            .catch(error => {
                this.setState({loading: false});
                setTimeout(() => {
                    alert('エラー');
                }, 100);
            })
    }

    handleNavigate() {
        this.props.getUserProfile();
        this.props.userProfile.confirmed ? navigationService.popToTop() : navigationService.clear('AuthenticationScreen')
    }

    componentDidMount() {
        if (!this.props.image.imgShow) {
            this.launchCamera()
        }else {
            this.setState({
                ...this.props.image
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: '#FFFFFF', height: '100%', justifyContent: 'space-between'}}>
                <View>
                    <View style={{marginHorizontal: 20, marginTop: 25}}>
                        <JapaneseText style={{
                            fontSize: 16,
                            lineHeight: 24
                        }} value={'車検証QRがうまく読み取れない場合は以下より、車検証全体を文字が確認できる大きさで撮影し送信してください。'}/>
                    </View>
                    <View style={{ marginTop: 15}}>
                        {this.state.imgShow ?
                            <TouchableOpacity activeOpacity={1} onPress={() => this.ActionSheet.show()}>
                                <View style={{marginHorizontal: 15}}>
                                    <Image style={{width: '100%', height: 230}} source={{uri: this.state.imgShow}}/>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity activeOpacity={1} onPress={() => this.ActionSheet.show()}>
                                <View style={{
                                    borderColor: '#4B9FA5',
                                    borderWidth: 1,
                                    marginHorizontal: 15,
                                    padding: 100,
                                    backgroundColor: '#efefef'
                                }}>
                                    <SvgImage source={SvgViews.CameraIcon}/>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={{ margin: 15}}>
                    <ButtonCarpon disabled={this.state.loading || !this.state.imgShow}
                            style={{backgroundColor: '#F37B7D'}}
                            onPress={() => this.handleUploadCarCertificate()}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 14,
                                color: '#FFFFFF'
                        }}>送信する</Text>
                    </ButtonCarpon>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={this.state.imgShow ? [
                        'カメラで撮影する',
                        '削除',
                        'キャンセル'
                    ] : [
                        'カメラで撮影する',
                        'キャンセル'
                    ]}
                    cancelButtonIndex={this.state.imgShow ? 2 : 1}
                    onPress={this.handleCarPhoto.bind(this)}
                />
            </SafeAreaView>
        )
    }
}
