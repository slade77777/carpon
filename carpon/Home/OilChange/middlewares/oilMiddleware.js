import {GET_LIST_OIL, SETTING_OIL_TIME, RESET_OIL_PROFILE, UPDATE_OIL_PROFILE} from "../actions/oilAction";

import {myCarService} from "../../../services";
import _ from 'lodash'

const oilMiddleware = store => next => action => {

    switch (action.type) {
        case GET_LIST_OIL:
            store.dispatch({
                type : 'GET_LIST_OIL_$PROGRESS'
            });
            return myCarService.getOilStoreList(action.range)
                .then((stores) => {
                    let listStore = stores ? stores : [] ;
                    let listPrice = _.map(listStore, (element)=> {
                        return parseInt(element.detail.oil_charges_domestic) + parseInt(element.detail.oil_charges_import)
                    });
                    let PriceMin = _.min(listPrice);

                    let IndexPriceMin = _.findIndex(listPrice, (element)=> {
                        return element === PriceMin
                    });

                    next({...action, listStore: listStore, PriceMin: PriceMin, IndexPriceMin: IndexPriceMin, range: action.range})
                });

        case SETTING_OIL_TIME:
            return next(action);

        case RESET_OIL_PROFILE:
            return next(action);

        case UPDATE_OIL_PROFILE:
            return next({...action, profile: action.params});

        default :
            next(action);
    }
};

export default oilMiddleware;

