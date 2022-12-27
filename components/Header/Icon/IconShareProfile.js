import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import Share from "react-native-share";
import {SvgImage, SvgViews} from "../../Common/SvgImage";
import {connect} from 'react-redux';
import {era} from '@ja-supports/era'
import moment from 'moment';

@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null
    })
)
export default class IconShareProfile extends Component {
    render() {
        const carInfo = this.props.carInfo;
        const mileage = (carInfo.latest_mileage_kiro || carInfo.mileage_kiro) ? (carInfo.latest_mileage_kiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || carInfo.mileage_kiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) : '';
        const date      = moment(carInfo.first_registration_date, 'YYYY-MM-DD');
        const eraYear   = era(date.toDate());
        const momentDate = moment(date).format(' (YYYY) 年M月');
        const weight = carInfo.weight ? carInfo.weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'kg' : '';
        const grossWeight = carInfo.gross_weight ? carInfo.gross_weight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'kg' : '';
        let tire = '';
        if (carInfo.tire_front_json) {
            if (carInfo.tire_front_json && carInfo.tire_front_json.TireString === carInfo.tire_rear_json.TireString) {
                tire = '両：' + carInfo.tire_front_json.TireString;
            } else {
                tire = '前：' + carInfo.tire_front_json.TireString + '後：' + carInfo.tire_rear_json.TireString
            }
        }
        const volume = carInfo.displacement_volume ? carInfo.displacement_volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'cc' : '';
        const message = 'メーカー\t' + (carInfo.maker_name || '') + '\n' +
            '車名\t' + (carInfo.car_name || '') + '\n' +
            'グレード\t' + (carInfo.grade_name || '') + '\n' +
            '型式\t' + (carInfo.form || '') + '\n' +
            '走行距離\t' + mileage + 'km\n' +
            '年式（初度登録年月）\t' + (carInfo.first_registration_date ? eraYear.format(':era:nth') +  momentDate : '') +'\n' +
            '車検満了日\t'+ (carInfo.effective_date ? moment(carInfo.effective_date).format('YYYY年M月D日') : '') + '\n' +
            'ナンバープレート\t' + (carInfo.number || '') + '\n' +
            '車台番号\t' + (carInfo.platform_number || '') + '\n' +
            '車両重量（総重量）\t' + weight + '(' + grossWeight + ')' + '\n' +
            'タイヤサイズ\t' + tire + '\n' +
            '総排気量\t' + volume + '\n' +
            '使用燃料\t' + (carInfo.fuel || '') +'\n' +
            '給油口位置\t' + (carInfo.fuel_port_position || '') + '\n' +
            '燃料タンク容量\t' + (carInfo.tank_capacity ? carInfo.tank_capacity + 'L' : '') + '\n' +
            '全長\t' + (carInfo.length ? carInfo.length/1000 + 'm' : '') + '\n' +
            '全幅\t' + (carInfo.width ? carInfo.width/1000 + 'm' : '') + '\n' +
            '全高\t' + (carInfo.height ? carInfo.height/1000 + 'm' : '') + '\n' +
            'ホイールベース\t' + (carInfo.wheelBase ? (carInfo.wheelBase)/1000 + 'm' : '') + '\n' +
            '最小回転半径\t' + (carInfo.minimumTurningRadius || '') + 'm\n' +
            'ドア数\t'  + (carInfo.door || '') + 'ドア\n' +
            '燃費(JC08モード)\t' + (carInfo.fuelEconomyJc08 || '') + 'km/L\n' +
            '駆動方式\t' + (carInfo.drive || '') + '\n' +
            'ミッション\t' + (carInfo.missionName || '') + '\n' +
            '定員\t' + (carInfo.capacity || '') + '名';
        let shareOptions = {
            title: 'share car information',
            message: message,
            subject: 'carpon'
        };
        return (
            <View style={{
                flexDirection: 'row',
                paddingRight: 15,
                justifyContent: 'flex-end',
                flex: 1,
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => Share.open(shareOptions)}
                                  style={{paddingLeft: 10}}>
                    <SvgImage
                        source={SvgViews.Share}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}
