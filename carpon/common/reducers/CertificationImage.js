import {ADD_IMAGE} from "../../FirstLoginPhase/actions/registration";

const defaultMetadata = {
    branches: [],
    ready: true
};

export default (state = defaultMetadata, action) => {

    if (action.type === ADD_IMAGE); {
        return {
            ...action.image,
        }
    }

    return state;
};
