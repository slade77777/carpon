import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View, TextInput} from "react-native";
import CheckBoxCarpon from "./CheckBoxCarpon";
import RadioCarpon from "./RadioCarpon";
import DropdownApi from "./DropdownApi";
import InputText from "../../../../components/InputText";

export default class AnswerTypeInputGroup extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        typeChecked: {
            CheckBox: CheckBoxCarpon,
            Radio: RadioCarpon
        },

    };

    handleCheckType(type) {
        return (Object.keys(this.state.typeChecked).includes(type)) ? type : 'CheckBox'
    };

    onChangeText(value, indexItem) {
        const {item, index} = this.props;
        item.options[indexItem].value = value;
        this.props.onChangeData(item, index)
    }


    _renderItem({item, index}) {
        return (
            <TextInput
                style={{
                    height: 40,
                    borderColor: '#CCCCCC',
                    borderWidth: 0.5,
                    justifyContent: 'center',
                    width: '100%',
                    paddingLeft: 15
                }}
                placeholder={item.label}
                onChangeText={(e) => this.onChangeText(e, index)}
                value={item.value ? item.value.toString() : ''}
                key={index}
            />
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
                <View style={{
                    paddingHorizontal: 15, flexDirection: 'row',
                    height: 75,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{fontSize: 13, color: '#333333'}}>
                        {item.label}
                    </Text>
                    <CheckedComponent name={item.label} onPress={onPress ? onPress.bind(this, index) : () => ({})}
                                      checked={item.checked}/>
                </View>
                {
                    item.checked ?
                        <View style={{
                            flex: 1
                        }}>
                            {item.options.map((result,indexResult) => {
                                return(
                                    <View style={{
                                        paddingBottom: 15,
                                        paddingHorizontal :15
                                    }}>
                                        <InputText
                                            style={{
                                                height: 40,
                                                justifyContent: 'center',
                                                width: '100%',
                                                fontSize : 13,
                                            }}
                                            keyboardType={result.keyboardType}
                                            placeholder={`${result.label} ${result.unit ? "(" + result.unit + ")" : ""}`}
                                            onChangeText={(e) => this.onChangeText(e, indexResult)}
                                            value={result.value ? result.value.toString() : ''}
                                            key={indexResult}
                                        />
                                    </View>
                                )
                            })
                            }
                        </View> : null
                }
            </TouchableOpacity>
        )
    }
}
