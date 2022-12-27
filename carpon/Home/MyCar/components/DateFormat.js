import React, {Component} from 'react';
import {Text, View} from "react-native";

export default class DateFormat extends Component {

    render() {
        const {date} = this.props;
        return(
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 23, color: '#333333'}}>{date.slice(0, 4)}</Text>
                <Text style={{fontSize: 14, color: '#333333', marginTop: 11}}>{date.slice(4, 5)}</Text>
                <Text style={{fontSize: 23, color: '#333333'}}>{parseInt(date.slice(5, 7))}</Text>
                <Text style={{fontSize: 14, color: '#333333', marginTop: 11}}>{date.slice(7, 8)}</Text>
                <Text style={{fontSize: 23, color: '#333333'}}>{parseInt(date.slice(8, 10))}</Text>
                <Text style={{fontSize: 14, color: '#333333', marginTop: 11}}>{date.slice(10, 11)}</Text>
            </View>
        )
    }
}
