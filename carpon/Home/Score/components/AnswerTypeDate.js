import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View, TextInput} from "react-native";
import RadioCarpon from "./RadioCarpon";
import CheckBoxCarpon from "./CheckBoxCarpon";
import DateTimePicker from "react-native-modal-datetime-picker";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import moment from "moment";

export default class AnswerTypeDate extends Component {

    state = {
        isDateTimePickerVisible: false,
        typeChecked: {
            CheckBox: CheckBoxCarpon,
            Radio: RadioCarpon,
        }
    };

    handleCheckType(type) {
        return (Object.keys(this.state.typeChecked).includes(type)) ? type : 'CheckBox'
    };

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        let {item, index} = this.props;
        item.value = moment(date).format();
        this.props.onChangeData(item, index);
        this._hideDateTimePicker();
    };


    render() {
        const {item, index, onPress, type, hiddenChecked} = this.props;
        const typeChecked = type ? this.handleCheckType(type) : 'CheckBox';
        const CheckedComponent = this.state.typeChecked[typeChecked];
        return (
            <View key={index} style={{
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
                        flex : 1
                    }}>
                        <TouchableOpacity
                            onPress={() => this._showDateTimePicker()}
                            style={{
                                borderBottomWidth: 1,
                                borderColor: item.value ? '#4B9FA5' : '#999',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}
                        >

                            <View style={{flexDirection: 'column', height: 60, justifyContent: 'flex-end'}}>
                                <Text style={{
                                    color: '#4B9FA5',
                                    fontSize: item.value ? 11 : 13,
                                    marginVertical: item.value ? 0 : 5,
                                    fontWeight: 'bold'
                                }}>
                                    {item.label}
                                </Text>
                                {
                                    item.value ?
                                        <Text style={{color: 'black', fontSize: 18, paddingVertical: 10}}>
                                            {moment(item.value).format('YYYY年M月D日')}
                                        </Text>
                                        : null
                                }
                            </View>
                            <View style={{padding: 15}}>
                                <SvgImage source={SvgViews.IcDown}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        confirmTextIOS={'設定'}
                        cancelTextIOS={'キャンセル'}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        headerTextIOS={'期限'}
                        date={item.value ? new Date(item.value) : new Date()}
                    />
                    {!hiddenChecked &&
                    <CheckedComponent name={item.label} onPress={onPress ? onPress.bind(this, index) : () => ({})}
                                      checked={item.checked}/>}
                </View>
            </View>
        )
    }
}
