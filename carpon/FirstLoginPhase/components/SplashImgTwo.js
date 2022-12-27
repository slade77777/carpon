import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import JapaneseText from "../../../components/JapaneseText";
import LottieView from 'lottie-react-native';

class SplashImgTwo extends Component {
    render() {
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}}>
            <View style={{flex: 1, paddingHorizontal: 15}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginTop: 30}}>任意保険</Text>
                    <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32}}>かんたん一括見積比較</Text>
                    <View
                        style={{width: 60, borderBottomColor: '#F37B7D', borderBottomWidth: 2, marginTop: 15}}/>
                </View>
                <View style={{ justifyContent: 'center'}}>
                    <LottieView
                        source={require('../../../assets/Carpon_app_splash02_hoken.json')}
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
                    }} value={'簡単な質問に答えるだけで任意保険の一括見積出来ます。Carponなら保険見積に必要な情報がすでに登録されていますので複雑でわずらわしい情報入力は必要ありません。'}/>
                </View>
            </View>
            </ScrollView>
        )
    }
}

export default SplashImgTwo;
