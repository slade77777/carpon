import {
    UPDATE_INSURANCE_PROFILE, GET_INSURANCE_PROFILE
} from "../action/InsuranceAction";
import {reviewService, userProfileService} from "../../../services/index";

const insuranceMiddleware = store => next => action => {
    switch (action.type) {
        case UPDATE_INSURANCE_PROFILE :
            return userProfileService.updateProfileOptions(action.params)
                .then(response => {
                    action.params.estimation_type === "detail" &&
                    reviewService.checkAppReview().then((response) => {
                            store.dispatch({type: 'REVIEW_APP_STATUS', status: response.status});
                        }
                    );
                    store.dispatch({type: 'LOAD_USER'});
                    next({...action, result: response.data.data , createDate: response.data.create_date, individualResult: true})
                }).catch((error) => {
                    store.dispatch({
                        type: 'UPDATE_INSURANCE_INDIVIDUAL_FAIL'
                    });
                    if (action.params.estimation_type !== 'easy') {
                        store.dispatch({
                            type: 'LOAD_USER'
                        });
                    }
                });

        case GET_INSURANCE_PROFILE :
            return userProfileService.getInsuranceProfile()
                .then(response => {
                    next({...action, result: response.data.data , createDate: response.data.create_date, bodyRequest: response.data.body_request})
                }).catch(error => {
                    if (error.response.data.message === 'HISTORY_NOT_FOUND') {
                        next({...action, result: [] , createDate: null, bodyRequest: {}})
                    }
                });

        default :
            next(action);
    }
};

export default insuranceMiddleware;
