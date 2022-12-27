import React, {useState, useEffect} from 'react';
import {PanGestureHandler, PinchGestureHandler, State} from "react-native-gesture-handler";
import {imageFocalPointEditorAction} from "../imageFocalPointEditorAction";

export function ImageController({children}) {

    const [imageState, {panZoomTo}] = imageFocalPointEditorAction();
    const [lastEditorState, setLastEditorState] = useState(imageState);

    const handlePanZoom = ({nativeEvent: {translationX, translationY}}) => {
        panZoomTo(
            limitChecker(translationX, translationY),
            imageState.scale
        );
    };

    function PanLimit(translation, value) {
        if (translation > 0) {
            return translation > value ? value : translation
        } else {
            return translation < -value ? -value : translation
        }
    }

    function limitChecker(translationX, translationY) {
        switch (imageState.limitParam.translation) {
            case 'x' :
                return {
                    translateX: PanLimit(translationX + lastEditorState.translation.translateX, imageState.limitParam.limit.width),
                    translateY: 0
                };
            case 'y':
                return {
                    translateY: PanLimit(translationY + lastEditorState.translation.translateY, imageState.limitParam.limit.height),
                    translateX: 0
                };
            case 'xy':
                return {
                    translateX: PanLimit(translationX + lastEditorState.translation.translateX, imageState.limitParam.limit.width),
                    translateY: PanLimit(translationY + lastEditorState.translation.translateY, imageState.limitParam.limit.height)
                };

            default :
                return {
                    translateX: 0,
                    translateY: 0
                }
        }

    }

    const syncWithLatestState = ({nativeEvent: {state}}) => {
        if (state === State.END) {
            setLastEditorState(imageState);
        }
    };

    return (
        <PinchGestureHandler
            onGestureEvent={({nativeEvent: {scale: pinchScale}}) => {
                panZoomTo(lastEditorState.translation, (pinchScale * lastEditorState.scale))
            }}
            onHandlerStateChange={({nativeEvent: {state}}) => {
                if (state === State.END) {
                    setLastEditorState(imageState);
                }
            }}
        >
            <PanGestureHandler
                onGestureEvent={handlePanZoom}
                onHandlerStateChange={syncWithLatestState}
            >
                {children}
            </PanGestureHandler>
        </PinchGestureHandler>
        )

}
