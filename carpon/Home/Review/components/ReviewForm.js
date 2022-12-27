import React, {Component} from 'react';
import { InputText} from '../../../../components/index';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, Text, View, Dimensions, Modal, Image, Linking,
    PermissionsAndroid, Platform, SafeAreaView, KeyboardAvoidingView, InputAccessoryView, Keyboard
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import StarRate from "../../../../components/Common/StarRate";
import stylesCommon from "../../../../style";
import Dropdown from '../../../common/Dropdown';
import TextInputMultiline from "../../../../components/TextInputMultiline";
import {connect} from 'react-redux';
import {editReview, getPastReview, postReview, postReviewFirst, requestSuccess} from "../action/ReviewAction";
import moment from 'moment'
import ImagePicker from 'react-native-image-picker';
import {default as MultiImagePicker} from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet'
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import Icon from "react-native-vector-icons/FontAwesome";
import {loadUser} from "../../../FirstLoginPhase/actions/registration";
import AndroidOpenSettings from 'react-native-android-open-settings';
import color from "../../../color";
import CarImageList from "../../../../components/CarImageList";
import {navigationService} from "../../../services";
import CarLabel from "../../../../components/CarLabel";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import CarponRate from "../container/CarponRate";
import {changeScreenNumber} from "../../../common/actions/metadata";

const {width, height} = Dimensions.get('window');

@connect(state => ({
        carInformation: state.registration.carProfile.profile,
        profile: state.registration.userProfile.myProfile,
        loading: state.review.loading,
        carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : [],
        review: state.review
    }),
    dispatch => ({
        getPastReview: (id) => dispatch(getPastReview(id)),
        postReview: (review, MyId) => dispatch(postReview(review, MyId)),
        postReviewFirst: (review, MyId) => dispatch(postReviewFirst(review, MyId)),
        editReview: (review) => dispatch(editReview(review)),
        loadUser: () => dispatch(loadUser()),
        requestSuccess: (key) => dispatch(requestSuccess(key)),
        changeScreenNumber: (number) => dispatch(changeScreenNumber(number)),
    }))

export default class ReviewForm extends Component {

    constructor(props) {
        super(props);
        const lastestMileage = this.props.carInformation.latest_mileage_kiro ? this.props.carInformation.latest_mileage_kiro : this.props.carInformation.mileage_kiro_certificate;
        this.data = {
            car_mileage_kiro: lastestMileage,
            total_rate: 0,
            carSource: (props.carInfo && props.carInfo.photos && props.carInfo.photos[0] && !props.navigation.getParam('contentReview')) ? props.carInfo.photos[0].url : null,
            modalVisible: false,
            modalEditImage: false,
            carEdit: null,
            CarAge: [],
            status: 'post',
            review_text: '',
            review_nice_thing: '',
            review_other: '',
            id: null,
            imageHeight: 0,
            rate_capacity: 0,
            rate_economical: 0,
            rate_exterior_design: 0,
            rate_interior_design: 0,
            rate_ride_comfort: 0,
            rate_ride_easy: 0,
            rate_ride_performance: 0,
            rateApp: false
        };
        this.state = {
            ...this.data
        };
    }

    componentWillMount() {
        this.updateImageSize();

        let startDate = this.props.carInformation ? this.props.carInformation.first_registration_date : null;
        let countMonth = moment().diff(startDate, 'month');
        for (let i = 0; i < 6; i++) {
            const month = (countMonth % 12) || 12;
            const year = Math.trunc(countMonth / 12);
            const label = `${month !== 12 ? year : year - 1}年 ${month}ヶ月`;
            this.state.CarAge[i] = {value: countMonth, label};
            countMonth--;
        }
        let contentReview = this.props.navigation.getParam('contentReview');
        contentReview && this.setState({...contentReview, status: 'edit'});
        if (contentReview && contentReview.image_url) {
            this.setState({carSource: contentReview.image_url}, () => {
                this.updateImageSize();
            })
        }
    }

    updateImageSize() {
        if (this.state.carSource) {
            Image.getSize(this.state.carSource, (actualWidth, actualHeight) => {
                this.setState({imageHeight : (width - 30) * actualHeight/actualWidth})
            });
        }
    }

    handleOnChangeText = (text, field) => {
        this.setState({[field]: text});
    };

    onStarRatingPress = (rating, starCountName) => {
        let sum = this.state.total_rate - (this.state[starCountName] ? this.state[starCountName] : 0) / 7 + rating / 7;
        this.setState({[starCountName]: rating, total_rate: sum});
    };

