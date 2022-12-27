import React, {useEffect, useState} from 'react';
import {Image, Animated, Dimensions} from "react-native";
import {imageFocalPointEditorAction} from "../imageFocalPointEditorAction";
import {CalculateLimit, transitionChecker} from "../../../ImageEditor/CalculateImageSize";

const {width} = Dimensions.get('window');

export default function ImageConsumer({imageUrl}) {

    const [state, {panLimit}] = imageFocalPointEditorAction();
    const [imageSize, setImageSize] = useState({width: 1, height: 1});
    const animatedScale = new Animated.Value(state.scale);
    let frameSize = {width: width-30, height: (width-30)*2/3};
    console.log(state);

    useEffect(() => {
        Image.getSize(imageUrl, (Width, Height) => {
            setImageSize({width: Width, height: Height});
            console.log(handleImageSize({width: Width, height: Height}), frameSize);
            panLimit({
                limit: CalculateLimit(handleImageSize({width: Width, height: Height}), frameSize, state.scale),
                translation: transitionChecker(handleImageSize({width: Width, height: Height}), frameSize, state.scale)
            });
        });

    }, []);

    function handleImageSize(imageSize) {
        if(imageSize.height < imageSize.width) {
            return {width: imageSize.width * ((width-30)*2/3)/ imageSize.height, height: (width-30)*2/3}
        }else {
            return {width: width-30, height: imageSize.height * (width-30)/ imageSize.width}
        }
    }

    return (
        <Animated.View
            style={[
                {
                    transform: [
                        {translateX: state.translation.translateX}, {translateY: state.translation.translateY},
                        {scale: animatedScale},
                    ]
                }]}
        >
            <Image source={{uri: imageUrl}} style={{resizeMode: 'cover', ...handleImageSize(imageSize)}}/>
        </Animated.View>
    )

}
