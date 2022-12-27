import React, {Component} from 'react';
import {Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import {screen} from "../../../navigation";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {connect} from 'react-redux';
import color from "../../color";
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
import {updateAvatar} from '../actions/accountAction';
import {navigationService} from "../../services/index";
import EditAvatar from "../component/EditAvatar";
import AndroidOpenSettings from 'react-native-android-open-settings';
import {viewPage} from "../../Tracker";

const accountComponent = {
    nick_name: {
        label: 'ニックネーム',
        onPress: () => {
            navigationService.navigate('UpdateNickname');
        },
        value: user => user.nick_name || ''
    },
    first_name: {
        label: 'お名前',
        onPress: () => {
            navigationService.navigate('UpdateName');
        },
        value: user => (user.last_name || '') + ' ' + (user.first_name || '') + '(' + user.last_name_katakana + ' ' + user.first_name_katakana + ')'
    },
    address: {
        label: 'ご住所',
        onPress: () => {
            navigationService.navigate('UpdateAddress');
        },
        value: user => '〒' + (user.post_code || '') + ' ' + (user.province_name || '') + ' ' + (user.address || '') + ' ' + (user.apartment_number || '') + ' ' + (user.mansion_room_number || '')
    },
    birthday: {
        label: '生年月日',
        onPress: () => {
            navigationService.navigate('UpdateBirthday');
        },
        value: user => user.birthday ? moment(user.birthday).format('YYYY年M月D日') : ''
    },
    gender: {
        label: '性別',
        onPress: () => {
            navigationService.navigate('UpdateGender');
        },
        value: user => user.gender === 'm' ? '男性' : '女性',
    },
    phone: {
        label: '電話番号',
        onPress: null,
        value: user => user.phone || ''
    },
    email: {
        label: 'メールアドレス',
        onPress: () => {
            navigationService.navigate('UpdateMail');
        },
        value: user => user.email || ''
    },
    selfIntroduction: {
        label: 'プロフィール文',
        onPress: (user) => {
            navigationService.navigate('ProfileStatement');
        },
        value: user => ''
    },
    remove: {
        label: '退会について',
        onPress: () => {
            navigationService.navigate('ConfirmDelete');
        },
        value: user => ''
    },
};

@screen('AccountSetting', {header: <HeaderOnPress title={'ユーザー設定'}/>})
@connect(state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        provinceList: state.metadata.profileOptions ? state.metadata.profileOptions.driving_area : [],
    }),
    dispatch => ({
        updateAvatar: (data) => {
            dispatch(updateAvatar(data))
        },
        loadListQuestion: (idSurvey) => dispatch({
            type: 'LOAD_LIST_QUESTION',
            idSurvey
        }),
    })
)
export class AccountSetting extends Component {
    constructor(props) {
        super(props);
        const userProfile = props.userProfile || {};
        this.state = {
            avatar: userProfile.avatar,
            modalEditImage: false,
            carEdit: null,
        };
    }

    componentDidMount() {
        viewPage('user_setting', 'ユーザ設定');
    }

    componentWillUnmount() {
        let updateScore = this.props.navigation.getParam('updateScore');
        if (updateScore) {
            let survey = this.props.navigation.getParam('survey');
            this.props.loadListQuestion(survey.id)
        }
    }

    render() {
        const userProfile = this.props.userProfile;
        const provinceChoice = this.props.provinceList.find((item) => item.value === userProfile.province);
        userProfile.province_name = provinceChoice ? provinceChoice.label : null;
        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFFFFF'}}>
                    <TouchableOpacity onPress={() => this.ActionSheet.show()}
                                      style={{justifyContent: 'center', alignItems: 'center', height: 200}}>
                        {
                            (this.props.userProfile && this.props.userProfile.avatar) ?
                                <View>
                                    <Image source={{uri: this.state.avatar}} style={{
                                        height: 123, width: 123,
                                        borderRadius: 61.5, borderColor: '#E5E5E5', borderWidth: 1
                                    }}/>
                                    <View style={{
                                        backgroundColor: '#CCCCCC',
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'absolute',
                                        left: 90,
                                        top: 90
                                    }}>
                                        <SvgImage source={() => SvgViews.IconEdit({fill: 'white'})}/>
                                    </View>
                                </View>
                                :
                                <View style={{
                                    backgroundColor: '#CCCCCC',
                                    width: 123,
                                    height: 123,
                                    borderRadius: 61.5,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>

                                    <View>
                                        <Text style={{fontSize: 12, color: '#666666', fontWeight: 'bold'}}>ユーザー</Text>
                                        <Text style={{fontSize: 12, color: '#666666', fontWeight: 'bold'}}>アイコン</Text>
                                    </View>
                                    <SvgImage source={SvgViews.IconEdit}/>
                                </View>
                        }
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            options={[
                                'カメラロールから選択',
                                '写真を撮る',
                                'キャンセル'
                            ]}
                            cancelButtonIndex={2}
                            onPress={this.handlePhoto.bind(this)}
                        />
                        <Modal visible={this.state.modalEditImage} transparent={false}>
                            <EditAvatar updateCar={(url) => this.uploadImage(url)}
                                        closeModal={() => this.setState({modalEditImage: false})}
                                        carSource={this.state.carEdit}/>
                        </Modal>
                    </TouchableOpacity>
                    {
                        userProfile && Object.keys(accountComponent).map(function (key, index) {
                            return (
                                <TouchableOpacity onPress={accountComponent[key].onPress}
                                                  style={{
                                                      minHeight: 60,
                                                      justifyContent: 'center',
                                                      borderBottomWidth: 1,
                                                      borderTopWidth: index === 0 ? 1 : 0,
                                                      borderColor: '#E5E3E3'
                                                  }}
                                                  key={index}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{width: '35%', justifyContent: 'center'}}>
                                            <Text style={{
                                                fontSize: 14,
                                                color: 'black',
                                                fontWeight: 'bold',
                                                paddingLeft: 20
                                            }}>
                                                {accountComponent[key].label}
                                            </Text>
                                        </View>
                                        <View style={{width: '55%', justifyContent: 'center'}}>
                                            <Text numberOfLines={1} style={{textAlign: 'right'}}>
                                                {accountComponent[key].value(userProfile)}
                                            </Text>
                                        </View>
                                        <View style={{
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                            width: '10%',
                                            paddingRight: 15
                                        }}>
                                            {
                                                accountComponent[key].onPress &&
                                                <SvgImage source={() => SvgViews.ArrowLeft({fill: color.active})}/>
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
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

    handlePhoto(buttonIndex) {
        const options = {
            title: 'Select insurance Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        switch (buttonIndex) {
            case 0:
                Platform.OS === 'android' && this.requestFilePermission();
                ImagePicker.launchImageLibrary(options, (response) => {
                    if (Platform.OS === 'ios' && response.error === 'Photo library permissions not granted') {
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
                    } else {
                        const source = response.uri;
                        const cancelable = response.didCancel;
                        !(cancelable && source === undefined) ? this.setState({
                            carEdit: source,
                            modalEditImage: true
                        }) : null;
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
                        console.log(source);
                        source ? this.setState({carEdit: source, modalEditImage: true}) : null;
                    }
                });
                break;
            case 2:
                return true;
            default:
                return true;
        }
    }

    uploadImage(source) {
        const bodyFormData = new FormData();
        bodyFormData.append('image', {
            uri: source,
            type: 'image/jpeg',
            name: 'avatar'
        });
        this.props.updateAvatar(bodyFormData);
        this.setState({carEdit: null, modalEditImage: false, avatar: source})
    }
}
