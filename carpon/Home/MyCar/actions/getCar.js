export const GET_CAR = 'GET_CAR';
export const GET_RECALL = 'GET_RECALL';
export const UPDATE_GRADE = 'UPDATE_GRADE';
export const GET_CAR_FAILED = 'GET_CAR_FAILED';
export const GET_CAR_PRICE_ESTIMATE = 'GET_CAR_PRICE_ESTIMATE';
export const GET_CAR_SELL_ESTIMATE = 'GET_CAR_SELL_ESTIMATE';

export function getCar() {
    return {
        type : GET_CAR,
    }
}

export function getRecall(car_id, car_form) {
    return {
        type : GET_RECALL,
        car_id,
        car_form
    }
}

export function updateGrade(hoyu_id) {
    return {
        type: UPDATE_GRADE,
        hoyu_id
    }
}

export function getCarPriceEstimate() {
    return {
        type: GET_CAR_PRICE_ESTIMATE
    }
}

export function getCarSellEstimate() {
    return {
        type: GET_CAR_SELL_ESTIMATE
    }
}
