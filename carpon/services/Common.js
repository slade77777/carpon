export default class Common {

    constructor(axios) {
        this.axios = axios;
    }

    getGenerateSignature(message, secretKey) {
        return this.axios.get(`/generate-signature?message=${message}&key=${secretKey}`).then(response => response.data);
    }


    contactAdmin(data) {
        return this.axios.post('/contact', data).then(response => response.data);
    }

    getAppversion(platform) {
        return this.axios.get('/version?platform=' + platform).then(response => response.data);
    }

}
