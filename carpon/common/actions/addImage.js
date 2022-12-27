import {ADD_IMAGE} from "../../FirstLoginPhase/actions/registration";

export function addImage(image) {
    return {
        type: ADD_IMAGE,
        image
    }
}