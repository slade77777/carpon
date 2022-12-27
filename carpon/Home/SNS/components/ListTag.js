import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import color from "../../../color";
import {selectTag} from "../container/NewPostForm";

export default class ListTag extends Component {
    render() {
        return (
            <View style={{borderTopWidth: 1, borderColor: '#E5E5E5'}}>
                {
                    this.props.listTag.length > 0 ?
                        this.props.listTag.map((tag, index) => (
                            <TouchableOpacity onPress={() => this.props.selectHashTag(tag)} style={{
                                width: '100%',
                                height : 50,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 15,
                                borderBottomWidth: 1,
                                borderColor: '#E5E5E5'
                            }} key={index}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', height : 50}}>
                                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                                        #{(tag.content.length > 20) ? tag.content.substring(0, 20) + '...' : tag.content}
                                    </Text>
                                    <Text style={{fontSize: 13, color: color.active, marginLeft: 8}}>{tag.total}件</Text>
                                </View>
                                <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                            </TouchableOpacity>
                        )): <View style={{ alignItems: 'center', flexDirection: 'row', height : 50, borderBottomWidth: 1, borderColor: "#E5E5E5"}}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#4B9FA5', marginLeft: 12}}>一致するタグが見つかりません</Text>
                        </View>

                }
            </View>
        )
    }
}
