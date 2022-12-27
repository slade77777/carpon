import React, {useState, useEffect} from 'react';
import {PanGestureHandler, PinchGestureHandler, State} from "react-native-gesture-handler";
import {imageEditorAction} from "../../ImageEditorAction";

export default function PanZoomInput({children}) {

    const [{croppingParam, limitParam, actionInfo}, {panZoomTo, handleImageAction}] = imageEditorAction();
    const [lastEditorState, setLastEditorState] = useState(croppingParam);

    useEffect(() => {
        setLastEditorState(croppingParam);
    }, [actionInfo]);

    function PanLimit(translation, value) {
        if (translation > 0) {
            return translation > value ? value : translation
        } else {
            return translation < -value ? -value : translation
        }
    }

    function limitChecker(translationX, translationY) {
        switch (limitParam.translation) {
            case 'x' :
                return {
                    x: PanLimit(translationX + lastEditorState.translate.x, limitParam.limit.width),
                    y: 0
                };
            case 'y':
                return {
                    y: PanLimit(translationY + lastEditorState.translate.y, limitParam.limit.height),
                    x: 0
                };
            case 'xy':
                return {
                    x: PanLimit(translationX + lastEditorState.translate.x, limitParam.limit.width),
                    y: PanLimit(translationY + lastEditorState.translate.y, limitParam.limit.height)
                };

            default :
                return {
                    x: 0,
                    y: 0
                }
        }

    }

    const handlePanZoom = ({nativeEvent: {translationX, translationY}}) => {
        panZoomTo(
            limitChecker(translationX, translationY),
            croppingParam.scale
        );
    };

    const syncWithLatestState = ({nativeEvent: {state}}) => {
        if (state === State.END) {
            setLastEditorState(croppingParam);
        }
    };

    return (
        <PinchGestureHandler
            onGestureEvent={({nativeEvent: {scale: pinchScale}}) => {
                panZoomTo(lastEditorState.translate, (pinchScale * lastEditorState.scale > croppingParam.FrameScale ? pinchScale * lastEditorState.scale : croppingParam.FrameScale))
            }}
            onHandlerStateChange={({nativeEvent: {state}}) => {
                let ActionInfo = {
                    ...actionInfo,
                    panInput: true,
                    imageScale: croppingParam.scale
                };
                if (state === State.END) {
                    setLastEditorState(croppingParam);
                    handleImageAction(ActionInfo);
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
