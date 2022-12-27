import React, {Component} from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Platform, FlatList, AsyncStorage, Dimensions, Image} from 'react-native'
import {connect} from 'react-redux'
import {navigationService} from "./../carpon/services";
import {SvgImage, SvgViews} from "./Common/SvgImage";
import color from "../carpon/color";
import moment from 'moment';
const {width, height} = Dimensions.get('window');

@connect(state => ({
        profile: state.registration.userProfile.myProfile,
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
        carProfile: state.registration.carProfile
    }), () => ({})
)
export default class CarLabel extends Component {

    getCarLabel() {
        const {maker_name, car_name} = this.props.carInfo;
        return`${(maker_name ? ((car_name && car_name.substring(0 ,maker_name.length) === maker_name) ? '' : maker_name) : '')} ${car_name ? car_name : ''}`;
    }

    getLastMonth() {
        const lastMonth = new Date(this.props.carInfo.effective_date).getMonth() - 1;
        const dayLastMonth = new Date(this.props.carInfo.effective_date).setMonth(lastMonth);
        return moment(dayLastMonth).format('YYYY年M月D日');
    }

    render() {
        const carInfo = this.props.carInfo;
        return (
            <TouchableOpacity onPress={() => navigationService.navigate('MyCarProfile')} style={{backgroundColor: 'white', padding: 10, borderWidth: 1, borderColor: '#E5E5E5', flexDirection: 'row'}}>
                <View style={{ width: 60}}>
                    {
                        (carInfo.photos && carInfo.photos[0]) ? <Image
                                style={{width: 60, height: 60}}
                                source={{uri: carInfo.photos[0].url}}
                            /> :
                            <View style={{width: 60, height: 60, backgroundColor: 'grey'}}/>
                    }
                </View>
                <View style={{justifyContent: 'center', marginLeft: 10,  width: width * 0.8 - 100}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black' , lineHeight: 20}}>{this.getCarLabel()}</Text>
                    <Text style={{fontSize: 14, marginLeft: 3}}>次回車検：{this.getLastMonth()}</Text>
                </View>
                <View style={{
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    width: width * 0.2,
                    paddingRight: 15
                }}>
                    <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                </View>
            </TouchableOpacity>

        )
    }
}

