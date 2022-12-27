import {GET_LIST_RANGE, GET_LIST_STORES, SETTING_TIME, RESET_PROFILE, UPDATE_PROFILE} from "../actions/inspectionAction";
import {myCarService} from "../../../services";
import _ from 'lodash'

const inspectionMiddleware = store => next => action => {

    switch (action.type) {
        case GET_LIST_RANGE:
            return myCarService.getDistanceList()
                .then((response) => {
                    next({...action, listRange: response})
                });

        case GET_LIST_STORES:
            store.dispatch({
                type : 'GET_LIST_STORES_$PROGRESS'
            });
            return myCarService.getInspectionStoreList(action.range)
                .then((stores) => {
                    let listStore = stores ? stores : [] ;
                    let listPrice = _.map(listStore, (element)=> {
                        if(element.detail.total) {
                            const price = element.detail.total - element.detail.tax_discount;
                            if (price > 0) return (element.detail.total - element.detail.tax_discount)
                        }
                    });
                    let PriceMin = _.min(listPrice);

                    let IndexPriceMin = _.findIndex(listPrice, (element)=> {
                        return element === PriceMin
                    });

                    next({...action, listStore: listStore, PriceMin: PriceMin, IndexPriceMin: IndexPriceMin, range: action.range})
                });

        case SETTING_TIME:
            return next(action);

        case RESET_PROFILE:
            return next(action);

        case UPDATE_PROFILE:
            return next({...action, profile: action.params});


        default :
            next(action);
    }
};

export default inspectionMiddleware;
