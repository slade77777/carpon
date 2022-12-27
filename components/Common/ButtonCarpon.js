import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, ActivityIndicator, View} from 'react-native';

export default class ButtonCarpon extends PureComponent {

    render() {
        const {style, children, loading, disabled, opacity, ...props} = this.props;
        return (
            <TouchableOpacity {...props} style={{...Styles.button, ...style, opacity : opacity || (disabled ? 0.5 : 1)}} disabled={disabled || loading}>
                {loading ?
                    <View style={{paddingRight: 10}}>
                        <ActivityIndicator size="small" color="#FFFFFF"/>
                    </View> : null}
                {children}
            </TouchableOpacity>
        )
    }
}

const Styles = StyleSheet.create({
    button: {
        height: 40,
        width : '100%',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
});
