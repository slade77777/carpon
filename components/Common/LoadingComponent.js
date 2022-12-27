import React, {Component} from 'react';
import {ActivityIndicator, View} from 'react-native';
import color from "../../carpon/color";

export default class LoadingComponent extends Component {
    render() {
        const size = this.props.size ? this.props.size : {w: 30, h: 30};
        const loadingSize = this.props.loadingSize ? this.props.loadingSize: 'small';
        return (
            <View style={{
                zIndex: 20,
                borderRadius: 3,
                position : 'absolute',
                width : size.w,
                height : size.h,
                backgroundColor : this.props.backgroundColor || color.backgroundLoading,
                opacity : this.props.opacity || 0.5,
                justifyContent : 'center',
                alignItems : 'center',
                ...this.props.style
            }}>
                <ActivityIndicator size={loadingSize} color={color.loadingColor}/>
            </View>
        )
    }
}
