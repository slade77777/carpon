const Toast = require('@remobile/react-native-toast');

export default class ToastService {

    /**
     * Show toast
     * 
     * @param {*} message 
     * @param {*} duration 'long' or 'short', default is 'short'
     */
    show(message, duration) {
        if (duration === 'long') {
            Toast.showLongBottom(message);
        } else {
            Toast.showShortBottom(message);
        }
    }
}
