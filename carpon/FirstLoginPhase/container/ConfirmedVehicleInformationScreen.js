import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {SafeAreaView, Text, View} from 'react-native';
import HeaderCarpon from "../../../components/HeaderCarpon";
import ImageLoader from '../../../components/ImageLoader';
import {images} from "../../../assets/index";
import {navigationService} from "../../services/index";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import JapaneseText from "../../../components/JapaneseText";

@screen('ConfirmedVehicleInformationScreen', {header: <HeaderCarpon/>})
export class ConfirmedVehicleInformationScreen extends Component {

    constructor(props) {
        super(props);
        this.onPressView = this.onPressView.bind(this);
    }

    onPressView() {
        navigationService.clear('AuthenticationScreen')
    };

    render() {
        return (
            <SafeAreaView style={{flex : 1, backgroundColor : '#FFFFFF'}}>
                <View
                    style={{height: '100%', backgroundColor: '#FFFFFF', padding: 15, justifyContent: 'space-between'}}>
                    <View>
                        <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold'}}>車輌情報を確認しています</Text>
                        <JapaneseText style={{
                            fontSize: 14, color: '#333333', marginTop: 15, textAlign: 'justify',
                            lineHeight: 20,
                        }} value={'確認が済み次第Carponをご利用いただけますので、今しばらくお待ち下さい。'}/>
                        <JapaneseText style={{fontSize: 14, color: '#333333', marginTop: 7}} value={'この処理は通常、登録の翌日朝9:00に完了します。'}/>
                        <Text style={{fontSize: 14, color: '#333333', marginTop: 7}}>完了時にはプッシュ通知でご案内します。</Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <ImageLoader style={{width: 164, height: 142, marginLeft: 30}} source={images.imagePushNotify}/>
                    </View>
                    <View>
                        <ButtonCarpon
                            style={{backgroundColor: '#F06A6D', justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => this.onPressView()}>
                            <Text style={{
                                fontSize: 14,
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>OK</Text>
                        </ButtonCarpon>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
