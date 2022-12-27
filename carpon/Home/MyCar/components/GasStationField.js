import React, {Component} from 'react';
import {View, Text, Platform, Image, TouchableOpacity, Dimensions} from 'react-native';
import {getShopType} from "../../GasStation/container/GasStation";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import color from "../../../color";
import {navigationService} from "../../../services/index";
import {connect} from 'react-redux';
const {width} = Dimensions.get('window');

@connect(state => ({
    carProfile: state.registration.carProfile.profile,
    gasMin: state.gasReducer ? state.gasReducer.ItemPriceMin : null,
    state: state.gasReducer
}))
export class GasStationField extends Component {

    render() {
        const gasMin = this.props.gasMin;
        return (
            <TouchableOpacity
                style={{
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#e5e5e5',
                    backgroundColor: '#FFFFFF',
                    minHeight: 75,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15
                }}
                onPress={() => navigationService.navigate('GasStation')}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width - 65,
                    justifyContent: 'space-between'
                }}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <Text style={{fontSize: 14, color: '#333', fontWeight: 'bold'}}>
                            ガソリン最安値
                        </Text>
                    </View>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                        {
                            gasMin && <View style={{height: 100, justifyContent: 'center'}}>
                                {gasMin.Price ? <Text style={{fontSize: 10, color: '#333333'}}>レギュラー</Text> : <View />}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: gasMin.Price ? 'space-between' : 'flex-end'
                                }}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{
                                            fontSize: 35,
                                            textAlign: 'right',
                                            color: '#333333'
                                        }}>{gasMin.Price ? gasMin.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-'}</Text>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#333333',
                                            marginTop: 20,
                                            marginRight: 5
                                        }}>円／L</Text>
                                    </View>
                                    <View style={{marginTop: 5}}>
                                        {
                                            gasMin && gasMin.logo_url &&
                                            <Image source={{uri: gasMin.logo_url}} style={{width: 30, height: 30}}/>
                                        }
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5}}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#333333',
                                        marginTop: 3
                                    }}>現在地から{gasMin.Distance ? (Math.round(parseInt(gasMin.Distance) / 100) / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-'}km</Text>
                                    {
                                        gasMin && gasMin.shop_type_name && <View style={{
                                            backgroundColor: '#F37B7D',
                                            borderRadius: 1,
                                            paddingVertical: 2,
                                            paddingHorizontal: 5,
                                            marginLeft: 6,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>{gasMin.shop_type_name}</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <View style={{alignItems: 'flex-end', justifyContent: 'center', width: 35}}>
                    <SvgImage fill={color.active} source={SvgViews.ArrowCircle}/>
                </View>
            </TouchableOpacity>

        )
    }
}
