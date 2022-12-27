import _ from 'lodash';
import axios from 'axios';

export default class MyCarService {
    constructor(axios) {
        this.axios = axios;
    }

    updateOil(data) {
        return this.axios.post('/record/oil', data)
    }

    updateMileage(data) {
        return this.axios.post('/record/mileage', data)
    }

    updateLicense(data) {
        return this.axios.put('/car/'+ data.id + '/driver_license', data)
    }

    getMileage() {
        return this.axios.get('/record/history-mileage').then(response => response.data)
    }

    removeMileage(id) {
        return this.axios.delete(`/record/mileage`, {params : {id}}).then(response => response)
    }

    confirmRecall(data) {
        return this.axios.post('/car/'+ data.id + '/form-confirm', data)
    }

    unconfirmRecall(data) {
        return this.axios.delete('/car/un-confirm', {params: data})
    }

    updateTire(tire, id) {
        return this.axios.put(`/car/${id}/tire`, tire).then(response => response.status)
    }

    updateInsurance(data) {
        return this.axios.post('/car/'+ data.id + '/insurance', data)
    }

    updateCar(data) {
        return this.axios.put('/car/'+ data.id + '/platform_number', _.omit(data, ['id']))
    }

    updateCarImage(data) {
        return this.axios.post('/car/photo', data)
    }

    removeCarImage(id) {
        return this.axios.delete('/car/photo/' + id)
    }

    getInsuranceList() {
        return this.axios.get('/insurance-company')
    }

    updateCarLookup() {
        return this.axios.put('/car/update_lookup').then(response => response.data)
    }

    confirmCarLookup(confirm) {
        return this.axios.get('/car/confirm_car_lookup?confirm=' + confirm).then(response => response.data)
    }

    getCarModelChangePrediction() {
        return this.axios.get('/car/model_change_prediction').then(res => res.data)
    }

    getTireAdvertising(tire) {
        return this.axios.get(`/affiliate_tire?tire=${tire}`).then(res => res.data)
    }

    getDistanceList() {
        return this.axios.get('/oil/list-range').then(res => res.data)
    }

    getOilStoreList(range) {
        return this.axios.get('/oil/list?range=' + range + '&service_type=2').then(res => res.data)
    }

    getInspectionStoreList(range) {
        return this.axios.get('/oil/list?range=' + range + '&service_type=1').then(res => res.data)
    }

    getInspectionStoreBy(storeId, groupId) {
        return this.axios.get(`/oil/detail?service_type=1&store_id=${storeId}&group_id=${groupId}`).then(res => res.data)
    }

    getOilStoreDetail(storeId, groupId) {
        return this.axios.get(`/oil/detail?service_type=2&store_id=${storeId}&group_id=${groupId}`).then(res => res.data)
    }

    updateOilStore(data) {
        return this.axios.post('/oil/making-reservation', data).then(response => response.data)
    }

    getGasStationList(range, cor) {
        if (cor) {
            const requestOne = this.axios.get('/gas/list?range=' + range + '&lat=' + cor.latitude + '&lng=' + cor.longitude);
            const requestTwo = this.axios.get('/gas/top?range=' + range + '&lat=' + cor.latitude + '&lng=' + cor.longitude);
            return axios.all([requestOne, requestTwo])
        } else {
            const requestOne = this.axios.get('/gas/list?range=' + range);
            const requestTwo = this.axios.get('/gas/top?range=' + range);
            return axios.all([requestOne, requestTwo])
        }
    }

    getGasStationDetail(id) {
        return this.axios.get('/gas/detail?id=' + id).then(res => res.data)
    }

    getCampaign() {
        return this.axios.get('/user/campaign').then(res => res.data)
    }
}
