import React, {useReducer, useEffect} from 'react';
import {View, Dimensions} from "react-native";
import {ImageFocalPointEditorReduce} from "../imageFocalPointEditorReduce";
import {ImageController} from "./ImageController";
import ImageConsumer from "./ImageConsumer";
import FrameImage from "./FrameImage";

const {width} = Dimensions.get('window');


export const EditorContext = React.createContext({
    activatedAbility: null
});

const defaultEditorState = {
    scale: 1,
    translation: {
        translateX: 0,
        translateY: 0
    },
    limitParam: {
        limit: 0,
        translation: null
    },
};

export default function FocalPointEditor({imageUrl}) {

    const [state, dispatch] = useReducer(ImageFocalPointEditorReduce, defaultEditorState);

    return (
        <EditorContext.Provider value={[state, dispatch]}>
            <View>
                <ImageConsumer imageUrl={imageUrl}/>
                <FrameImage height={(width-30)*2/3} width={width - 30} style={{opacity: 0.5, zIndex: 2, position: 'absolute'}}/>
                <ImageController>
                    <View style={{
                        width: width-30,
                        height: (width-30)*2/3,
                        zIndex: 2,
                        position: 'absolute'
                    }}/>
                </ImageController>
            </View>
        </EditorContext.Provider>
    )
}

