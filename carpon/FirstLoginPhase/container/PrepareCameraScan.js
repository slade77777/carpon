import React, {Component} from 'react';
import {screen} from '../../../navigation';
import {ActivityIndicator, Alert, Dimensions, Platform, SafeAreaView, Text, View} from 'react-native';
import HeaderOnPress from "../../../components/HeaderOnPress";
import Video from 'react-native-video';
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import Config from 'react-native-config';
import {navigationService} from "../../services/index";
import LoadingComponent from "../../../components/Common/LoadingComponent";
import {connect} from "react-redux";
import {viewPage} from "../../Tracker";

const {width} = Dimensions.get('window');

@screen('PrepareCameraScan', {header: <HeaderOnPress title='マイカー登録'/>})
@connect((state) => ({
    registration: state.registration
    }),
    dispatch => ({
        resetCameraState: () => {
            dispatch({
                type: 'RESET_CAMERA_STATE'
            })
        },
    }))

export class PrepareCameraScan extends Component {

    state = {
        isLoading: true
    };

    componentWillMount() {
        this.props.resetCameraState();
        viewPage('guide_capturing_number_plate', 'ナンバープレート撮影案内');
    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: 'white'}}>
                <View
                    style={{
                        backgroundColor: '#FFFFFF',
                        height: '100%',
                        padding: 15
                    }}>
                    <Text style={{fontSize: 16, color: 'black', marginTop: 10, lineHeight: 20}}>
                        ナンバープレートから車両情報を取得します。カメラを起動し、ナンバーを撮影してください。
                    </Text>
                    <View style={{marginTop: 15}}>
                        {this.state.isLoading && Platform.OS === 'ios' &&
                        <LoadingComponent loadingSize={'large'} opacity={0.3} size={{w: '100%', h: '100%'}}/>}
                        <Video source={{uri: Config.CAR_TUTORIAL_VIDEO}}
                               ref={(ref) => {
                                   this.player = ref
                               }}
                               onBuffer={() => console.log('buffer')}
                               onError={() => Alert.alert('エラー', 'サーバーまたはネットワークに接続できませんでした')}
                               style={{
                                   width: width - 31,
                                   height: (width - 30) * 9 / 16,
                                   padding: 0,
                                   borderWidth: this.state.isLoading ? 0 : 1, borderColor: '#CCC'
                               }}
                               repeat={true}
                               onLoad={() => this.setState({isLoading: false})}
                        />
                    </View>

                    <ButtonCarpon style={{backgroundColor: '#F06A6D', marginVertical: 20, height: 50}}
                                  onPress={() => navigationService.navigate('ScanLicensePlate')}>
                        <Text style={{fontSize: 14, color: '#FFFFFF', fontWeight: 'bold'}}>カメラを起動する</Text>
                    </ButtonCarpon>

                    <ButtonCarpon style={{backgroundColor: '#EFEFEF', height: 50}}
                                  onPress={() => navigationService.navigate('LicensePlateManual')}>
                        <Text style={{
                            fontSize: 14,
                            color: '#666666',
                            fontWeight: 'bold'
                        }}>手入力する</Text>
                    </ButtonCarpon>

                </View>
            </SafeAreaView>
        )
    }
}
