import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import color from "../../../color";

export default class ListUser extends Component {

    render() {
        return (
            <View style={{borderTopWidth: 1, borderColor: '#E5E5E5'}}>
                {
                    this.props.listUser.map((user, index) => (
                        <TouchableOpacity onPress={() => this.props.selectUserTag(user)} style={{
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
                                <Image source={{uri: user.avatar}} style={{width: 30, height: 30, borderRadius: 15}}/>
                                <Text style={{fontSize: 14, fontWeight: 'bold', marginLeft: 15}}>{user.nickName || user.lastName + user.firstName}</Text>
                            </View>
                            <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    }
}
