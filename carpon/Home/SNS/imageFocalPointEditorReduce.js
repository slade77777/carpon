import {PAN_ZOOM_TO, PAN_LIMIT} from "./imageFocalPointEditorAction";

export function ImageFocalPointEditorReduce(state, action) {
    switch (action.type) {
        case PAN_ZOOM_TO:
            console.log(action);
            return {
                ...state,
                translation: {
                    ...action.translation
                },
                scale: action.scale
            };
        case PAN_LIMIT:
            return {
                ...state,
                limitParam: {
                    ...action.limitParam,
                }
            };
        default:
            return state
    }
}
