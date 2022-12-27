export const UPDATE_INSURANCE_PROFILE = 'UPDATE_INSURANCE_PROFILE';
export const GET_INSURANCE_PROFILE = 'GET_INSURANCE_PROFILE';
export const UPDATE_INSURANCE_INDIVIDUAL_FAIL = 'UPDATE_INSURANCE_INDIVIDUAL_FAIL';

export function updateInsuranceProfile(params) {
    return {
        type: UPDATE_INSURANCE_PROFILE,
        params
    }
}

export function getInsuranceProfile() {
    return {
        type: GET_INSURANCE_PROFILE
    }
}
