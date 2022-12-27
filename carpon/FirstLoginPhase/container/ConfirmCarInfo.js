import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Alert, Text, View, ScrollView, SafeAreaView} from 'react-native';
import {connect} from "react-redux";
import {SingleColumnLayout} from "../../layouts";
import {confirmCarProfile} from "../actions/registration";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {navigationService} from "../../services/index";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import moment from "moment/moment";
import Era from "../../common/Era";
import {getCar} from "../../Home/MyCar/actions/getCar";
import AsyncStorage from '@react-native-community/async-storage';
import {addTrackerEvent, viewPage} from "../../Tracker";
import {getUserProfile} from "../../Account/actions/accountAction";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('ConfirmCarInfo', {header: <HeaderOnPress leftComponent={<View/>} title={'マイカー情報の確認'}/>})
@connect(state => ({
        carProfile: state.registration.carProfile ? state.registration.carProfile.profile : {},
        registration: state.registration,
        answering: state.answerSurvey.answering ? state.answerSurvey.answering.status : false,
        myProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }),
    dispatch => ({
        getUserProfile: () => dispatch(getUserProfile()),
        confirmCarProfile: (profile) => dispatch(confirmCarProfile(profile)),
        getCarInfo: () => dispatch(getCar()),
    }),
)
export class ConfirmCarInfo extends Component {

    state = {
        scanPlateTime: 0
    };

    async componentDidMount() {
        this.setState({complete: false});
        const time = await AsyncStorage.getItem('scanPlateTime');
        if (time) this.setState({scanPlateTime: time});
        const carInfo = this.props.carProfile;
        const userProfile = this.props.myProfile;
        addTrackerEvent('car_status_change', {
            car_is_small: carInfo.type === 1,
            car_maker: carInfo.maker_name,
            car_model: carInfo.car_name,
            car_first_regist_date: carInfo.first_registration_date ? (new Date(carInfo.first_registration_date).getTime())/1000 : null,
            car_mileage: carInfo.mileage_kiro,
            car_next_inspection_date: carInfo.effective_date ? (new Date(carInfo.effective_date).getTime())/1000 : null,
            car_capacity: carInfo.capacity,
            car_weight: carInfo.weight
        });
        addTrackerEvent('car_oil_date_change', {
            car_next_oil_change_date: carInfo.oil_need_change_date
        });
        addTrackerEvent('car_insurance_state_change', {
            car_has_insurance: userProfile.has_car_insurance === null ? '' : userProfile.has_car_insurance,
            car_insurance_expire_date: userProfile.insurance_expiration_date ? (new Date(userProfile.insurance_expiration_date).getTime())/1000 : null
        });
        addTrackerEvent('user_car_status_change', {
            user_has_car: true
        })
        viewPage('confirm_added_car', 'マイカー情報の確認');
    }

    handleConfirmCar() {
        this.props.getCarInfo();
        const carProfile = this.props.carProfile;
        if (this.props.registration.isScanByQr) {
            navigationService.clear('ConfirmCarQRInfo', {addCarFromMainTab: true})
        } else if (this.props.answering) {
            navigationService.navigate('ConfirmCarQRInfoAfterAnswer')
        } else {
            this.props.confirmCarProfile(carProfile);
        }
    }

