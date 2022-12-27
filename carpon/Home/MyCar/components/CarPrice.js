import React, {Component} from 'react';
import {Text} from 'react-native';
import numeral from 'numeral';

export default class CarPrice extends Component{

    render() {

        return (<Text>{this.props.value ? numeral(Math.round(this.props.value / 1000) * 1000).format('0,0') : ''}</Text>);
    }
}
