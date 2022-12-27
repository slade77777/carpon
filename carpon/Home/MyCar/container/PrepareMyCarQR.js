import React, {Component} from 'react';
import {screen} from '../../../../navigation';
import {Alert, Dimensions, Text, View, ActivityIndicator, Platform} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import Video from 'react-native-video';
import Config from 'react-native-config';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";

const {width, height} = Dimensions.get('window');

@screen('PrepareMyCarQR', {header: <HeaderOnPress/>})
export class PrepareMyCarQR extends Component {

    state={
        isLoading: true
    };

    render() {
        const navigate = this.props.navigation.navigate;
        return (
            <View style={{backgroundColor: '#FFFFFF', height: '100%', justifyContent: 'space-between', padding: 20}}>
                <View>
                    <Text style={{color: '#333333', fontSize: 16, fontWeight: 'bold'}}>
                        車検証QRコードから登録
                    </Text>
                    <Text style={{fontSize: 14, lineHeight: 20, color: '#333333', marginTop : 10}}>
                        カメラを起動し、車検証右下に記載されているQRコードを読み取ります。
                    </Text>
                    <View style={{ marginTop: 15}}>
                        {
                            this.state.isLoading && Platform.OS === 'ios' &&  <ActivityIndicator style={{ marginTop: 100 }} size="large" color="grey" />
                        }
                        <Video source={{uri: Config.CAR_QR_VIDEO}}
                               ref={(ref) => {
                                   this.player = ref
                               }}
                               onBuffer={() => console.log('buffer')}
                               onError={() => Alert.alert('エラー', 'サーバーまたはネットワークに接続できませんでした')}
                               style={{
                                   width: width - 31,
                                   height: (width - 30)*9/16,
                                   padding: 0,
                                   borderWidth: this.state.isLoading ? 0 : 1, borderColor: '#CCC'
                               }}
                               repeat={true}
                               onLoad={() => this.setState({isLoading: false})}
                        />
                    </View>
                </View>
                <View>
                    <ButtonCarpon style={{backgroundColor : '#F06A6D'}} onPress={() => navigate('UpdateQRCode')}>
                        <Text style={{fontSize : 14, fontWeight : 'bold', color : '#FFFFFF'}}>カメラを起動する</Text>
                    </ButtonCarpon>
                </View>
            </View>
        )
    }
}
