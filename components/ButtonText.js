import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ButtonCarpon from "./Common/ButtonCarpon";

export default class ButtonText extends Component {

    render() {
        const {style, title, children, ...props} = this.props;
        const styleAction = Object.assign({}, Styles.activeButton, style);
        if (this.props.disabled) {
            return (<View/>)
        } else {
            return (
                <View>
                    <ButtonCarpon {...props} style={styleAction}>
                        {children}
                        <Text style={Styles.activeText}>{title}</Text>
                    </ButtonCarpon>
                </View>
            )
        }
    }
}

const Styles = StyleSheet.create({
    activeButton: {
        height: 45,
        backgroundColor: '#F37B7D',
        display: 'flex',
        justifyContent : 'center',
        alignContent : 'center',
        borderRadius: 5,
    },
    activeText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFFFFF'
    }
});
