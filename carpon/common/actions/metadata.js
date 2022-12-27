export const UPDATE_METADATA             = 'UPDATE_METADATA';
export const NOTIFY_METADATA_BEFORE_LOAD = 'NOTIFY_METADATA_BEFORE_LOAD';
export const ANSWER_PROFILE_OPTIONS      = 'ANSWER_PROFILE_OPTIONS';
export const RESET_ANSWER                = 'RESET_ANSWER';
export const LOAD_REWARD                 = 'LOAD_REWARD';
export const CHANGE_TAB                  = 'CHANGE_TAB';
export const RESET_TAB                   = 'RESET_TAB';
export const CHANGE_SCREEN_NUMBER        = 'CHANGE_SCREEN_NUMBER';
export const SET_CURRENT_SCREEN           = 'SET_CURRENT_SCREEN';

export function loadMetadata() {
    return {
        type: UPDATE_METADATA
    }
}

export function notifyMetadataBeforeLoad() {
    return {
        type: NOTIFY_METADATA_BEFORE_LOAD
    }
}

export function AnswerProfileOptions(answer) {
    return {
        type: ANSWER_PROFILE_OPTIONS,
        answer
    }
}

export function ResetAnswer() {
    return {
        type: RESET_ANSWER
    }
}

export function loadReward() {
    return {
        type: LOAD_REWARD
    }
}

export function changeTab(tab, rank) {
    return {
        type: CHANGE_TAB,
        tab,
        rank
    }
}

export function changeScreenNumber(number) {
    return {
        type: CHANGE_SCREEN_NUMBER,
        number
    }
}

export function resetTab() {
    return {
        type: RESET_TAB
    }
}

export function setCurrentScreen(screen) {
    return {
        type: SET_CURRENT_SCREEN,
        currentScreen: screen
    }
}
