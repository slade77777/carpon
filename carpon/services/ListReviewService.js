export default class ListReviewService {

    constructor(axios) {
        this.axios = axios
    }

    getListReviewTop(params) {
        return this.axios.get('/review/top', {params: params}).then(response => response.data)
    }

    likeReview(review_id) {
        return this.axios.post(`/review/${review_id}/like`)
    }

    unlikeReview(review_id) {
        return this.axios.post(`/review/${review_id}/unlike`)
    }

    getSummary(params) {
        return this.axios.get('/review/summary', {params: params}).then(res => res.data)
    }

    getListReviewFollowCar(params) {
        return this.axios.get('/review/car', {params: params}).then(response => response.data)
    }

    getReviewDetail(review_id) {
        return this.axios.get(`/review/${review_id}`).then(response => response.data)
    }

    getReviewUser(profile_id, page) {
        return this.axios.get('/review/user', {params: {profile_id, page}}).then(res => res.data)
    }

    getPastReview(profile_id, page, review_id) {
        return this.axios.get('/review/past', {params: {profile_id, page, review_id}}).then(res => res.data)
    }


}