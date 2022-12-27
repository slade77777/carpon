import lodash from 'lodash';

export const $$_CARPON_INITIAL_STATE = '$$_CARPON_INITIAL_STATE';
export const $$_CARPON_CLEAR = '$$_CARPON_CLEAR';

export default class Storage {
    constructor(backendAdapter) {
        this.backendAdapter  = backendAdapter;
    }

    async set(key, value) {


        if (value === undefined || value === null) {
            throw new Error('Could not set null or undefined value');
        }
        await (this.backendAdapter).setItem(key, JSON.stringify(value));
    }

    async get(key, defaultIfNotExisted = null) {
        const parsedValue = await (this.backendAdapter).getItem(key);

        if (!parsedValue) {
            return defaultIfNotExisted;
        }

        try {
            return JSON.parse(parsedValue);
        } catch (error) {
            console.warn(`Data with key [${key}] is malformed`);

            return defaultIfNotExisted;
        }
    }

    sync(store, storeKey = $$_CARPON_INITIAL_STATE, debounce = 300, debounceOptions = {}) {
        const $this = this;
        const debouncedSyncer = lodash.debounce(() => {

            const state = store.getState();

            $this.set(storeKey, state).catch(error => {
                console.warn('Storage syncing false');
                console.error(error);
            });
        }, debounce, debounceOptions);
        $this.get(storeKey, {}).then(data => {
            store.dispatch({
                type: storeKey,
                data
            });
            store.subscribe(debouncedSyncer);
        });
    }
}

export function combineWithRootReducer(rootReducer) {
    return (state, action) => {

        if (action.type === $$_CARPON_INITIAL_STATE) {
            return {...action.data};
        }

        // todo
        if (action.type === $$_CARPON_CLEAR) {
            return {}
        }

        return rootReducer(state, action);
    }
}
