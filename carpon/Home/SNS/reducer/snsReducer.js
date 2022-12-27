import {
  ADD_TAG,
  CHANGE_POST_TAB_NUMBER,
  DELETE_POST,
  DELETE_TAG,
  ACTION__$DONE,
  ACTION__$PROGRESS,
  GET_POST_BY_TAG,
  LIKE_POST,
  SET_POST,
  LOAD_MOR_POST,
  LOAD_TAG_HISTORY,
  REFRESH_POST,
  SET_KEYWORD,
  UNLIKE_POST,
  SET_LIKE_STATUS,
  IMAGE_DELETE_SUCCESS,
  LOAD_MORE_POST_TAG,
  GET_ALL_POST,
  GET_POPULARITY_POST,
} from '../action/SNSAction';
import _ from 'lodash';

const initialState = {
  AllPostLoading: false,
  PopularityPostLoading: false,
  TaggedPostLoading: false,
  DeletePostLoading: false,
  LikePostLoading: false,
  postTabNumber: 0,
  keyword: null,
  AllPost: {},
  PopularityPost: {},
  TaggedPost: {data: [], has_next: false, page: 1},
  tagHistory: [],
  detailPost: {
    postId: null,
    liked: false,
    totalLike: 0,
  },
  ImagePostInMyPageDeleting: false,
};

export function removeOnePost(posts, removePostId) {
  return posts.filter(post => post.id !== removePostId);
}

export function likePost(posts, postId) {
  const indexPost = _.findIndex(posts, post => {
    return postId === post.id;
  });
  if (indexPost > -1) {
    const newPosts = [...posts];
    newPosts[indexPost] = {
      ...newPosts[indexPost],
      liked: true,
      total_like_post: newPosts[indexPost].total_like_post + 1,
    };

    return newPosts;
  }

  return posts;
}

export function unlikePost(posts, postId) {
  const indexPost = _.findIndex(posts, post => {
    return postId === post.id;
  });
  if (indexPost > -1) {
    const newPosts = [...posts];
    newPosts[indexPost] = {
      ...newPosts[indexPost],
      liked: false,
      total_like_post: newPosts[indexPost].total_like_post - 1,
    };

    return newPosts;
  }

  return posts;
}

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTION__$PROGRESS:
      return {
        ...state,
        [action.LoadingKeyword]: true,
      };

    case ACTION__$DONE:
      return {
        ...state,
        [action.LoadingKeyword]: false,
      };

    case CHANGE_POST_TAB_NUMBER:
      return {
        ...state,
        postTabNumber: action.number,
        keyword: action.keyword ? action.keyword : state.keyword,
      };

    case SET_POST:
      return {
        ...state,
        detailPost: {
          ...state.detailPost,
          postId: action.postId,
        },
      };

    case SET_LIKE_STATUS:
      return {
        ...state,
        detailPost: {
          ...state.detailPost,
          liked: action.liked,
          totalLike: action.totalLike,
        },
      };

    case GET_ALL_POST:
      return {
        ...state,
        AllPost: action.AllPost,
      };

    case GET_POPULARITY_POST:
      return {
        ...state,
        PopularityPost: action.PopularityPost,
      };

    case GET_POST_BY_TAG:
      return {
        ...state,
        TaggedPost: action.TaggedPost,
      };

    case LOAD_MORE_POST_TAG:
      return {
        ...state,
        TaggedPost: {
          ...state.TaggedPost,
          data: _.uniqBy([...state.TaggedPost.data, ...action.data], 'id'),
          has_next: action.has_next,
          page: action.page,
        },
      };

    case LOAD_MOR_POST:
      return {
        ...state,
        [action.postName]: {
          ...state[action.postName],
          data: _.uniqBy(
            [...state[action.postName].data, ...action.data],
            'id',
          ),
          has_next: action.has_next,
          page: action.postParams.page,
        },
      };

    case REFRESH_POST:
      return {
        ...state,
        [action.post]: {
          ...state[action.post],
          page: 1,
          has_next: action.has_next,
          data: action.data,
        },
      };

    case LOAD_TAG_HISTORY:
      return {
        ...state,
        tagHistory: action.tagHistory,
      };

    case ADD_TAG:
      return {
        ...state,
        tagHistory: action.tagHistory,
      };

    case DELETE_TAG:
      return {
        ...state,
        tagHistory: action.tagHistory,
      };

    case 'CHANGE_SCREEN_NUMBER':
      return {
        ...state,
        keyword: action.keyword ? action.keyword : state.keyword,
      };

    case SET_KEYWORD:
      return {
        ...state,
        keyword: action.value,
      };

    case DELETE_POST:
      return {
        ...state,
        ImagePostInMyPageDeleting: true,
        AllPost: {
          ...state.AllPost,
          data: removeOnePost(state.AllPost.data, action.id),
        },
        PopularityPost: {
          ...state.PopularityPost,
          data: removeOnePost(state.PopularityPost.data, action.id),
        },
        TaggedPost: {
          ...state.TaggedPost,
          data: removeOnePost(state.TaggedPost.data, action.id),
        },
      };

    case IMAGE_DELETE_SUCCESS:
      return {
        ...state,
        ImagePostInMyPageDeleting: false,
      };

    case LIKE_POST:
      return {
        ...state,
        AllPost: {
          ...state.AllPost,
          data: likePost(state.AllPost.data, action.id),
        },
        PopularityPost: {
          ...state.PopularityPost,
          data: likePost(state.PopularityPost.data, action.id),
        },
        TaggedPost: {
          ...state.TaggedPost,
          data: likePost(state.TaggedPost.data, action.id),
        },
        detailPost: {
          ...state.detailPost,
          liked:
            action.id === state.detailPost.postId
              ? true
              : state.detailPost.liked,
          totalLike:
            action.id === state.detailPost.postId
              ? state.detailPost.totalLike + 1
              : state.detailPost.totalLike,
        },
      };

    case UNLIKE_POST:
      return {
        ...state,
        AllPost: {
          ...state.AllPost,
          data: unlikePost(state.AllPost.data, action.id),
        },
        PopularityPost: {
          ...state.PopularityPost,
          data: unlikePost(state.PopularityPost.data, action.id),
        },
        TaggedPost: {
          ...state.TaggedPost,
          data: unlikePost(state.TaggedPost.data, action.id),
        },
        detailPost: {
          ...state.detailPost,
          liked:
            action.id === state.detailPost.postId
              ? false
              : state.detailPost.liked,
          totalLike:
            action.id === state.detailPost.postId
              ? state.detailPost.totalLike - 1
              : state.detailPost.totalLike,
        },
      };

    default:
      return state;
  }
}
