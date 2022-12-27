export default class ApiSMSService {

    constructor(axios) {
        this.axios = axios;
    }

    getAuthOTP(params) {
        return this.axios.post(`/auth`, params).then(response => {
            return response.data
        });
    }

    login(loginInformation) {
        return this.axios.post(`/auth/login/email`, loginInformation).then(response => response.data)
    }

    getAuthOTPForDevice(params) {
        return this.axios.post(`/auth`, params).then(response => response.data)
    }
}
