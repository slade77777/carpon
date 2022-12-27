import {READ_NOTIFICATION, GET_NOTIFICATION} from "../actions/notification";
import {notificationService} from "../../services/index";
import notifee from '@notifee/react-native';

export default store => next => action => {
    switch (action.type) {
        case GET_NOTIFICATION:
            return notificationService.getAllNotificationCount()
                .then(response => {
                    next({
                        ...action,
                        unreadNumber: response.length
                    })
                });
        case READ_NOTIFICATION:
            return next ({
                ...action
            });

        default:
            next(action);
    }
}
