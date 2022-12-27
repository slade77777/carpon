export default class CarInformationService {

    constructor(axios) {
        this.axios = axios;
    }

    getCarInformation(params) {
        return this.axios.get(`/car/lookup?notSendAdmin=true`, {params}).then(response => response);
    }

    getCarCertificate(params) {
        return this.axios.get(`/car/qr_code?notSendAdmin=true`, {params}).then(response => response);
    }

    ChangeCarByCertificate(params) {
        return this.axios.post(`/car/change_car`, {...params}).then(response => response.data);
    }

    getCarBranches() {
        return this.axios.get('/car/maker').then(response => response.data);
    }

    getCarModel(maker_code) {
        return this.axios.get(`/car/maker/${maker_code}`)
    }

    getCarGradeModel(maker_code, name_code) {
        return this.axios.get(`/car/maker/${maker_code}/name/${name_code}`).then(res => res.data)
    }

    getCarColors() {
        return this.axios.get(`/car/color`).then(response => response.data.map(item => ({
            ...item,
            value: item.color_code,
            label: item.color_name
        })))
    }

    getCarGrade() {
        return this.axios.get('/car/grade')
    }

    updateCarInformation(information) {
        return this.axios.post('/car', information).then(response => response);
    }

    getCarDistance() {
        return this.axios.get('/car/mileage').then(response => response.data.map(item => ({
            ...item, value: item.id,
            label: item.value
        })))
    }

    getProfileMyCar() {
        return this.axios.get('/car').then(response => response.data)
    }

    getMyCarRecall(id, form) {
        return this.axios.get('/car/' + id + '/recall?form=' + form)
    }

    switchCarBy(QR) {
        return this.axios.post('/car/change_car', QR).then(response => response.data)
    }

    removeCar() {
        return this.axios.delete('/car').then(response => response.data)
    }

    updateGrade(param) {
        return this.axios.put('car/update-grade', param).then(response => response.data)
    }

    estimateCarPrice() {
        return this.axios.post('/car/pricing_estimation', {})
    }

    estimateCarSell() {
        return this.axios.post('/car/selling_Recommendation', {})
    }

    getListMileages() {
        return this.axios.get('/car/options-mileage').then(response => response.data)
    }

    getListStores(data) {
        return this.axios.post('/purchase_assessment/merchant_list', data).then(response => response.data)
    }

    addCarQR(params) {
        return this.axios.put(`/car/update/qr_code`, params).then(response => response);
    }

    getCarOutOfWorkingTime(params) {
        return this.axios.get(`/car/queue-number`, {params}).then(response => response.data);
    }

    getCarGradeList(maker_code, name_code) {
        return this.axios.get(`/car/list_grade/${maker_code}/name/${name_code}`).then(response => response.data);
    }

    skipCar() {
        return this.axios.put(`/car/skip`, {});
    }

    getTemporaryCar() {
        return this.axios.post(`/car/save_temporary_car`, {}).then(response => response.data);
    }
}
