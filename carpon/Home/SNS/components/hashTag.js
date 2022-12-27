import React from 'react';
import {Text} from "react-native";
import {navigationService} from "../../../services";
import color from "../../../color";
import {useSNSContext} from "../SNSContext";
import store from "../../../store";

export const HashTag = ({isDetail, tag}) => {
    const [, {focusTab, setTagKeyword}] = useSNSContext();
    return (
        <Text
            onPress={() => {
                focusTab(2);
                setTagKeyword(tag.replace('#', ''));
                store.dispatch({type: 'CHANGE_SCREEN_NUMBER', number: 2, keyword: tag.replace('#', '')});
                isDetail && navigationService.popToTop();
            }}
            style={{paddingHorizontal: 5}}
        >
            <Text
                style={{
                    textAlignVertical: 'center',
                    color: color.active,
                    fontSize: 17,
                    top: Platform.OS === 'ios' ? 1 : 4,
                    lineHeight : 23,
                    fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif'
                }}>{tag}</Text>
        </Text>

    )
};
