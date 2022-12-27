import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import CheckBoxCarpon from "./CheckBoxCarpon";
import RadioCarpon from "./RadioCarpon";
import DropdownApi from "./DropdownApi";

export default class AnswerTypeSelectBoxGroup extends Component {

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

    handleSelectItem(value, indexItem) {
        const {item, index} = this.props;
        item.data[indexItem] = value;
        this.props.onChangeData(item, index)
    }


    _renderItem({item, index}) {
        return (
            <DropdownApi item={item} index={index} key={index} onPress={this.handleSelectItem.bind(this)}/>
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
                paddingBottom: 15
            }}>
                <View style={{
                    paddingHorizontal: 15, flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View style={{flex: 1}}>
                        <FlatList
                            data={item.data}
                            renderItem={this._renderItem.bind(this)}
                            onEndReachedThreshold={0.8}
                        />
                    </View>
                    <View style={{paddingLeft: 15, alignItems: 'center', justifyContent: 'center'}}>
                        <CheckedComponent name={item.label} onPress={onPress ? onPress.bind(this, index) : () => ({})}
                                          checked={item.checked}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}