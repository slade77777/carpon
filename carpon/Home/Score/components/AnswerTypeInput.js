import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View, TextInput} from "react-native";
import RadioCarpon from "./RadioCarpon";
import CheckBoxCarpon from "./CheckBoxCarpon";
import InputText from "../../../../components/InputText";

export default class AnswerTypeInput extends Component {

    state = {
        typeChecked: {
            CheckBox: CheckBoxCarpon,
            Radio: RadioCarpon,
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


    render() {
        const {item, index, onPress, type, hiddenChecked} = this.props;
        const typeChecked = type ? this.handleCheckType(type) : 'CheckBox';
        const CheckedComponent = this.state.typeChecked[typeChecked];
        return (
            <TouchableOpacity activeOpacity={1} onPress={onPress ? onPress.bind(this, index) : () => ({})} key={index} style={{
                borderColor: '#E5E5E5',
                borderWidth: 0.5,
                justifyContent: 'center',
            }}>
                <View style={{
                    paddingHorizontal: 15, flexDirection: 'row',
                    height: 75,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View style={{
                        flex : 1,
                        paddingRight: 15
                    }}>
                        <InputText
                            style={{
                                height: 40,
                                justifyContent: 'center',
                                width: '100%',
                                fontSize: 13,
                            }}
                            keyboardType={item.keyboardType}
                            placeholder={`${item.label} ${item.unit ? "(" + item.unit + ")" : ""}`}
                            onChangeText={this.onChangeText.bind(this)}
                            value={item.value ? item.value.toString() : ''}
                        />
                    </View>
                    {!hiddenChecked &&
                    <CheckedComponent name={item.label} onPress={onPress ? onPress.bind(this, index) : () => ({})}
                                      checked={item.checked}/>}
                </View>
            </TouchableOpacity>
        )
    }
}
