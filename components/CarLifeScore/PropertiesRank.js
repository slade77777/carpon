import React, {Component} from 'react';
import {View, Text} from 'react-native';


export default class PropertiesRank extends Component {

    render() {
        return (
            <View style={{
                borderColor: '#EBEBEB',
                borderWidth: 1,
                height: 45,
                justifyContent: 'center',
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15
                }}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}