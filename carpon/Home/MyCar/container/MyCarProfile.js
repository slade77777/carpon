import React, {Component} from 'react';
import stylesGeneral from '../../../../style';
import {screen} from "../../../../navigation";
import {
    Dimensions,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Linking,
    PermissionsAndroid,
    SafeAreaView
} from "react-native";
import ImageSlider from 'react-native-image-slider';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {connect} from 'react-redux';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import ImagePicker from 'react-native-image-picker';
import {default as MultiImagePicker} from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet'
import {navigationService, uploadingService} from "../../../services/index";
import {CarInfo} from '../components';
import Spinner from 'react-native-loading-spinner-overlay';
import {removeCarImage, updateCarImage} from '../actions/myCarAction';
import color from "../../../color";
import {getCar} from "../actions/getCar";
import AndroidOpenSettings from 'react-native-android-open-settings';
import IconShareProfile from "../../../../components/Header/Icon/IconShareProfile";
import {VehicleInformation} from "../components/VehicleInformation";
import {Equipment} from "../components/Equipment";
import {SafetyAndSecurityEquipment} from "../components/SafetyAndSecurityEquipment";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";
import ImageDetailModal from "../../../../components/ImageDetailModal";

const {width, height} = Dimensions.get('window');

@screen('MyCarProfile', {
    header: <HeaderOnPress rightComponent={<IconShareProfile isSharable={true}/>} title='マイカープロフィール'/>
})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null
    }),
    dispatch => ({
        updateCarImage: (data) => {
            dispatch(updateCarImage(data))
        },
        removeCarImage: (id) => {
            dispatch(removeCarImage(id))
        },
        getCarInfo: () => dispatch(getCar()),
        loadListQuestion: (idSurvey) => dispatch({
            type: 'LOAD_LIST_QUESTION',
            idSurvey
        }),
    })
)
export class MyCarProfile extends Component {
    state = {
        imageDetailOpen: false,
        imageDetail: null,
        imageDetailId: null,
        uploading: false,
        modalEditImage: false,
        carEdit: null,
        isCropping: false,
        isHovering: false,
        showContent: true,
        isMainImage: false,
        CarFields: []
    };

    onClose = () => this.setState({
        imageDetailOpen: false, imageDetail: null, imageDetailId: null
    });

    handleChangeImage(images, index) {
        if (images && images[index + 1] && images[index + 1].url) {
            this.setState({
                imageDetailOpen: true,
                imageDetail: images[index + 1] && images[index + 1].url,
                imageDetailId: images[index + 1] && images[index + 1].id,
                isMainImage: index === -1
            })
        } else {
            this.ActionSheet.show();
        }
    }

    componentDidMount() {
        viewPage('my_car_profile', 'マイカープロフィール');
    }

    componentWillUnmount() {
        let updateScore = this.props.navigation.getParam('updateScore');
        if (updateScore) {
            let survey = this.props.navigation.getParam('survey');
            this.props.loadListQuestion(survey.id)
        }
    }

