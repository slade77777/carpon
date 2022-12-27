export default class NewsService {

    constructor(axios) {
        this.axios = axios;
    }

    getNewsDetail(newsId) {
        return this.axios.get(`/news/${newsId}`)
    }

    getAllNews(params) {
        return this.axios.get('/news', {params}).then((response) => response.data)
    }

    getNewsOtherUser(Profile) {
        return this.axios.get(`my_news?profile_id=${Profile.id}&page=${Profile.page}`).then((response) => response.data)
    }

    postReportComment(comment_id, comment) {
        return this.axios.post(`/news_comment/${comment_id}/report`, {comment})
    }

    getComments(newsId) {
        return this.axios.get(`/news/${newsId}/comment`).then(response => response.data);
    }

    postNewsTab(data) {
        return this.axios.post('/news_tab', data).then(response => response.data)
    }

    getNewsTab() {
        return this.axios.get('/news_tab').then((response) => response.data)
    }

    removeNewsTab(tab_id) {
        return this.axios.delete(`/news_tab/${tab_id}`)
    }

    postReplyComment(news_id, comment) {
        return this.axios.post(`/news/${news_id}/comment`, {comment}).then(response => response.data);
    }

    deleteComemnt(comment_id) {
        return this.axios.delete(`/news_comment/${comment_id}`).then(response => response.status);
    }

    editComment(comment_id, comment) {
        return this.axios.put(`/news_comment/${comment_id}`, {comment}).then(response => response.data)
    }

    likeComment(comment_id) {
        return this.axios.post(`/news_comment/${comment_id}/like`)
    }

    unlikeComment(comment_id) {
        return this.axios.post(`/news_comment/${comment_id}/unlike`)
    }

    postNewsClip(news_id) {
        return this.axios.post(`/news/${news_id}/clip`).then(response => response.data)
    }

    unNewsClip(newId) {
        return this.axios.post(`/news/${newId}/un-clip`).then(response => response.data)
    }
}
