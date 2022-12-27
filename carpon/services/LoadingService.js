import store from '../store';
import { SHOW_LOADING, HIDE_LOADING } from '../common/actions/LoadingAction'

export default class LoadingService {

    constructor() {
        this.loading = false;
    }

    show() {
        store.dispatch({
            type: SHOW_LOADING
        })
    }

    hide() {
        store.dispatch({
            type: HIDE_LOADING
        })
    }
}
