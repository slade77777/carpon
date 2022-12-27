import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Platform
} from 'react-native';
import {screen} from '../../../navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {SvgImage, SvgViews} from '../../../components/Common/SvgImage'
import {navigationService} from "../../services/index";
import {SingleColumnLayout} from "../../layouts";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import {deviceService} from "../../services/index";
import {connect} from 'react-redux';
import {registerCarType} from "../actions/registration";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {viewPage} from "../../Tracker";

const {width} = Dimensions.get('window');

@screen('CarTypeSwitch', {header: <HeaderOnPress title='マイカー登録'/>})
@connect(state => ({
        carProfile: state.registration.carProfile,
    }),
    (dispatch) => ({
        registerCarType: (carType)=> dispatch(registerCarType(carType))
    }))
export class CarTypeSwitch extends Component {

    componentDidMount() {
        viewPage('select_car_type_switch', '車両選択_車両変更');
        firebase.messaging().getToken().then(fcmToken => {
            deviceService.postToken(fcmToken, Platform.OS)
        });
    }

    onPressView(carType) {
        this.props.registerCarType(carType);
        navigationService.navigate('PrepareCameraQR', this.props.navigation.state.params)
    }

    render() {
        return (
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        height: '100%',
                        width: width
                    }}>
                        <View style={{padding: 15}}>
                            <Text style={{
                                paddingTop: 10,
                                color: 'black',
                                fontSize: 16
                            }}>車種を選択してください。</Text>
                        </View>
                        <View style={{marginTop: 15}}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.onPressView(0)}>
                                <View style={{
                                    paddingHorizontal: 15,
                                    height: 100,
                                    flexDirection: 'row',
                                    borderTopWidth: 1,
                                    borderTopColor: '#E5E5E5'
                                }}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '20%'}}>
                                        <SvgImage source={SvgViews.ImageCar}/>
                                    </View>
                                    <View style={{
                                        justifyContent: 'center',
                                        width: '70%',
                                        paddingLeft: 20
                                    }}>
                                        <Text style={Styles.textCar}>普通自動車</Text>
                                    </View>
                                    <View style={{justifyContent: 'center', alignItems: 'flex-end', width: '10%'}}>
                                        <SvgImage source={SvgViews.ArrowLeft}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.onPressView(1)}>
                                <View style={{
                                    paddingHorizontal: 15,
                                    height: 100,
                                    flexDirection: 'row',
                                    borderTopWidth: 1,
                                    borderTopColor: '#E5E5E5',
                                    borderBottomColor: '#E5E5E5',
                                    borderBottomWidth: 1
                                }}>
                                    <View style={{justifyContent: 'center', alignItems: 'center', width: '20%'}}>
                                        <SvgImage source={SvgViews.ImageCarSmall}/>
                                    </View>
                                    <View style={{
                                        justifyContent: 'center',
                                        width: '70%',
                                        paddingLeft: 20
                                    }}>
                                        <Text style={Styles.textCar}>軽自動車</Text>
                                    </View>
                                    <View style={{justifyContent: 'center', alignItems: 'flex-end', width: '10%'}}>
                                        <SvgImage source={SvgViews.ArrowLeft}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />
        )
    }
}

const Styles = StyleSheet.create({
    carContent: {
        marginTop: 20,
        flexDirection: 'row',
        paddingLeft: 30,
        height: 80
    },
    carOption: {
        width: '100%',
        borderWidth: 0.6,
        borderRadius: 5,
        borderColor: '#707070',
        margin: wp('1%'),
        backgroundColor: 'white',
        height: 120
    },
    textCar: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16
    },
    button: {
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        color: '#CCCCCC',
        borderRadius: 5,
        borderWidth: 0.5,
    },
    content: {width: '60%', flexDirection: 'column', justifyContent: 'center'}
});