    handleOnSelected = (value) => {
        this.setState({car_age: value});
    };

    validateField() {
        const {review_text, review_nice_thing, review_other} = this.state;
        return review_text.length >= 30 && review_nice_thing.length >= 10 && review_other.length >= 10;
    }

    validateStarRating() {
        const {rate_exterior_design, rate_interior_design, rate_ride_performance, rate_ride_comfort, rate_ride_easy, rate_economical, rate_capacity} = this.state;
        return rate_exterior_design > 0 && rate_interior_design > 0 && rate_ride_performance > 0 &&
            rate_ride_comfort > 0 && rate_ride_easy > 0 && rate_economical > 0 && rate_capacity > 0
    }

    handleSubmit = () => {
        const {
            rate_exterior_design, rate_interior_design, rate_ride_performance, rate_ride_comfort, rate_ride_easy, rate_economical,
            rate_capacity, review_text, review_nice_thing, review_other, carSource, car_mileage_kiro, car_age, status, id, rateApp
        } = this.state;

        const bodyFormData = new FormData();
        !!id && bodyFormData.append('id', id);
        bodyFormData.append('rate_exterior_design', rate_exterior_design);
        bodyFormData.append('rate_interior_design', rate_interior_design);
        bodyFormData.append('rate_ride_performance', rate_ride_performance);
        bodyFormData.append('rate_ride_comfort', rate_ride_comfort);
        bodyFormData.append('rate_ride_easy', rate_ride_easy);
        bodyFormData.append('rate_economical', rate_economical);
        bodyFormData.append('rate_capacity', rate_capacity);
        bodyFormData.append('review_text', review_text);
        bodyFormData.append('review_nice_thing', review_nice_thing);
        bodyFormData.append('review_other', review_other);
        bodyFormData.append('car_mileage_kiro', car_mileage_kiro);
        bodyFormData.append('car_age', car_age ? parseInt(car_age, 10) : this.state.CarAge[0].value);
        carSource &&
        bodyFormData.append('image', {
            uri: carSource.includes('http') ? carSource : 'file://' + carSource,
            type: 'image/jpeg',
            name: 'avatar'
        });
        switch (status) {
            case 'post':
                if (this.props.isFirstReview) {
                    return rateApp ? this.props.editReview(bodyFormData) : this.props.postReviewFirst(bodyFormData, this.props.profile.id);
                } else {
                    return rateApp ? this.props.editReview(bodyFormData) : this.props.postReview(bodyFormData, this.props.profile.id);
                }
            case 'edit':
                return this.props.editReview(bodyFormData);
            default :
                return Alert.alert(
                    'メッセージ',
                    'コメントを入力してください (必須)',
                    [
                        {text: 'やり直す', style: 'cancel'},
                    ],
                    {cancelable: false}
                );
        }
    };

    handleTurnOffRateAlert() {
        this.setState({rateApp: false})
    }

    componentWillReceiveProps(props) {
        if(props.review.postReviewSuccess){
            this.handlePostReviewSuccess();
            this.props.requestSuccess('postReviewSuccess');
        }
    }

    handlePostReviewSuccess() {
        const reviewAppStatus = this.props.review.reviewAppStatus;
        Alert.alert(
            'レビューを投稿しました',
            '',
            [
                {
                        title: 'OK',
                        onPress: () => {
                            return reviewAppStatus ? this.handleSetRateApp() : this.handleGoBackMain()
                        }
                    }
            ]
        )
    }

    handleSetRateApp() {
        return this.setState({rateApp: true})
    }

