import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import LottieView from 'lottie-react-native';

class SplashImgThree extends Component{
    render(){
        return(
            <ScrollView scrollIndicatorInsets={{right: 1}}>
            <View style={{flex: 1, paddingHorizontal: 15}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginTop: 30}}>お得な車検を自動提案</Text>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32}}>近隣最安値が見つかる！</Text>
                    <View
                        style={{width: 60, borderBottomColor: '#F37B7D', borderBottomWidth: 2, marginTop: 15}}/>
                </View>
                <View style={{ justifyContent: 'center'}}>
                    <LottieView
                        source={require('../../../assets/Carpon_app_splash03_shaken.json')}
                        style={{ width: Dimensions.get('window').width - 50}}
                        loop={true}
                        autoPlay
                    />
                </View>
                <View style={{alignItems: 'center', marginTop: 15}}>
                    <Text style={{
                        fontSize: 17,
                        lineHeight: 24,
                        color: '#333333'
                    }}>ご自宅周辺のお値打ち車検工場をピックアップ！比較して納得のいくお店にお申し込みください。</Text>
                </View>
            </View>
            </ScrollView>
        )
    }
}

export default SplashImgThree;
