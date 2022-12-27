import {
    POST_UN_FOLLOW, POST_FOLLOW, LOAD_FOLLOWING, LOAD_FOLLOWER, LOAD_MY_FOLLOWING, LOAD_FOLLOWER_BY_ID,
    POST_FOLLOW_$PROGRESS, POST_UN_FOLLOW_$PROGRESS
} from "../actions/followAction";
import lodash from 'lodash';

const initialState = {
    following: [],
};
export default function followReducer(state = initialState, action) {

    switch (action.type) {
        case LOAD_MY_FOLLOWING:
            return {
                ...state,
                following: [...action.followings],
            };
            case LOAD_FOLLOWING:
            return {
                ...state,
                followingById: [...action.followings],
            };
        case POST_FOLLOW:
            return {
                ...state,
                following: [...state.following, action.profile],
                followReady: true
            };
        case POST_FOLLOW_$PROGRESS:
            return {
                ...state,
                followReady: false
            };
        case POST_UN_FOLLOW:
            return {
                ...state,
                followReady: true,
                following: [...lodash.filter(state.following, followingProfile => action.profile.id !== followingProfile.id)]
            };
        case POST_UN_FOLLOW_$PROGRESS:
            return {
                ...state,
                followReady: false
            };
        case LOAD_FOLLOWER:
            return{
                ...state,
                followers: [...action.followers],
            };
        case LOAD_FOLLOWER_BY_ID:
            return{
                ...state,
                followersById: [...action.followers],
            };
        default :
            return state
    }
}