    handleGoBackMain() {
        this.props.changeScreenNumber(3);
        return navigationService.popToTop();
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        const carPhotos = this.props.carInformation.photos;
        const {
            rate_exterior_design, rate_interior_design, rate_ride_performance, rate_ride_comfort, rate_ride_easy, rate_economical,
            rate_capacity, review_text,  car_mileage_kiro, car_age, rateApp
        } = this.state;
        const review_other = this.state.review_other ? this.state.review_other: '';
        const review_nice_thing = this.state.review_nice_thing ? this.state.review_nice_thing: '';
        return (
            <View style={{flex: 1}}>
                {
                    this.props.loading &&
                    <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>
                }
                {
                    rateApp && <CarponRate params={{move: 'MainTab'}}
                                                      handleTurnOffRateAlert={()=> this.handleTurnOffRateAlert()}/>
                }
                <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'}>
                    <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFF'}}>
                        <View style={Styles.body}>
                            <View style={{ margin: 15}}>
                                <CarLabel/>
                            </View>
                            <View style={{marginHorizontal: 15, marginBottom: 15}}>
                                <Text tyle={{fontSize: 17, color: '#666666', lineHeight: 24}}>マイカーについて教えて下さい。</Text>
                            </View>
                            <View style={Styles.g2}>
                                <Text style={Styles.titleGreen}>
                                    現在の走行距離
                                </Text>
                            </View>
                            <View style={{...Styles.row, paddingTop: 0, marginBottom: 10}}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        flex: 1
                                    }}>
                                        <InputText
                                            title={''}
                                            keyboardType={'numeric'}
                                            value={`${car_mileage_kiro || ''}`}
                                            onChangeText={(text) => this.handleOnChangeText(text, 'car_mileage_kiro')}/>
                                    </View>
                                    <Text style={{
                                        position: 'absolute',
                                        right: 10,
                                        top: 20
                                    }}>km</Text>
                                </View>
                            </View>
                            <View style={Styles.g2}>
                                <Text style={Styles.titleGreen}>
                                    車齢（初度登録からの経過年数）
                                </Text>
                            </View>
                            <View style={{...Styles.row, paddingTop: 0, marginBottom: 5}}>
                                <View style={{flex: 1}}>
                                    <Dropdown
                                        label={''}
                                        dropdownOffset={{top: 20, left: 0}}
                                        data={this.state.CarAge}
                                        value={car_age ? car_age : this.state.CarAge[0].value}
                                        onChangeText={(value) => this.handleOnSelected(value)}
                                    />
                                </View>
                            </View>
                            <View style={Styles.g2}>
                                <Text style={Styles.titleGreen}>
                                    マイカーの評価
                                </Text>
                            </View>
                            <View style={{...Styles.row, paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#CCCCCC'}}>
                                <View style={Styles.oneHalf}>
                                    <Text style={Styles.textBold}>外装デザイン</Text>
                                    <Text style={Styles.textRegular}>外観のデザイン及び機能性</Text>
                                </View>
                                <View style={Styles.oneHalf}>
                                    <StarRate
                                        onPress={true}
                                        starCount={rate_exterior_design ? rate_exterior_design : 0}
                                        onStarRatingPress={(rating) => this.onStarRatingPress(rating, 'rate_exterior_design')}
                                    />
                                </View>
                            </View>
                            <View style={{...Styles.row, paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#CCCCCC'}}>
                                <View style={Styles.oneHalf}>
                                    <Text style={Styles.textBold}>内装デザイン</Text>
                                    <Text style={Styles.textRegular}>内装のデザイン及び機能性</Text>
                                </View>
                                <View style={Styles.oneHalf}>
                                    <StarRate
                                        onPress={true}
                                        starCount={rate_interior_design ? rate_interior_design : 0}
                                        onStarRatingPress={(rating) => this.onStarRatingPress(rating, 'rate_interior_design')}
                                    />
                                </View>
                            </View>
                            <View style={{...Styles.row, paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#CCCCCC'}}>
                                <View style={Styles.oneHalf}>
                                    <Text style={Styles.textBold}>走行性能</Text>
                                    <Text style={Styles.textRegular}>走り心地及び操作性</Text>
                                </View>
                                <View style={Styles.oneHalf}>
                                    <StarRate
                                        onPress={true}
                                        starCount={rate_ride_performance ? rate_ride_performance : 0}
                                        onStarRatingPress={(rating) => this.onStarRatingPress(rating, 'rate_ride_performance')}
                                    />
                                </View>
                            </View>
                            <View style={{...Styles.row, paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#CCCCCC'}}>
                                <View style={Styles.oneHalf}>
                                    <Text style={Styles.textBold}>乗り心地</Text>
                                    <Text style={Styles.textRegular}>乗り心地</Text>
                                </View>
                                <View style={Styles.oneHalf}>
                                    <StarRate
                                        onPress={true}
                                        starCount={rate_ride_comfort}
                                        onStarRatingPress={(rating) => this.onStarRatingPress(rating, 'rate_ride_comfort')}
                                    />
                                </View>
                            </View>
                            <View style={{...Styles.row, paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#CCCCCC'}}>
                                <View style={Styles.oneHalf}>
                                    <Text style={Styles.textBold}>取り回し</Text>
                                    <Text style={Styles.textRegular}>運転しやすさ</Text>
                                </View>
                                <View style={Styles.oneHalf}>
                                    <StarRate
                                        onPress={true}
                                        starCount={rate_ride_easy ? rate_ride_easy : 0}
                                        onStarRatingPress={(rating) => this.onStarRatingPress(rating, 'rate_ride_easy')}
                                    />
                                </View>
                            </View>
                            <View style={{...Styles.row, paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#CCCCCC'}}>
                                <View style={Styles.oneHalf}>
                                    <Text style={Styles.textBold}>経済性</Text>
                                    <Text style={Styles.textRegular}>燃費等の維持費</Text>
                                </View>
                                <View style={Styles.oneHalf}>
                                    <StarRate
                                        onPress={true}
                                        starCount={rate_economical ? rate_economical : 0}
                                        onStarRatingPress={(rating) => this.onStarRatingPress(rating, 'rate_economical')}
                                    />
                                </View>
                            </View>
                            <View style={{...Styles.row, paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#CCCCCC'}}>
                                <View style={Styles.oneHalf}>
                                    <Text style={Styles.textBold}>荷室 ( トランク )</Text>
                                    <Text style={Styles.textRegular}>積める荷物の量</Text>
                                </View>
                                <View style={Styles.oneHalf}>
                                    <StarRate
                                        onPress={true}
                                        starCount={rate_capacity ? rate_capacity : 0}
                                        onStarRatingPress={(rating) => this.onStarRatingPress(rating, 'rate_capacity')}
                                    />
                                </View>
                            </View>
                            <View style={{paddingTop: hp('4%')}}>
                                <View style={{...Styles.g2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View>
                                        <Text style={Styles.titleGreen}>マイカーの良いところ</Text>
                                    </View>
                                    <View style={{paddingRight: 15}}>
                                        {(review_nice_thing.length >= 10 && review_nice_thing.length <= 1000) ?
                                            <Icon name='check-circle' color='#4B9FA5' size={16}/> :
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: '#F37B7D'}}>あと{10 - review_nice_thing.length}文字</Text>
                                                <Icon style={{marginLeft: 3}} name='exclamation-circle' color='#F37B7D'
                                                      size={16}/>
                                            </View>}
                                    </View>
                                </View>
                                <View style={{height: hp('20%'), padding: 15}}>
                                    <TextInputMultiline
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        value={review_nice_thing}
                                        style={{textAlignVertical: 'top', borderRadius: 0}}
                                        maxLength={1000}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'review_nice_thing')}
                                        placeholder={'10文字以上1000文字以内でご入力ください。例）良い点や悪い点を含めた総合的なまとめなど'}
                                    />
                                </View>
                            </View>
                            <View style={{paddingTop: 10}}>
                                <View style={{...Styles.g2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View>
                                        <Text style={Styles.titleGreen}>マイカーのイマイチなところ</Text>
                                    </View>
                                    <View style={{paddingRight: 15}}>
                                        {(review_other.length >= 10 && review_other.length <= 1000) ?
                                            <Icon name='check-circle' color='#4B9FA5' size={16}/> :
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: '#F37B7D'}}>あと{10 - review_other.length}文字</Text>
                                                <Icon style={{marginLeft: 3}} name='exclamation-circle' color='#F37B7D'
                                                      size={16}/>
                                            </View>}
                                    </View>
                                </View>
                                <View style={{height: hp('20%'), padding: 15}}>
                                    <TextInputMultiline
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        value={review_other}
                                        style={{textAlignVertical: 'top', borderRadius: 0}}
                                        maxLength={1000}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'review_other')}
                                        placeholder={'10文字以上1000文字以内でご入力ください。例）内装が安っぽい、後部座席が狭い、荷室が狭い、など'}
                                    />
                                </View>
                            </View>
                            <View style={{paddingVertical: 10}}>
                                <View style={{...Styles.g2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View>
                                        <Text style={Styles.titleGreen}>レビュー本文</Text>
                                    </View>
                                    <View style={{paddingRight: 15}}>
                                        {review_text.length >= 30 ? <Icon name='check-circle' color='#4B9FA5' size={16}/> :
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{color: '#F37B7D'}}>あと{30 - review_text.length}文字</Text>
                                                <Icon style={{marginLeft: 3}} name='exclamation-circle' color='#F37B7D'
                                                      size={16}/>
                                            </View>}
                                    </View>
                                </View>
                                <View style={{height: hp('20%'), padding: 15}}>
                                    <TextInputMultiline
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        value={review_text ? review_text : ''}
                                        style={{textAlignVertical: 'top', borderRadius: 0}}
                                        maxLength={1000}
                                        placeholder={'30文字以上1000文字以内でご入力ください例）視界が広く運転しやすい、収納が多く使いやすい、など'}
                                        onChangeText={(text) => this.handleOnChangeText(text, 'review_text')}
                                    />
                                </View>
                            </View>
                            <View style={Styles.g2}>
                                <Text style={Styles.titleGreen}>
                                    マイカー画像
                                </Text>
                            </View>
                            <View style={{padding: 15}}>
                                <TouchableOpacity onPress={() => this.ActionSheet.show()}>
                                    {
                                        this.state.carSource ?
                                            <View style={{paddingTop: hp('1%')}}>
                                                <Image
                                                    style={{width: width - 30, height: this.state.imageHeight}}
                                                    source={{uri: this.state.carSource}}
                                                />
                                            </View>
                                            :
                                            <View style={Styles.mid}>
                                                <SvgImage source={() => SvgViews.IconCamera({color: color.active})} width="50" height="45" />
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.button}>
                                <ButtonCarpon disabled={!this.validateStarRating() || !this.validateField()}
                                              style={{backgroundColor: '#F37B7D', height: 50}}
                                              onPress={() => this.handleSubmit()}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        color: '#FFFFFF'
                                    }}>レビューを投稿する</Text>
                                </ButtonCarpon>
                            </View>
                        </View>
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            options={this.state.carSource ? [
                                'プロフィール画像から選択',
                                'カメラロールから選択',
                                'カメラで撮影',
                                '削除',
                                'キャンセル'
                            ] : [
                                'プロフィール画像から選択',
                                'カメラロールから選択',
                                'カメラで撮影',
                                'キャンセル'
                            ]}
                            cancelButtonIndex={this.state.carSource ? 4 : 3}
                            onPress={this.handleCarPhoto.bind(this)}
                        />
                        <Modal visible={this.state.modalVisible} transparent={false} onRequestClose={this.onClose}>
                            <CarImageList carPhotos={carPhotos} onClose={this.onClose} saveCar={(carImages) => this.chooseMyCar(carImages)}/>
                        </Modal>
                    </ScrollView>
                </KeyboardAvoidingView>
                { Platform.OS === 'ios' &&
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={{padding: 10, backgroundColor: '#CCCCCC', alignItems: 'flex-end', height: 50, width: '100%', paddingRight: 15, justifyContent: 'center'}}>
                        <Text onPress={() => Keyboard.dismiss()} style={{color: 'blue', fontWeight: 'bold', textAlign: 'center', fontSize: 18}}>
                            完了
                        </Text>
                    </View>
                </InputAccessoryView>
                }
            </View>
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
            title: 'Select Avatar',
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
                this.setState({modalVisible: true});
                break;
            case 1:
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
                    this.chooseMyCar(carSource)
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
            case 2:
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
                        source ? this.chooseMyCar(source) : null;
                    }
                });
                break;
            case 3:
                this.state.carSource ? this.setState({carSource: null}) : null;
                break;
            default:
                return true;
        }
    }

    onClose = () => this.setState({modalVisible: false});

    chooseMyCar(url) {
        this.setState({carEdit: url, modalVisible: false});
        navigationService.navigate('DefaultImageEditor',
            {
                carSource: url,
                updateCar: (url) => this.chooseCar(url)
            });
    }

    chooseCar(url) {
        this.setState({carSource: url, modalVisible: false}, () => {
            this.updateImageSize();
        });
        navigationService.goBack();
    }
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
    },
    g2: {
        height: 45,
        justifyContent: 'center',
        paddingLeft: 15,
        backgroundColor: '#F2F8F9',
        borderBottomWidth: 1,
        borderBottomColor: color.active
    },
    titleGreen: { fontSize: 14, fontWeight: 'bold', color: color.active},
    oneHalf: {
        width: wp('43%'),
        paddingVertical: 5
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    textBold: {
        color: '#262626',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textTitle: {
        color: '#333333',
        fontSize: 12
    },
    textRegular: {
        marginTop: 5,
        fontSize: 9,
        color: '#999999'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        paddingTop: hp('1.5%'),
        paddingBottom: hp('1.5%'),
    },
    rowStarPoint: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#7FCAC3',
        padding: hp('1%')
    },
    button: {
        paddingBottom: wp('5%'),
        margin: 15,
    },
    mid: {
        justifyContent: 'center',
        marginTop: 10,
        height: 250,
        backgroundColor: '#CCCCCC'
    }
});
