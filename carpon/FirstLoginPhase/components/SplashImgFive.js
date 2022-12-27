import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import JapaneseText from "../../../components/JapaneseText";
import LottieView from 'lottie-react-native';

class SplashImgFive extends Component{
    render(){
        return(
            <ScrollView scrollIndicatorInsets={{right: 1}}>
            <View style={{flex: 1, paddingHorizontal: 15}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginTop: 30}}>質問に答えてランクアップ</Text>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32}}>おトクな特典がもらえる</Text>
                    <View
                        style={{width: 60, borderBottomColor: '#F37B7D', borderBottomWidth: 2, marginTop: 15}}/>
                </View>
                <View style={{ justifyContent: 'center'}}>
                    <LottieView
                        source={require('../../../assets/Carpon_App_Splash05_tokuten.json')}
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
                    }} value={'カーライフに関する質問など、各種ミッションをクリアするとランクアップ！ ランクに応じた、維持費お役立ち特典をご用意しています。'}/>
                </View>
            </View>
            </ScrollView>
        )
    }
}

export default SplashImgFive;
