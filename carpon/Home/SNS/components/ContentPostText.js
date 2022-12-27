import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {isTag, isUser} from "../container/NewPostForm";
import {HashTag} from "./hashTag";
import {UserTag} from "./UserTag";

export default function ContentPostText({content, tags}) {
    const [value, setValue] = useState(content);

    useEffect(() => {
        const newText = content.split(/([#,@]\S+)/);
        setValue(newText)
    }, [content]);

    return (
        <Text style={{fontSize: 17, lineHeight: 23}} textAlign='justify'>
            {
                Array.isArray(value) && value.map((text, index) => {
                    if (isTag(text)) {
                        return <HashTag isDetail={true} key={index} tag={text}/>
                    }
                    if (isUser(text)) {
                        return <UserTag key={index} tags={tags} userTag={text}/>
                    }
                    return (
                        <Text style={{color: '#333'}}>{text}</Text>
                    )
                })
            }
        </Text>
    )
}
