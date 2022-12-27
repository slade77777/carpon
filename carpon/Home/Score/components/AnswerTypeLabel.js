import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import CheckBoxCarpon from "./CheckBoxCarpon";
import RadioCarpon from "./RadioCarpon";

export default class AnswerTypeLabel extends Component {
    state = {
        typeChecked: {
            CheckBox: CheckBoxCarpon,
            Radio: RadioCarpon
        }
    };

    handleCheckType(type) {
        return (Object.keys(this.state.typeChecked).includes(type)) ? type : 'CheckBox'
    };

    render() {
        const {item, index, onPress, type} = this.props;
        const typeChecked = type ? this.handleCheckType(type) : 'CheckBox';
        const CheckedComponent = this.state.typeChecked[typeChecked];
        const specialAnswer = {
            status: item.value === -1,
        };
        return (
            <TouchableOpacity onPress={onPress ? onPress.bind(this, index, specialAnswer) : () => ({})} key={index} style={{
                height: 75,
                borderColor: '#E5E5E5',
                borderWidth: 0.5,
                justifyContent: 'center'
            }}>
                <View style={{
                    paddingHorizontal: 15, flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        {item.color_code && <View style={{backgroundColor : item.color_code, width : 5, height : 5, marginRight: 10}}/>}
                        <Text style={{fontSize: 13, color: '#333333'}}>
                            {item.label}
                        </Text>
                    </View>
                    <CheckedComponent name={item.label} onPress={onPress ? onPress.bind(this, index) : () => ({})}
                                      checked={item.checked}/>
                </View>
            </TouchableOpacity>
        )
    }
}