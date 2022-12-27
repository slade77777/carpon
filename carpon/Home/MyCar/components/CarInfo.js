import React, {Component} from 'react';
import {Alert, Text, View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {connect} from "react-redux";
import color from "../../../color";
import moment from 'moment';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {navigationService} from "../../../services";
import Era from "../../../common/Era";
import Icon from 'react-native-vector-icons/FontAwesome';
import numeral from 'numeral';

export const myCarComponents = {
    maker_name: {
        title: () => 'メーカー',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.maker_name || ''}
            </Text>
        )
    },
    car_name: {
        title: () => '車名',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.car_name || ''}
            </Text>)
    },
    grade_name: {
        title: () => 'グレード',
        nextScreen: () => 'GradeSelection',
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.grade_name || ''}
            </Text>
        )
    },
    form: {
        title: () => '型式',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
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
            carProfile.first_registration_date ? <Text style={{color: '#333', fontSize: 16}}> <Era
                date={carProfile.first_registration_date}/></Text> : '')
    },
    latest_mileage: {
        title: () => '走行距離',
        nextScreen: () => 'MileageChange',
        value: (car) => (
            <View style={{flexDirection: 'row'}}>
                <Text style={{textAlign: 'right', color: '#333', fontSize: 16}}>
                    {(car.latest_mileage_kiro || car.mileage_kiro) ? (car.latest_mileage_kiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || car.mileage_kiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) : ''}
                </Text>
                <Text style={{
                    textAlign: 'right',
                    color: '#333',
                    fontSize: 16
                }}>{(car.latest_mileage_kiro || car.mileage_kiro) ? 'km' : ''}</Text>
            </View>
        )
    },
    effective_date: {
        // title: (carProfile) => carProfile.qr_code_1 ? '車検満了日' : 'マイカープロフィール',
        noDisplay: true,
        title: () => '車検満了日',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {moment(carProfile.effective_date).format('YYYY年M月D日')}
            </Text>
        )
    },
    number: {
        title: () => 'ナンバープレート',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.number || ''}
            </Text>
        )
    },

    platform_number: {
        title: () => '車台番号',
        nextScreen: (carProfile) => carProfile.qr_code_1 ? null : 'PrepareCameraQR',
        params: {isAddQR: true},
        value: (carProfile) => (
            <View>
                {
                    carProfile.qr_code_1 ? <Text style={{color: '#333', fontSize: 16}}>
                        {carProfile.platform_number}
                    </Text> : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>
                }

            </View>
        )
    },
    weight: {
        title: () => '車両重量（総重量）',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{marginTop: carProfile.body.vehicle.car_weight > 1000 ? 5 : 0, color: '#333', fontSize: 16}}>
                {carProfile.body.vehicle.car_weight ? carProfile.body.vehicle.car_weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'kg ' : '-kg'}
                <Text>(
                    {
                        carProfile.body.vehicle.car_total_weight ? carProfile.body.vehicle.car_total_weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'kg' : '-kg'
                    })
                </Text>
            </Text>
        )
    },
    tire_size_front: {
        title: () => 'タイヤサイズ',
        nextScreen: () => 'Tire',
        value: (carProfile) => (
            <View>
                {
                    (carProfile.tire_front_json && carProfile.tire_rear_json && carProfile.tire_front_json.TireString === carProfile.tire_rear_json.TireString) ?
                    <Text style={{textAlign: 'right', color: '#333', fontSize: 16}}>
                        {carProfile.tire_front_json.TireString || '-'}
                    </Text> :
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
    total_displacement_volume: {
        title: () => '総排気量',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{marginTop: carProfile.total_displacement_volume > 1000 ? 5 : 0, color: '#333', fontSize: 16}}>
                {carProfile.total_displacement_volume ? carProfile.total_displacement_volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'cc' : '-cc'}
            </Text>
        )
    },
    fuel: {
        noDisplay: true,
        title: () => '使用燃料',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.fuel || ''}
            </Text>
        )
    },
    fuel_port_position: {
        title: () => '給油口位置',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{
                color: '#333',
                fontSize: 16
            }}>{carProfile.fuel_port_position ? carProfile.fuel_port_position : '-'}</Text>
        )
    },
    tank_capacity: {
        title: () => '燃料タンク容量',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{
                color: '#333',
                fontSize: 16
            }}>{carProfile.tank_capacity ? carProfile.tank_capacity + 'L' : '-L'}</Text>
        )
    },
    length: {
        title: () => '全長',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.length ? parseFloat(numeral(carProfile.length / 1000).format('0.00')) + 'm' : '-m'}
            </Text>
        )
    },
    width: {
        title: () => '全幅',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.width ? parseFloat(numeral(carProfile.width / 1000).format('0.00')) + 'm' : '-m'}
            </Text>
        )
    },
    height: {
        title: () => '全高',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.height ? parseFloat(numeral(carProfile.height / 1000).format('0.00')) + 'm' : '-m'}
            </Text>
        )
    },
    wheelBase: {
        title: () => 'ホイールベース',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.height ? parseFloat(numeral(carProfile.wheelBase / 1000).format('0.00')) + 'm' : '-m'}
            </Text>
        )
    },
    minimumTurningRadius: {
        title: () => '最小回転半径',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.height ? parseFloat(numeral(carProfile.minimumTurningRadius).format('0.00')) + 'm' : '-m'}
            </Text>
        )
    },
    door: {
        title: () => 'ドア数',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.height ? (carProfile.door) + 'ドア' : '-'}
            </Text>
        )
    },
    fuelEconomyJc08: {
        title: () => '燃費（JC08モード）',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.fuelEconomyJc08 ? parseFloat(numeral(carProfile.fuelEconomyJc08).format('0.0')) + 'km/L' : '-km/L'}
            </Text>
        )
    },
    kudou: {
        title: () => '駆動方式',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16}}>
                {carProfile.height ? (carProfile.kudou) : ''}
            </Text>
        )
    },
    missionName: {
        title: () => 'ミッション',
        nextScreen: () => null,
        value: (carProfile) => (
            <View style={{height: 70, width: '70%', justifyContent: 'center', alignItems: 'flex-end'}}>
                <Text style={{color: '#333', fontSize: 16, textAlign: 'right'}}>
                    {carProfile.missionName ? (carProfile.missionName) : ''}
                </Text>
            </View>

        )
    },
    capacity: {
        title: () => '定員',
        nextScreen: () => null,
        value: (carProfile) => (
            <Text style={{color: '#333', fontSize: 16, paddingTop: 15, paddingBottom: 10}}>
                {carProfile.height ? (carProfile.capacity) + '名' : '-名'}
            </Text>
        )
    },

};

