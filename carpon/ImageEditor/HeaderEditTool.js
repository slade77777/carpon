import React from 'react';
import {TouchableOpacity, View, Text} from "react-native";

export function HeaderEditTool({resetAction, changeAbility, centerComponent, saveImage, resetSize}) {

    return (
        <View style={{
            flexDirection: 'row',
            height: 40,
            paddingHorizontal: 15,
            justifyContent: 'space-between',
            paddingTop: 10,
            zIndex: 9
        }}>
            <TouchableOpacity
                style={{width: 80, paddingVertical: 5}}
                onPress={() => {
                resetSize && resetSize();
                resetAction && resetAction();
                changeAbility(null)
            }}>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white'}}>
                    キャンセル
                </Text>
            </TouchableOpacity>
            {centerComponent && centerComponent()}
            <TouchableOpacity
                style={{width: 80,paddingVertical: 5, alignItems: 'flex-end'}}
                onPress={() => {
                saveImage()
            }}>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'white'}}>
                    編集を確定
                </Text>
            </TouchableOpacity>
        </View>

    );
}
