import {
    GET_LIST_MODEL_REVIEW, GET_REVIEW_DETAIL, GET_REVIEW_SUMMARY, POST_REVIEW, UPDATE_REVIEW, POST_REVIEW_FIRST,
    GET_LIST_REVIEW_CAR, GET_LIST_REVIEW_USER, GET_PAST_REVIEW, EDIT_REVIEW, DELETE_REVIEW, DELETE_REVIEW_IN_MY_PAGE
}                                         from "../action/ReviewAction";
import {listReviewService, reviewService} from "../../../../carpon/services/index";
import {carInformationService}            from "../../../../carpon/services";
import {addTrackerEvent}                  from "../../../Tracker";
import { submitAppFlyer }                 from "../../../../App";

const reviewMiddleware = store => next => action => {
    let listReview = store.getState().review ? store.getState().review.reviews : [];
    let page = action.page || 1;
    switch (action.type) {
        case UPDATE_REVIEW:
            store.dispatch(({type: 'UPDATE_REVIEW__$PROGRESS'}));
            return listReviewService.getListReviewTop({page : page}).then(result => {
                return next({
                    ...action,
                    reviews: page === 1 ?
                        (result.data.map(review => {
                            return  Object.assign({page: 1}, review)
                        }))
                        : listReview.concat(result.data.map(review => {
                            return  Object.assign({page: action.page}, review)
                        })),
                    has_next: result.has_next
                })
            });

        case GET_LIST_REVIEW_CAR :
            store.dispatch(({type: 'UPDATE_REVIEW__$PROGRESS'}));
            return listReviewService.getListReviewFollowCar({...action.params, page}).then(response => {
                return next({
                    ...action,
                    reviews: page === 1 ? response.data : listReview.concat(response.data),
                    has_next: response.has_next,
                })
            });

        case POST_REVIEW :
            store.dispatch(({type: 'ACTION_$PROGRESS'}));
            return reviewService.postReview(action.data)
                .then(() => {
                    reviewService.checkAppReview().then((response) => {
                            store.dispatch({type: 'REVIEW_APP_STATUS', status: response.status});
                        }
                    );
                    const currentUser = store.getState().registration.userProfile.myProfile;
                    addTrackerEvent('review_post', {review_num: currentUser.total_review ? currentUser.total_review + 1 : null});
                    submitAppFlyer('REVIEW_POST',
                        {
                            id: currentUser.id,
                            email: currentUser.email,
                        },
                        currentUser.id
                    );
                    store.dispatch({type: 'GET_PAST_REVIEW'});
                    store.dispatch({type: 'GET_USER_PROFILE'});
                    store.dispatch({type: 'GET_PAST_REVIEW'});
                    store.dispatch({type: 'UPDATE_REVIEW'});
                    store.dispatch({type: 'SIDE_MENU_STATE', state: false});
                    store.dispatch({type: 'ACTION_DONE'});
                    return next({...action});
                })
                .catch((error) => {
                    alert('APIエラー');
                    return store.dispatch({type: 'ACTION_DONE'});
                });

        case POST_REVIEW_FIRST :
            store.dispatch(({type: 'ACTION_$PROGRESS'}));
            return reviewService.postReview(action.data)
                .then(() => {
                    reviewService.checkAppReview().then((response) => {
                            store.dispatch({type: 'REVIEW_APP_STATUS', status: response.status});
                        }
                    );
                    const currentUser = store.getState().registration.userProfile.myProfile;
                    addTrackerEvent('review_post', {review_num: 1});
                    submitAppFlyer('REVIEW_POST',
                        {
                            id: currentUser.id,
                            email: currentUser.email,
                        },
                        currentUser.id
                    );
                    store.dispatch({type: 'GET_USER_PROFILE'});
                    store.dispatch({type: 'GET_PAST_REVIEW'});
                    store.dispatch({type: 'UPDATE_REVIEW'});
                    return next({...action});
                })
                .catch((error) => {
                    alert('APIエラー');
                    return store.dispatch({type: 'ACTION_DONE'});
                });


        case EDIT_REVIEW:
            store.dispatch(({type: 'ACTION_$PROGRESS'}));
            return reviewService.editReview(action.review)
                .then((response) => {
                    store.dispatch(({type: 'UPDATE_REVIEW'}));
                    return next({...action, profile: response});
                })
                .catch((error) => {
                    alert('APIエラー');
                    return store.dispatch(({type: 'ACTION_DONE'}));
                });

        case DELETE_REVIEW:
            store.dispatch(({type: 'ACTION_$PROGRESS'}));
            return reviewService.deleterReview(action.id)
                    .then(() => {
                        store.dispatch(({type: 'UPDATE_REVIEW'}));
                        store.dispatch({type: 'GET_USER_PROFILE'});
                        store.dispatch({type: 'SIDE_MENU_STATE', state: false});
                        setTimeout(() => {
                            return next({...action});
                        }, 3000);
                })
                    .catch((error)=> {
                        alert('APIエラー');
                        return store.dispatch(({type: 'ACTION_DONE'}));
                });

        case DELETE_REVIEW_IN_MY_PAGE:
            store.dispatch(({type: 'ACTION_$PROGRESS'}));
            return reviewService.deleterReview(action.id)
                    .then(() => {
                        store.dispatch(({type: 'UPDATE_REVIEW'}));
                        store.dispatch({type: 'GET_USER_PROFILE'});
                        store.dispatch({type: 'SIDE_MENU_STATE', state: false});
                        setTimeout(() => {
                            return next({...action});
                        }, 3000);
                })
                    .catch((error)=> {
                        alert('APIエラー');
                        return store.dispatch(({type: 'ACTION_DONE'}));
                });

        case GET_REVIEW_DETAIL :
            return listReviewService.getReviewDetail(action.review_id).then((response) => {
                return next({
                    ...action,
                    review : response.data
                });
            });

        case GET_REVIEW_SUMMARY :
            store.dispatch({
                type : 'UPDATE_REVIEW__$PROGRESS'
            });
            return listReviewService.getSummary(action.params).then(res => {
                return next({
                    ...action,
                    summary : res,
                });
            }).catch(() => {
                next({
                    ...action
                })
            });
        case GET_LIST_MODEL_REVIEW :
            return carInformationService.getCarGradeModel(action.params.maker_code, action.params.car_name_code).then(res => {
                next({
                    ...action,
                    listModel : res
                })
            });
        case GET_PAST_REVIEW :
            return listReviewService.getReviewUser(action.id).then(response => {
                return next({
                    ...action,
                    response: response.data
                })
            });
        case GET_LIST_REVIEW_USER :
            return listReviewService.getReviewUser(action.profile_id).then(response => {
                return next({
                    ...action,
                    response: response.data
                })
            });
        default :
            next(action)
    }

};

export default reviewMiddleware;
