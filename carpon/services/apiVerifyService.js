export default class ApiVerifyService {

    constructor(axios) {
        this.axios = axios;
    }

    postCode(mobile, code, id) {
        return this.axios.post(`/auth/verify`, {mobile, code, id}).then(response => response.data);
    }

    forgotPassword(mail) {
        return this.axios.get(`/forgot-password?email=${mail}`).then(response => response.data);
    }

    resetPassword(params) {
        return this.axios.put('update-password', params).then(response => response.data);
    }

    ivrCall(params) {
        return this.axios.post('ivr_api', params).then(response => response.data);
    }

    confirmIvr(id) {
        return this.axios.get(`/confirm-ivr?id=${id}`).then(response => response.data);
    }

    verifyUser(params) {
        return this.axios.get(`/verify_user`, {params}).then(response => response.data);
    }
}
