import React, { Component } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { screen } from '../../../navigation';
import stylesGeneral from '../../../style';
import HeaderOnPress from "../../../components/HeaderOnPress";
import { SvgImage, SvgViews } from '../../../components/Common/SvgImage'
import {navigationService} from "../../services/index";
import AsyncStorage from '@react-native-community/async-storage';

@screen('RegisterMethod', { header: <HeaderOnPress title='登録方法の選択' /> })
export class RegisterMethod extends Component {
    state = {
        scanPlateTime: 0
    };

    async componentDidMount() {
        const time = await AsyncStorage.getItem('scanPlateTime');
        if (time) this.setState({scanPlateTime: time})
    }

    render() {
        const scanPlateTime = this.state.scanPlateTime;
        return (
            <View style={Styles.main}>
                <View style={{ paddingHorizontal: 15}}>
                    <Text style={{ paddingBottom: 20, fontSize: 16, marginTop: 10 , color : '#333333' }}>マイカーの登録方法を選択してください</Text>
                </View>

                <View style={{...Styles.cardView, borderTopWidth: 1, marginTop : 10}}>
                    <TouchableOpacity activeOpacity={1}
                        onPress={() => { (!scanPlateTime || scanPlateTime < 2) && navigationService.navigate('PrepareCameraScan')}}
                    >
                        <View style={Styles.padding}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                                <SvgImage source={SvgViews.ScanPlate} />
                            </View>
                            <View style={Styles.textCard}>
                                <View style={{ flexDirection: 'row'}}>
                                    <Text style={Styles.text1}>ナンバーから登録</Text>
                                    {
                                        scanPlateTime >= 1 && <Text style={{ color : 'red'}}>{`（残り${2 - scanPlateTime}回）`}</Text>
                                    }
                                </View>
                                {/*<Text style={Styles.text2}>ナンバープレートを読み取り登録します</Text>*/}
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'flex-end', width : '10%'}}>
                                <SvgImage source={SvgViews.ArrowLeft}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={Styles.cardView}>
                    <TouchableOpacity activeOpacity={1}
                        onPress={() => {navigationService.navigate('PrepareCameraQR')}}
                    >
                        <View style={Styles.padding}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                                <SvgImage source={SvgViews.ScanQR} />
                            </View>
                            <View style={Styles.textCard}>
                                <Text style={Styles.text1}>車検証QRコードから登録</Text>
                                {/*<Text style={Styles.text2}>車検証のQRコードを読み取り登録します</Text>*/}
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'flex-end', width : '10%'}}>
                                <SvgImage source={SvgViews.ArrowLeft}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    text1: {
        fontSize: 15,
        color: 'black',
    },
    text2: {
        marginTop: 10,
        fontSize: 12,
    },
    padding: {
        paddingHorizontal: 15,
        height: 100,
        flexDirection: 'row'
    },
    titleHeader: {
        fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', ...stylesGeneral.fontStyle
    },
    main: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 30,
        height: '100%',
    },
    cardView: {
        borderBottomWidth: 1,
        borderColor: '#E5E5E5',
        width: '100%',
        backgroundColor: '#fff',
    },
    textCard: {
        justifyContent: 'center',
        width: '65%',
        marginLeft: 20
    }
});

