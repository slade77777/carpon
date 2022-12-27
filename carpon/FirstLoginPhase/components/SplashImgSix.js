import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, View, Image, Platform} from 'react-native';
import LottieView from 'lottie-react-native';
import {images} from "../../../assets/index";
import PlateForm from "../../../assets/svg/PlateForm";

class SplashImgSix extends Component{
    render(){
        return(
            <ScrollView scrollIndicatorInsets={{right: 1}}>
            <View style={{flex: 1, paddingHorizontal: 15}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginTop: 30}}>車検や保険満了日、</Text>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32}}>免許更新などをプッシュ通知</Text>
                    <View
                        style={{width: 60, borderBottomColor: '#F37B7D', borderBottomWidth: 2, marginTop: 15}}/>
                </View>
                <View style={{ justifyContent: 'center'}}>
                    <LottieView
                        source={require('../../../assets/Carpon_app_splash06_push-notification.json')}
                        style={{ width: Dimensions.get('window').width - 50}}
                        loop={true}
                        autoPlay
                    />
                </View>
                <View style={{alignItems: 'center', marginTop: 5}}>
                    <Text style={{
                        fontSize: 17,
                        lineHeight: 24,
                        color: '#333333'
                    }}>定期的に訪れるおクルマのイベントや車両固有のリコールなど、大切な情報を<Text style={{
                        fontSize: 17,
                        lineHeight: 24,
                        color: '#4B9FA5'
                    }}>プッシュ通知</Text>でお知らせします。 </Text>
                </View>
            </View>
            </ScrollView>
        )
    }
}

export default SplashImgSix;
