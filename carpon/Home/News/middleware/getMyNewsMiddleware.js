import {navigationService, newsService} from "../../../../carpon/services/index";
import {
    GET_MY_NEWS_NOT_REFRESH, UPDATE_NEWS_MORE, UPDATE_NEWS, UPDATE_TAB, REMOVE_TAB, UPDATE_OPT_NEWS
} from "../action/newsAction";
import {Alert} from "react-native";
import {userProfileService} from "../../../services";
import {addTrackerEvent} from "../../../Tracker";

const getMyNewsMiddleware = store => next => action => {
    switch (action.type) {
        case UPDATE_NEWS :
            store.dispatch({
                type: 'UPDATE_NEWS__$PROGRESS'
            });
            let params = {...action.params, page: 1};
            return newsService.getAllNews(params)
                .then(response => {
                    next({...action, params, news: response.data, has_next: response.has_next})
                })
                ;
        case UPDATE_NEWS_MORE  :
            return newsService.getAllNews(action.params)
                .then(response => {
                    next({...action, news: response.data, has_next: response.has_next})
                })
                ;
        case UPDATE_TAB:
            store.dispatch({
                type: 'UPDATE_TAB__$PROGRESS'
            });
            return newsService.getNewsTab()
                .then(response => {
                    next({
                        ...action, tab: response.map((result, index) => ({
                            key: `car${index}`,
                            name: `car${index}`,
                            title: result.car_name,
                            type: 'car',
                            ...result
                        }))
                    })
                });
        case REMOVE_TAB:
            return newsService.removeNewsTab(action.id)
                .then(() => {
                    addTrackerEvent('news_tab_num_change', {tab_num: store.getState().news.tab.length + 1});
                    store.dispatch({
                            type: UPDATE_TAB
                        })
                    }
                );
        case GET_MY_NEWS_NOT_REFRESH :
            return newsService.getAllNews(action.params)
                .then(response => {
                    next({...action, myNews: response.data})
                })
                ;
        case 'POST_NEWS_TAB' :
            return newsService.postNewsTab(action.data).then(() => {
                addTrackerEvent('news_tab_num_change', {tab_num: store.getState().news.tab.length + 3});
                store.dispatch({
                    type: UPDATE_TAB
                });
                navigationService.popToTop();
            }).catch(() => {
                Alert.alert(
                    'メッセージ',
                    'この車はすでに登録されています。',
                    [
                        {text: 'OK', style: 'cancel'},
                    ],
                    {cancelable: false}
                );
            });

        case UPDATE_OPT_NEWS:
            return userProfileService.updateUserProfile(action.optNews).then(()=> {
                next({...action})
            }).catch(error => {
                console.log(error.response);
            });

        default :
            next(action);
    }
};

export default getMyNewsMiddleware;
