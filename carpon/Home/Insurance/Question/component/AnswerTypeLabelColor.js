import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import CheckBoxCarpon from "../../../Score/components/CheckBoxCarpon";
import RadioCarpon from "../../../Score/components/RadioCarpon";


export default class AnswerTypeLabelColor extends Component {
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
        return (
            <TouchableOpacity onPress={onPress ? onPress.bind(this, index) : () => ({})} key={index} style={{
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
                        flexDirection : 'row',
                        alignItems : "center"
                    }}>
                        <View style={{backgroundColor : item.color_code, width : 5, height : 5, marginRight: 10}}/>
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
