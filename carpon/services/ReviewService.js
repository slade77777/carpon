export default class ReviewService {

    constructor(axios) {
        this.axios = axios;
    }

    postReview(data) {
        return this.axios.post('/review', data).then(response => response.data)
    }

    editReview(review) {
        return this.axios.put('/update_review/', review).then(response => response)
    }

    deleterReview(id) {
        return this.axios.delete(`del_review?review_id=${id}`).then(response => response)
    }

    checkAppReview() {
        return this.axios.post('/user/rating').then(response => response.data)
    }
}