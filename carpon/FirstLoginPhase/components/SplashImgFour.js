import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import JapaneseText from "../../../components/JapaneseText";
import LottieView from 'lottie-react-native';

class SplashImgFour extends Component{
    render(){
        return(
            <ScrollView scrollIndicatorInsets={{right: 1}}>
            <View style={{flex: 1, paddingHorizontal: 15}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <JapaneseText style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginTop: 30}} value={'Carponならリアルタイムに'}/>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32}}>愛車の価値がわかる！</Text>
                    <View
                        style={{width: 60, borderBottomColor: '#F37B7D', borderBottomWidth: 2, marginTop: 15}}/>
                </View>
                <View style={{ justifyContent: 'center'}}>
                    <LottieView
                        source={require('../../../assets/Carpon_app_splash04_mycar-value.json')}
                        style={{ width: Dimensions.get('window').width - 50}}
                        loop={true}
                        autoPlay
                    />
                </View>
                <View style={{alignItems: 'center', marginTop: 15}}>
                    <JapaneseText style={{
                        fontSize: 17,
                        lineHeight: 24,
                        color: '#333333'
                    }} value={'中古車流通データベースに蓄積された相場情報を元にいつでも愛車の現在価値を算出。売り時を逃しません。'}/>
                </View>
            </View>
            </ScrollView>
        )
    }
}

export default SplashImgFour;
