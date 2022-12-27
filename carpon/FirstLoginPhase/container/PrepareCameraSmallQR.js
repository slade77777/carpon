import React, {Component} from 'react';
import {screen} from '../../../navigation';
import {ActivityIndicator, Platform, Text, View, SafeAreaView, Dimensions, Alert} from 'react-native';
import {ButtonText} from '../../../components/index';
import {ScanSmallQRCode} from "./ScanSmallQRCode";
import HeaderOnPress from "../../../components/HeaderOnPress";
import Video from 'react-native-video';
import Config from 'react-native-config';
import {viewPage} from "../../Tracker";
const {width} = Dimensions.get('window');

@screen('PrepareCameraSmallQR', {header: <HeaderOnPress/>})
export class PrepareCameraSmallQR extends Component {
    state={
        isLoading: true
    };

    componentDidMount() {
        viewPage('guide_capturing_mini_qr', '軽自動車QR案内');
    }

    render() {
        const navigate = this.props.navigation.navigate;
        return (
            <SafeAreaView style={{flex : 1, backgroundColor: 'white'}}>
                <View
                    style={{backgroundColor: '#FFFFFF', height: '100%', padding: 15, justifyContent: 'space-between'}}>
                    <View style={{paddingVertical: 15}}>
                        <Text style={{color: '#333333', fontSize: 16, fontWeight: 'bold'}}>
                            車検証QRコードから登録
                        </Text>
                        <Text style={{fontSize: 14, color: '#333333', lineHeight: 20, marginTop: 15}}>
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
                        <ButtonText title={'カメラを起動する'} onPress={() => navigate('ScanSmallQRCode')}/>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

