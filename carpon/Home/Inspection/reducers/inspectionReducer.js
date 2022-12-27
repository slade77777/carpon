import {GET_LIST_RANGE, GET_LIST_STORES, SETTING_TIME, RESET_PROFILE, UPDATE_PROFILE} from "../actions/inspectionAction";

const initialState = {
    listRange: [],
    listStore: [],
    loading: false,
    times: {
        first_date: null,
        first_date_time: null,
        second_date: null,
        second_date_time: null
    },
    profile: {
        first_name: null,
        last_name: null,
        first_name_katakana: null,
        last_name_katakana: null,
        email: null,
        phone: null
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LIST_RANGE:
            return {
                ...state,
                listRange: action.listRange
            };

        case GET_LIST_STORES:
            return {
                ...state,
                listPrice:action.listPrice,
                listStore: action.listStore,
                PriceMin: action.PriceMin,
                IndexPriceMin: action.IndexPriceMin,
                range: action.range,
                loading: false
            };

        case 'GET_LIST_STORES_$PROGRESS':
            return {
                ...state,
                loading: true
            };

        case SETTING_TIME:
            return {
                ...state,
                times: action.params
            };

        case RESET_PROFILE:
            return {
                ...state,
                profile: {
                    first_name: null,
                    last_name: null,
                    first_name_katakana: null,
                    last_name_katakana: null,
                    email: null,
                    phone: null
                }
            };

        case UPDATE_PROFILE:
            return {
                ...state,
                profile: action.profile
            };

        default :
            return state
    }

}
