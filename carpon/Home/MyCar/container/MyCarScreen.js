import React, {Component} from 'react';
import stylesGeneral from '../../../../style';
import {
    Dimensions,
    Image,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert, Platform,
    Linking, PermissionsAndroid
} from "react-native";
import Advertisement from '../../../../components/Advertisement';
import MyCar from '../../../../components/MyCar/MyCar';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {connect} from 'react-redux';
import {getCar, getCarPriceEstimate, getCarSellEstimate, getRecall} from "../../MyCar/actions/getCar";
import {navigationService, uploadingService} from "../../../services/index";
import ModelChangePrediction from "../components/ModelChangePrediction";
import ActionSheet from 'react-native-actionsheet';
import {default as MultiImagePicker} from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import {updateCarImage} from "../actions/myCarAction";
import Spinner from 'react-native-loading-spinner-overlay';
import {getListGasStations} from "../../GasStation/actions/gasAction";
import AndroidOpenSettings from 'react-native-android-open-settings';
import {getListStores} from "../../Inspection/actions/inspectionAction";
import {GasStationField} from "../components/GasStationField";
import {getListOilStores} from "../../OilChange/actions/oilAction";
import Campaign from "../../../../components/Campaign";

const {width} = Dimensions.get('window');

@connect(state => ({
        carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : [],
        oilRecordsData: state.getCar.myCarInformation ? state.oilRecordsHistory : null,
        gasRange: state.gasReducer ? state.gasReducer.range : '5',
        range: state.inspectionReducer ? state.inspectionReducer.range : '5',
        oilRange: state.oilReducer ? state.oilReducer.range : '5',
        profile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }), (dispatch) => ({
        getRecall: (id, form) => dispatch(getRecall(id, form)),
        getCar: () => dispatch(getCar()),
        getCarPriceEstimate: () => dispatch(getCarPriceEstimate()),
        getCarSellEstimate: () => dispatch(getCarSellEstimate()),
        updateCarImage: (data) => dispatch(updateCarImage(data)),
        getListGasStations: (range) => dispatch(getListGasStations(range)),
        getListStores: (range) => dispatch(getListStores(range)),
        getListOilStores: (range) => dispatch(getListOilStores(range))
    })
)
export default class MyCarScreen extends Component {
    state = {
        imgHeight: 0,
        refreshing: false,
        carEdit: null,
        uploading: false,
    };

    componentWillMount() {
        this.props.getRecall(this.props.carInfo.id, this.props.carInfo.form);
        this.props.getCarPriceEstimate();
        this.props.getCarSellEstimate();
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        setTimeout(() => {
            this.props.getCar();
            this.props.getRecall(this.props.carInfo.id, this.props.carInfo.form);
            this.refs.child && this.refs.child.getModelPrediction();
            this.props.getCarPriceEstimate();
            this.props.getCarSellEstimate();
            this.props.getListGasStations(this.props.gasRange);
            this.props.getListStores(this.props.range);
            this.props.getListOilStores(this.props.oilRange);
            this.setState({refreshing: false});
        }, 2000);
    };

    render() {
        return (
            <View style={{
                flex: 1,
            }}>
                <ScrollView scrollIndicatorInsets={{right: 1}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View style={Styles.body}>
                        <View style={{
                            backgroundColor: 'white',
                        }}>
                            {
                                this.props.carInfo && this.props.carInfo.length !== 0 &&
                                <TouchableOpacity activeOpacity={1}
                                                  onPress={() => navigationService.navigate('MyCarProfile')}>
                                    {
                                        (this.props.carInfo.photos && this.props.carInfo.photos.length > 0 && this.props.carInfo.photos[0]) ?
                                            <View style={{height: 250, justifyContent: 'center'}}>
                                                <Image style={{width, height: 250}}
                                                       source={{uri: this.props.carInfo.photos[0].url}}/>
                                            </View>
                                            :
                                            <TouchableOpacity activeOpacity={1} onPress={() => this.ActionSheet.show()}
                                                              style={{width: '100%', height: 'auto'}}>
                                                <SvgImage source={() => SvgViews.DefaultCarImage()}/>
                                            </TouchableOpacity>
                                    }
                                </TouchableOpacity>
                            }
                            <Spinner
                                visible={this.state.uploading}
                                textContent={'アップロード中...'}
                                textStyle={{color: 'white'}}
                            />
                            <Campaign isMyCar={true}/>
                            <GasStationField/>
                            <Advertisement/>
                            <ModelChangePrediction ref={'child'}/>
                            <MyCar/>
                        </View>
                    </View>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        options={[
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
        this.setState({uploading: true});
        const bodyFormData = new FormData();
        bodyFormData.append('image', {
            uri: source,
            type: 'image/jpeg',
            name: 'avatar'
        });
        uploadingService.uploadImage(bodyFormData).then((response) => {
            this.props.updateCarImage({
                id: null,
                url: response.url,
                car_id: this.props.carInfo.id,
                ETag: response.ETag
            });
            this.setState({uploading: false});
            navigationService.goBack();
        })
            .catch(() => {
                this.setState({uploading: false});
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
                        source && navigationService.navigate('DefaultImageEditor',
                            {
                                carSource: source,
                                updateCar: (url) => this.uploadImage(url)
                            });
                    }
                });
                break;
            default:
                return true;
        }
    }
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#F5F5F5',
        flex: 1
    },
    header: {
        backgroundColor: '#F3D625',
        fontSize: 14,
        flexDirection: 'row',
    },
    titleHeader: {
        fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', ...stylesGeneral.fontStyle
    }
});

