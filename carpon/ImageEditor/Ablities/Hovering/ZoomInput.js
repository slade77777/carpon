import React, {useState} from 'react';
import {PanGestureHandler, PinchGestureHandler, State} from "react-native-gesture-handler";
import {imageEditorAction} from "../../ImageEditorAction";
import {CalculateLimit} from "../../CalculateImageSize";

const ZoomMin = 1;
const ZoomMax = 3;

export default function ZoomInput({children}) {

    const [{hoveringParam, imageSize}, {hoveringZoomTo}] = imageEditorAction();
    const [lastEditorState, setLastEditorState] = useState(hoveringParam);
    const limitPosition = CalculateLimit(imageSize, imageSize, hoveringParam.scale);

    function PanLimit(translation, value) {
        if (translation > 0) {
            return translation > value ? value : translation
        } else {
            return translation < -value ? -value : translation
        }
    }

    function limitChecker(translationX, translationY) {
        return {
            x: PanLimit(translationX * hoveringParam.scale + lastEditorState.translate.x, limitPosition.width),
            y: PanLimit(translationY * hoveringParam.scale + lastEditorState.translate.y, limitPosition.height)
        };

    }

    const handlePanZoom = ({nativeEvent: {translationX, translationY}}) => {
        hoveringZoomTo(
            limitChecker(translationX, translationY),
            hoveringParam.scale
        );
    };

    const syncWithLatestState = ({nativeEvent: {state}}) => {
        if (state === State.END) {
            setLastEditorState(hoveringParam);
        }
    };

    /**
     * @return {number}
     */
    function ZoomLimit(pinchScale) {
        if(pinchScale * lastEditorState.scale < ZoomMin){
            return ZoomMin
        }else if(pinchScale * lastEditorState.scale > ZoomMax) {
            return ZoomMax
        }else {
            return pinchScale * lastEditorState.scale
        }
    }

    return (
        <PinchGestureHandler
            onGestureEvent={({nativeEvent: {scale: pinchScale}}) => {
                hoveringZoomTo(lastEditorState.translate, ZoomLimit(pinchScale))
            }}
            onHandlerStateChange={({nativeEvent: {state}}) => {
                if (state === State.END) {
                    setLastEditorState(hoveringParam);
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
