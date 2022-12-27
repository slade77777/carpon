import React, {useContext, useCallback} from 'react';
import {EditorContext} from "./components/FocalPointEditor";

export const PAN_ZOOM_TO = 'PAN_ZOOM_TO';
export const PAN_LIMIT = 'PAN_LIMIT';

export function imageFocalPointEditorAction() {

    const [state, dispatch] = useContext(EditorContext);

    const panZoomTo = useCallback((translation, scale) => {
        dispatch({
            type: PAN_ZOOM_TO,
            translation,
            scale
        })
    });

    const panLimit = useCallback((limitParam) => {
        dispatch({
            type: PAN_LIMIT,
            limitParam
        })
    });

    return [
        state, {panZoomTo, panLimit}
    ]
}
