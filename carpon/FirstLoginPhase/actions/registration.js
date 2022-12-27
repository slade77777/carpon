import config from '../../../carpon/config';
import polling from "../../../polling";
import {apiVerifySMS} from "../../services";

const steps = config.registrationFlow.steps;

export const REGISTER_LOAD_CAR_PROFILE_FROM_PLATE = 'REGISTER_LOAD_CAR_PROFILE_FROM_PLATE';
export const REGISTER_PLATFORM_NUMBER = 'REGISTER_PLATFORM_NUMBER';
export const LOGIN_EMAIL = 'LOGIN_EMAIL';
export const VERIFY_EMAIL = 'VERIFY_EMAIL';
export const RESET_STATE = 'RESET_STATE';
export const LOAD_CAR = 'LOAD_CAR';
export const LOAD_USER = 'LOAD_USER';
export const RESET_LOADING = 'RESET_LOADING';
export const ACTIVE_LOADING = 'ACTIVE_LOADING';
export const REGISTER_CAR_TYPE = 'REGISTER_CAR_TYPE';
export const ADD_IMAGE = 'ADD_IMAGE';
export const SWITCH_CAR = 'SWITCH_CAR';
export const LOAD_CAR_AFTER_SWITCH = 'LOAD_CAR_AFTER_SWITCH';
export const REMOVE_CAR = 'REMOVE_CAR';
export const LOAD_CAR_FOR_USER_LOGIN = 'LOAD_CAR_FOR_USER_LOGIN';
export const ADD_CAR_QR = 'ADD_CAR_QR';
export const LOADING_SUCCESS = 'LOADING_SUCCESS';
export const COME_BACK_REGISTER_CAR = 'COME_BACK_REGISTER_CAR';
export const VERIFY_PHONE_NUMBER = 'VERIFY_PHONE_NUMBER';
export const RESET_MODAL_STATUS = 'RESET_MODAL_STATUS';
export const UPDATE_APP_VERSION = 'UPDATE_APP_VERSION';
export const UPDATE_GRADE_LIST = 'UPDATE_GRADE_LIST';
export const CLEAR_CAR_DATA = 'CLEAR_CAR_DATA';
export const UPDATE_HOYU_NOT_FOUND = 'UPDATE_HOYU_NOT_FOUND';
export const HOYU_NOT_FOUND = 'HOYU_NOT_FOUND';
export const HOYU_FOUND = 'HOYU_FOUND';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';

export const {
    REGISTER_PHONE_NUMBER,
    REGISTER_PHONE_NUMBER_CONFIRM,
    REGISTER_CAR_PROFILE_LOADED,
    PENDING_SMALL_CAR,
    REGISTER_CAR_PROFILE_UPDATED,
    REGISTER_CAR_PROFILE_CONFIRMED,
    REGISTER_USER_PROFILE,
    REGISTER_INITIALIZE,
    REGISTER_USER_PROFILE_CONFIRMED,
    LOADING_DATA,
    OUT_OF_WORKING_TIME,
    REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE,
    SKIP_CAR,
    REGISTER_CAR_OUT_OF_WORKING_TIME
} = steps;

export function loadingSuccess() {
    return {
        type: LOADING_SUCCESS,
    }
}

export function outOfWorkingTime() {
    return {
        type: OUT_OF_WORKING_TIME,
    }
}

export function registerCarType(carType) {
    return {
        type: REGISTER_CAR_TYPE,
        carType
    }
}

export function loadCarProfileFromPlate(plateNumber) {
    return {
        type: REGISTER_LOAD_CAR_PROFILE_FROM_PLATE,
        plateNumber
    }
}

export function registerCarOutOfWorkingTimeBy(plateNumber) {
    return {
        type: REGISTER_CAR_OUT_OF_WORKING_TIME,
        plateNumber
    }
}

export function loadCarProfileFromCertificate(qrCode) {
    return {
        type: REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE,
        qrCode
    }
}

