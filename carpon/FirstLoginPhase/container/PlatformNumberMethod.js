import React, { Component } from 'react';
import { View, Alert, BackHandler, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { screen } from '../../../navigation';
import stylesGeneral from '../../../style';
import { SvgImage, SvgViews } from '../../../components/Common/SvgImage'
import {connect} from 'react-redux';
import color from "../../color";
import {SingleColumnLayout} from "../../layouts";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {navigationService} from "../../services/index";

@screen('PlatformNumberMethod', { header: <HeaderOnPress /> })
@connect((state)=>({
    profile: state.registration
}))
export class PlatformNumberMethod extends Component {
    render() {
        return (
        <SafeAreaView style={{backgroundColor : 'white', flex : 1}}>
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <View style={Styles.main}>
                        <View style={Styles.cardView}>
                            <View style={{paddingHorizontal: 15}}>
                                <Text style={{fontWeight: 'bold', fontSize: 18}}>登録方法の選択</Text>
                                <Text style={{paddingBottom: 30, fontSize: 14, marginTop: 10}}>マイカーの登録方法を選択してください</Text>
                            </View>
                        </View>
                        <View style={Styles.cardView}>
                            <TouchableOpacity activeOpacity={1} onPress={() => {
                                navigationService.navigate('PrepareCameraQR')
                            }}>
                                <View style={Styles.padding}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '20%'}}>
                                        <SvgImage source={SvgViews.ScanQR}/>
                                    </View>
                                    <View style={Styles.textCard}>
                                        <Text style={Styles.text1}>車検証のQRコードを読み取る</Text>
                                    </View>
                                    <View style={Styles.direction}>
                                        <SvgImage source={SvgViews.ArrowLeft}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.cardView}>
                            <TouchableOpacity activeOpacity={1} onPress={() => {
                                navigationService.navigate('RegisterPlatformNumber')
                            }}>
                                <View style={Styles.padding}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '20%'}}>
                                        <SvgImage source={() => SvgViews.CarInsurance({
                                            color: color.active,
                                            width: 30,
                                            height: 24
                                        })}/>
                                    </View>
                                    <View style={Styles.textCard}>
                                        <Text style={Styles.text1}>車検証の車台番号を入力する</Text>
                                    </View>
                                    <View style={Styles.direction}>
                                        <SvgImage source={SvgViews.ArrowLeft}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                }
                bottomContent={
                    <View style={{margin: 20}}/>
                }
                />
        </SafeAreaView>
        )
    }
}

const Styles = StyleSheet.create({
    text1: {
        fontSize: 14,
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
        backgroundColor: '#fff',
    },
    textCard: {
        justifyContent: 'center',
        width: '60%',
        marginLeft: 20
    },
    direction: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width : '20%',
        paddingRight: 20
    }
});