    render() {
        const myCarComponents = {
            maker_name: {
                title: () => 'メーカー',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{color: '#666666', fontSize: 16}}>
                        {carProfile.maker_name || ''}
                    </Text>
                )
            },
            car_name: {
                title: () => '車名',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{color: '#666666', fontSize: 16}}>
                        {carProfile.car_name || ''}
                    </Text>)
            },
            grade_name: {
                title: () => 'グレード',
                nextScreen: () => 'GradeSelection',
                value: (carProfile) => (
                    <Text style={{color: '#666666', fontSize: 16}}>
                        {carProfile.grade_name || ''}
                    </Text>
                )
            },
            form: {
                title: () => '型式',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{color: '#666666', fontSize: 16}}>
                        {carProfile.form || ''}
                    </Text>
                )
            },
            first_registration_date: {
                title: (carInfo) => {
                    return carInfo.type ? '年式（初度検査年月）' : '年式（初度登録年月）'
                },
                nextScreen: () => null,
                value: (carProfile) => (
                    carProfile.first_registration_date ?
                        <Text style={{color: '#666666', fontSize: 16}}> <Era date={carProfile.first_registration_date}/></Text> : '')
            },
            latest_mileage_kiro: {
                title: () => '走行距離',
                nextScreen: () => 'MileageChange',
                value: (car) => (
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{textAlign: 'right', color: '#666666', fontSize: 16}}>
                            {(car.latest_mileage_kiro || car.mileage_kiro) ? (car.latest_mileage_kiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || car.mileage_kiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) : ''}
                        </Text>
                        <Text style={{
                            textAlign: 'right',
                            color: '#666666',
                            fontSize: 16
                        }}>{(car.latest_mileage_kiro || car.mileage_kiro) ? 'km' : ''}</Text>
                    </View>
                )
            },
            effective_date: {
                // title: (carProfile) => carProfile.qr_code_1 ? '車検満了日' : 'マイカープロフィール',
                title: () => '車検満了日',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{color: '#666666', fontSize: 16}}>
                        {moment(carProfile.effective_date).format('YYYY年M月D日')}
                    </Text>
                )
            },
            number: {
                title: () => 'ナンバープレート',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{color: '#666666', fontSize: 16}}>
                        {carProfile.number || ''}
                    </Text>
                )
            },
            length: {
                title: () => '全長',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{marginTop: carProfile.length > 1000 ? 5 : 0, color: '#666666', fontSize: 16}}>
                        {carProfile.length ? (carProfile.length / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'cm' : ''}
                    </Text>
                )
            },
            width: {
                title: () => '全幅',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{marginTop: carProfile.width > 1000 ? 5 : 0, color: '#666666', fontSize: 16}}>
                        {carProfile.width ? (carProfile.width / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'cm' : ''}
                    </Text>
                )
            },
            height: {
                title: () => '全高',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{marginTop: carProfile.height > 1000 ? 5 : 0, color: '#666666', fontSize: 16}}>
                        {carProfile.height ? (carProfile.height / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'cm' : ''}
                    </Text>
                )
            },
            weight: {
                title: () => '車両総重量',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{marginTop: carProfile.gross_weight > 1000 ? 5 : 0, color: '#666666', fontSize: 16}}>
                        {carProfile.gross_weight ? carProfile.gross_weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'kg' : ''}
                    </Text>
                )
            },
            tire_size_front: {
                title: () => 'タイヤ',
                nextScreen: () => 'Tire',
                value: (carProfile) => (
                    <View>
                        {
                            (carProfile.tire_front_json && carProfile.tire_rear_json && carProfile.tire_front_json.TireString === carProfile.tire_rear_json.TireString) ?
                            <Text style={{textAlign: 'right', color: '#666666', fontSize: 16}}>
                                両：{carProfile.tire_front_json.TireString}
                            </Text>
                                :
                            <View>
                                {
                                    carProfile.tire_front_json ? <Text style={{fontSize: 14, color: '#333333', textAlign: 'right'}}>
                                        前：{carProfile.tire_front_json.TireString || '-'}
                                    </Text> : <View/>
                                }
                                {
                                    carProfile.tire_rear_json ? <Text style={{fontSize: 14, color: '#333333', textAlign: 'right'}}>
                                        後：{carProfile.tire_rear_json.TireString || '-'}
                                    </Text> : <View/>
                                }
                            </View>
                        }
                    </View>)
            },
            displacement_volume: {
                title: () => '総排気量',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{
                        marginTop: carProfile.displacement_volume > 1000 ? 5 : 0,
                        color: '#666666',
                        fontSize: 16
                    }}>
                        {carProfile.displacement_volume ? carProfile.displacement_volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'cc' : ''}
                    </Text>
                )
            },
            fuel: {
                title: () => '使用燃料',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{color: '#666666', fontSize: 16}}>
                        {carProfile.fuel || ''}
                    </Text>
                )
            },
            fuel_port_position: {
                title: () => '給油口位置',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{
                        color: '#666666',
                        fontSize: 16
                    }}>{carProfile.fuel_port_position ? carProfile.fuel_port_position : ''}</Text>
                )
            },
            tank_capacity: {
                title: () => 'タンク容量',
                nextScreen: () => null,
                value: (carProfile) => (
                    <Text style={{
                        color: '#666666',
                        fontSize: 16
                    }}>{carProfile.tank_capacity ? carProfile.tank_capacity + 'L' : ''}</Text>
                )
            }
        };

        const carProfile = this.props.carProfile;

        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{ bottom: isIphoneX() ? getBottomSpace() + 54 : 70 }} style={{backgroundColor: '#FFF'}}>
                            <View style={{marginTop: 25, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E5E5E5'}}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#333333',
                                    paddingLeft: 15
                                }}>以下車両をマイカーとして登録しました。</Text>
                            </View>
                            {
                                Object.keys(myCarComponents).map((attribute, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: '#FFFFFF',
                                                minHeight: 60,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                paddingHorizontal: 15,
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#E5E5E5'
                                            }}>
                                            <View style={{justifyContent: 'center'}}>
                                                <Text style={{fontSize: 14, color: '#333', fontWeight: 'bold'}}>
                                                    {myCarComponents[attribute].title(carProfile)}
                                                </Text>
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                {myCarComponents[attribute].value(carProfile)}
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)',
                            paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15,
                            position: 'absolute',
                            bottom: 0,
                            width: '100%'
                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D'}}
                                          onPress={() => this.handleConfirmCar()}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>次へ</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </View>
        )

    }
}
