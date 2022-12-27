export const GET_LIST_RANGE = 'GET_LIST_RANGE';
export const GET_LIST_STORES = 'GET_LIST_STORES';
export const SETTING_TIME = 'SETTING_TIME';
export const RESET_PROFILE = 'RESET_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export function getListRange() {
    return {
        type: GET_LIST_RANGE
    }
}

export function resetProfile() {
    return {
        type: RESET_PROFILE
    }
}

export function getListStores(range) {
    return {
        type: GET_LIST_STORES,
        range
    }
}

export function settingTime(params) {
    return {
        type: SETTING_TIME,
        params
    }
}

export function updateProfile(params) {
    return {
        type: UPDATE_PROFILE,
        params
    }
}
