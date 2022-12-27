import React, {Component} from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Platform, FlatList, AsyncStorage, SafeAreaView, Alert} from 'react-native'
import {connect} from 'react-redux'
import {navigationService} from "./../carpon/services";
import {$$_CARPON_CLEAR} from "../carpon/services/Storage";
import {SvgImage, SvgViews} from "./Common/SvgImage";
import {userProfileService} from "../carpon/services/index";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import {identifyUser} from "../carpon/Tracker";

@connect(state => ({
        profile: state.registration.userProfile.myProfile,
        unreadNotificationNumber: state.notification ? state.notification.unreadNumber : 0,
        carProfile: state.registration.carProfile
    }), (dispatch) => ({
        clear: () => {
            dispatch({
                type: $$_CARPON_CLEAR
            });

            AsyncStorage.clear();
        }
    })
)
export default class Menu extends Component {

    _renderItemMenu({item, index}) {
        return (
            <TouchableOpacity
                key={index} activeOpacity={1}
                style={{
                    backgroundColor: '#262525',
                    alignItems: 'center',
                    padding: 15,
                    marginBottom: 2,
                    flexDirection: 'row'
                }}
                onPress={() => {
                    setTimeout(item.onPress, 300)
                }}>
                {
                    item.icon ?
                        <View style={{width: '10%', justifyContent: 'center', alignItems: 'center'}}>
                            <SvgImage source={() => SvgViews[item.icon]({fill: item.active ? '#CCC' : '#666'})}/>
                        </View> : <View/>
                }
                <View
                    style={{width: '90%', marginLeft: item.icon ? 10 : 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 14, color: item.active ? '#FFF' : '#666'}}>{item.text}</Text>
                    {
                        (item.noteNumber && item.noteNumber > 0) ? <View style={{
                            paddingHorizontal: item.noteNumber > 9 ? 4 : 5,
                            width: item.noteNumber === 1 ? 15: 'auto',
                            backgroundColor: '#FF0000',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            borderRadius: 7.5,
                            marginLeft: 10,
                            height: 15,
                        }}>
                            <Text style={{textAlign: 'center', fontSize: 7, color: '#FFF', fontWeight: 'bold'}}>{item.noteNumber}</Text>
                        </View> : null
                    }
                </View>
            </TouchableOpacity>
        )
    }

    handleLogOut() {
        Alert.alert(
            'ログアウト',
            '本当にログアウトしますか？',
            [
                {
                    text: 'キャンセル',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        firebase.messaging().getToken().then(fcmToken => {
                            userProfileService.logout(fcmToken).then(() => {
                                navigationService.clear('Login');
                                this.props.clear();
                            }).catch(() => {
                                navigationService.clear('Login');
                                this.props.clear();
                            });
                        }).catch(() => {
                            navigationService.clear('Login');
                            this.props.clear();
                        });
                    }
                }
            ])
    }

    render() {
        const IsCar = this.props.carProfile.profile.id;
        const waitingCar = this.props.carProfile.waitingCarHOUY || this.props.carProfile.waitingCarCertification;

        const menus = [
            {
                text: 'お知らせ',
                icon: 'IconNotifications',
                noteNumber: this.props.unreadNotificationNumber,
                onPress: () => {
                    navigationService.navigate('Notification')
                },
                active: true
            }, {
                text: 'マイページ',
                icon: 'IconAccount',
                onPress: () => {
                    navigationService.navigate('MyPageScreen', {profile: this.props.profile})
                },
                active: true
            }, {
                text: 'マイカープロフィール',
                icon: 'IconCar',
                onPress: () => {
                    IsCar && navigationService.navigate('MyCarProfile')
                },
                active: IsCar
            }, {
                text: 'ユーザー設定',
                icon: 'IconSettings',
                onPress: () => {
                    navigationService.navigate('AccountSetting')
                },
                active: true
            },
            {
                text: '車検証登録・車両乗り換え',
                icon: 'Refix',
                onPress: () => {
                    !waitingCar &&
                    navigationService.navigate('UpdateCar', {onTabChange: (index) => this.props.onTabChange(index)})
                },
                active: !waitingCar
            }, {
                text: 'ご利用ガイド',
                icon: 'GuideIcon',
                onPress: () => {
                    navigationService.navigate('GuideWebView')
                },
                active: true
            },{
                text: '利用規約',
                icon: 'LibraryBooks',
                onPress: () => {
                    navigationService.navigate('TermsOfServiceScreen')
                },
                active: true
            }, {
                text: 'プライバシーポリシー',
                icon: 'Security',
                onPress: () => {
                    navigationService.navigate('PrivacyPolicyScreen')
                },
                active: true
            }, {
                text: 'このアプリについて',
                icon: 'IconWarning',
                onPress: () => {
                    navigationService.navigate('AboutUsScreen')
                },
                active: true
            }, {
                text: 'お問い合わせ',
                icon: 'Mail',
                onPress: () => {
                    navigationService.navigate('Contact', {type: 'Account'})
                },
                active: true
            }, {
                text: 'ログアウト',
                icon: 'LogOutIcon',
                onPress: () => {
                    this.handleLogOut()
                },
                active: true
            }
        ];
        return (
            <SafeAreaView style={{backgroundColor: '#262525'}}>
                <View style={Styles.body}>
                    <FlatList
                        style={{height: '100%',}}
                        data={menus}
                        extraData={this.props}
                        renderItem={this._renderItemMenu.bind(this)}
                        onEndReachedThreshold={0.8}
                    />
                </View>
            </SafeAreaView>

        )
    }
}

const Styles = StyleSheet.create({
    body: {
        justifyContent: 'space-between',
        flexDirection: 'column',
    }
});
