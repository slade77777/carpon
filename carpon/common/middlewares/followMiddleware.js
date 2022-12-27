import {
    POST_FOLLOW, POST_FOLLOW_FAILED, POST_UN_FOLLOW, LOAD_MY_FOLLOWING, LOAD_FOLLOWER_BY_ID, POST_UN_FOLLOW_FAILED,
    LOAD_FOLLOWING, LOAD_FOLLOWER, postFollowProgress, postUnFollowProgress
} from "../actions/followAction";
import {userProfileService} from "../../services/index";
import {addTrackerEvent} from "../../Tracker";

const postFollowMiddleware = store => next => action => {
    switch (action.type) {
        case POST_FOLLOW :
            next(postFollowProgress());
            return userProfileService.postFollow(action.profile.id).then((response) => {
                store.dispatch({type: 'GET_USER_PROFILE'});
                addTrackerEvent('follow', {followee_id: action.profile.id})
                return next({
                    ...action,
                    response: response.data
                });
            }).catch(() => {
                return next({
                    ...action,
                    type: POST_FOLLOW_FAILED,
                })
            });

        case POST_UN_FOLLOW :
            next(postUnFollowProgress());
            return userProfileService.UnFollow(action.profile.id).then((response) => {
                store.dispatch({type: 'GET_USER_PROFILE'});
                return next({
                    ...action,
                    response: response.data
                });
            }).catch(() => {
                return next({
                    ...action,
                    type: POST_UN_FOLLOW_FAILED
                })
            });
        case LOAD_MY_FOLLOWING:
            return userProfileService.getMyFollowing()
                .then(followings => followings.map(following => following))
                .then(followings => {
                    next({
                        ...action,
                        followings
                    })
                });
            case LOAD_FOLLOWING:
            return userProfileService.getFollowingBy(action.id)
                .then(followings => followings.map(following => following))
                .then(followings => {
                    next({
                        ...action,
                        followings
                    })
                });
        case LOAD_FOLLOWER:
            return userProfileService.getMyFollower().then(followers =>
                next({
                    ...action,
                    followers
                })
            );
        case LOAD_FOLLOWER_BY_ID:
            return userProfileService.getFollowerBy(action.id).then(followers =>
                next({
                    ...action,
                    followers
                })
            );
        default :
            next(action)
    }
};

export default postFollowMiddleware;
