import {CancelToken} from 'axios';

export default class PostService {
  constructor(axios) {
    this.axios = axios;
  }

  getListPost(params) {
    return this.axios.get(`/posts`, {params}).then(response => response.data);
  }

  createPost(data) {
    return this.axios.post('/user_post', data).then(response => response.data);
  }

  getListTag(keyword, limit) {
    return this.axios
      .get(`/search_tag?keyword=${keyword}&limit=${limit}`)
      .then(response => response.data);
  }

  getTagHistory() {
    return this.axios
      .get(`/search_tag_history`)
      .then(response => response.data);
  }

  likePost(id) {
    return this.axios
      .post(`/user_post/${id}/like`, {})
      .then(response => response.data);
  }

  unlikePost(id) {
    return this.axios
      .post(`/user_post/${id}/unlike`, {})
      .then(response => response.data);
  }

  getPostComment(id) {
    return this.axios
      .get(`/posts/${id}/comment`)
      .then(response => response.data);
  }

  likePostComment(id) {
    return this.axios
      .post(`posts_comment/${id}/like`, {})
      .then(response => response.data);
  }

  unlikePostComment(id) {
    return this.axios
      .post(`posts_comment/${id}/unlike`, {})
      .then(response => response.data);
  }

  createComment(data) {
    return this.axios
      .post(`post/comment`, data)
      .then(response => response.data);
  }

  getListUser(nickname, limit, postId) {
    return this.axios
      .get(`/search_user?nickname=${nickname}&limit=${limit}&post_id=${postId}`)
      .then(response => response.data);
  }

  getPostByTag(params, cancelRef = {current: null}) {
    return this.axios
      .get(`/search_post_by_tag`, {
        params,
        cancelToken: new CancelToken(c => {
          cancelRef.current = c;
        }),
      })
      .then(response => response.data)
      .catch(e => {
        console.log(e);
        throw e;
      });
  }

  deleteTagHistory(keyword) {
    return this.axios
      .delete(`/delete_tag_history`, {data: {keyword}})
      .then(response => response.data);
  }

  getDetailPost(id) {
    return this.axios.get(`/post/${id}`).then(response => response.data);
  }

  addTagHistory(keyword) {
    return this.axios
      .post(`tag_history`, {keyword})
      .then(response => response.data);
  }

  editPost(id, data) {
    return this.axios
      .put(`/${id}/edit_post`, data)
      .then(response => response.data);
  }

  deletePost(id) {
    return this.axios
      .delete(`/delete_post/${id}`)
      .then(response => response.data);
  }

  updateComment(data) {
    return this.axios.put(`/comment`, data).then(response => response.data);
  }

  deleteComment(id) {
    return this.axios.delete(`/comment/${id}`).then(response => response.data);
  }

  reportPost(data) {
    return this.axios.post(`report_sns`, data).then(response => response.data);
  }

  getPopularTag() {
    return this.axios.get(`/tag_popular`, {}).then(response => response.data);
  }
}
