import React, {Component} from 'react';
import {screen} from "../../navigation";
import {View, Text, ScrollView, Alert, SafeAreaView, Image, Dimensions, Linking} from 'react-native';
import {navigationService, notificationService} from "../services/index";
import {getAllNotification} from "../common/actions/notification";
import {connect} from 'react-redux';
import ButtonCarpon from "../../components/Common/ButtonCarpon";
import {SingleColumnLayout} from "../layouts";
import {switchCar} from "../FirstLoginPhase/actions/registration";
import HeaderOnPress from "../../components/HeaderOnPress";
import Icon from 'react-native-vector-icons/Ionicons';
import moment from "moment/moment";
import {viewPage} from "../Tracker";

const {width} = Dimensions.get('window');
import Spinner from 'react-native-loading-spinner-overlay';
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";
import {TabView} from "react-native-tab-view";

const notRequiredCarScreen = ['News', 'ReportComment', 'Comment',
    'NewsVehicleList', 'NewsAddModelManufacturerList', 'NewsModelAdditionCarModelList', 'OtherIconSettings',
    'AccountSetting', 'UpdateNickname', 'UpdateAddress', 'UpdateMail', 'UpdatePassword', 'UpdateName', 'UpdateBirthday', 'UpdateGender'];

@screen('DetailNotification', ({
    header: <HeaderOnPress title={'お知らせ詳細'} leftComponent={<Icon name="md-close" size={30} color="#FFFFFF"/>}/>
}))
@connect(state => ({
    carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : [],
}), dispatch => ({
    getAllNotification: () => dispatch(getAllNotification()),
    switchCarByQR: () => dispatch(switchCar())
}))
export class DetailNotification extends Component {

    state = {
        notification: {},
        loading: false
    };

    componentWillMount() {
        viewPage('notification_detail', 'お知らせ詳細');
        this.setState({loading: true});
        const message_id = this.props.navigation.getParam('message_id');
        if (message_id) {
            notificationService.getNotificationByMessageId({message_id}).then(data => {
                this.setState({notification: data, loading: false});
                this.props.getAllNotification();
                this.props.navigation.state.params.refresh();
            }).catch(() => this.setState({loading: false}));
        } else {
            const notificationData = this.props.navigation.getParam('notificationData');
            let id = null;
            if (notificationData) {
                const data = JSON.parse(notificationData);
                id = data.id;
            } else {
                id = this.props.navigation.getParam('id');
            }
            if (id) {
                notificationService.getNotificationDetail(id).then(data => {
                    this.setState({notification: data, loading: false});
                    notificationService.updateReadNotification(id).then(() => {
                        this.props.getAllNotification();
                        this.props.navigation.state.params.refresh();
                    });
                }).catch(() => this.setState({loading: false}));
            }
        }
    }

    handleTagColor(labelType) {
        switch (labelType) {
            case 'Normal':
                return '#4B9FA5';
            case 'Strong':
                return '#F37B7D';
            default:
                return '#4B9FA5'
        }
    }

