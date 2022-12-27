import React, {Component} from 'react';
import {View, StyleSheet, TextInput, Text, TouchableOpacity} from 'react-native';
import color from '../../carpon/color';

export class InputTextSpecial extends Component {

    handleChangeText = (text) => {
        this.props.onChangeText(text);
    };

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    this.focusTextInput.focus();
                    this.props.onFocus();

                }}>
                <View style={{height: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: color.active, fontSize: 12, fontWeight: 'bold'}}>{this.props.title}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                    paddingVertical: 5,
                    borderColor: this.props.value ? color.active : '#999'
                }}
                >
                    <TextInput
                        {...this.props}
                        ref={(input) => {
                            this.focusTextInput = input;
                        }}
                        placeholder={this.props.placeholder}
                        style={{
                            backgroundColor: '#FFFFFF',
                            color: '#999',
                            marginBottom: 0.5,
                            fontSize: 18,
                            paddingVertical: 5
                        }}
                        onChangeText={this.handleChangeText}
                    />
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#999', fontSize: 18}}> {this.props.unit}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
