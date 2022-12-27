export const GET_LIST_OIL = 'GET_LIST_OIL';
export const SETTING_OIL_TIME = 'SETTING_OIL_TIME';
export const RESET_OIL_PROFILE = 'RESET_OIL_PROFILE';
export const UPDATE_OIL_PROFILE = 'UPDATE_OIL_PROFILE';

export function getListStores(range) {
    return {
        type: GET_LIST_OIL,
        range
    }
}

export function resetOilProfile() {
    return {
        type: RESET_OIL_PROFILE
    }
}

export function getListOilStores(range) {
    return {
        type: GET_LIST_OIL,
        range
    }
}

export function settingOilTime(params) {
    return {
        type: SETTING_OIL_TIME,
        params
    }
}

export function updateOilProfile(params) {
    return {
        type: UPDATE_OIL_PROFILE,
        params
    }
}
