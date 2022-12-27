import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity, Dimensions, Platform} from 'react-native';
import {images} from "../../../../assets/index";
import {connect} from "react-redux";
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import moment from 'moment';
import {navigationService} from "../../../services/index";
import color from "../../../color";
import CarLabel from "../../../../components/CarLabel";

@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
    })
)
export default class CarInspectionCost extends Component{

    state = {
        width1 : 100
    };

    findDimensions(layout){
        const fullWidth = Dimensions.get('window').width;
        const {width} = layout;
        this.setState({width1: fullWidth - width - 30});
    }


    render() {
        const {carInfo, storeDetail} = this.props;
        const discount = parseFloat(storeDetail.discount_value);
        const {width} = Dimensions.get('window');
        let price = 0;
        if (storeDetail.total && (storeDetail.total - storeDetail.tax_discount > 0)) {
            price = storeDetail.total - storeDetail.tax_discount;
        }
        return (
            <View style={{backgroundColor: '#F6FAFB', borderBottomWidth: 1, borderColor: '#CCCCCC'}}>
                <TouchableOpacity style={{
                    flexDirection: 'column',
                    margin: 15
                }}>
                    <CarLabel/>
                    <View style={{ marginTop: 10}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50}}>
                            <Text style={{fontSize: 20, color: '#333333', fontWeight: 'bold', width: '50%'}}>車検費用（概算）</Text>
                            <Text style={{fontSize: price !== 0 ? 36 : 14, color: price !== 0 ? '#008833' : '#F37B7D', width: '50%', textAlign: 'right'}}>
                                {price !== 0 ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'この車の車検に対応していません'}
                                {price !== 0 && <Text style={{fontSize: 20, color: '#008833', marginTop: 17}}>円</Text>}
                            </Text>
                        </View>
                        <View style={{ marginTop: 15}}>
                            <Text style={{ color: '#4B9FA5', fontSize: 13}}>＜車検費用の内訳＞</Text>
                            <View style={{flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.props.onPressSecond()} style={{ flexDirection: 'row'}}>
                                    <Text style={{fontSize: 15, marginRight: 5}}>車検基本料、その他</Text>
                                    <SvgImage source={SvgViews.IconHelp}/>
                                </TouchableOpacity>
                                <View>
                                    <Text style={{fontSize: 24, color: '#008833'}}>
                                        {(storeDetail && storeDetail.fee && price !== 0) ? storeDetail.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--'}
                                        <Text style={{fontSize: 14, color: '#008833', marginTop: 15}}>円</Text>
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.border}/>
                            <View style={{ flexDirection: 'row', paddingVertical: 5}}>
                                <TouchableOpacity onPress={() => this.props.onPressFirst()} style={{ flexDirection: 'row', alignItems: 'center', height: 25, marginTop: 12}}
                                                  onLayout={(event) => this.findDimensions(event.nativeEvent.layout)}>
                                    <Text style={{fontSize: 15, marginRight: 5}}>法定費用</Text>
                                    <SvgImage source={SvgViews.IconHelp}/>
                                </TouchableOpacity>
                                <View style={{ width: this.state.width1}}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
                                        <Text style={{fontSize: 15, paddingLeft: 5}}>ー 重量税</Text>
                                        <View>
                                            <Text style={{fontSize: 24, color: '#333333'}}>
                                                {(storeDetail && storeDetail.taxt_amount && price !== 0) ? storeDetail.taxt_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--'}
                                                <Text style={{fontSize: 14, color: '#333333', marginTop: 10}}>円</Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.border}/>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10}}>
                                        <Text style={{fontSize: 15, paddingLeft: 5}}>ー その他</Text>
                                        <View style={{ flexDirection: 'row'}}>
                                            <Text style={{fontSize: 24, color: '#333333', marginBottom: -3}}>
                                                {(storeDetail && storeDetail.law && price !== 0) ? (storeDetail.law - storeDetail.taxt_amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--'}
                                                <Text style={{fontSize: 14, color: '#333333', marginTop: 10}}>円</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.border}/>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50}}>
                                <Text style={{fontSize: 15}}>最大割引</Text>
                                <View style={{top: 3}}>
                                    <Text style={{fontSize: 24, color: '#FF0000'}}>
                                        {(discount && price !== 0) ? '-' + discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--'}
                                        <Text style={{fontSize: 14, color: '#FF0000', marginTop: 10}}>円</Text>
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.border}/>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    (!storeDetail || !storeDetail.total) && <View style={{ marginHorizontal: 20, marginBottom: 10}}>
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
