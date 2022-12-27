import {createStore} from 'redux';
import rootReducer from './combineReducers';
import middleware from './combineMiddleware';
import Storage, {combineWithRootReducer} from "./services/Storage";
import AsyncStorage from '@react-native-community/async-storage'

const storage = new Storage(AsyncStorage);

const store = createStore(combineWithRootReducer(rootReducer), middleware);

storage.sync(store);

export default store;

