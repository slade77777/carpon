import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity, Dimensions, Platform} from 'react-native';
import {images} from "../../../../assets/index";
import {connect} from "react-redux";
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import moment from 'moment';
import {navigationService} from "../../../services/index";
import color from "../../../color";

@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
    })
)
export default class CarInspectionTop extends Component{

    state = {
        width1 : 100
    };

    findDimensions(layout){
        const fullWidth = Dimensions.get('window').width;
        const {width} = layout;
        this.setState({width1: fullWidth - width - 45});
    }

    render() {
        const store = this.props.storeDetail;
        const storeDetail = store.detail;
        const discount = storeDetail ? parseFloat(storeDetail.discount_value) : 0;
        let price = 0;
        if (storeDetail && storeDetail.total && (storeDetail.total - storeDetail.tax_discount > 0)) {
            price = storeDetail.total - storeDetail.tax_discount;
        }
        return (
            <View style={{backgroundColor: '#F6FAFB', borderBottomWidth: 1, borderColor: '#E5E5E5'}}>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    margin: 15,
                    opacity: 1
                }} onPress={() => storeDetail && navigationService.navigate('InspectionDetail', {store})}>
                    <View style={{width: Dimensions.get('window').width - 45}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{width: Dimensions.get('window').width - 170}}>
                                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>{store.name || '--'}</Text>
                                <Text style={{fontSize: 15, color: '#333333', marginTop: 5}}>自宅からの距離:  {store.distance ? Math.round(store.distance * 10)/10 : '--'}km</Text>
                                <Text style={{fontSize: price !== 0 ? 36 : 14, color: price !== 0 ? '#008833' : '#F37B7D', bottom: 2, marginTop: 10}}>
                                    {price !== 0 ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'この車の車検に対応していません'}
                                    {price !== 0 && <Text style={{fontSize: 20, color: '#008833', marginTop: 17}}>円</Text>}
                                </Text>
                            </View>
                            <View>
                                {
                                    (store && store.image_url1) ? <View style={{width: 102, height: 102,  borderWidth: 1, borderColor: color.active}}>
                                            <Image key={store.end_point + store.image_url1} source={{uri: store.end_point + store.image_url1}}
                                                   style={{width: 100, height: 100}}/>
                                        </View>
                                        : <Image key={images.noImage} source={images.noImage}
                                                 style={{width: 100, height: 100,  borderWidth: 1, borderColor: color.active}}/>
                                }
                            </View>
                        </View>
                        <View style={{ marginTop: 15}}>
                            <Text style={{ color: '#4B9FA5', fontSize: 13}}>＜車検費用の内訳＞</Text>
                            <View style={{flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center',marginVertical:6}}>
                                <TouchableOpacity onPress={() => this.props.onPressSecond()} style={{ flexDirection: 'row'}}>
                                    <Text style={{fontSize: 15, marginRight: 5}}>車検基本料、その他</Text>
                                    <SvgImage source={SvgViews.IconHelp}/>
                                </TouchableOpacity>
                                <View style={{ marginBottom:6 }}>
                                    <Text style={{fontSize: 24, color: '#008833'}}>
                                        {((storeDetail && storeDetail.fee && price !== 0) ? storeDetail.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--')}
                                        <Text style={{fontSize: 15, color: '#008833', marginTop: 15}}>円</Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.border}/>

                            <View style={{ flexDirection: 'row', paddingVertical: 5}}>
                                <TouchableOpacity onPress={() => this.props.onPressFirst()} style={{ flexDirection: 'row', alignItems: 'center', height: 25, marginTop: 14}}
                                    onLayout={(event) => this.findDimensions(event.nativeEvent.layout)}>
                                    <Text style={{fontSize: 15, marginRight: 5}}>法定費用</Text>
                                    <SvgImage source={SvgViews.IconHelp}/>
                                </TouchableOpacity>
                                <View style={{ width: this.state.width1}}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom:14}}>
                                        <Text style={{fontSize: 15, paddingLeft: 5}}>ー 重量税</Text>
                                        <View style={{ marginBottom:6 }}>
                                            <Text style={{fontSize: 24, color: '#333333'}}>
                                                {(storeDetail && storeDetail.taxt_amount && price !== 0) ? storeDetail.taxt_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--'}
                                                <Text style={{fontSize: 15, color: '#333333', marginBottom:8}}>円</Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.border}/>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, paddingBottom:10}}>
                                        <Text style={{fontSize: 15, paddingLeft: 5}}>ー その他</Text>
                                        <View style={{ flexDirection: 'row'}}>
                                            <Text style={{fontSize: 24, color: '#333333',paddingBottom:6}}>
                                                {(storeDetail && storeDetail.law && price !== 0) ? (storeDetail.law - storeDetail.taxt_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--'}
                                                <Text style={{fontSize: 15, color: '#333333'}}>円</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.border}/>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, marginVertical:6 }}>
                                <Text style={{fontSize: 15}}>最大割引</Text>
                                <View>
                                    <Text style={{fontSize: 24, color: '#FF0000',paddingBottom:8}}>
                                        {discount ? '-' + discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--'}
                                        <Text style={{fontSize: 15, color: '#FF0000', marginTop: 10}}>円</Text>
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.border}/>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'center', width: 30}}>
                        <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                    </View>
                </TouchableOpacity>
                {
                    (!storeDetail || !storeDetail.total) && <View style={{ marginHorizontal: 6, marginBottom: 10}}>
                        <Text style={{ color: '#F37B7D', fontSize: 17, textAlign: 'center'}}>このクルマは料金表の範囲外です。店舗にお問い合わせください。</Text>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    border: {borderWidth: 1, borderColor: '#E5E5E5',borderStyle: 'dotted', height: 1, width: '100%', borderRadius: Platform.OS === 'ios' ? 0 : 1},
});