    render() {
        const notification = this.state.notification;
        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFF', paddingTop: 25}}
                                    contentInset={{bottom: isIphoneX() ? getBottomSpace() : 0}}
                        >
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            {
                                notification.destination === 'carpon.MyPageScreen' ?
                                    <View style={{flexDirection: 'row', marginHorizontal: 15}}>
                                        <View style={{
                                            width: width / 5, justifyContent: 'center'
                                        }}>
                                            <Image source={{uri: notification.avatar}} style={{
                                                width: width / 5,
                                                height: width / 5,
                                                borderRadius: width / 10,
                                                borderColor: '#E5E5E5',
                                                borderWidth: 1
                                            }}/>
                                        </View>
                                        <View style={{width: (width * 4 / 5) - 50, marginLeft: 20}}>
                                            <Text style={{fontSize: 12, textAlign: 'right'}}>
                                                {moment(notification.createDate).format('YYYY年M月D日')}
                                            </Text>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                                color: '#666666', marginTop: 5
                                            }}>
                                                {notification.title}
                                            </Text>
                                        </View>
                                    </View>
                                    :
                                    <View style={{paddingHorizontal: 15}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <View style={{
                                                backgroundColor: this.handleTagColor(notification.labelType),
                                                borderRadius: 2,
                                                height: 14,
                                                width: 80,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={{color: '#fff', fontSize: 8, fontWeight: 'bold'}}>
                                                    {notification.tag}
                                                </Text>
                                            </View>
                                            <Text style={{fontSize: 12, color: '#666666'}}>
                                                {moment(notification.createDate).format('YYYY年 MM月DD日')}
                                            </Text>
                                        </View>
                                        <View style={{marginTop: 10}}>
                                            <Text style={{
                                                fontSize: 17,
                                                fontWeight: 'bold',
                                                marginBottom: 10,
                                                lineHeight: 23,
                                                color: '#333333'
                                            }}>{notification.title}</Text>
                                            <Text style={{fontSize: 15}}>{notification.content}</Text>
                                        </View>
                                    </View>
                            }

                        </ScrollView>
                    }
                    bottomContent={
                        (notification.buttonLabel && (notification.destination || notification.targetScheme || notification.targetUrl)) ?
                            <View style={{
                                backgroundColor: 'rgba(112, 112, 112, 0.5)',
                                paddingTop: 15,
                                paddingHorizontal: 15,
                                paddingBottom: isIphoneX() ? getBottomSpace() : 15,
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                            }}>
                                <ButtonCarpon disabled={false}
                                              style={{backgroundColor: '#F37B7D'}}
                                              onPress={() => this.handleSubmit()}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        color: '#FFFFFF'
                                    }}>{notification.buttonLabel}</Text>
                                </ButtonCarpon>
                            </View> : <View/>
                    }
                />
            </View>
        )
    }

    handleSubmit() {
        const notification = this.state.notification;
        if (notification.destination) {
            this.handleNavigate(notification.destination, notification);
            return;
        }
        if (notification.targetScheme) {
            this.handleScheme(notification.targetScheme);
            return;
        }
        if (notification.targetUrl) {
            Linking.openURL(notification.targetUrl);
        }
    }

    handleCarNotification(data) {
        const params = data.params;
        if (params && params.status) {
            if (params.status === 'SUCCESS') {
                Alert.alert(
                    '車両情報確認完了',
                    'マイカーの詳細情報を入力し、登録を完了させてください。',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigationService.clear('UpdateCarPending');
                            }
                        }
                    ]);
            } else {
                navigationService.clear('MainTab');
                Alert.alert('軽自動車登録に失敗しました')
            }
        }
    }

    handleNavigate(screen, notification) {
        switch (screen) {
            case 'MyCar' :
                navigationService.clear('MainTab', {tabNumber: 0});
                break;
            case 'Score' :
                navigationService.clear('MainTab', {tabNumber: 1});
                break;
            case 'News' :
                navigationService.clear('MainTab', {tabNumber: 2});
                break;
            case 'Review' :
                navigationService.clear('MainTab', {tabNumber: 3});
                break;
            case 'LookupMiniCar':
            case 'LookupNormalCar':
                this.handleCarNotification(notification);
                break;
            default:
                navigationService.push(screen, notification.params);
        }
    }

    handleScheme(url) {
        const appUrl = 'carpon://app/';
        if (url.includes(appUrl)) {
            const path = url.replace(appUrl, '');
            if (path) {
                const pathValue = path.split('/');
                if (pathValue[0]) {
                    const params = {};
                    if (pathValue.length >= 2) {
                        for (let i = 1; i < pathValue.length; i++) {
                            if (i % 2 === 1) {
                                params[pathValue[i]] = pathValue[i + 1];
                            }
                        }
                    }
                    switch (pathValue[0]) {
                        case 'MainTab':
                            navigationService.clear(pathValue[0], params);
                            break;
                        case 'ScoreQuestion':
                            navigationService.clear('MainTab', {nextScreen: pathValue[0], ...params});
                            break;
                        default:
                            navigationService.push(pathValue[0], params);
                    }
                }
            }
        }
    }
}
