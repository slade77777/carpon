import React, {Component} from 'react';
import {StyleSheet, Dimensions, Text, View, TouchableOpacity, FlatList, SafeAreaView, ScrollView, ActivityIndicator, Alert} from 'react-native';
import SvgViews from "../../../../assets/svg/index";
import {SvgImage} from "../../../../components/Common/SvgImage";
import moment from 'moment';
import Divider from "../../../../components/Common/Divider";
import color from "../../../color";
import {connect} from 'react-redux';
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {myCarService} from "../../../services/index";
import {getRecall} from "../actions/getCar";
const {width, height} = Dimensions.get('window');

@connect(state => ({
    carInfo: state.getCar ? state.getCar : null
}), (dispatch) => ({
    getRecall: (id, form) => dispatch(getRecall(id, form)),
}))
export default class ButtonRecall extends Component{

    state = {
        loading: false
    };

    recallCar(report_id) {
        const form = this.props.carInfo.myCarInformation.form;
        const id = this.props.carInfo.myCarInformation.id;
        Alert.alert(
            '車台番号は確認済ですか？',
            '対象車両の場合は、対応開始日を確認しお近くのディーラーにご連絡下さい。',
            [
                {
                    text: 'いいえ',
                },
                {
                    text: 'はい',
                    onPress: () => {
                        this.setState({loading: true});
                        myCarService.confirmRecall({
                            form, id,
                            report_id: report_id,
                        })
                            .then(() => {
                                this.props.getRecall(id, form);
                            }).finally(() => this.setState({loading: false}));
                    }
                }
            ])

    }

    unrecallCar(report_id) {
        const form = this.props.carInfo.myCarInformation.form;
        const id = this.props.carInfo.myCarInformation.id;
        this.setState({loading: true});
        myCarService.unconfirmRecall({
            form, id,
            report_id: report_id,
        })
            .then(() => {
                this.props.getRecall(id, form);
            }).finally(() => this.setState({loading: false}));
    }

    render() {
        const item = this.props.item;
        return (
            <View>
                <View>
                    <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                            borderColor: '#CCCCCC',
                            borderRadius: 15,
                            width: 184,
                            height: 30,
                            borderWidth: 1,
                            justifyContent: 'center',
                            marginTop: 15,
                            marginBottom: 5
                        }}>
                            <Text style={{
                                fontSize: 12,
                                textAlign: 'center'
                            }}>{item.report_date && moment(item.report_date).format('YYYY年M月D日')}</Text>
                        </View>
                    </View>
                    <View style={styles.g2}>
                        <Text style={{fontWeight: 'bold', fontSize: 17, color: 'black'}}>{item.defective_device}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderTopWidth: 1, padding: 15, borderColor: '#E5E5E5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15}}>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14, marginTop: 1}}>対応開始日</Text>
                        <Text style={{ fontSize: 16, color: 'black'}}>{item.recall_measure_start_date && moment(item.recall_measure_start_date).format('YYYY年M月D日')}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, padding: 15, borderColor: '#E5E5E5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14, marginTop: 1}}>届出番号</Text>
                        <Text style={{ fontSize: 16, color: 'black'}}>{item.report_key}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, padding: 15, borderColor: '#E5E5E5' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black'}}>状況</Text>
                        <Text style={{ marginTop: 10,  borderColor: '#E5E5E5', fontSize: 16, color: 'black'}}>{item.defect_detail}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, padding: 15, borderColor: '#E5E5E5' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black'}}>対策</Text>
                        <Text style={{ marginTop: 10, fontSize: 16, color: 'black'}}>{item.measure_detail}</Text>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: color.active, margin: 15, backgroundColor: '#F8F8F8' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 25, width: '100%', marginTop: 15}}>
                            <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>対象車台番号</Text>
                            <View style={{ marginLeft: 5}}>
                                {!item.is_confirm && <SvgImage fill={color.active} source={SvgViews.Required}/>}
                            </View>
                        </View>
                        <View style={{ padding: 10}}>
                            {
                                item.target_cars && item.target_cars.map((car, index) => {
                                    return (
                                        <Text key={index} style={{ textAlign: 'center', color: '#F37B7D', fontSize: 16, lineHeight: 24}}>{car.platform_number_raw_text}</Text>
                                    )
                                })
                            }
                        </View>
                        <View>
                            {
                            !item.is_confirm ? <TouchableOpacity activeOpacity={1} onPress={() => !this.state.loading && this.recallCar(item.report_id)}
                                                                 style={{ backgroundColor: '#FFFFFF', borderWidth:2, borderColor: '#CCCCCC', margin: 15,
                                                                     borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    {this.state.loading && <LoadingComponent size={{w: '100%', h: '100%'}}/>}
                                    <View style={{ width: 30, marginLeft: 15}}/>
                                    <Text style={{ padding: 15, color: 'black', fontSize: 14, textAlign: 'center', fontWeight: 'bold'}}>
                                        車台番号を確認したらタップ
                                    </Text>
                                    <View style={{
                                        marginRight: 15,
                                        height: 30,
                                        width: 30,
                                        backgroundColor: '#EFEFEF',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 21
                                    }}>
                                        <SvgImage source={() => SvgViews.IconDone({fill: 'white'})}/>
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity activeOpacity={1} onPress={() => !this.state.loading && this.unrecallCar(item.report_id)}
                                                  style={{ backgroundColor: '#FFFFFF', borderWidth:2, borderColor: '#CCCCCC', margin: 15,
                                                      borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    {this.state.loading && <LoadingComponent size={{w: '100%', h: '100%'}}/>}
                                    <View style={{ width: 30, marginLeft: 15}}/>
                                    <Text style={{ padding: 15, color: '#CCCCCC', fontSize: 14, textAlign: 'center', fontWeight: 'bold'}}>
                                        車台番号を確認したらタップ
                                    </Text>
                                    <View style={{
                                        marginRight: 15,
                                        height: 30,
                                        width: 30,
                                        backgroundColor: '#008833',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 21
                                    }}>
                                        <SvgImage source={() => SvgViews.IconDone({fill: 'white'})}/>
                                    </View>
                                </TouchableOpacity>
                        }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        height: '100%',
        textAlign: 'center',
    },
    g2: {
        marginTop: 10,
        height: 45,
        justifyContent: 'center',
        paddingLeft: 20,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderBottomColor: color.active
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
