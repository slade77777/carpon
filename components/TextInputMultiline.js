import React, { PureComponent } from 'react';
import {StyleSheet, TextInput} from 'react-native';

export default class TextInputMultiline extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({value: nextProps.value})
        }
    }

    handleChangeText = (text) => {
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
        this.setState({
            value: text
        })
    };

    render() {
        const { style, ...props } = this.props;
        return (
            <TextInput {...props} value={this.state.value} multiline style={{...Styles.initHeightInput, ...style}}
                onChangeText={this.handleChangeText}>
            </TextInput>
        )
    }
}

const Styles = StyleSheet.create({
    initHeightInput: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
        height: '100%',
        width: '100%',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#CCCCCC'
    }
});
