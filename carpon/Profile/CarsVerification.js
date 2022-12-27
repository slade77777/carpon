import React, {Component} from 'react';
import {screen} from "../../navigation";
import {Text, Keyboard, View} from 'react-native';
import HeaderCarpon from "../../components/HeaderCarpon";
import ImageLoader from '../../components/ImageLoader';
import {images} from "../../assets";

@screen('CarsVerification', {header: <HeaderCarpon/>})
export class CarsVerification extends Component {
    state = {
        code    : '',
        disabled: true,
    };

    render() {
        return (
            <View style={{backgroundColor: '#FFFFFF', padding: 30, height: '100%',}} onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                <View style={{height: '30%', justifyContent: 'center', alignItems: 'center'}}>
                    <ImageLoader style={{ width: 164, height: 142 }} source={images.imagePushNotify}/>
                </View>
                <Text style={{textAlign: 'center', fontSize: 14, marginTop: '10%'}}>
                    車輌情報を確認しています。</Text>
                <Text style={{textAlign: 'center',fontSize: 13}}>確認が終了次第Carponをご利用いただけます。</Text>
                <Text style={{textAlign: 'center', fontSize: 13}}> この処理は通常、登録の翌日朝9:00に完了します。</Text>
                <Text style={{textAlign: 'center', fontSize: 13}}>完了時にはプッシュ通知でご案内します。</Text>
            </View>
        )
    }
}
