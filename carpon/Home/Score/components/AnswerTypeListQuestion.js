import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import CheckBoxCarpon from "./CheckBoxCarpon";
import RadioCarpon from "./RadioCarpon";
import AnswerTypeQuestion from "./AnswerTypeQuestion";

export default class AnswerTypeListQuestion extends Component {

    state = {
        typeChecked: {
            CheckBox: CheckBoxCarpon,
            Radio: RadioCarpon
        },
    };

    handleCheckType(type) {
        return (Object.keys(this.state.typeChecked).includes(type)) ? type : "CheckBox"
    };


    handleChangeData(value, indexItem) {
        const {item, index} = this.props;
        const newData = item.data;
        newData[indexItem] = value;
        this.props.onChangeData({...item, data: [...newData]}, index)
    }

    _renderItem({item, index}) {
        return (
            <AnswerTypeQuestion question={item} key={index} index={index} onPress={this.handleChangeData.bind(this)}/>
        )
    }

    render() {
        const {item, index, onPress, type} = this.props;
        const typeChecked = type ? this.handleCheckType(type) : 'CheckBox';
        const CheckedComponent = this.state.typeChecked[typeChecked];
        return (
            <TouchableOpacity activeOpacity={1} onPress={onPress ? onPress.bind(this, index) : () => ({})} key={index} style={{
                borderColor: '#E5E5E5',
                borderWidth: 0.5,
                justifyContent: 'center',
            }}>
                <View>
                    <View style={{
                        paddingHorizontal: 15, flexDirection: 'row',
                        height: 75,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 13, color: '#333333'}}>
                            {item.label}
                        </Text>
                        <CheckedComponent name={item.label}
                                          onPress={onPress ? onPress.bind(this, index) : () => ({})}
                                          checked={item.checked}/>
                    </View>
                    {
                        item.checked ?
                            <View style={{flex: 1, margin: 15, borderColor: '#E5E5E5',
                                borderWidth: 0.5,}}>
                                <FlatList
                                    style={{margin : -0.5}}
                                    data={item.data}
                                    renderItem={this._renderItem.bind(this)}
                                    onEndReachedThreshold={0.8}
                                />
                            </View> : null
                    }
                </View>
            </TouchableOpacity>
        )
    }
}