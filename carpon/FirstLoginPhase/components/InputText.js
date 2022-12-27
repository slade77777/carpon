import React, {Component} from 'react';
import {View, StyleSheet, TextInput, Text, Platform} from 'react-native';
import color from '../../../carpon/color';
import Icon from 'react-native-vector-icons/FontAwesome';

export class InputText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({
                value: nextProps.value
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
                        <View style={{height: 14.5, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{
                                color: color.active,
                                fontSize: 12,
                                fontWeight: 'bold'
                            }}>{this.props.title}</Text>
                            <View style={{alignItems: 'center'}}>
                                {this.props.validateMark && <Icon name='check-circle' color='#4B9FA5' size={12}/>}
                            </View>
                        </View>
                        : <View style={{height: 14.5}}/>
                }
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 0.5,
                    borderColor: borderBottomColor,
                }}>
                    <View style={{width: '100%'}}>
                        <TextInput
                            {...this.props}
                            ref={(input) => {
                                this.focusTextInput = input;
                            }}
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
        paddingBottom: 5,
        fontSize: 18,
        backgroundColor: '#FFFFFF',
        color: '#666',
        height: 35,
        marginBottom: 0.5
    }
});
