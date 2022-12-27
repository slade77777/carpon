import React, {useContext, useCallback} from 'react';
import {EditorContext} from "./Editor";

export const CHANGE_IMAGE_SIZE = 'CHANGE_IMAGE_SIZE';
export const CHANGE_ABILITY = 'CHANGE_ABILITY';
export const SET_SCREEN_SIZE = 'SET_SCREEN_SIZE';
export const PAN_ZOOM_TO = 'PAN_ZOOM_TO';
export const PAN_LIMIT = 'PAN_LIMIT';
export const IMAGE_ACTION = 'IMAGE_ACTION';
export const SET_IMAGE_URL = 'SET_IMAGE_URL';
export const HOVERING_ZOOM_TO = 'HOVERING_ZOOM_TO';

export function imageEditorAction() {

    const [state, dispatch] = useContext(EditorContext);

    const changeImageSize = useCallback((imageSize) => {
        dispatch({
            type: CHANGE_IMAGE_SIZE,
            imageSize
        });
    },[dispatch]);

    const changeAbility = useCallback((ability) => {
        dispatch({
            type: CHANGE_ABILITY,
            ability
        })
    }, [dispatch]);

    const setScreenSize = useCallback((screenSize)=> {
        dispatch({
            type: SET_SCREEN_SIZE,
            screenSize
        })
    }, [dispatch]);

    const panZoomTo = useCallback((translate, scale, FrameScale) => {
        dispatch({
            type: PAN_ZOOM_TO,
            translate,
            scale,
            FrameScale
        })
    });

    const panLimit = useCallback((limitParam) => {
        dispatch({
            type: PAN_LIMIT,
            limitParam
        })
    });

    const handleImageAction = useCallback((actionInfo) => {
        dispatch({
            type: IMAGE_ACTION,
            actionInfo
        })
    });

    const setImageUri = useCallback(
        (url) => {
            dispatch({
                type: SET_IMAGE_URL,
                url
            })
        }
    );

    const hoveringZoomTo = useCallback((translate, scale) => {
        dispatch({
            type: HOVERING_ZOOM_TO,
            translate,
            scale,
        })
    });

    return [
        state, {hoveringZoomTo, changeImageSize, changeAbility, setScreenSize, panZoomTo, panLimit, handleImageAction, setImageUri}
    ]
}
