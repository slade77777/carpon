import React, {Component} from 'react';
import {Alert, Dimensions, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {screen} from '../../../navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import HeaderCarpon from "../../../components/HeaderCarpon";
import {SvgImage, SvgViews} from '../../../components/Common/SvgImage'
import {deviceService, navigationService} from "../../services/index";
import {SingleColumnLayout} from "../../layouts";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import {comeBackRegisterCar, registerCarType, skipCar} from "../actions/registration";
import store from "../../store";
import color from "../../color";
import {addTrackerEvent, viewPage} from "../../Tracker";

const {width} = Dimensions.get('window');

@screen('CarType', {header: <HeaderCarpon title='マイカー登録'/>})
@connect(state => {
        return {
            isCarLimited: state.registration.isCarLimited,
        }
    },
    (dispatch) => ({
        registerCarType: (carType) => dispatch(registerCarType(carType)),
        comeBackRegisterCar: () => dispatch(comeBackRegisterCar()),
        skipCar: () => dispatch(skipCar())
    }))
export class CarType extends Component {

    componentDidMount() {
        firebase.messaging().getToken().then(fcmToken => {
            deviceService.postToken(fcmToken, Platform.OS)
        });
        let result = this.props.navigation.getParam('registerCarAgain');
        result && this.props.comeBackRegisterCar();
        viewPage('select_car_type', '車両選択');
        setTimeout(() => {
            this.props.isCarLimited && this.handleCarLimited()
        }, 1000);
    }

    handleCarLimited() {
        Alert.alert(
            'ユーザ登録にお進み下さい',
            '既に3回利用されたため、こちらの端末ではナンバー登録は利用できません。ユーザ登録の後、車検証QRスキャンによる車両登録がご利用いただけます。',
            [
                {
                    text: 'ユーザ登録に進む',
                    onPress: () => {
                        store.dispatch({type: 'SKIP_CAR_WHEN_LIMIT'});
                        navigationService.clear('AuthenticationScreen')
                    }, style: 'destructive',
                },
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false}
        );
    }

    onPressView(carType) {
        if (this.props.isCarLimited) {
            return this.handleCarLimited()
        } else {
            this.props.registerCarType(carType);
            navigationService.navigate('PrepareCameraScan')
        }
    }

    handleSkip() {
        Alert.alert(
            'あとでマイカーを登録する',
            'マイカーが登録されるまで一部機能がご利用いただけません',
            [
                {
                    text: 'OK', style: 'destructive', onPress: () => {
                        this.props.skipCar();
                        addTrackerEvent('wiz_regist_method', {method: 'suspend'})
                }
                },
                {text: 'キャンセル', style: 'cancel'},
            ],
            {cancelable: false}
        );
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
                            {
                                this.props.isCarLimited &&
                                <View style={{ margin: 15}}>
                                    <Text>
                                        <Text style={{color: '#666666'}}>※マイカーが登録できない場合は</Text>
                                        <Text onPress={() => navigationService.navigate('Contact', {type: 'LimitCar'})} style={{color: color.active, textDecorationLine: 'underline'}}>こちら</Text>
                                        <Text style={{color: '#666666'}}>よりお問い合わせください</Text>
                                    </Text>
                                </View>
                            }
                        </View>
                    </View>
                }
                bottomContent={
                    <SafeAreaView>
                        <View style={{paddingHorizontal: 15}}>
                            <ButtonCarpon onPress={this.handleSkip.bind(this)}
                                          style={{marginBottom: 20, backgroundColor: '#EFEFEF', height: 50}}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: 14,
                                    color: '#333333',
                                    fontWeight: 'bold'
                                }}>あとでマイカーを登録する</Text>
                            </ButtonCarpon>
                        </View>
                    </SafeAreaView>
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
