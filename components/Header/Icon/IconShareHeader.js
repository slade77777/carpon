import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import Share from "react-native-share";
import {SvgImage, SvgViews} from "../../Common/SvgImage";

export default class IconShareHeader extends Component {
    render() {
        let shareOptions = {
            title: 'share new detail',
            url: this.props.link,
            subject: 'carpon'
        };
        return (
            <View style={{
                flexDirection: 'row',
                paddingRight: 15,
                justifyContent: 'flex-end',
                flex: 1,
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => Share.open(shareOptions)}
                                  style={{paddingLeft: 10}}>
                    <SvgImage
                        source={SvgViews.Share}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}
