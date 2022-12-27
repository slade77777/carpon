import React, {Component} from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native'
import Color from "../carpon/color";


export default class HeaderOnlyColor extends Component {

    render() {
        return (
            <SafeAreaView style={{backgroundColor: '#212121'}}>
                <StatusBar
                    backgroundColor={Color.active}
                    barStyle="light-content"
                />
                <View
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: Color.active,
                        padding: 0,
                        height: 60,
                        flexDirection: 'row'
                    }}
                >
                    <View/>
                </View>
            </SafeAreaView>
        )
    }
}
