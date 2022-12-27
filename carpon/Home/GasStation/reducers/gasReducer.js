import {GET_LIST_GAS_STATION} from "../actions/gasAction";

const initialState = {
    listGasStation: [],
    lowestThreeStation: [],
    loading: false,
    ItemPriceMin: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LIST_GAS_STATION:
            return {
                ...state,
                listGasStation: action.listGasStation,
                ItemPriceMin: action.ItemPriceMin,
                lowestThreeStation: action.lowestThreeStation || [],
                range: action.range
            };

        case 'GET_LIST_GAS_$PROGRESS':
            return {
                ...state,
                loading: true
            };

        case 'STOP_LOADING':
            return {
                ...state,
                loading: false
            };

        default :
            return state
    }

}
