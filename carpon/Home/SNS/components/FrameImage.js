import React, {useState, useEffect} from 'react';
import {View} from "react-native";

export default function FrameImage({width, height, style}) {

    const border = 1;
    const borderColor = '#e5e5e5';

    return (
        <View style={{width: width, height: height, justifyContent: 'space-between', ...style}}>
            <View style={{backgroundColor: borderColor, height: 1, width: width}}/>
            <View style={{backgroundColor: borderColor, height: 1, width: width}}/>
            <View style={{backgroundColor: borderColor, height: 1, width: width}}/>
            <View style={{backgroundColor: borderColor, height: 1, width: width}}/>
            <View style={{
                position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
                width: width
            }}>
                <View style={{width: width*3/8, flexDirection: 'row',}}>
                    <View style={{backgroundColor: borderColor, height: height, width: 1, marginLeft: width/8}}/>
                    <View style={{backgroundColor: borderColor, height: height, width: 1, marginLeft: width/4}}/>
                </View>
                <View style={{width: width*3/8, flexDirection: 'row',}}>
                    <View style={{backgroundColor: borderColor, height: height, width: 1, marginRight: width/4}}/>
                    <View style={{backgroundColor: borderColor, height: height, width: 1, marginRight: width/8}}/>
                </View>
            </View>
        </View>
    )
}