    render() {
        const carPhotos = this.props.carInfo.photos;
        let images = [];
        if (carPhotos) {
            for (let i = 0; i <= 9; i++) {
                images[i] = carPhotos[i] || {id: null, url: ''};
            }
        }
        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? getBottomSpace() : 0}}
                            style={Styles.body}>
                    <Spinner
                        visible={this.state.uploading}
                        textContent={'アップロード中...'}
                        textStyle={{color: 'white'}}
                    />
                    <ImageSlider loopBothSides
                                 autoPlayWithInterval={0}
                                 style={{height: 250}}
                                 loop={true}
                                 images={images}
                                 customSlide={({index, item}) => (
                                     <TouchableOpacity activeOpacity={1} style={{width}} key={index}
                                                       onPress={() => this.handleChangeImage(images, index)}>
                                         {
                                             (images[index + 1] && images[index + 1].url) ?
                                                 <Image source={{uri: images[index + 1].url}}
                                                        style={{width, height: 250, padding: 0, margin: 0}}/>
                                                 :
                                                 <View style={{
                                                     borderWidth: 1,
                                                     borderColor: color.active,
                                                     backgroundColor: '#EFEFEF',
                                                     height: 250,
                                                     alignItems: 'center',
                                                     justifyContent: 'center'
                                                 }}>
                                                     <SvgImage source={() => SvgViews.Camera({fill: color.active})}/>
                                                 </View>
                                         }
                                         {
                                             index === -1 && <View style={Styles.firstImage}>
                                                 <Text style={{color: color.active, fontWeight: 'bold'}}>
                                                     メイン画像
                                                 </Text>
                                             </View>
                                         }
                                     </TouchableOpacity>
                                 )}
                    />
                    <CarInfo/>
                    <VehicleInformation/>
                    <Equipment/>
                    <SafetyAndSecurityEquipment/>
                    <View style={{marginHorizontal: 15}}>
                        <Text style={{fontSize: 12, color: '#333333', lineHeight: 18}}>
                            ※カタログデータの為、実際の車両スペックと違う場合があります。ご了承ください
                        </Text>
                    </View>
                    <ImageDetailModal
                        closeModal={() => this.onClose()}
                        imageDetailOpen={this.state.imageDetailOpen}
                        openEditor={() => this.ActionSheet.show()}
                        imageDetail={this.state.imageDetail}
                        isMainImage={this.state.isMainImage}
                    />
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        options={
                            this.state.imageDetail ?
                                [
                                    'メイン画像に設定',
                                    '削除',
                                    'キャンセル'
                                ] : [
                                    'カメラロールから選択',
                                    '写真を撮る',
                                    'キャンセル'
                                ]}
                        cancelButtonIndex={2}
                        onPress={this.handleCarPhoto.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }

    uploadImage(source) {
        this.setState({uploading: true, modalEditImage: false});
        const bodyFormData = new FormData();
        bodyFormData.append('image', {
            uri: source.includes('http') ? source : 'file://' + source,
            type: 'image/jpeg',
            name: 'avatar'
        });
        uploadingService.uploadImage(bodyFormData).then((response) => {
            this.props.updateCarImage({
                url: response.url,
                car_id: this.props.carInfo.id,
                ETag: response.ETag
            });
            this.setState({imageDetail: null, uploading: false, imageDetailId: null});
            navigationService.goBack();
        })
            .catch(() => {
                this.setState({imageDetail: null, uploading: false, imageDetailId: null});
                setTimeout(() => {
                    alert('アップロード失敗');
                }, 100)
            })
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
                if (this.state.imageDetail) {
                    this.setMainImage();
                    this.setState({imageDetail: null, imageDetailOpen: false, imageDetailId: null, showContent: true})
                } else {
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
                        carSource && this.setState({
                            carEdit: carSource,
                            imageDetailOpen: false,
                            showContent: true
                        });
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
                }
                break;
            case 1:
                if (this.state.imageDetail) {
                    this.props.removeCarImage(this.state.imageDetailId);
                    this.setState({imageDetail: null, imageDetailOpen: false, imageDetailId: null, showContent: true})
                } else {
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
                            if (source) {
                                this.setState({
                                    carEdit: source,
                                    imageDetailOpen: false,
                                    showContent: true
                                });
                                navigationService.navigate('DefaultImageEditor',
                                    {
                                        carSource: source,
                                        updateCar: (url) => this.uploadImage(url)
                                    });
                            }
                        }
                    });
                }
                break;
            default:
                this.setState({showContent: true});
                return true;
        }
        this.setState({showContent: true});
    }

    setMainImage() {
        uploadingService.orderImage({image_id: this.state.imageDetailId}).then(() => {
            this.props.getCarInfo();
            this.setState({modalEditImage: false, carEdit: null, imageDetailOpen: false, showContent: true});
        })
            .catch((error) => {
                // console.log(error);
            })
    }
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFF',
        flex: 1
    },
    header: {
        backgroundColor: '#F3D625',
        fontSize: 14,
        flexDirection: 'row',
    },
    titleHeader: {
        fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', ...stylesGeneral.fontStyle
    },
    firstImage: {
        position: 'absolute',
        right: 20,
        borderWidth: 1,
        borderColor: color.active,
        borderRadius: 5,
        top: 20,
        padding: 5
    },
    mid: {
        justifyContent: 'center',
        height: 250,
        width: width,
        marginBottom: 50,
        backgroundColor: '#CCCCCC'
    },
    mainImage: {
        position: 'absolute',
        right: 20,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        top: height / 4 + 20,
        padding: 5
    }
});

