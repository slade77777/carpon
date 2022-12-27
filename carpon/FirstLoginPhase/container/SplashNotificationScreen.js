import React, {Component} from 'react';
import {Dimensions, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {screen} from '../../../navigation';
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {SplashImgFive, SplashImgFour, SplashImgOne, SplashImgSix, SplashImgThree, SplashImgTwo} from '../components'
import firebase from "@react-native-firebase/app";
import '@react-native-firebase/messaging';
import {navigationService} from "../../services";
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import {viewPage} from "../../Tracker";
import LottieView from "lottie-react-native";

const {width, height} = Dimensions.get('window');

@screen('SplashNotificationScreen', {header: null})
export default class SplashNotificationScreen extends Component {

    componentDidMount() {
        viewPage('tutorial_notification', 'チュートリアル');
    }

    onPressView() {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled === 1) {
                    // this.registerListener();
                    navigationService.clear('LoadingMetaData');
                } else {
                    // Linking.openURL('app-settings:notifications');
                    firebase.messaging().requestPermission()
                        .then(() => {
                            navigationService.clear('LoadingMetaData');
                        })
                        .catch(error => {
                            navigationService.clear('LoadingMetaData');
                            // console.log(error);
                        });
                }
            });
    };

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: '#EFEFEF'
            }}>
                <View style={{justifyContent: 'space-between', height: '100%', backgroundColor: '#EFEFEF'}}>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1, paddingHorizontal: 15, marginTop: height/7}}>
                                <View style={{width: '100%', alignItems: 'center'}}>
                                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginTop: 30}}>Carponが車検満了日を</Text>
                                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32}}>通知でお知らせします</Text>
                                    <View
                                        style={{width: 60, borderBottomColor: '#F37B7D', borderBottomWidth: 2, marginTop: 15}}/>
                                </View>
                                <View style={{ justifyContent: 'center', marginTop: height/10}}>
                                    <SvgImage source={SvgViews.NotifyBell}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{padding: 15, paddingBottom: 25}}>
                        <View style={{alignItems: 'center', marginBottom: 25}}>
                            <Text style={{
                                fontSize: 17,
                                lineHeight: 24,
                                color: '#F37B7D'
                            }}>リコール情報<Text style={{
                                fontSize: 17,
                                lineHeight: 24,
                                color: '#333333'
                            }}>など、おクルマに関する大事な情報を通知でお知らせします。</Text></Text>
                        </View>
                        {
                            <View style={{display: 'flex', flexDirection: 'row'}}>
                                <ButtonCarpon onPress={this.onPressView.bind(this)}
                                              style={{
                                                  height: 50,
                                                  backgroundColor: '#4B9FA5',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  flex: 2
                                              }}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>通知設定</Text>
                                </ButtonCarpon>
                            </View>
                        }
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
