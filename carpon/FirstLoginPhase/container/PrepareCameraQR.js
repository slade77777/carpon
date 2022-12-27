import React, {Component} from 'react';
import {screen} from '../../../navigation';
import {ActivityIndicator, Platform, Text, View, SafeAreaView, Dimensions, Alert} from 'react-native';
import {ScanQRCode} from "./ScanQRCode";
import HeaderOnPress from "../../../components/HeaderOnPress";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {connect} from 'react-redux';
import Video from 'react-native-video';
import Config from 'react-native-config';
import {navigationService} from "../../services/index";
import {viewPage} from "../../Tracker";
const {width, height} = Dimensions.get('window');

@screen('PrepareCameraQR', {header: <HeaderOnPress title='車検証情報の登録'/>})
@connect(
    state =>({
        carProfile: state.registration.carProfile,
    }),
    ()=> ({})
)
export class PrepareCameraQR extends Component {

    state={
        isLoading: true
    };

    componentDidMount() {
        viewPage('guide_capturing_normal_qr', '普通車QR案内');
    }

    handleNavigate() {
        return navigationService.navigate(this.props.carProfile.carType === 0 ? 'ScanQRCode' : 'ScanSmallQRCode', this.props.navigation.state.params)
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <View style={{backgroundColor: '#FFFFFF', height: '100%', justifyContent: 'space-between', padding: 15, marginTop: 10}}>
                    <View>
                        <Text style={{fontSize: 17, lineHeight: 25}}>カメラを起動し、車検証の右下に記載されているQRコードを読み取ります。</Text>
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
                    <View style={{paddingBottom: 10}}>
                        <ButtonCarpon style={{backgroundColor: '#F06A6D'}} onPress={() => this.handleNavigate()}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FFFFFF'}}>カメラを起動する</Text>
                        </ButtonCarpon>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
