import {UPDATE_AVATAR} from "../actions/accountAction";

const initialState = {};

export default  function accountReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_AVATAR:
            return {
                ...state
            };
        default :
            return state
    }
}