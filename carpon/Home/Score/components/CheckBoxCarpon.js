import React, {PureComponent} from "react";
import {TouchableOpacity} from "react-native";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";

export default class CheckBoxCarpon extends PureComponent {

    render() {
        const backgroundColor = this.props.checked ? '#4B9FA5' : '#EFEFEF';
        return (
            <TouchableOpacity activeOpacity={1}
                style={{
                    width: 18,
                    height: 18,
                    backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2
                }}>
                <SvgImage
                    source={SvgViews.IconDoneWhite}/>
            </TouchableOpacity>
        )
    }
}
