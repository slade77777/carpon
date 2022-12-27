import { Alert } from 'react-native'

export default class DialogService {
    displayed = false

    /**
     * show alert dialog
     * 
     * @param {string} title 
     * @param {string} message 
     * @param {function} okCallback callback function when press ok
     * @param {string} okText 
     * @param {function} cancelCallback callback function when press cancel
     * @param {string} cancelText 
     * @param {function} onDismiss callback function when dismiss
     */
    confirm(title, message, okCallback, okText, cancelCallback, cancelText, onDismiss) {
        if (this.displayed) return;
        let buttonOk = {
            text: okText || 'はい'
        }
        buttonOk.onPress = () => {
            this.displayed = false;
            if (okCallback) okCallback();
        };
        let buttonCancel = {
            text: cancelText || 'いいえ',
            style: 'cancel'
        }
        buttonCancel.onPress = () => {
            this.displayed = false;
            if (cancelCallback) cancelCallback();
        };
        this.displayed = true;
        return Alert.alert(
            title,
            message,
            [
                buttonOk,
                buttonCancel,
            ],
            {
                cancelable: true,
                onDismiss: () => {
                    this.displayed = false;
                    if (onDismiss) onDismiss();
                }
            }
        );
    }

    alert(message, okCallback, okText, onDismiss) {
        if (this.displayed) return;
        let buttonOk = {
            text: okText || 'はい'
        }
        buttonOk.onPress = () => {
            this.displayed = false;
            if (okCallback) okCallback();
        };
        this.displayed = true;
        return Alert.alert(
            null,
            message,
            [
                buttonOk
            ],
            {
                cancelable: true,
                onDismiss: () => {
                    this.displayed = false;
                    if (onDismiss) onDismiss();
                }
            }
        );
    }

    message(message) {
        this.alert(message);
    }

    showNetworkError() {
        this.alert('サーバーまたはネットワークに接続できませんでした');
    }
}
