export const GET_POST_BY_TAG = 'GET_POST_BY_TAG';
export const CHANGE_POST_TAB_NUMBER = 'CHANGE_POST_TAB_NUMBER';
export const SET_POST = 'SET_POST';
export const GET_ALL_POST = 'GET_ALL_POST';
export const GET_POPULARITY_POST = 'GET_POPULARITY_POST';
export const ACTION__$PROGRESS = 'ACTION__$PROGRESS';
export const ACTION__$DONE = 'ACTION__$DONE';
export const LOAD_MOR_POST = 'LOAD_MOR_POST';
export const REFRESH_POST = 'REFRESH_POST';
export const DELETE_POST = 'DELETE_POST';
export const LIKE_POST = 'LIKE_POST';
export const LOAD_MORE_POST_TAG = 'LOAD_MORE_POST_TAG';
export const LOAD_TAG_HISTORY = 'LOAD_TAG_HISTORY';
export const ADD_TAG = 'ADD_TAG';
export const DELETE_TAG = 'DELETE_TAG';
export const SET_KEYWORD = 'SET_KEYWORD';
export const UNLIKE_POST = 'UNLIKE_POST';
export const SET_LIKE_STATUS = 'SET_LIKE_STATUS';
export const IMAGE_DELETE_SUCCESS = 'IMAGE_DELETE_SUCCESS';

export function getPostByTag(keyword) {
  return {
    type: GET_POST_BY_TAG,
    keyword,
  };
}

export function loadMorPostTag(keyword, page) {
  return {
    type: LOAD_MORE_POST_TAG,
    keyword,
    page,
  };
}

export function changePostTab(number, keyword, screenNumber) {
  return {
    type: CHANGE_POST_TAB_NUMBER,
    number,
    keyword,
    screenNumber,
  };
}

export function setPost(id) {
  return {
    type: SET_POST,
    postId: id,
  };
}

export function getAllPost() {
  return {
    type: GET_ALL_POST,
  };
}

export function getPopularityPost() {
  return {
    type: GET_POPULARITY_POST,
  };
}

export function refreshPost(postParams, post) {
  return {
    type: REFRESH_POST,
    postParams,
    post,
  };
}

export function loadMor(postParams, postName) {
  return {
    type: LOAD_MOR_POST,
    postParams,
    postName,
  };
}

export function loadTagHistory() {
  return {
    type: LOAD_TAG_HISTORY,
  };
}

export function addTagBy(keyword) {
  return {
    type: ADD_TAG,
    keyword,
  };
}

export function deleteTagBy(keyword) {
  return {
    type: DELETE_TAG,
    keyword,
  };
}

export function setKeyword(value) {
  return {
    type: SET_KEYWORD,
    value,
  };
}

export function deletePostBy(id) {
  return {
    type: DELETE_POST,
    id,
  };
}
export function ImagePostDeleteSuccess() {
  return {
    type: IMAGE_DELETE_SUCCESS,
  };
}

export function likePostBy(id) {
  return {
    type: LIKE_POST,
    id,
  };
}

export function unlikePostBy(id) {
  return {
    type: UNLIKE_POST,
    id,
  };
}

export function setLikeStatus(liked, totalLike) {
  return {
    type: SET_LIKE_STATUS,
    liked,
    totalLike,
  };
}