export function loadCarProfile(profile) {
    return {
        type: REGISTER_CAR_PROFILE_LOADED,
        profile
    }
}

export function updateCarProfile(profile) {
    return {
        type: REGISTER_CAR_PROFILE_UPDATED,
        profile
    }
}

export function confirmCarProfile(profile) {
    return {
        type: REGISTER_CAR_PROFILE_CONFIRMED,
        profile
    }
}

export function registerUserProfile(profile) {
    return {
        type: REGISTER_USER_PROFILE,
        profile
    }
}

export function updateUserProfile(field, value) {
    return {
        type: UPDATE_USER_PROFILE,
        value,
        field
    }
}

export function registerUserProfileConfirmed(emailInformation) {
    return {
        type: REGISTER_USER_PROFILE_CONFIRMED,
        emailInformation
    }
}

export function initialize() {
    return {
        type: REGISTER_INITIALIZE
    }
}

export function loadingData() {
    return {
        type: LOADING_DATA
    }
}

export function updatePlatform(params) {
    return {
        type: REGISTER_PLATFORM_NUMBER,
        params
    }
}

export function loginEmail(loginInformation) {
    return {
        type: LOGIN_EMAIL,
        loginInformation
    }
}

export function verifyEmail(emailInformation) {
    return {
        type: VERIFY_EMAIL,
        emailInformation
    }
}

export function resetState() {
    return {
        type: RESET_STATE
    }
}

export function callAPIProgress(actionName) {
    return {
        type: `${actionName}_$PROGRESS`
    }
}

export function callAPIFailed(actionName) {
    return {
        type: `${actionName}_FAILED`
    }
}

export function loadCar() {
    return {
        type: LOAD_CAR
    }
}


export function loadUser() {
    return {
        type: LOAD_USER
    }
}

export function resetLoading() {
    return {
        type: RESET_LOADING
    }

}

export function switchCar() {
    return {
        type: SWITCH_CAR,
    }
}

export function loadCarAfterSwitchBy(QR) {
    return {
        type: LOAD_CAR_AFTER_SWITCH,
        QR
    }
}

export function removeCar() {
    return {
        type: REMOVE_CAR
    }
}

export function clearCarData() {
    return {
        type: CLEAR_CAR_DATA
    }
}

export function comeBackRegisterCar() {
    return {
        type: COME_BACK_REGISTER_CAR
    }
}

export function skipCar() {
    return {
        type: SKIP_CAR
    }
}

export function loadCarForUserLogin() {
    return {
        type: LOAD_CAR_FOR_USER_LOGIN
    }
}

export function pendingSmallCar() {
    return {
        type: PENDING_SMALL_CAR
    }
}

export function addQRCode(QR) {
    return {
        type: ADD_CAR_QR,
        QR
    }
}

export function verifyPhoneNumber(info) {
    return {
        type: VERIFY_PHONE_NUMBER,
        info
    }
}

export function resetModalStatus() {
    return {
        type: RESET_MODAL_STATUS
    }
}

export function updateAppVersion(version) {
    return {
        type: UPDATE_APP_VERSION,
        version
    }
}

export function updateGradeList(data) {
    return {
        type: UPDATE_GRADE_LIST,
        data
    }
}

export const waitForIVRConfirmation = (options, params) => (dispatch) => {

    polling(() => {
        return apiVerifySMS.confirmIvr(params.id)
            .then(response => {
                const credential = {
                    ...response,
                    mobile: params.mobile
                };
                dispatch({
                    type: 'VERIFY_CODE_SUCCESS',
                    credential
                });
            })
    }, options).catch(error => {
        if (error.code === 'E_POLLING_TIMEOUT') {
            dispatch({
                type: "IVR_TIMEOUT",
                error: error
            });
        } else {
            dispatch({
                type: "IVR_FAILED",
                error
            });
        }
    });
};
