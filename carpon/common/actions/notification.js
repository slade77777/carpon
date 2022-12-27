export const GET_NOTIFICATION = 'GET_NOTIFICATION';
export const READ_NOTIFICATION = 'READ_NOTIFICATION';
export const READ_ALL_NOTIFICATION = 'READ_ALL_NOTIFICATION';
export const TURN_OFF_REFRESH = 'TURN_OFF_REFRESH';

export function getAllNotification(page) {
    return {
        type: 'GET_NOTIFICATION',
        page
    }
}

export function readNotification(mail) {
    return {
        type: 'READ_NOTIFICATION',
        mail: mail
    }
}

export function _readAllNotification() {
    return {
        type: READ_ALL_NOTIFICATION,
    }
}

export function _turnOffRefresh() {
    return {
        type: TURN_OFF_REFRESH,
    }
}
