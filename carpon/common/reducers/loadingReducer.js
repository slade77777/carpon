import { HIDE_LOADING, SHOW_LOADING } from "../actions/LoadingAction";

const initialState = false;

export default function loadingReducer(state = initialState, action) {
    switch (action.type) {
        case HIDE_LOADING:
            return false;
        case SHOW_LOADING:
            return true;
        default:
            return state
    }
}
