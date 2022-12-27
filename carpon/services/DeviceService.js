export default class DeviceService {
    constructor(axios) {
        this.axios = axios;
    }

    postToken(device_token, platform) {
        return this.axios.post(`/user/device`, {device_token, platform})
    }
}
