import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import color from "../../../color";
import {isTag, isUser} from "../container/NewPostForm";
import ViewMoreText from 'react-native-view-more-text';
import {HashTag} from "./hashTag";
import {UserTag} from "./UserTag";

export default function ContentInPostList({content, tags, onShowMore = () => {}}) {
    const texts = content.split(/([#,@]\S+)/);

    return (
        <ViewMoreText
            numberOfLines={6}
            renderViewMore={
                () => {
                    return (
                        <TouchableOpacity
                            style={{paddingVertical: 10}}
                            onPress={() => onShowMore()}>
                            <Text
                                style={{color: color.active}}>
                                続きを見る
                            </Text>
                        </TouchableOpacity>
                    )
                }
            }

        >
            <Text style={{fontSize: 17, lineHeight: 23}}
                  textAlign='justify'>
                {
                    texts.map((text, index) => {

                        if (isTag(text)) {
                            return <HashTag key={index} tag={text}/>
                        }

                        if (isUser(text)) {
                            return <UserTag key={index} tags={tags} userTag={text}/>
                        }

                        return (
                            <Text style={{color: '#333'}} key={index}>{text}</Text>
                        )
                    })
                }
            </Text>
        </ViewMoreText>
    )
}
