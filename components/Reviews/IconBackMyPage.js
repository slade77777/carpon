import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {navigationService} from "../../carpon/services";
import {SvgImage, SvgViews} from "../Common/SvgImage";

export default class IconBackMyPage extends Component {

    onPress() {
        setTimeout(() => navigationService.goBack(null), 100)
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.onPress()}>
                <View style={{
                    opacity: 0.5,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: '#262525',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <SvgImage source={SvgViews.Remove}/>
                </View>
            </TouchableOpacity>
        )
    }
}