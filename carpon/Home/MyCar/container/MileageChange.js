import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, Platform, SafeAreaView} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import moment from 'moment';
import {getMileage} from "../actions/myCarAction";
import {RemoveMileage} from "../components";
import {era} from '@ja-supports/era'
import {viewPage} from "../../../Tracker";

const oneDay = 24*60*60*1000;

function getDayLeft(newDate, oldDate) {
    let diffDays = 0;
    if (oldDate.getTime() < newDate.getTime()) {
        diffDays = Math.round(Math.abs((newDate.getTime() - oldDate.getTime())/(oneDay)));
    }
    return diffDays;
}

@screen('MileageChange', {header: <HeaderOnPress title='走行距離' rightContent={{icon: 'IconEdit', color:'#FFF', nextScreen: 'UpdateMileageChange'}}/>})
@connect(state => ({
    carInfo: state.getCar ? state.getCar.myCarInformation : null,
    mileageChangeHistory: state.getCar.mileageChangeHistory ? state.getCar.mileageChangeHistory: null
}),
    dispatch => ({
        getMileage: ()=> {dispatch(getMileage())}
    })
    )
export class MileageChange extends Component {

    renderItem = ({item, index}) => {
            return (
                <View style={{ borderBottomWidth: 1, padding: 15, borderColor: '#E5E5E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} key={index}>
                    <View>
                        <Text style={{ fontSize: 12, color: '#666666'}}>{moment(item.createDate).format('YYYY年M月D日')}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {item.certification && <View><Text style={{fontSize: 12, color: '#CCCCCC', paddingRight: 15}}>※車検証から取得</Text></View>}
                        <Text style={{ fontSize: 16, color: '#666666', marginTop: item.mileage > 1000 ? 5 : 0}}>{item.mileage && item.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}km</Text>
                        {
                            !item.certification ?
                                <RemoveMileage mileage={item}/>
                                :
                                <View style={{paddingTop: 17, paddingBottom: 17, paddingHorizontal: 17}}/>
                        }

                    </View>
                </View>
            )
    };

    componentWillMount() {
        this.props.getMileage();
        viewPage('view_mileage', '走行距離');
    }

    render() {
        // let date = new Date('1930/05/03');
        // console.log(era(date));
        const carInfo = this.props.carInfo;
        const mileageChangeHistory = this.props.mileageChangeHistory ? this.props.mileageChangeHistory: [];
        const dayDiff = getDayLeft(carInfo.latest_mileage_kiro_date !== 0 ? new Date(carInfo.latest_mileage_kiro_date) : new Date(), new Date(carInfo.first_registration_date));
        const mileageKiro = carInfo.latest_mileage_kiro || carInfo.mileage_kiro;
        return (
            <View style={{flex: 1}}>
                <View style={styles.body}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderWidth: 0.5, borderColor: '#E5E5E5',
                        paddingHorizontal: 10, height: 50, alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 14}}>現在の走行距離</Text>
                        <Text style={{fontSize: 16, marginTop: mileageKiro > 1000 ? 7 : 0}}>{mileageKiro && mileageKiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'km'}</Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 15}}>
                        <Text style={{fontSize: 13, color: '#666666'}}>※ </Text>
                        <View>
                            <Text style={{fontSize: 13, color: '#666666'}}>ご利用状況に基づいたメンテナンス情報をお届けします。</Text>
                            <Text style={{fontSize: 13, color: '#666666'}}>定期的な更新をお願いします。</Text>
                        </View>
                    </View>
                    <View style={{paddingHorizontal: 15}}>
                        <View style={{
                            flexDirection: 'column',
                            borderWidth: 2,
                            borderColor: '#4B9FA5',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 20,
                            marginBottom: 20
                        }}>
                            <Text style={{fontSize: 16, color: '#4B9FA5', fontWeight: 'bold'}}>年間走行距離（概算）</Text>
                            <View style={{ flexDirection: 'row'}}>
                                <Text style={{ marginTop: 3, fontSize: 20, fontWeight: 'bold'}}>
                                    {Math.round((carInfo.latest_mileage_kiro || carInfo.mileage_kiro) * 365/dayDiff).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                <Text style={{ marginTop: 10}}>km</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.g2}>
                        <Text style={{fontWeight: 'bold'}}>更新履歴</Text>
                    </View>
                    {/*<View style={{paddingBottom: Platform.OS === 'android' ? 340 : 310}}>*/}
                        <FlatList
                            style={{height: '100%'}}
                            data={mileageChangeHistory}
                            renderItem={this.renderItem}
                            onEndReachedThreshold={0.8}
                        />
                    {/*</View>*/}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        height: '100%',
        textAlign: 'center',
    },
    g2: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        backgroundColor: '#F8F8F8',
        borderTopWidth: 0.5,
        borderTopColor: '#E5E5E5',
        borderBottomWidth: 2,
        borderBottomColor: '#4B9FA5',

    },
    button: {
        height: 60,
        backgroundColor: '#CCCCCC',
        borderRadius: 3
    },
    width30: {
        width: '40%',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        height: 30,
        justifyContent: 'center',
        backgroundColor: '#F8F8F8'
    },
    width70: {
        width: '60%',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        height: 30,
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12,
        paddingLeft: 10
    },
    value: {
        paddingLeft: 10
    }
});
