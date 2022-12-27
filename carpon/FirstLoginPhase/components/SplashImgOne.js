import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import JapaneseText from "../../../components/JapaneseText";
import LottieView from 'lottie-react-native';

class SplashImgOne extends Component {
    render() {
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}}>
                <View style={{flex: 1, paddingHorizontal: 15}}>
                    <View style={{width: '100%', alignItems: 'center'}}>
                        <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginTop: 30}}>かんたん</Text>
                        <Text style={{fontSize: 24, fontWeight: 'bold', lineHeight: 32}}>マイカー登録</Text>
                        <View
                            style={{
                                width: 60,
                                borderBottomColor: '#F37B7D',
                                borderBottomWidth: 2,
                                marginTop: 15
                            }}/>
                    </View>
                    <View style={{ justifyContent: 'center'}}>
                        <LottieView
                            source={require('../../../assets/Carpon_app_splash01_mycar-regist.json')}
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
                        }} value={'ナンバープレートを撮影するだけで、150項目以上の車両情報が登録されます。'}/>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default SplashImgOne;
