import {UPDATE_AVATAR, GET_USER_PROFILE} from "../actions/accountAction";
import {userProfileService} from "../../services/index";

const accountMiddleware = store => next => action => {
    switch (action.type) {
        case GET_USER_PROFILE:
            return userProfileService.getUserProfile().then(response => {
                store.dispatch({
                    type: 'LOAD_SCORE_HISTORY'
                });
                return next({
                    type: GET_USER_PROFILE,
                    userProfile: response
                });
            });
        case UPDATE_AVATAR:
            return userProfileService.updateAvatar(action.params)
                .then(response => {
                    store.dispatch({
                        type: 'GET_USER_PROFILE'
                    });
                    next({
                        ...action,
                        response: response,
                    })
                });

        default :
            next(action)
    }
}

export default accountMiddleware;
