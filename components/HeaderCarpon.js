import React, {Component} from 'react';
import {Dimensions, Platform, Text, View, SafeAreaView, StatusBar} from 'react-native'
import TitleHeader from "./TitleHeader";


export default class HeaderCarpon extends Component {

    render() {
        const {leftComponent, rightComponent} = this.props;
        return (
            <SafeAreaView style={{backgroundColor: '#212121'}}>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                />
                <View
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#212121',
                        padding: 0,
                        height: 60,
                        flexDirection: 'row'
                    }}
                >
                    <View style={{flex: 1}}>
                        {leftComponent}
                    </View>
                    <View style={{flex: 3}}>
                        {this.renderCenter()}
                    </View>
                    <View style={{flex: 1}}>
                        {rightComponent}
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    renderCenter() {
        const {centerComponent, title} = this.props;
        if (centerComponent) {
            return centerComponent;
        }
        if (title) {
            return (
                <Text style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16
                }}>{this.props.title}</Text>
            )
        }
        return (<TitleHeader/>)
    }
}