@connect(state => ({
        carProfile: state.getCar ? state.getCar.myCarInformation : null,
    })
)
export class MyCarField extends Component {

    renderCard() {
        const {attribute, car} = this.props;
        return (
            <View style={{
                backgroundColor: '#FFFFFF',
                minHeight: 60,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E5E5'
            }}>
                <View style={{justifyContent: 'center'}}>
                    <Text style={{fontSize: 14, color: '#333333', fontWeight: 'bold'}}>
                        {myCarComponents[attribute].title(car)}
                    </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                    {myCarComponents[attribute].value(car)}
                    {
                        myCarComponents[attribute].nextScreen(car) ?
                            <View style={{justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 10}}>
                                <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                            </View> :
                            <View style={{paddingHorizontal: 10}}/>
                    }
                </View>
            </View>
        )
    }

    render() {
        const {attribute, car} = this.props;
        return (
            <View>
                {
                    myCarComponents[attribute].nextScreen(car) ?
                        <TouchableOpacity
                            onPress={() => navigationService.navigate(myCarComponents[attribute].nextScreen(car), myCarComponents[attribute].params)}>
                            {this.renderCard()}
                        </TouchableOpacity>
                        :
                        <View>
                            {myCarComponents[attribute].noDisplay ? (car[attribute] && this.renderCard()) : this.renderCard()}
                        </View>
                }
            </View>
        )
    }
}

@connect(state => ({
    carInfo: state.getCar ? state.getCar.myCarInformation : null,
}))
export default class CarInfo extends Component {
    render() {
        const car = this.props.carInfo;
        return (
            <View style={styles.g2}>
                <Text onPress={() => navigationService.navigate('UpdateCar')} style={{ textAlign: 'center', color:color.active, textDecorationLine: 'underline', fontSize: 14, lineHeight: 17}}>乗り換え（車両変更）はこちら</Text>
                <View style={{
                    paddingLeft: 15,
                    backgroundColor: '#F8F8F8',
                    borderBottomWidth: 1,
                    borderBottomColor: color.active,
                    marginVertical: 15,
                    paddingVertical: 15,
                }}>
                    <Text style={{fontWeight: 'bold'}}>基本情報</Text>
                </View>
                <View>
                    {
                        car && Object.keys(myCarComponents).map(function (key, index) {
                            return car.hasOwnProperty(key) ? (
                                <MyCarField key={index} attribute={key} car={car}/>) : null
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    g2: {
        marginVertical: 15,
        paddingBottom: 15
    },
});
