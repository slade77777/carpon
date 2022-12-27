import {
    CHANGE_ABILITY,
    CHANGE_IMAGE_SIZE,
    IMAGE_ACTION,
    PAN_LIMIT,
    PAN_ZOOM_TO,
    SET_SCREEN_SIZE,
    SET_IMAGE_URL, HOVERING_ZOOM_TO
} from "./ImageEditorAction";

export function ImageEditorReducer(state, action) {
    switch (action.type) {
        case CHANGE_IMAGE_SIZE:
            return {
                ...state,
                imageSize: action.imageSize
            };

        case CHANGE_ABILITY:
            return {
                ...state,
                ability: action.ability,
                activatedAbility: !!action.ability
            };

        case SET_SCREEN_SIZE:
            return {
                ...state,
                screenSize: action.screenSize
            };

        case PAN_ZOOM_TO:
            return {
                ...state,
                croppingParam: {
                    scale: action.scale ? action.scale : state.croppingParam.scale,
                    translate: action.translate ? action.translate : state.croppingParam.translate,
                    FrameScale: action.FrameScale ? action.FrameScale : state.croppingParam.FrameScale
                }
            };


        case HOVERING_ZOOM_TO:
            return {
                ...state,
                hoveringParam: {
                    scale: action.scale ? action.scale : state.hoveringParam.scale,
                    translate: action.translate ? action.translate : state.hoveringParam.translate,
                }
            };

        case PAN_LIMIT:
            return {
                ...state,
                limitParam: {
                    ...action.limitParam,
                }
            };

        case IMAGE_ACTION:
            return {
                ...state,
                actionInfo: {
                    ...action.actionInfo
                }
            };

        case SET_IMAGE_URL:
            return {
                ...state,
                imageUrl: action.url
            };

        default:
            return state
    }
}
