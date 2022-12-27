import React from 'react';
import {TextInput, StyleSheet, View, TouchableOpacity, Dimensions, Text} from 'react-native';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import color from "../../../color";

const {width} = Dimensions.get('window');


export function TextInputPost(props) {
    return (
        <View style={Styles.body}>
            <View style={Styles.container}>
                <TextInput
                    {...props}
                    multiline={true}
                    scrollEnabled={true}
                    style={{...Styles.inputComment, ...props.style}}
                >
                    <Text>{props.inputText}</Text>
                </TextInput>
                <TouchableOpacity
                    onPress={() => {
                        props.hasComment && props.handleSubmit();
                    }}
                    style={{width: 52, height: 40, justifyContent: 'center'}}
                >
                    <SvgImage
                        source={() => SvgViews.Post({color: props.hasComment ? color.active : '#CCC'})}
                    />
                </TouchableOpacity>
            </View>

        </View>

    )
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    inputComment: {
        borderWidth: 0.5,
        borderColor: '#CCC',
        borderRadius: 5,
        width: width - 72,
        maxHeight: 200,
        minHeight: 45,
        paddingTop: Platform.OS === 'ios' ? 12 : 5,
        paddingBottom: 5,
        paddingHorizontal: 5,
        backgroundColor: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif'
    }
});
