import React from 'react';
import {TouchableOpacity, Text} from "react-native";
import {navigationService} from "../../../services";
import color from "../../../color";

export const UserTag = ({userTag, tags}) => {

    const user = tags.find(tag => tag.type === 'user' && tag.content === userTag.replace('@', ''));
    return (
        <Text
            onPress={() => {
                user && navigationService.navigate('MyPageScreen', {profile_id: user.tagUserId})
            }}
            style={{justifyContent: 'flex-end', alignItems: 'center'}}
        >
            <Text style={{
                textAlignVertical: 'center',
                color: color.active,
                fontSize: 17,
                top: Platform.OS === 'ios' ? 1 : 4,
                lineHeight: 18.5,
                fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif'
            }}
            >{userTag}</Text>
        </Text>

    )
};
