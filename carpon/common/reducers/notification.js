import {READ_NOTIFICATION, GET_NOTIFICATION, READ_ALL_NOTIFICATION, TURN_OFF_REFRESH} from "../actions/notification";
import * as lodash from "lodash";

const initialState = {
    mail: [],
    unreadNumber: 0,
    refresh: false
};

export default function loadingReducer(state = initialState, action) {
    switch (action.type) {
        case GET_NOTIFICATION:
            return {
                ...state,
                unreadNumber: action.unreadNumber
            };

        case READ_NOTIFICATION:
            return {
                ...state,
                mail: [...lodash.filter(state.mail, mail => action.mail.id !== mail.id), action.mail]
            };

        case READ_ALL_NOTIFICATION:
            return {
                ...state,
                unreadNumber: 0,
                refresh: true
            };

        case TURN_OFF_REFRESH:
            return {
                ...state,
                refresh: false
            };

        default:
            return state
    }
}
