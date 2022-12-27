import Config from './config';
import {loadUser} from "./FirstLoginPhase/actions/registration";

const UserRankMiddleware = store => next => action => {

    let interactWithRankActions = Config.interactWithRankActions.find((actionType) => {
        return action.type === actionType
    });

    if(!!interactWithRankActions) {
        next(loadUser());
        next(action)
    }else {
        return next(action)
    }
};

export default UserRankMiddleware;
