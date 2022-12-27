import React, {Component} from 'react';
import {View} from 'react-native';

export default class Divider extends Component {
    render() {
        const {style, ...props} = this.props;
        return (
            <View style={[{backgroundColor : '#E5E5E5', height : 2, width : '100%'}, style]} {...props}/>
        )
    }
}