import React, {Component} from 'react';
import {SvgImage, SvgViews} from "../../Common/SvgImage";
import {TouchableOpacity} from "react-native";
import {navigationService} from "../../../carpon/services";

export default class IconArrowHeader extends Component {

    onPress() {
        if (this.props.pop) {
            navigationService.pop(this.props.pop)
        }
        else {
            navigationService.goBack(null);
        }
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.onPress.bind(this)} style={{
                alignItems: 'flex-start',
                flex: 1,
                justifyContent: 'center',
                paddingLeft: 15
            }}>
                <SvgImage source={SvgViews.ActionBarBack}/>
            </TouchableOpacity>
        )
    }
}