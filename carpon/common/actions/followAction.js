export const POST_FOLLOW = 'POST_FOLLOW';
export const POST_FOLLOW_FAILED = 'POST_FOLLOW_FAILED';
export const POST_UN_FOLLOW = 'POST_UN_FOLLOW';
export const POST_UN_FOLLOW_FAILED = 'POST_UN_FOLLOW_FAILED';
export const LOAD_FOLLOWING = 'LOAD_FOLLOWING';
export const LOAD_FOLLOWER = 'LOAD_FOLLOWER';
export const LOAD_MY_FOLLOWING = 'LOAD_MY_FOLLOWING';
export const LOAD_FOLLOWER_BY_ID = 'LOAD_FOLLOWER_BY_ID';
export const POST_FOLLOW_$PROGRESS = 'POST_FOLLOW_$PROGRESS';
export const POST_UN_FOLLOW_$PROGRESS = 'POST_UN_FOLLOW_$PROGRESS';

export function postFollow(profile) {
    return {
        type : POST_FOLLOW,
        profile : profile
    }
}

export function postFollowProgress() {
    return {
        type: POST_FOLLOW_$PROGRESS
    }
}

export function postUnFollow(profile) {
    return {
        type: POST_UN_FOLLOW,
        profile: profile
    }
}

export function postUnFollowProgress() {
    return {
        type: POST_UN_FOLLOW_$PROGRESS
    }
}

export function loadFollowing(id) {
    return {
        type: LOAD_FOLLOWING,
        id: id
    }
}

export function loadMyFollowing() {
    return {
        type: LOAD_MY_FOLLOWING,
    }
}

export function loadMyFollower() {
    return {
        type: LOAD_FOLLOWER,
    }
}
export function loadFollowerById(id) {
    return {
        type: LOAD_FOLLOWER_BY_ID,
        id: id
    }
}