import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {
    Alert,
    Text,
    Keyboard,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    View,
    SafeAreaView,
    PermissionsAndroid,
    Platform,
    Linking,
    Dimensions,
    Image, Modal,
} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../../components';
import {connect} from 'react-redux';
import color from '../../../color';
import {SingleColumnLayout} from "../../../layouts";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {navigateSuccess, updateInsurance} from '../actions/myCarAction';
import ImagePicker from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {myCarService, uploadingService} from "../../../services/index";
import {navigationService} from "../../../../carpon/services";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import Dropdown from "../../../common/Dropdown";
import AndroidOpenSettings from 'react-native-android-open-settings';
import Icon from 'react-native-vector-icons/Entypo';
import {getUserProfile} from "../../../Account/actions/accountAction";
import {addTrackerEvent, viewPage} from "../../../Tracker";
import {default as MultiImagePicker} from "react-native-image-crop-picker";
import Spinner from "react-native-loading-spinner-overlay";
import ImageViewer from "react-native-image-zoom-viewer";
import ImageDetailModal from "../../../../components/ImageDetailModal";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');

@screen('UpdateInsurance', {header: <HeaderOnPress title={'任意保険（更新・修正）'}/>})
@connect(
    state => ({
        carInfo: state.getCar,
        updateInsuranceReady: state.getCar.updateInsuranceReady,
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_company : [],
        gradeList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_nonfleet_grade : [],
        accidentList: state.metadata.profileOptions ? state.metadata.profileOptions.accident_coefficient_applied_term : [],
        myProfile: state.registration.userProfile.myProfile,
    }),
    dispatch => ({
        updateInsurance: (data) => {
            dispatch(updateInsurance(data))
        },
        navigateSuccess: (key) => {
            dispatch(navigateSuccess(key))
        },
        getUserProfile: () => dispatch(getUserProfile()),
    })
)
export class UpdateInsurance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            insurance_company: props.myProfile.insurance_company,
            accident_coefficient_applied_term: (props.myProfile.accident_coefficient_applied_term !== 8) ? props.myProfile.accident_coefficient_applied_term : props.accidentList[0].value,
            insurance_expiration_date: props.myProfile.insurance_expiration_date,
            insurance_number: props.myProfile.insurance_number,
            insurance_nonfleet_grade: props.myProfile.insurance_nonfleet_grade,
            insurance_image_front: props.myProfile.insurance_image_front,
            insurance_image_front_signed_url: props.myProfile.insurance_image_front_signed_url,
            insurance_image_back: props.myProfile.insurance_image_back,
            insurance_image_back_signed_url: props.myProfile.insurance_image_back_signed_url,
            isDateTimePickerVisible: false,
            imageOpen: null,
            uploading: false,
            imageFrontHeight: 0,
            imageBackHeight: 0,
            imageDetailOpen: false,
            imageDetail: null
        };
    }

    componentDidMount() {
        this.props.getUserProfile();
        viewPage('edit_insurance', '任意保険の変更');
        this.updateImageSize(this.props.myProfile);
    }

    updateImageSize(userProfile) {
        userProfile.insurance_image_front_signed_url && Image.getSize(userProfile.insurance_image_front_signed_url, (actualWidth, actualHeight) => {
            this.setState({imageFrontHeight : (width - 30) * actualHeight/actualWidth})
        });
        userProfile.insurance_image_back_signed_url && Image.getSize(userProfile.insurance_image_back_signed_url, (actualWidth, actualHeight) => {
            this.setState({imageBackHeight : (width - 30) * actualHeight/actualWidth})
        });
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({insurance_expiration_date: date});
        this._hideDateTimePicker();
    };

    async handleUpdateInsurance() {
        const {insurance_company, accident_coefficient_applied_term, insurance_expiration_date, insurance_number,
            insurance_nonfleet_grade, insurance_image_front, insurance_image_back} = this.state;
        this.props.updateInsuranceReady && this.props.updateInsurance({
            insurance_company: insurance_company || this.props.optionsList[0].value,
            accident_coefficient_applied_term: accident_coefficient_applied_term || this.props.accidentList[0].value,
            insurance_expiration_date, insurance_number,
            insurance_nonfleet_grade: insurance_nonfleet_grade || this.props.gradeList[0].value, insurance_image_front, insurance_image_back,
            id: this.props.carInfo.myCarInformation.id
        });
        setTimeout(() => {
            const userProfile = this.props.myProfile;
            addTrackerEvent('car_insurance_state_change', {
                car_has_insurance: userProfile.has_car_insurance === null ? '' : userProfile.has_car_insurance,
                car_insurance_expire_date: insurance_expiration_date ? (new Date(userProfile.insurance_expiration_date).getTime())/1000 : null
            });
        }, 5000)
    }

    componentWillReceiveProps(props) {
        if (props.carInfo.updatedInsurance) {
            Alert.alert(
                '保存しました',
                '',
                [
                    {text: 'OK', onPress: () => {
                        navigationService.goBack()
                    }},
                ],
                {cancelable: false}
            );
            this.props.navigateSuccess('updatedInsurance')
        }
    }

    handleOnSelected(val) {
        this.setState({ insurance_company: val});
    }

    render() {
        const inputAccessoryViewID ='inputAccessoryViewID';
        const optionList = this.props.optionsList.map((item) => {
            item.label = item.name;
            return item;
        });
        const gradeList = this.props.gradeList;
        const accidentList = this.props.accidentList;
        return (
            <View style={{flex : 1}}>
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <ScrollView scrollIndicatorInsets={{right: 1}} style={{height: '100%', backgroundColor: 'white'}}
                          onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                        {(!this.props.updateInsuranceReady || this.state.uploading) && <Spinner
                            visible={this.state.uploading}
                            textContent={'アップロード中...'}
                            textStyle={{color: 'white'}}
                        />}
                        <View style={{...Styles.inforLine, marginTop: 20}}>
                            <View style={{height: 65, width: '100%'}}>
                                <Dropdown
                                    label={'保険会社'}
                                    baseColor={color.active}
                                    data={optionList}
                                    value={this.state.insurance_company ? this.state.insurance_company : (optionList[0] && optionList[0].value)}
                                    onChangeText={(value) => this.handleOnSelected(value)}
                                />
                            </View>
                        </View>
                        <View style={{ margin: 15}}>
                            <View style={{
                                borderBottomWidth: 0.5,
                                borderColor: '#CCCCCC',
                                width: '100%',
                                height: 51,
                                marginTop: 10
                            }}>
                                <TouchableOpacity onPress={this._showDateTimePicker}>
                                    <View>
                                        <Text style={{
                                            color: color.active,
                                            fontSize: this.state.insurance_expiration_date ? 11 : 20,
                                            fontWeight: 'bold',
                                        }}>{this.state.insurance_expiration_date && '任意保険満期'}</Text>
                                    </View>
                                    <Text style={{
                                        fontSize: 18,
                                        marginTop: this.state.insurance_expiration_date ? (Platform.OS === 'ios' ? 10 : 5 ) : (Platform.OS === 'ios' ? 10 : -5),
                                        color: this.state.insurance_expiration_date ? '#666666' : '#CCCCCC'
                                    }}>
                                        {this.state.insurance_expiration_date ? moment(this.state.insurance_expiration_date).format('YYYY年M月D日') : '任意保険満期'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: 50, width: '100%', marginTop: 10}}>
                                <Dropdown
                                    baseColor={color.active}
                                    labelHeight={25}
                                    fontSize={18}
                                    labelFontSize={12}
                                    label={'前年度事故係数適用期間'}
                                    data={accidentList}
                                    value={this.state.accident_coefficient_applied_term ? this.state.accident_coefficient_applied_term : (accidentList[0] && accidentList[0].value)}
                                    onChangeText={(value) => this.setState({accident_coefficient_applied_term: value})}
                                />
                            </View>
                        </View>
                        <View style={Styles.inforLine}>
                            <View style={{height: 65, width: '100%'}}>
                                <Dropdown
                                    label={'ノンフリート等級'}
                                    baseColor={color.active}
                                    labelHeight={30}
                                    fontSize={18}
                                    labelFontSize={13}
                                    data={gradeList}
                                    value={this.state.insurance_nonfleet_grade ? this.state.insurance_nonfleet_grade : (gradeList[0] && gradeList[0].value)}
                                    onChangeText={(value) => {
                                        this.setState({insurance_nonfleet_grade: value});
                                        setTimeout(() => {
                                            this.child.focus();
                                        }, 500)
                                    }}
                                />
                            </View>
                        </View>
                        <View style={Styles.inforLine}>
                            <View style={{height: 65, width: '100%', marginTop: 10}}>
                                <InputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='保険証券番号'
                                    maxLength={16}
                                    ref={child => {this.child = child}}
                                    style={{ color: '#666666'}}
                                    value={this.state.insurance_number}
                                    onChangeText={(val) => this.setState({insurance_number: val})}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 15, marginHorizontal: 40, backgroundColor: '#B1DBDE', alignItems: 'center', borderRadius: 5}}>
                            <Text style={{ color: '#333333', fontSize: 15, fontWeight: 'bold', marginTop: 15}}>ユーザー専用画像メモ機能です。</Text>
                            <Text style={{ color: '#333333', fontSize: 12, fontWeight: 'bold', marginTop: 5, marginBottom: 15}}>※カーポンが画像を無断で利用することはありません</Text>
                        </View>
                        <View style={{ width: '100%', alignItems: 'center', bottom: 10}}>
                            <Icon name="triangle-down" size={30} color="#B1DBDE"/>
                        </View>
                        <View style={{ paddingTop: 5, marginHorizontal: 15 }}>
                            <Text style={{ color: color.active, fontSize: 12, marginBottom: 10, fontWeight: 'bold'}}>任意保険証券（表）</Text>
                            <TouchableOpacity onPress={() => this.handleChangeImage('front')}>
                                {
                                    this.state.insurance_image_front_signed_url ?
                                        <View style={{ paddingTop: 5 }}>
                                            <Image
                                                style={{ height: this.state.imageFrontHeight, width: width - 30 }}
                                                source={{ uri: this.state.insurance_image_front_signed_url }}
                                            />
                                        </View>
                                        :
                                        <View style={Styles.mid}>
                                            <SvgImage source={() => SvgViews.IconCamera({color: color.active})} width="50" height="45"  />
                                        </View>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 20, marginHorizontal: 15, marginBottom: 80 }}>
                            <Text style={{ color: color.active, fontSize: 12, marginBottom: 10, fontWeight: 'bold'}}>任意保険証券（裏）</Text>
                            <TouchableOpacity onPress={() => this.handleChangeImage('back')}>
                                {
                                    this.state.insurance_image_back_signed_url ?
                                        <View style={{ paddingTop: 5 }}>
                                            <Image
                                                style={{ height: this.state.imageBackHeight, width: width - 30 }}
                                                source={{ uri: this.state.insurance_image_back_signed_url }}
                                            />
                                        </View>
                                        :
                                        <View style={Styles.mid}>
                                            <SvgImage source={() => SvgViews.IconCamera({color: color.active})} width="50" height="45" />
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
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            confirmTextIOS={'設定'}
                            cancelTextIOS={'キャンセル'}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                            headerTextIOS={'期限'}
                            date={this.state.insurance_expiration_date ? new Date(this.state.insurance_expiration_date) : new Date()}
                        />
                        <ActionSheet
                            ref={o => this.ActionSheetFront = o}
                            options={this.state.insurance_image_front_signed_url ? [
                                'カメラロールから選択',
                                '写真を撮る',
                                '削除',
                                'キャンセル'
                            ] : [
                                'カメラロールから選択',
                                '写真を撮る',
                                'キャンセル'
                            ]}
                            cancelButtonIndex={this.state.insurance_image_front_signed_url ? 3 : 2}
                            onPress={this.handleCarPhoto.bind(this)}
                        />
                        <ActionSheet
                            ref={o => this.ActionSheetBack = o}
                            options={this.state.insurance_image_back_signed_url ? [
                                'カメラロールから選択',
                                '写真を撮る',
                                '削除',
                                'キャンセル'
                            ] : [
                                'カメラロールから選択',
                                '写真を撮る',
                                'キャンセル'
                            ]}
                            cancelButtonIndex={this.state.insurance_image_back_signed_url ? 3 : 2}
                            onPress={this.handleCarPhoto.bind(this)}
                        />
                    </ScrollView>
                }
                bottomContent={
                    <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%'}}>
                        <ButtonText style={{backgroundColor: color.active}} disabled={false} title={'更新する'} onPress={() => this.handleUpdateInsurance()}/>
                    </View>
                }
            />
            </View>
        )
    }

    handleChangeImage(type) {
        this.setState({imageOpen: type});
        if ((type === 'front' && this.state.insurance_image_front_signed_url) || (type === 'back' && this.state.insurance_image_back_signed_url)) {
            this.setState({
                imageDetailOpen: true,
                imageDetail: type === 'front' ? this.state.insurance_image_front_signed_url : this.state.insurance_image_back_signed_url
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
        uploadingService.uploadPrivateImage(bodyFormData).then((response) => {
            if (this.state.imageOpen === 'front') {
                Image.getSize(response.url, (actualWidth, actualHeight) => {
                    this.setState({imageFrontHeight : (width - 30) * actualHeight/actualWidth, insurance_image_front_signed_url: response.url, uploading: false, insurance_image_front: response.key, imageOpen: null})
                });
            } else {
                Image.getSize(response.url, (actualWidth, actualHeight) => {
                    this.setState({imageBackHeight : (width - 30) * actualHeight/actualWidth, insurance_image_back_signed_url: response.url, uploading: false, insurance_image_back: response.key, imageOpen: null})
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
            title: 'Select insurance Image',
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
                    this.setState({ insurance_image_front: null, insurance_image_front_signed_url: null, imageDetailOpen: null, imageOpen: null, imageDetail: null });
                } else {
                    this.setState({ insurance_image_back: null, insurance_image_back_signed_url: null, imageDetailOpen: null, imageOpen: null, imageDetail: null });
                }
                break;
            default:
                return true;
        }
    }
}

const Styles = StyleSheet.create({
    mid: {
        justifyContent: 'center',
        borderRadius: 2,
        marginTop: 10,
        height: 230,
        backgroundColor: '#EFEFEF'
    },
    inforLine: {
        paddingHorizontal: 15,
        marginTop: 10,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    textInput : {
        width: '45%',
        height: 65,
    }
});
