export default class InsuranceService {
    constructor(axios) {
        this.axios = axios;
    }
    getOptions() {
        return this.axios.get('/profile-options').then(response => response.data);
    }
}
