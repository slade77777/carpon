import {View} from "react-native";
import React, {Component} from "react";
import {SvgImage, SvgViews} from "./SvgImage";

export class Logo extends Component{
    render() {
        return(
            <View style={{flexDirection: 'column', height:'100%', marginRight: 15, marginLeft: 15, justifyContent: 'center', alignItems: 'center'}}>
                <View>
                    <SvgImage source={SvgViews.CarponSplashLogo} style={{ flex: 0 ,width: 260, height: 71}} />
                </View>
            </View>
        )
    }
}