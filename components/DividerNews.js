import React, {Component} from 'react';
import {View} from 'react-native';

export default class DividerNews extends Component {

    render() {
        const {style, props} = this.props;
        const styleCommon = Object.assign({backgroundColor : '#E5E5E5', height: 10, borderTopWidth : 1, borderTopColor : '#CCCCCC'}, style);
        return (
            <View {...props} style={styleCommon}/>
        )
    }
}
