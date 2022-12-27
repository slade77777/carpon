import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import RadioCarpon from "./RadioCarpon";
import CheckBoxCarpon from "./CheckBoxCarpon";
import {navigationService} from "../../../services";
import {connect} from 'react-redux'
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import _ from 'lodash';

@connect(state => ({
    answerSurvey: state.answerSurvey
}))
export class AnswerTypeSelectCar extends Component {

    state = {
        typeChecked: {
            CheckBox: CheckBoxCarpon,
            Radio: RadioCarpon
        }
    };

    handleCheckType(type) {
        return (Object.keys(this.state.typeChecked).includes(type)) ? type : 'CheckBox'
    };

    onChangeText(text) {
        const {item, index} = this.props;
        item.value = text;
        this.props.onChangeData(item, index)
    }

    handleNavigate() {
        const {item, questionId} = this.props;
        navigationService.navigate('ManufacturerListScreen', {score: true, questionId})
    }

    componentWillReceiveProps(nextProps) {
        const {item, index, questionId} = this.props;
        const {answerSurvey} = nextProps;

        if (answerSurvey.updateDataCar && answerSurvey.rawDataSelectCarInfo.questionId === questionId) {
            let carInfo = answerSurvey.rawDataSelectCarInfo;
            item.maker.value = carInfo.maker_code;
            item.maker.name = carInfo.maker_name;
            item.car_name.value = carInfo.car_name_code;
            item.car_name.name = carInfo.car_name;
            item.checked = true;
            nextProps.onChangeData(item, index)
        }
    }

    render() {
        const carInfo = this.props.carInfo;
        const {item, index, onPress, type} = this.props;
        const typeChecked = type ? this.handleCheckType(type) : 'CheckBox';
        const CheckedComponent = this.state.typeChecked[typeChecked];
        return (
            <TouchableOpacity
                onPress={onPress ? onPress.bind(this, index) : () => ({})} key={index}
                style={{
                    borderColor: '#E5E5E5',
                    borderWidth: 0.5,
                    paddingHorizontal: 15,
                    paddingBottom : 15,
                    justifyContent: 'center'
                }}>
                <View>
                    <View style={{
                        flexDirection: 'row',
                        height: 60,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 13, color: '#333333'}}>
                            {item.label}
                        </Text>
                        <CheckedComponent
                            name={item.label}
                            onPress={onPress ? onPress.bind(this, index) : () => ({})}
                            checked={item.checked}/>
                    </View>
                    {
                        item.checked ?
                            <View style={{
                            marginTop: -15
                            }}>
                                <TouchableOpacity
                                    onPress={() => this.handleNavigate()}
                                    style={{
                                        borderBottomWidth: 1,
                                        borderColor: carInfo ? '#4B9FA5' : '#999',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end'
                                    }}
                                >

                                    <View style={{flexDirection: 'column', height: 60, justifyContent: 'flex-end'}}>
                                        <Text style={{
                                            color: item.maker.name ? '#4B9FA5' : '#999',
                                            fontSize: item.maker.name ? 11 : 13,
                                            marginVertical: item.maker.name ? 0 : 5,
                                            fontWeight: 'bold'
                                        }}>
                                            メーカー
                                        </Text>
                                        {
                                            item.maker.name ?
                                                <Text style={{color: '#999', fontSize: 18, paddingVertical: 10}}>
                                                    {item.maker.name}
                                                </Text>
                                                : null
                                        }
                                    </View>
                                    <View style={{padding: 15}}>
                                        <SvgImage source={SvgViews.IcDown}/>
                                    </View>
                                </TouchableOpacity>
                                {
                                    item.car_name.name ?
                                        <TouchableOpacity
                                            onPress={() => this.handleNavigate()}
                                            style={{
                                                borderBottomWidth: 1,
                                                borderColor: '#4B9FA5',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-end'
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'column',
                                                height: 60,
                                                justifyContent: 'flex-end'
                                            }}>
                                                <Text style={{color: '#4B9FA5', fontSize: 11, fontWeight: 'bold'}}>
                                                    車種
                                                </Text>
                                                <Text style={{color: '#999', fontSize: 18, paddingVertical: 10}}>
                                                    {item.car_name.name}
                                                </Text>
                                            </View>
                                            <View style={{padding: 15}}>
                                                <SvgImage source={SvgViews.IcDown}/>
                                            </View>
                                        </TouchableOpacity> : null
                                }
                            </View>
                            : null
                    }
                </View>
            </TouchableOpacity>
        )
    }
}