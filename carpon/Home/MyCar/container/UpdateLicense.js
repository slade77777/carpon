import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {
    Alert,
    Linking,
    Text,
    Keyboard,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    View,
    Platform,
    SafeAreaView,
    PermissionsAndroid,
    Modal, Image, Dimensions
} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../../components';
import {connect} from 'react-redux';
import color from '../../../color';
import {SingleColumnLayout} from "../../../layouts";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {navigateSuccess, updateLicense} from '../actions/myCarAction';
import Dropdown from "../../../common/Dropdown";
import ImagePicker from 'react-native-image-picker';
import {default as MultiImagePicker} from 'react-native-image-crop-picker';
import ImageLoader from "../../../../components/ImageLoader";
import ActionSheet from 'react-native-actionsheet';
import stylesCommon from "../../../../style";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {uploadingService} from "../../../services";
import {navigationService} from "../../../../carpon/services";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import Era from "../../../common/Era";
import AndroidOpenSettings from 'react-native-android-open-settings';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getUserProfile} from "../../../Account/actions/accountAction";
import IconEntypo from 'react-native-vector-icons/Entypo';
import {addTrackerEvent, identifyUser, viewPage} from "../../../Tracker";
import Spinner from "react-native-loading-spinner-overlay";
import ImageDetailModal from "../../../../components/ImageDetailModal";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";
import {submitAppFlyer} from "../../../../App";
const {width} = Dimensions.get('window');

@screen('UpdateLicense', {header: <HeaderOnPress title={'運転免許証 ( 更新・編集 )'}/>})
@connect(
    state => ({
        carInfo: state.getCar,
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        updateLicenseReady: state.getCar.updateLicenseReady,
        colorList: state.metadata.profileOptions ? state.metadata.profileOptions.color_of_driver_license : [],
    }),
    dispatch => ({
        updateLicense: (data) => {
            dispatch(updateLicense(data))
        },
        navigateSuccess: (key) => {
            dispatch(navigateSuccess(key))
        },
        getUserProfile: () => dispatch(getUserProfile()),
    })
)
export class UpdateLicense extends Component {
    constructor(props) {
        super(props);
        const user = props.userProfile;
        this.state = {
            license_number: user ? user.license_number : null,
            license_expiration_date: user ? user.license_expiration_date : null,
            color_of_driver_license: user ? user.color_of_driver_license : null,
            license_image_front: user ? user.license_image_front : null,
            license_image_back: user ? user.license_image_back : null,
            license_image_front_signed_url: user ? user.license_image_front_signed_url : null,
            license_image_back_signed_url: user ? user.license_image_back_signed_url : null,
            isDateTimePickerVisible: false,
            imageOpen: null,
            uploading: false,
            isFullData: user && user.license_number && user.license_expiration_date && user.color_of_driver_license,
            imageFrontHeight: 0,
            imageBackHeight: 0,
            imageDetailOpen: false,
            imageDetail: null
        };
    }

    componentDidMount() {
        this.props.getUserProfile();
        viewPage('edit_driver_license', '運転免許証の変更');
        this.updateImageSize(this.props.userProfile)
    }

