import React, {Component} from 'react';
import {Platform, Text} from 'react-native';

export default class JapaneseText extends Component {

    render() {
        const {style, value, ...props} = this.props;
        const styleAction = {...style, fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif'};
        return (
                <Text {...props} style={styleAction}>
                    {value}
                </Text>
        )
    }
}

