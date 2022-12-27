import React, {Component} from 'react';
import {Text} from 'react-native';

export default class LabelTitleNews extends Component {


    render() {
        const title = this.props.title;
        const style = Object.assign({fontSize: 17, fontWeight: 'bold', color: 'black', lineHeight: 20}, this.props.style);
        return (
            <Text style={style} numberOfLines={2}>
                {title}
            </Text>
        )
    }
}
