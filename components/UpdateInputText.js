import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import color from '../carpon/color';

export default class UpdateInputText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || props.defaultValue
        }
    }
    handleChangeText = (text) => {
        this.setState({value: text});
        this.props.onChangeText(text);
    };

    focus() {
        this.focusTextInput.focus();
    }

    render() {
        const borderBottomColor = !!this.state.value ? '#4B9FA5' : '#CCCCCC';
        return (
            <View>
                {
                    this.state.value ?
                        <View style={{ height: 14}}>
                            <Text style={{ color: color.active, fontSize: 12, fontWeight: 'bold'}}>{this.props.title}</Text>
                        </View>
                        : <View style={{ height: 14}}/>
                }
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 0.5,
                    borderColor: borderBottomColor
                }}>
                    <View style={{ width: this.props.lineNumber = 2 ? '80%' : '90%'}}>
                        <TextInput {...this.props}
                                   ref={(input) => { this.focusTextInput = input; }}
                                   placeholder={this.props.placeholder || this.props.title}
                                   style={[Styles.InputText, this.props.style, { fontSize: 18 }]}
                                   onChangeText={this.handleChangeText}
                        />
                    </View>
                    <View style={{alignItems:'center', marginTop: 15, width: 30}}>
                        {this.props.validationIcon}
                    </View>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    InputText: {
        zIndex: 0,
        fontSize: 20,
        backgroundColor: '#FFFFFF',
        height: 40,
        padding: 0,
        color: '#666666',
    },
    divider: {
        borderWidth: 2,

    }
});
