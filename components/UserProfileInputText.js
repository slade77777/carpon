import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import color from '../carpon/color';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class UserProfileInputText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || null
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value) {
            this.setState({
                value : nextProps.value
            })
        }
    };

    handleChangeText = (text) => {
        this.setState({value: text});
        this.props.onChangeText(text);
    };

    focus() {
        this.focusTextInput.focus();
    }

    render() {
        const borderBottomColor = this.props.validateMark ? '#4B9FA5' : '#f37b7d';
        return (
            <View>
                {
                    this.state.value ?
                        <View style={{ height: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{ color: color.active, fontSize: 12, fontWeight: 'bold'}}>{this.props.title}</Text>
                            <View style={{ bottom: 3}}>
                                {this.props.validateMark && <Icon name='check-circle' color='#4B9FA5' size={16}/>}
                            </View>
                        </View>
                        : <View style={{ height: 15}}/>
                }
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: this.props.validateMark ? 0.7 : 1,
                    borderColor: borderBottomColor,
                }}>
                    <View style={{ width: this.props.lineNumber = 2 ? '80%' : '100%'}}>
                        <TextInput {...this.props}
                                   ref={(input) => { this.focusTextInput = input; }}
                                   placeholder={this.props.placeholder || this.props.title}
                                   style={[Styles.InputText, this.props.style]}
                                   onChangeText={this.handleChangeText}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    InputText: {
        zIndex: 0,
        fontSize: 14,
        backgroundColor: '#FFFFFF',
        height: 40,
        padding: 0,
    },
    divider: {
        borderWidth: 2,

    }
});
