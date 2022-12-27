import React , {Component} from 'react';
import {Text, TouchableOpacity} from "react-native";
import {SvgImage, SvgViews} from "../Common/SvgImage";

export default class LabelFurtherDisplay extends Component {
    render() {
        return (
            <TouchableOpacity activeOpacity={1}
                onPress={this.props.onPress.bind(this)}
                style={{
                    flexDirection: 'row',
                    alignItems : 'center',
                    justifyContent : 'center',
                    paddingVertical: 20,
                    borderBottomWidth: 0.5,
                    borderColor: '#E5E5E5',
                    backgroundColor: '#F8F8F8'
                }}>
                <Text style={{fontSize: 12}}>さらに表示 </Text>
                <SvgImage source={SvgViews.IconArrowBelow} style={{width: 14, height: 10}}/>
            </TouchableOpacity>
        )
    }
}
