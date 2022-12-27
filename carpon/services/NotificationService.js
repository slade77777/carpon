export default class NotificationService {

    constructor(axios) {
        this.axios = axios;
    }

    updateReadNotification(id) {
        return this.axios.put(`/notification/` + id);
    }

    ReadAllNotification() {
        return this.axios.put('/notification/readAll');
    }

    getAllNotifications(params) {
        return this.axios.get('/notification', {params}).then((response) => response.data)
    }

    getAllNotificationCount() {
        return this.axios.get('/notification/length').then((response) => response.data)
    }

    getNotificationDetail(id) {
        return this.axios.get(`/notification/` + id).then((response) => response.data);
    }

    getNotificationByMessageId(params) {
        return this.axios.get(`/notification/box`, {params}).then((response) => response.data);
    }
}
