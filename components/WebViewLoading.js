import React, {Component} from 'react';
import {View, ActivityIndicator, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class WebViewLoading extends Component {
    render() {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: width - (this.props.widthSpace || 0),
                height: height - (this.props.space || 100),
                backgroundColor: '#FFFFFF'
            }}>
                <ActivityIndicator animating size="large"/>
            </View>
        )
    }
}
