import {
    GET_LIST_MODEL_REVIEW,
    GET_REVIEW_DETAIL,
    GET_REVIEW_SUMMARY,
    GET_LIST_REVIEW_CAR,
    GET_PAST_REVIEW,
    POST_REVIEW,
    UPDATE_REVIEW,
    EDIT_REVIEW,
    DELETE_REVIEW,
    DELETE_REVIEW_IN_MY_PAGE,
    RESET_STATUS_RELOAD,
    RESET_LOADING,
    POST_REVIEW_FIRST,
    RESET_RERENDER_REVIEW,
    REQUEST_SUCCESS, LOAD_REVIEW_MY_PAGE
} from "../action/ReviewAction";
import momentJA from "../../../../carpon/services/momentJA";
import _ from 'lodash';

const initialState = {
    summaryDefault: {
        "rate_exterior_design": 0.0,
        "rate_interior_design": 0.0,
        "rate_ride_performance": 0.0,
        "rate_ride_comfort": 0.0,
        "rate_ride_easy": 0.0,
        "rate_economical": 0.0,
        "rate_capacity": 0.0,
        "total_rate": 0.0
    },
    summary: {},
    summaryParameters: {},
    listModel: [],
    reviews: [],
    reviewParameters: {},
    updateModel: false,
    showMessage: false,
    pastReview: [],
    loading: false,
    reload: false,
    reRenderReview: false,
    reviewAppStatus: false
};

function handleCheckDate(reviews) {
    return reviews.map((review, index) => {
        if (index === 0) {
            return {
                ...review,
                showDate: true
            }
        } else {
            return {
                ...review,
                showDate: momentJA(review['create_date']).format('YYYYMMDD') !== momentJA(reviews[index - 1]['create_date']).format('YYYYMMDD')
            };
        }
    })
}


export default function reviewReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_REVIEW :
            return {
                ...state,
                reviews: action.reviews,
                refresh: false,
                has_next: action.has_next,
                reviewParameters: {}
            };
        case 'UPDATE_REVIEW__$PROGRESS':
            return {
                ...state,
                refresh: true,
            };
        case  'RESET_STATUS_MODEL' :
            return {
                ...state,
                updateModel: false,
            };
        case 'REMOVE_FILTER_REVIEW' :
            return {
                ...state,
                reviewParameters: {},
                summary: initialState.summaryDefault,
                summaryLoaded: false,
                summaryParameters: {},
                listModel: [],
                updateModel: true,
            };
        case GET_REVIEW_SUMMARY :
            return {
                ...state,
                refresh: false,
                summaryParameters: action.params,
                summary: action.summary ? action.summary : initialState.summaryDefault,
                showMessage: !!action.summary,
                summaryLoaded: true,
                updateModel: true,
            };
        case GET_LIST_MODEL_REVIEW :
            return {
                ...state,
                listModel: action.listModel ? action.listModel : [],
            };
        case GET_LIST_REVIEW_CAR :
            return {
                ...state,
                refresh: false,
                reviewParameters: action.params,
                reviews: _.uniq(handleCheckDate(action.reviews)),
                has_next: action.has_next
            };

        case POST_REVIEW:
            return {
                ...state,
                loading: false,
                reRenderReview: true,
                postReviewSuccess: true
            };

        case 'REVIEW_APP_STATUS':
            return {
                ...state,
                reviewAppStatus: action.status
            };

        case POST_REVIEW_FIRST:
            return {
                ...state,
                loading: false,
                reRenderReview: true,
                postReviewSuccess: true
            };

        case 'ACTION_$PROGRESS':
            return {
                ...state,
                loading: true
            };

        case 'ACTION_DONE':
            return {
                ...state,
                loading: false
            };

        case EDIT_REVIEW:
            return {
                ...state,
                loading: false,
                reRenderReview: true
            };
        case RESET_RERENDER_REVIEW:
            return {
                ...state,
                loading: false,
                reRenderReview: false
            };

        case DELETE_REVIEW:
            return {
                ...state,
                loading: false,
                reviewDeletedId: action.id
            };

        case DELETE_REVIEW_IN_MY_PAGE:
            return {
                ...state,
                loading: false,
                reload: true,
                reviewDeletedId: action.id
            };

        case RESET_STATUS_RELOAD:
            return {
                ...state,
                reload: false
            };

        case RESET_LOADING:
            return {
                ...state,
                loading: false
            };

        case GET_REVIEW_DETAIL :
            return {
                ...state,
                review: action.review || ''
            };

        case GET_PAST_REVIEW :
            return {
                ...state,
                pastReview: [
                    ...action.response
                ]
            };

        case LOAD_REVIEW_MY_PAGE:
            return {
                ...state,
                LoadReviewMyPage: true
            };

        case REQUEST_SUCCESS:
            return {
                ...state,
                [action.key] : false
            };

        default :
            return state
    }
}
