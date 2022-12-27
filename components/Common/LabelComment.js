import React, {Component} from 'react';
import {Text} from 'react-native';

export default class LabelComment extends Component {


    render() {
        const comment = this.props.comment.length < 20 ? this.props.comment : `${this.props.comment.slice(0, 20)}...`;
        return (
            <Text style={{
                paddingLeft: 55,
                color: '#333333'
                // ...this.props.style
            }}>
                {comment}
            </Text>
        )
    }
}
