import React, {Component} from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';

export default class InputText extends Component {

    state = {
        show: false
    };

    setFocus(status) {
        this.props.onTouch && this.props.onTouch();
        this.props.onFocus && this.props.onFocus();
        this.setState({show: status})
    }

    focus() {
        this.focusTextInput.focus();
    }

    render() {
        const borderBottomWidth = this.props.borderBottomWidth ? this.props.borderBottomWidth : 0.5;
        const compare = (this.state.show || this.props.value);
        const borderBottomColor = compare ? '#4B9FA5' : '#CCCCCC';
        const placeholder = compare ? '' : (this.props.placeholder || this.props.title);
        const height = (compare && this.props.multiline) ? {height: 120} : {};
        return (
            <View >
                <View style={{height: 14, marginBottom: -3, zIndex: 1}}>
                    {
                        compare ?
                            <Text style={{color: '#4B9FA5', fontSize: 12, fontWeight: 'bold'}}>{this.props.title || this.props.placeholder}</Text>
                            : null
                    }
                </View>
                <View style={{ marginTop: this.props.multiline ? 10 : 0}}>
                    <TextInput
                        {...this.props}
                        ref={(input) => { this.focusTextInput = input; }}
                        placeholder={placeholder}
                        placeholderTextColor={'#CCCCCC'}
                        style={{...Styles.InputText, ...this.props.style, borderBottomColor, borderBottomWidth, ...height}}
                        onFocus={this.setFocus.bind(this, true)}
                        onBlur={this.setFocus.bind(this, false)}
                    />
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    InputText: {
        zIndex: 0,
        fontSize: 18,
        backgroundColor: '#FFFFFF',
        height: 40,
        padding: 0,
        color: '#666666',
    }
});
