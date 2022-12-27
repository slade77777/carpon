import React from 'react';
import App from './App';
import store from './carpon/store';
import {Provider} from "react-redux";

export default () =>
    <Provider store={store}>
        <App/>
    </Provider>
