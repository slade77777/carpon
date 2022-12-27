import React, {Component} from 'react';
import {Text, View} from 'react-native';

export default class LabelMileageAndAgeCar extends Component {

    render() {
        const { car_mileage_kiro, car_age } = this.props.carInfo;
        const years = Math.trunc(car_age / 12);
        const months = (car_age % 12) || 12;
        const style = Object.assign({ fontSize: 12, color:'#666666' }, this.props.styleText);
        return (
            <View {...this.props}>
                <Text style={style}>
                    {`走行距離：${car_mileage_kiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}km ／ `}
                </Text>
                <Text style={style}>
                    {`車齢：${years ? `${years}年` : ''} ${months ? `${months}ヶ月` : ''}`}
                </Text>
            </View>
        )
    }
}
