export default class UploadingService {
    constructor(axios) {
        this.axios = axios;
    }

    uploadPostImage(image) {
        return this.axios.post('/upload-image-post', image).then(response => response.data);
    }

    uploadImage(image) {
        return this.axios.post('/upload-image', image).then(response => response.data);
    }

    uploadCarCertificate(data){
        return this.axios.post('/user/image-certificates', data).then(response => response.data);
    }

    orderImage(data) {
        return this.axios.put('/car/order_image', data);
    }

    uploadPrivateImage(image) {
        return this.axios.post('/upload-image-private', image).then(response => response.data);
    }
}
