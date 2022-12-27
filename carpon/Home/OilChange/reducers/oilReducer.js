import {GET_LIST_OIL, SETTING_OIL_TIME, RESET_OIL_PROFILE, UPDATE_OIL_PROFILE} from "../actions/oilAction";

const initialState = {
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
        case GET_LIST_OIL:
            return {
                ...state,
                listPrice:action.listPrice,
                listStore: action.listStore,
                PriceMin: action.PriceMin,
                IndexPriceMin: action.IndexPriceMin,
                range: action.range,
                loading: false
            };

        case 'GET_LIST_OIL_$PROGRESS':
            return {
                ...state,
                loading: true
            };

        case SETTING_OIL_TIME:
            return {
                ...state,
                times: action.params
            };

        case RESET_OIL_PROFILE:
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

        case UPDATE_OIL_PROFILE:
            return {
                ...state,
                profile: action.profile
            };

        default :
            return state
    }

}
