export const POST_REVIEW = 'POST_REVIEW';
export const POST_REVIEW_FIRST = 'POST_REVIEW_FIRST';
export const GET_REVIEW_DETAIL = 'GET_REVIEW_DETAIL';
export const GET_REVIEW_SUMMARY = 'GET_REVIEW_SUMMARY';
export const UPDATE_REVIEW = 'UPDATE_REVIEW';
export const GET_LIST_MODEL_REVIEW = 'GET_LIST_MODEL_REVIEW';
export const GET_LIST_REVIEW_CAR = 'GET_LIST_REVIEW_CAR';
export const GET_PAST_REVIEW = 'GET_PAST_REVIEW';
export const GET_LIST_REVIEW_USER = 'GET_LIST_REVIEW_USER';
export const EDIT_REVIEW = 'EDIT_REVIEW';
export const DELETE_REVIEW = 'DELETE_REVIEW';
export const DELETE_REVIEW_IN_MY_PAGE = 'DELETE_REVIEW_IN_MY_PAGE';
export const RESET_STATUS_RELOAD = 'RESET_STATUS_RELOAD';
export const RESET_LOADING = 'RESET_LOADING';
export const RESET_RERENDER_REVIEW = 'RESET_RERENDER_REVIEW';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const LOAD_REVIEW_MY_PAGE = 'LOAD_REVIEW_MY_PAGE';


export function getPastReview(id) {
    return {
        type : GET_PAST_REVIEW,
        id
    }
}
export function postReview(data, MyId) {
    return {
        type : POST_REVIEW,
        data : data,
        MyId : MyId
    }
}

export function postReviewFirst(data, MyId) {
    return {
        type : POST_REVIEW_FIRST,
        data : data,
        MyId : MyId
    }
}

export function editReview(review) {
    return {
        type: EDIT_REVIEW,
        review
    }
}

export function resetRenderReview() {
    return {
        type: RESET_RERENDER_REVIEW
    }
}

export function DeleteReview(id) {
    return{
        type: DELETE_REVIEW,
        id
    }
}

export function DeleteReviewInMyPage(id) {
    return{
        type: DELETE_REVIEW_IN_MY_PAGE,
        id
    }
}

export function resetStatusReload(id) {
    return{
        type: RESET_STATUS_RELOAD,
        id
    }
}

export function resetLoading() {
    return{
        type: RESET_LOADING
    }
}

export function getDetailReview(review_id) {
    return {
        type: GET_REVIEW_DETAIL,
        review_id
    }
}

export function getReviewSummary(params) {
    return {
        type : GET_REVIEW_SUMMARY,
        params
    }
}

export function updateReview(page) {
    return {
        type : UPDATE_REVIEW,
        page
    }
}

export function getListModelReview(params) {
    return {
        type : GET_LIST_MODEL_REVIEW,
        params
    }
}

export function getListReview(params, page) {
    return {
        type : GET_LIST_REVIEW_CAR,
        params,
        page
    }
}

export function loadReview() {
    return {
        type: LOAD_REVIEW_MY_PAGE
    }
}

export function requestSuccess(key) {
    return {
        type: REQUEST_SUCCESS,
        key
    }
}
