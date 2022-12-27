export const UPDATE_AVATAR = 'UPDATE_AVATAR';
export const GET_USER_PROFILE = 'GET_USER_PROFILE';

export function updateAvatar(params) {
    return {
        type: UPDATE_AVATAR,
        params
    }
}

export function getUserProfile() {
    return {
        type: GET_USER_PROFILE
    }
}