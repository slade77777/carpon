export default class EmailConfirmationService {

    constructor(axios) {
        this.axios = axios;
    }

    postEmailConfirmation(code) {
        return this.axios.get(`/user/verify?code=${code}`).then(response => response.data)
    }
}