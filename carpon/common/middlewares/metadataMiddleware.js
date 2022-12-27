import {carInformationService, surveyService, userProfileService} from "../../services";
import {ANSWER_PROFILE_OPTIONS, CHANGE_TAB, LOAD_REWARD, RESET_ANSWER, UPDATE_METADATA} from "../actions/metadata";
import {viewPage} from "../../Tracker";

export default store => next => action => {
    switch (action.type) {

        case UPDATE_METADATA:
            return Promise.all([
                carInformationService.getCarBranches(),
                userProfileService.getOptions()
            ]).then(responses => {
                return {
                    branches: responses[0],
                    profileOptions: responses[1]
                };
            }).then(metadata => next({
                ...action,
                metadata
            }));

        case ANSWER_PROFILE_OPTIONS:
            return next(action);

        case RESET_ANSWER:
            return next(action);

        case CHANGE_TAB:
            const TabNumber = store.getState().metadata.scoreScreenTabNumber;
            if (TabNumber !== action.tab) {
                switch (action.tab) {
                    case 0:
                        viewPage('score', 'スコア');
                        break;
                    case 1:
                        viewPage('score_up', 'スコアアップ');
                        break;
                    case 2:
                        viewPage('Benefits', '特典一覧');
                        break;
                }
            }
            return next(action);

        case LOAD_REWARD :
            return surveyService.loadReward()
                .then(response => {
                    next({...action, reward: response})
                })
                .catch(error => console.log(error));

        default:
            next(action);
    }
}
