import React, {PureComponent} from 'react';
import {StyleSheet, Text} from 'react-native';

export default class TextButtonCarpon extends PureComponent {

    render() {
        const {style, children, ...props} = this.props;
        return (
            <Text {...props} style={{...Styles.text, ...style}}>
                {children}
            </Text>
        )
    }
}

const Styles = StyleSheet.create({
    text: {
        color : 'white',
        fontSize : 17
    }
});