    updateImageSize(userProfile) {
        userProfile.license_image_front_signed_url && Image.getSize(userProfile.license_image_front_signed_url, (actualWidth, actualHeight) => {
            this.setState({imageFrontHeight : (width - 30) * actualHeight/actualWidth})
        });
        userProfile.license_image_back_signed_url && Image.getSize(userProfile.license_image_back_signed_url, (actualWidth, actualHeight) => {
            this.setState({imageBackHeight : (width - 30) * actualHeight/actualWidth})
        });
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false})
    };

    _handleDatePicked = (date) => {
        this.setState({license_expiration_date: moment(date).format('YYYY-MM-DD')});
        this._hideDateTimePicker();
        setTimeout(() => {
            this.child.focus();
        }, 500)
    };

    async handleUpdateLicense() {
        const {license_number, license_expiration_date, color_of_driver_license, license_image_front, license_image_back} = this.state;
        const profile = this.props.userProfile;
        this.props.updateLicenseReady && this.props.updateLicense({
            license_number, license_expiration_date, color_of_driver_license, license_image_front, license_image_back,
            id: this.props.carInfo.myCarInformation.id
        });
        const colorChoice = this.props.colorList.find((item) => item.value === color_of_driver_license);
        identifyUser({
            user_id: profile.id,
            user_license_update_date: (new Date(license_expiration_date).getTime())/1000,
            user_profile_license_color: colorChoice ? colorChoice.label : null
        });
        addTrackerEvent('license_status_change', {
            user_license_update_date: (new Date(license_expiration_date).getTime())/1000,
            user_profile_license_color: colorChoice ? colorChoice.label : null
        })
    }

    componentWillReceiveProps(props) {
        if (props.carInfo.updatedLicense) {
            const {license_number, license_expiration_date, color_of_driver_license} = this.state;
            const user = this.props.userProfile;
            if (user && user.id) {
                if (!this.state.isFullData) {
                    submitAppFlyer('LICENCE_REGIST',
                        {
                            user_id: user.id,
                            license_number, license_expiration_date, color_of_driver_license
                        },
                        user.id
                    );
                }
            }
            navigationService.goBack();
            this.props.navigateSuccess('updatedLicense')
        }
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <View style={{ flex: 1 }}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}}>
                            {(!this.props.updateLicenseReady || this.state.uploading)  && <Spinner
                                visible={this.state.uploading}
                                textContent={'アップロード中...'}
                                textStyle={{color: 'white'}}
                            />}
                        <View style={{backgroundColor: 'white', marginVertical: 20}}
                              onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                            <View style={{marginHorizontal: 15, height: 60}}>
                                <Dropdown
                                    label={'種類（色）'}
                                    fontSize={18}
                                    data={this.props.colorList}
                                    containerStyle={{ height: 60}}
                                    value={this.state.color_of_driver_license || ''}
                                    onChangeText={(value) => this.setState({color_of_driver_license: value})}
                                />
                            </View>
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderColor: this.state.license_expiration_date ? color.active : '#CCCCCC',
                                marginHorizontal: 15,
                                marginTop: 15,
                            }}>
                                <TouchableOpacity onPress={this._showDateTimePicker}
                                    style={{height: 60, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start'}}
                                >
                                    {
                                        this.state.license_expiration_date ?
                                            <View>
                                                <Text style={{
                                                    color: color.active,
                                                    fontSize: 11,
                                                    fontWeight: 'bold',
                                                }}>期限</Text>
                                            </View> :
                                            <View/>
                                    }
                                    {
                                        this.state.license_expiration_date ?
                                            <Text style={{
                                                fontSize: 18,
                                                marginVertical: 5,
                                                color: this.state.license_expiration_date ? '#666666' : '#999999'
                                            }}>
                                                <Era date={this.state.license_expiration_date}/>
                                            </Text>
                                            :
                                            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 8}}>
                                                <Text style={{
                                                    fontSize: 18,
                                                    marginTop: 0,
                                                    color: '#CCCCCC',
                                                    flex: 1
                                                }}>
                                                    有効期限
                                                </Text>
                                                <Icon
                                                    name="angle-down"
                                                    size={18}
                                                    color={'#CCCCCC'}
                                                    style={{textAlign: 'right', flex: 1, paddingRight: 10}}
                                                />
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                confirmTextIOS={'設定'}
                                cancelTextIOS={'キャンセル'}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                                headerTextIOS={'期限'}
                                date={this.state.license_expiration_date ? new Date(this.state.license_expiration_date) : new Date()}
                            />
                            <View style={{paddingHorizontal: 15, marginTop: 20}}>
                                <InputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='免許証番号'
                                    ref={child => {this.child = child}}
                                    keyboardType={'numeric'}
                                    value={this.state.license_number}
                                    onChangeText={(val) => this.setState({license_number: val})}
                                />
                            </View>
                            <View style={{ marginTop: 15, marginHorizontal: 40, backgroundColor: '#B1DBDE', alignItems: 'center', borderRadius: 5}}>
                                <Text style={{ color: '#333333', fontSize: 15, fontWeight: 'bold', marginTop: 15}}>ユーザー専用画像メモ機能です。</Text>
                                <Text style={{ color: '#333333', fontSize: 12, fontWeight: 'bold', marginTop: 5, marginBottom: 15}}>※カーポンが画像を無断で利用することはありません</Text>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center', bottom: 10}}>
                                <IconEntypo name="triangle-down" size={30} color="#B1DBDE"/>
                            </View>
                            <View style={{ paddingTop: 5, marginHorizontal: 15 }}>
                                <Text style={{ color: color.active, fontSize: 12, fontWeight: 'bold'}}>運転免許証 (表)</Text>
                                <TouchableOpacity onPress={() => this.handleChangeImage('front')}>
                                    {
                                        this.state.license_image_front_signed_url ?
                                            <View style={{ paddingTop: 5 }}>
                                                <ImageLoader
                                                    style={{ height: this.state.imageFrontHeight, width: width - 30 }}
                                                    source={{ uri: this.state.license_image_front_signed_url }}
                                                />
                                            </View>
                                            :
                                            <View style={Styles.mid}>
                                                <SvgImage source={() => SvgViews.IconCamera({ color: color.active})} width="50" height="45"  />
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingTop: 20, paddingBottom: 60, marginHorizontal: 15}}>
                                <Text style={{ color: color.active, fontSize: 12, fontWeight: 'bold'}}>運転免許証 (裏)</Text>
                                <TouchableOpacity
                                    onPress={() => this.handleChangeImage('back')}
                                >
                                    {
                                        this.state.license_image_back_signed_url ?
                                            <View style={{ paddingTop: 5 }}>
                                                <ImageLoader
                                                    style={{ height: this.state.imageBackHeight, width: width - 30 }}
                                                    source={{ uri: this.state.license_image_back_signed_url }}
                                                />
                                            </View>
                                            :
                                            <View style={Styles.mid}>
                                                <SvgImage source={() => SvgViews.IconCamera({ color: color.active})} width="50" height="45" />
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <ImageDetailModal
                                closeModal={() => this.setState({imageDetailOpen: false, imageDetail: null, imageOpen: null})}
                                imageDetailOpen={this.state.imageDetailOpen}
                                openEditor={() => this.openPicker(this.state.imageOpen)}
                                imageDetail={this.state.imageDetail}
                            />
                            <ActionSheet
                                ref={o => this.ActionSheetFront = o}
                                options={this.state.license_image_front_signed_url ? [
                                    'カメラロールから選択',
                                    '写真を撮る',
                                    '削除',
                                    'キャンセル'
                                ] : [
                                    'カメラロールから選択',
                                    '写真を撮る',
                                    'キャンセル'
                                ]}
                                cancelButtonIndex={this.state.license_image_front_signed_url ? 3 : 2}
                                onPress={this.handleCarPhoto.bind(this)}
                            />
                            <ActionSheet
                                ref={o => this.ActionSheetBack = o}
                                options={this.state.license_image_back_signed_url ? [
                                    'カメラロールから選択',
                                    '写真を撮る',
                                    '削除',
                                    'キャンセル'
                                ] : [
                                    'カメラロールから選択',
                                    '写真を撮る',
                                    'キャンセル'
                                ]}
                                cancelButtonIndex={this.state.license_image_back_signed_url ? 3 : 2}
                                onPress={this.handleCarPhoto.bind(this)}
                            />
                        </View>
                        </ScrollView>
                    }
                    bottomContent={
                         <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%'}}>
                            <ButtonText style={{backgroundColor: color.active}} disabled={false} title={'保存する'} onPress={() => this.handleUpdateLicense()}/>
                        </View>
                    }
                />
            </View>
        )
    }

    handleChangeImage(type) {
        this.setState({imageOpen: type});
        if ((type === 'front' && this.state.license_image_front_signed_url) || (type === 'back' && this.state.license_image_back_signed_url)) {
            this.setState({
                imageDetailOpen: true,
                imageDetail: type === 'front' ? this.state.license_image_front_signed_url : this.state.license_image_back_signed_url
            })
        } else {
            this.openPicker(type);
        }
    }

    openPicker(type) {
        if (type === 'front') {
            this.ActionSheetFront.show();
        } else {
            this.ActionSheetBack.show();
        }
    }

    uploadImage(source) {
        this.setState({uploading: true, imageDetailOpen: null, imageDetail: null});
        const bodyFormData = new FormData();
        bodyFormData.append('image', {
            uri: source,
            type: 'image/jpeg',
            name: 'avatar'
        });
        uploadingService.uploadPrivateImage(bodyFormData)
            .then((response) => {
                if (this.state.imageOpen === 'front') {
                    Image.getSize(response.url, (actualWidth, actualHeight) => {
                        this.setState({imageFrontHeight : (width - 30) * actualHeight/actualWidth, license_image_front_signed_url: response.url, uploading: false, license_image_front: response.key, imageOpen: null})
                    });
                } else {
                    Image.getSize(response.url, (actualWidth, actualHeight) => {
                        this.setState({imageBackHeight : (width - 30) * actualHeight/actualWidth, license_image_back_signed_url: response.url, uploading: false, license_image_back: response.key, imageOpen: null})
                    });
                }
                navigationService.goBack();
            }).catch((error)=> {
                this.setState({uploading: false})
                setTimeout(() => {
                    Alert.alert('写真のアップロードに失敗しました');
                }, 100)
            }
        )
    }

    async requestFilePermission() {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if (!granted) {
            Alert.alert(
                '写真へのアクセスを許可',
                '写真の利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
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
            title: 'Select License Image',
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
                Platform.OS === 'android' && this.requestFilePermission();
                MultiImagePicker.openPicker({
                    width: 1500,
                    height: 900,
                    mediaType: "photo",
                    multiple: true,
                    maxFiles: 3
                }).then(response => {
                    const carSource = [];
                    response.map(image => {
                        carSource.push({
                            uri: image.path
                        })
                    });
                    this.setState({imageDetailOpen: null, imageDetail: null});
                    carSource && navigationService.navigate('DefaultImageEditor',
                        {
                            carSource: carSource,
                            updateCar: (url) => this.uploadImage(url)
                        });

                }).catch(error => {
                    if (Platform.OS === 'ios' && error.toString().includes('Cannot access images')) {
                        Alert.alert(
                            '写真へのアクセスを許可',
                            '写真の利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                            [
                                {
                                    text: 'いいえ',
                                },
                                {
                                    text: 'はい',
                                    onPress: () => Linking.openURL('app-settings:')
                                }
                            ])
                    }
                });
                break;
            case 1:
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
                        this.setState({imageDetailOpen: null, imageDetail: null});
                        source && navigationService.navigate('DefaultImageEditor',
                            {
                                carSource: source,
                                updateCar: (url) => this.uploadImage(url)
                            });
                    }
                });
                break;
            case 2:
                if (this.state.imageOpen === 'front') {
                    this.setState({ license_image_front: null, license_image_front_signed_url: null, imageDetailOpen: null, imageOpen: null, imageDetail: null });
                } else {
                    this.setState({ license_image_back: null, license_image_back_signed_url: null, imageDetailOpen: null, imageOpen: null, imageDetail: null });
                }
                break;
            default:
                return true;
        }
    }
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        padding: '4%',
    },
    mid: {
        justifyContent: 'center',
        borderRadius: 2,
        marginTop: 10,
        height: 230,
        backgroundColor: '#EFEFEF'
    }
});

