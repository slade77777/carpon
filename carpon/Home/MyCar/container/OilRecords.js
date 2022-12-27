import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import {screen} from "../../../../navigation";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {navigationService} from "../../../services";
import {connect} from 'react-redux';
import moment from 'moment';
import {viewPage} from "../../../Tracker";

class HeaderCloseIcon extends Component {

    onClose() {
        navigationService.goBack(null);
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.onClose();
            }} style={{
                alignItems: 'flex-start',
                flex: 1,
                justifyContent: 'center',
            }}>
                <SvgImage source={SvgViews.Remove}/>
            </TouchableOpacity>
        )
    }
}

@screen('OilRecords', {
    header: <HeaderOnPress title="給油記録"
                           leftComponent={<HeaderCloseIcon/>}
                           rightContent={{
                            icon: 'IconEdit', color: '#FFF',
                            nextScreen: 'OilRecordsEditor'
    }}/>
})

@connect(state => ({
    myCarInfo: state.getCar ? state.getCar.myCarInformation : null,
}))

export class OilRecords extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        viewPage('oil_records', '給油記録');
    }

    render() {
        let {myCarInfo} = this.props;
        const oil_details = [
            {label: '前回給油日', value: myCarInfo.oil_last_change_date ? moment(myCarInfo.oil_last_change_date).format('YYYY年MM月DD') : ''},
            {label: '給油量', value: `${myCarInfo.capacity.toLocaleString()}L`},
            {label: '給油額', value: myCarInfo.weight_tax_price ? myCarInfo.weight_tax_price.toLocaleString() + '円' : ''},
            {label: '給油時の走行距離', value: myCarInfo.oil_last_change_km ? myCarInfo.oil_last_change_km.toLocaleString() + 'km' : ''}
        ];

        const oilRecordsHistory = [
            {label: '2018年9月15日', value: '24.5L／3,580円／38,123km'},
            {label: '2018年8月27日', value: '24.5L／3,580円／36,987km'},
            {label: '2018年5月15日', value: '24.5L／3,580円／35,345km'},
            {label: '2018年5月5日', value: '24.5L／3,580円／26,768km'},
            {label: '2018年5月5日', value: '24.5L／3,580円／35,004km'},

        ];
        // console.log(this.props.carProfile, this.props.userProfile, this.props.carInfo);
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{flex: 1, height: '100%', backgroundColor: '#fff'}}>
                <View style={{flex: 1}}>
                    <View style={{
                        flex: 2,
                        borderTopColor: '#E5E5E5',
                        borderBottomWidth: 1,
                        borderBottomColor: '#e5e5e5',
                        marginTop: 20
                    }}>
                        {oil_details.map((detail, key) => (
                            <View key={key} style={{
                                flex: 1,
                                flexDirection: 'row',
                                borderBottomColor: '#E5E5E5',
                                borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: '#E5E5E5',
                                paddingVertical: 15, paddingHorizontal: 10
                            }}>
                                <View style={{flex: 1}}><Text
                                    style={{fontWeight: 'bold', fontSize: 14}}>{detail.label}</Text></View>
                                <View
                                    style={{flex: 1, alignItems: 'flex-end', fontSize: 16}}><Text>{detail.value}</Text></View>
                            </View>
                        ))
                        }
                    </View>

                    <View style={{flex: 1, paddingHorizontal: 15, paddingVertical: 5}}>
                        <View style={{marginVertical: 10}}>
                            <Text style={{flex: 1, marginVertical: 5, fontSize: 13, color: '#666666'}}>
                                ※ ご利用状況に基づいたメンテナンス情報をお届けしま</Text>
                            <Text style={{color: '#666666'}}>す。定期的な更新をお願いします。</Text>
                        </View>
                        <View style={{
                            flex: 1,
                            verticalAlign: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 25,
                            paddingVertical: 20,
                            borderWidth: 1,
                            borderColor: '#4B9FA5'
                            , marginVertical: 20
                        }}>
                            <Text style={{color: '#4B9FA5', fontSize: 17, fontWeight: 'bold'}}>平均燃費</Text>
                            <Text style={{fontSize: 15, marginTop: 10}}>{myCarInfo.oil_last_change_km && myCarInfo.weight_tax_price ? (myCarInfo.oil_last_change_km / myCarInfo.weight_tax_price).toFixed(1).toLocaleString() : 0 }km / L</Text>
                        </View>
                    </View>

                    <View style={{
                        borderBottomColor: '#4b9fa5', borderBottomWidth: 1.5,
                        backgroundColor: '#F8F8F8', borderTopColor: '#e5e5e5', borderTopWidth: 1.5, padding: 15
                    }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>更新履歴</Text>
                    </View>
                    <View style={{flex: 2}}>
                        {
                            oilRecordsHistory.map((history, key) => (
                                <View key={key} style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    borderBottomWidth: 2,
                                    borderBottomColor: '#e5e5e5',
                                    padding: 15,
                                    verticalAlign: 'center'
                                }}>
                                    <View style={{flex: 1, alignItems: 'flex-start'}}><Text
                                        style={{fontSize: 12}}>{history.label}</Text></View>
                                    <View style={{flex: 2, alignItems: 'flex-end'}}><Text
                                        style={{fontSize: 16}}>{history.value}</Text></View>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }
}
