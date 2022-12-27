import {View, Image} from "react-native";
import React, {Component} from 'react';
import color from "../color";
import {images} from "../../assets";

export class BackgroundLogo extends Component {
    render() {
        return (
            <View style={{width: '100%', height: '100%', backgroundColor: color.active, justifyContent: 'center'}}>
                <Image source={images.backgroundLogo} style={{width: '100%'}}/>
            </View>
        )
    }
}
