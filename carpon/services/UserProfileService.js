export default class UserProfile {

    constructor(axios) {
        this.axios = axios;
    }

    postUserProfile(data) {
        return this.axios.post('/user', data).then(response => response.data);
    }

    updateUserMail(data) {
        return this.axios.put('/user/change_email', data);
    }

    updateUserProfile(data) {
        return this.axios.put('/user', data);
    }

    confirmEmail(data) {
        return this.axios.post('/verify_changing_email', data);
    }

    getOTPResend(email){
        return this.axios.post(`/user/email/resend-code`, email);
    }

    updatePassword(data) {
        return this.axios.post('/user/change-password', data).then(response => response.data);
    }

    checkEmailAvailable(email){
        return this.axios.post('/user/check-email',email).then(response => response.data);
    }
    getUserProfile() {
        return this.axios.get('/user').then(response => response.data);
    }

    getUserProfileBy(id) {
        return this.axios.get('/user/' + id).then(response => response.data);
    }

    getFollowerBy(id) {
        return this.axios.get(`/user/follower?profile_id=${id}`).then(response => response.data)
    }

    getMyFollower() {
        return this.axios.get(`/user/follower`).then(response => response.data)
    }

    getFollowingBy(id) {
        return this.axios.get(`/user/following?profile_id=${id}`).then(response => response.data)
    }

    getMyFollowing() {
        return this.axios.get('/user/following').then(response => response.data)
    }

    postFollow(id) {
        return this.axios.post(`/user/follow?following_id=${id}`)
    }

    UnFollow(id) {
        return this.axios.post(`/user/unfollow?following_id=${id}`)
    }

    updateAvatar(image) {
        return this.axios.post('/user/avatar', image);
    }

    getCarPhotos(profile_id) {
        return this.axios.get(`/user/${profile_id}/car/photos`).then(response => response.data)
    }

    getToken(token) {
        return this.axios.get(`/auth/verify-token?token=${token}`).then(response => response.data)
    }

    logout(token) {
        return this.axios.delete('/logout?device_token=' + token);
    }

    getOptions() {
        return this.axios.get('/profile-options').then(response => response.data);
    }

    updateProfileOptions(answer) {
        return this.axios.put('user/profile-options', answer);
    }

    getInsuranceProfile() {
        return this.axios.get('/insurance-history');
    }

    updateUser(data) {
        return this.axios.put('/user/update', data)
    }

    updateCarSelling(data) {
        return this.axios.post('/purchase_assessment/car_selling', data);
    }

    sendSMSCarNotHOYU() {
        return this.axios.post('/user/send_hoyu_status')
    }

    getPostImageByUser(id) {
        return this.axios.get(`/list_image_post?profile_id=${id}`)
    }

    removeUser() {
        return this.axios.delete('/user/remove-user');
    }
}


