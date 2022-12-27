export const UPDATE_OIL = 'UPDATE_OIL';
export const UPDATE_MILEAGE = 'UPDATE_MILEAGE';
export const UPDATE_LICENSE = 'UPDATE_LICENSE';
export const UPDATE_TIRE = 'UPDATE_TIRE';
export const GET_MILEAGE = 'GET_MILEAGE';
export const CONFIRM_RECALL = 'CONFIRM_RECALL';
export const UPDATE_INSURANCE = 'UPDATE_INSURANCE';
export const UPDATE_CAR = 'UPDATE_CAR';
export const NAVIGATE_SUCCESS = 'NAVIGATE_SUCCESS';
export const UPDATE_CAR_IMAGE = 'UPDATE_CAR_IMAGE';
export const REMOVE_CAR_IMAGE = 'REMOVE_CAR_IMAGE';
export const UPDATE_CAR_LOOKUP = 'UPDATE_CAR_LOOKUP';
export const REMOVE_MILEAGE = 'REMOVE_MILEAGE';
export const UPDATE_ADVERTISING = 'UPDATE_ADVERTISING';
export const UNCONFIRM_RECALL = 'UNCONFIRM_RECALL';
export const LIKE = 'LIKE';
export const COMMENT = 'COMMENT';
export const GET_CAMPAIGN = 'GET_CAMPAIGN';
export const GET_CAMPAIGN_FAIL = 'GET_CAMPAIGN_FAIL';

export function Like() {
    return {
        type: LIKE
    }
}

export function Comment() {
    return {
        type: COMMENT
    }
}

export function updateOilRecords(records) {
    return {
        type: 'UPDATE_OIL_RECORDS',
        records
    }
}

export function updateOil(params) {
    return {
        type: UPDATE_OIL,
        params
    }
}

export function updateMileage(params) {
    return {
        type: UPDATE_MILEAGE,
        params
    }
}

export function removeMileage(mileage) {
    return {
        type: REMOVE_MILEAGE,
        mileage
    }
}

export function updateLicense(params) {
    return {
        type: UPDATE_LICENSE,
        params
    }
}

export function updateTire(tire, id) {
    return {
        type: UPDATE_TIRE,
        tire,
        id
    }
}

export function navigateSuccess(key) {
    return {
        type: NAVIGATE_SUCCESS,
        key
    }
}

export function getMileage() {
    return {
        type: GET_MILEAGE
    }
}

export function confirmRecall(params) {
    return {
        type: CONFIRM_RECALL,
        params
    }
}

export function unconfirmRecall(params) {
    return {
        type: UNCONFIRM_RECALL,
        params
    }
}

export function updateInsurance(params) {
    return {
        type: UPDATE_INSURANCE,
        params
    }
}

export function updateCar(params) {
    return {
        type: UPDATE_CAR,
        params
    }
}

export function updateCarImage(params) {
    return {
        type: UPDATE_CAR_IMAGE,
        params
    }
}

export function removeCarImage(id) {
    return {
        type: REMOVE_CAR_IMAGE,
        id
    }
}

export function updateCarLookup() {
    return {
        type: UPDATE_CAR_LOOKUP
    }
}

export function updateAdvertising(tire) {
    return {
        type: UPDATE_ADVERTISING,
        tire
    }
}

export function getCampaign() {
    return {
        type: GET_CAMPAIGN
    }
}
