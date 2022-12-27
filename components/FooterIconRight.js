import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from "react-native";
import {SvgImage, SvgViews} from "./Common/SvgImage";

export default class FooterIconRight extends Component {

    render() {
        const iconColor = {color: '#CCC'};
        return (
            <TouchableOpacity activeOpacity={1} style={Styles.footer} onPress={this.props.onPress}>
                <View style={{transform: [{ rotate: '30deg'}], margin: 10}}>
                    <SvgImage
                        source={() => SvgViews.Clip(iconColor)}
                    />
                </View>
                <Text style={Styles.text}>コメントする</Text>
            </TouchableOpacity>
        )
    }
}


const Styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        color: '#333333',
        fontSize: 13,
        textAlign: 'center'
    },
    footer : {
        borderTopColor: '#CCC',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderBottomColor: '#DDD',
        height: 50,
        backgroundColor: '#fff',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
