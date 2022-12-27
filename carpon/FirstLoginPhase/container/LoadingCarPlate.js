import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, StyleSheet, View, Dimensions, Alert} from 'react-native';
import stylesGeneral from '../../../style';
import color from '../../color';
import {connect} from 'react-redux';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import {loadingSuccess, outOfWorkingTime, skipCar} from "../actions/registration";
import {alertsCarNotHOYU} from "../provider";
import LoadingComponent from "../../../components/Common/LoadingComponent";
import {viewPage} from "../../Tracker";

const {width, height} = Dimensions.get('window');

@screen('LoadingCarPlate', {header: null})
@connect(state => ({
        carProfile: state.registration.carProfile,
        isScanByQr: state.registration.isScanByQr
    }),
    dispatch => ({
        skipCar: () => dispatch(skipCar()),
        outOfWorkingTime: () => dispatch(outOfWorkingTime()),
        loadingSuccess: () => dispatch(loadingSuccess()),

    })
)

export class LoadingCarPlate extends Component {
    constructor(props) {
        super(props);

        this.camera = null;
        this.state = {
            progress: 0
        };
    }

    handleSHowAlertCarPending() {
        Alert.alert(
            '車両情報確認中',
            '5〜10分で完了します。今しばらくお待ち下さい。',
            [
                {text: 'ユーザー登録に進む', onPress: () => this.props.skipCar()},
            ],
            {cancelable: false}
        );
    }

    async componentDidMount() {
        viewPage('call_carlookup', '自検協/全軽自協呼び出し');
        const carProfile = this.props.carProfile;
        if (carProfile.profile.id && !carProfile.profile.HOYO_not_found) {
            setTimeout(() => {
                this.props.loadingSuccess()
            }, 5000);
        } else {
            if (carProfile.carType === 1 && carProfile.profile.status === 'pending') {
                setTimeout(() => {
                    this.handleSHowAlertCarPending()
                }, 5000);
            } else if (carProfile.profile.HOYO_not_found) {
                setTimeout(() => {
                    alertsCarNotHOYU.register()
                }, 5000);
            } else {
                setTimeout(() => {
                    // navigationService.navigate('LoadedCarAnimation', {outOfWorkingTime: true})
                    this.props.outOfWorkingTime();
                }, 5000)
            }
        }

        setInterval(() => {
            if (this.state.progress <= 1) {
                this.setState({progress: this.state.progress + 0.1})
            }
        }, 300)

    }

    render() {
        const carProfile = this.props.carProfile.profile;
        return (
            <View style={{...Styles.body, alignItems: 'center'}}>
                {
                    this.state.progress > 1 &&
                    <View style={{height,width, alignItems: 'center', opacity: 0.5, position: 'absolute', zIndex: 5}}>
                        <LoadingComponent backgroundColor={'#04040F'} loadingSize={'large'} size={{w: '100%', h: '100%'}}/>
                    </View>
                }
                <Text style={{
                    position: 'absolute',
                    left: width / 2 - 15,
                    top: height / 6 + 115,
                    fontSize: 14,
                    color: color.active
                }}>
                    {this.state.progress <= 1 ? Math.round(this.state.progress * 100) : 100}%
                </Text>
                <View style={{marginTop: height / 6}}>
                    <LottieView
                        source={require('../../../assets/Carpon_loading1_No-chara.json')}
                        style={{width: 250, height: 250}}
                        autoPlay
                    />
                </View>
                <View style={{marginTop: 30}}>
                    <LottieView
                        source={require('../../../assets/Carpon-loading2_bar.json')}
                        style={{height: 20}}
                        autoPlay
                        loop={false}
                    />
                </View>
                <View style={{marginTop: 20}}>
                    {
                        this.state.progress > 0.3 && this.state.progress < 0.8 &&
                        <Text style={Styles.info}>”メーカー: {carProfile.maker_name || ''}”</Text>
                    }
                    {
                        this.state.progress > 0.1 && this.state.progress < 0.6 &&
                        <Text style={Styles.info}>“ナンバー: {carProfile.number || ''}”</Text>
                    }
                    {
                        this.state.progress > 0.15 && this.state.progress < 0.65 &&
                        <Text
                            style={Styles.info}>“登録年月日／交付年月日を取得：{carProfile.registration_date ? moment(carProfile.registration_date).format('YYYY年M月D日') : ''}”</Text>
                    }
                    {
                        this.state.progress > 0.2 && this.state.progress < 0.7 &&
                        <Text
                            style={Styles.info}>“初度登録年月: {carProfile.first_registration_date ? moment(carProfile.first_registration_date).format('YYYY年M月D日') : ''}”</Text>
                    }
                    {
                        this.state.progress > 0.25 && this.state.progress < 0.75 &&
                        <Text style={Styles.info}>“型式：{carProfile.form || ''}”</Text>
                    }
                    {
                        this.state.progress > 0.35 && this.state.progress < 0.8 &&
                        <Text style={Styles.info}>““エンジン型式：{carProfile.motor_form || ''}”</Text>
                    }
                    {
                        this.state.progress > 0.4 && this.state.progress < 0.85 &&
                        <Text style={Styles.info}>“グレードを取得：{carProfile.grade_name || ''}”</Text>
                    }
                    {
                        this.state.progress > 0.5 &&
                        <Text style={Styles.info}>“自動車の種別：{carProfile.according_type || ''}”</Text>
                    }
                    {
                        this.state.progress > 0.55 &&
                        <Text style={Styles.info}>“用途：{carProfile.use || ''}”</Text>
                    }
                    {
                        this.state.progress > 0.6 &&
                        <Text style={Styles.info}>“自家用・事業用の別：{carProfile.use_class || ''}”</Text>
                    }
                    {
                        this.state.progress > 0.65 &&
                        <View>
                            <Text style={Styles.info}>“排気量：{carProfile.displacement_volume || ''}”</Text>
                            <Text style={Styles.info}>“燃料種別：{carProfile.fuel || ''}”</Text>
                            <Text style={Styles.info}>“型式指定番号：{carProfile.spec || ''}”</Text>
                            <Text style={Styles.info}>“類別区分番号：{carProfile.class || ''}”</Text>
                            <Text style={Styles.info}>“乗車定員：{carProfile.capacity || ''}”</Text>
                        </View>
                    }
                    {
                        this.state.progress > 0.7 &&
                        <View>
                            <Text style={Styles.info}>“重量：{carProfile.weight || ''}”</Text>
                            <Text style={Styles.info}>“車両総重量：{carProfile.gross_weight || ''}”</Text>
                            <Text style={Styles.info}>“長さ：{carProfile.length || ''}”</Text>
                            <Text style={Styles.info}>“幅：{carProfile.width || ''}”</Text>
                            <Text style={Styles.info}>“高さ：{carProfile.height || ''}”</Text>
                            <Text style={Styles.info}>...</Text>
                        </View>
                    }
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    body: {
        height: '100%',
        backgroundColor: stylesGeneral.backgroundColor
    },
    info: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 12,
        color: '#999999'
    }
});
