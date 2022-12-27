import {
    UPDATE_NEWS_MORE,
    UPDATE_NEWS,
    UPDATE_TAB,
    GET_MY_NEWS_NOT_REFRESH,
    DELETE_COMMENT
} from "../action/newsAction";
import _ from 'lodash';

const initialState = {
    myNews: [],
    top: [],
    has_next: false,
    update: true,
    updateTab: false,
    newsParameters: {
        page: 1
    },
    tab: [],
    newsClip: {},
    updateClip: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'REMOVE_FIRST_TAP_NEWS' :
            let tab = state.tap.filter((item, index) => index !== 0);
            return {
                ...state,
                tab : tab
            };
        case UPDATE_NEWS_MORE  :
            return {
                ...state,
                newsParameters: {...action.params, page: action.params.page + 1},
                top: _.uniq([...state.top, ...action.news]),
                has_next: action.has_next,
            };
        case UPDATE_NEWS:
            return {
                ...state,
                newsParameters: {...action.params, page: action.params.page + 1},
                top: action.news,
                has_next: action.has_next,
                update: true,
            };
        case 'UPDATE_NEWS__$PROGRESS':
            return {
                ...state,
                update: false,
            };
        case 'UPDATE_TAB__$PROGRESS':
            return {
                ...state,
                update: false,
                updateTab: false,
            };
        case UPDATE_TAB:
            return {
                ...state,
                tab: action.tab,
                update: true,
                updateTab: true,
            };
        case GET_MY_NEWS_NOT_REFRESH :
            return {
                ...state,
                myNews: action.myNews
            };
        case DELETE_COMMENT:
            return {
                ...state,

            };
        case 'UPDATE_CLIP_NEW' :
            return {
                ...state,
                newsClip: action.newsClip,
                updateClip: true
            };
        case 'UPDATE_CLIP_NEW_SUCCESS' :
            return {
                ...state,
                updateClip: false,
            };
        default :
            return state
    }
}
