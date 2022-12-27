export const UPDATE_NEWS = 'UPDATE_NEWS';
export const UPDATE_NEWS_MORE = 'UPDATE_NEWS_MORE';
export const UPDATE_TAB  = 'UPDATE_TAB';
export const GET_MY_NEWS_NOT_REFRESH = 'GET_MY_NEWS_NOT_REFRESH';
export const REMOVE_TAB = 'REMOVE_TAB';
export const CLIP_NEWS = "CLIP_NEWS";
export const UPDATE_OPT_NEWS = 'UPDATE_OPT_NEWS';

export function updateNews(params) {
    return {
        type: UPDATE_NEWS,
        params
    }
}

export function getNewsMore(params) {
    return {
        type: UPDATE_NEWS_MORE ,
        params
    }
}

export function updateTab() {
    return {
        type: UPDATE_TAB
    }
}

export function getMyNewsNotRefresh(params) {
    return {
        type: GET_MY_NEWS_NOT_REFRESH,
        params
    }
}


export function removeTab(id) {
    return {
        type: REMOVE_TAB,
        id
    }
}

export function updateOptNews(optNews) {
    return {
        type: UPDATE_OPT_NEWS,
        optNews
    }
}
