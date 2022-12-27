'use strict';
import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, Alert} from 'react-native';
import stylesGeneral from '../../../../style';
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import color from '../../../color';
import {navigateSuccess, updateCar} from '../actions/myCarAction';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('window');

@screen('UpdateQRCode', {header: null})
@connect(
    state => ({
        carInfo: state.getCar,
        updateCarReady: state.getCar.updateCarReady,
        plateNumber: state.registration.carProfile.profile ? state.registration.carProfile.profile.number: null
    }),
    dispatch => ({
        updateCar: (data) => {
            dispatch(updateCar(data))
        },
        navigateSuccess: (key) => {
            dispatch(navigateSuccess(key))
        }
    })
)
export class UpdateQRCode extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        part1: null,
        part2: null,
        part3: null,
        part4: null,
        part5: null,
        reactivate: true
    };

    firstTime = true;

    componentWillReceiveProps(props) {
        if(this.firstTime){
            this.props.carInfo.updatedCar && this.props.navigation.pop(3);
            this.props.carInfo.updatedCar && props.navigateSuccess('updatedCar');
            this.firstTime = false
        }
    }

    render() {
        return (
            <View style={styles.body}>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                />
                <View style={{height: height}}>
                    {/*<QRCodeScanner*/}
                        {/*vibrate={false}*/}
                        {/*reactivate={this.state.reactivate}*/}
                        {/*topViewStyle={{flex: 0, height: 0}}*/}
                        {/*cameraStyle={{height: height}}*/}
                        {/*onRead={this.onSuccess.bind(this)}*/}
                        {/*showMarker={false}*/}
                        {/*markerStyle={{ width: 150, height: 150, borderColor: 'white', borderRadius: 10, marginBottom: 200 }}*/}
                        {/*fadeIn={true}*/}
                    {/*/>*/}
                </View>
                <View style={{position: 'absolute', top: 0, height: height/4, width,backgroundColor: '#333333', opacity: 0.5}}>
                    <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack(null)}>
                        <View style={{alignItems : 'flex-start', marginTop : 40, marginLeft : 15}}>
                            <SvgImage source={SvgViews.Remove}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{position: 'absolute',alignItems: 'center', top: height*2/3, height: height/3, width, backgroundColor: '#333333', opacity: 0.5}}>
                    <View style={{ padding: 20}}>
                        <Text style={{ textAlign: 'center', color: 'white'}}>
                            QRコードを検出し、自動で撮影されます。枠内に
                            左から2つ目から順にQRコードをかざしてください。
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{flexDirection: 'row'}}>
                            {
                                this.state.part1 ?
                                    <View style={styles.contentOk}>
                                        <SvgImage source={SvgViews.Qrcode}/>
                                    </View>
                                    :
                                    <View style={styles.contentNormal}/>
                            }
                            {
                                this.state.part2 ?
                                    <View style={styles.contentOk}>
                                        <SvgImage source={SvgViews.Qrcode}/>
                                    </View>
                                    :
                                    <View style={styles.contentNormal}/>
                            }
                            {
                                this.state.part3 ?
                                    <View style={styles.contentOk}>
                                        <SvgImage source={SvgViews.Qrcode}/>
                                    </View>
                                    :
                                    <View style={styles.contentNormal}/>
                            }
                        </View>
                        <View style={{flexDirection: 'row', marginLeft: 10}}>
                            {
                                this.state.part4 ?
                                    <View style={styles.contentOk}>
                                        <SvgImage source={SvgViews.Qrcode}/>
                                    </View>
                                    :
                                    <View style={styles.contentNormal}/>
                            }
                            {
                                this.state.part5 ?
                                    <View style={styles.contentOk}>
                                        <SvgImage source={SvgViews.Qrcode}/>
                                    </View>
                                    :
                                    <View style={styles.contentNormal}/>
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    onSuccess(e) {
        if (this.state.part1 && this.state.part2 && this.state.part3 && this.state.part4 && this.state.part5 && this.state.reactivate) {
            this.setState({reactivate: false});
            const platform_number = this.state.part5.split('/')[2];
            const number = ((this.state.part4 + this.state.part5).split('/'))[1];
            number === this.props.plateNumber &&
            setTimeout(() => {
                Alert.alert(
                '車検証情報の更新',
                '車検証の読み取りが完了しました。',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            this.props.updateCar({
                                id: this.props.carInfo.myCarInformation.id,
                                platform_number
                            });
                        }
                    },
                ])
            }, 500);
        } else {
            if (e.data) {
                if (e.data.substring(0,2) === '2/' && e.data.charCodeAt(2) > 255) {
                    this.setState({part4: e.data});
                    return true;
                }
                if (e.data.substring(0,2) === '2/' && e.data.charCodeAt(2) <= 255) {
                    this.setState({part1: e.data});
                    return true;
                }
                if (e.data.substring(e.data.length - 9,e.data.length - 3).match("^[A-z0-9]+$") && e.data.substring(e.data.length - 2, e.data.length).match("^[A-z0-9]+$") && e.data.substring(e.data.length - 3, e.data.length - 2) === '/') {
                    this.setState({part3: e.data});
                    return true;
                }
                if (e.data.charCodeAt(0) > 255) {
                    this.setState({part5: e.data});
                    return true;
                }
                if (e.data.split('/').length > 3 && e.data.split('/')[2] === '-   ' && e.data.split('/')[3] === '-   ') {
                    this.setState({part2: e.data});
                    return true;
                }
            }
        }
    }
}

const barcodePlaceHolder = {
    textAlign: 'center',
    width: 60,
    height: 60,
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: 'white',
    margin: 5,
    opacity: 1,
};

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        textAlign: 'center',
    },
    main: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 23,
    },
    header: {
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        paddingTop: 115,
        paddingBottom: 115,
    },
    bottom: {
        width: 60,
        marginLeft: (width - 60) / 2,
        borderRadius: 40,
        backgroundColor: '#73BFBF'
    },

    group: {
        marginLeft: 40,
        marginRight: 40,
        marginTop: 15,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    body: {
        height: '100%',
        backgroundColor: stylesGeneral.backgroundColor,
        flex: 1,
        flexDirection: 'column',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    activeText: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#909090'
    },
    buttonCancel: {
        width: '100%',
        borderRadius: 5,
        borderWidth: 0.5,
        backgroundColor: '#EFEFEF',
        marginTop: 10
    },

    contentNormal: {
        ...barcodePlaceHolder
    },
    contentOk: {
        ...barcodePlaceHolder,
        borderColor: color.active,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
