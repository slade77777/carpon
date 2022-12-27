import {
  ADD_TAG,
  DELETE_POST,
  DELETE_TAG,
  GET_ALL_POST,
  GET_POPULARITY_POST,
  GET_POST_BY_TAG,
  LIKE_POST,
  LOAD_MOR_POST,
  LOAD_MORE_POST_TAG,
  LOAD_TAG_HISTORY,
  REFRESH_POST,
  UNLIKE_POST,
} from '../action/SNSAction';
import {postService} from '../../../services';
import {Cancel} from 'axios';

const cancelFetchingPostsRef = {current: null};

const SNSMiddleware = store => next => action => {
  const AllPost = {page: 1};
  const PopularityPost = {page: 1, popular: true};

  switch (action.type) {
    case GET_ALL_POST:
      store.dispatch({
        type: 'ACTION__$PROGRESS',
        LoadingKeyword: 'AllPostLoading',
      });
      return postService
        .getListPost(AllPost)
        .then(response => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'AllPostLoading',
          });
          return next({
            ...action,
            AllPost: {...response, page: 1},
          });
        })
        .catch(error => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'AllPostLoading',
          });
        });

    case GET_POPULARITY_POST:
      store.dispatch({
        type: 'ACTION__$PROGRESS',
        LoadingKeyword: 'PopularityPostLoading',
      });
      return postService
        .getListPost(PopularityPost)
        .then(response => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'PopularityPostLoading',
          });
          return next({
            ...action,
            PopularityPost: {...response, page: 1},
          });
        })
        .catch(error => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'PopularityPostLoading',
          });
        });

    case GET_POST_BY_TAG:

      store.dispatch({
        type: 'ACTION__$PROGRESS',
        LoadingKeyword: 'InitialTaggedPostLoading',
      });

      if (cancelFetchingPostsRef.current) {
        cancelFetchingPostsRef.current('Cancel fetching Posts by tag');
      }

      return postService
        .getPostByTag(
          {tag_content: action.keyword, page: 1},
          cancelFetchingPostsRef,
        )
        .then(response => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'InitialTaggedPostLoading',
          });
          return next({
            ...action,
            TaggedPost: {...response, page: 1},
          });
        })
        .catch(error => {
          if (error instanceof Cancel) {
            store.dispatch({
              type: 'ACTION__$PROGRESS',
              LoadingKeyword: 'InitialTaggedPostLoading',
            });
          } else {
            store.dispatch({
              type: 'ACTION__$DONE',
              LoadingKeyword: 'InitialTaggedPostLoading',
            });
            return next({
              ...action,
              TaggedPost: {data: [], page: 1, has_next: false},
            });
          }
        });

    case LOAD_MOR_POST:
      store.dispatch({
        type: 'ACTION__$PROGRESS',
        LoadingKeyword: `${action.postName}Loading`,
      });
      return postService
        .getListPost({...action.postParams})
        .then(result => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: `${action.postName}Loading`,
          });
          return next({
            ...action,
            data: result.data,
            has_next: result.has_next,
          });
        })
        .catch(error => {
          console.log(error);
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: `${action.postName}Loading`,
          });
        });

    case LOAD_MORE_POST_TAG:
      store.dispatch({
        type: 'ACTION__$PROGRESS',
        LoadingKeyword: 'TaggedPostLoading',
      });
      return postService
        .getPostByTag({tag_content: action.keyword, page: action.page})
        .then(result => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'TaggedPostLoading',
          });
          return next({
            ...action,
            data: result.data,
            has_next: result.has_next,
            page: action.page,
          });
        })
        .catch(() => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'TaggedPostLoading',
          });
        });

    case REFRESH_POST:
      store.dispatch({
        type: 'ACTION__$PROGRESS',
        LoadingKeyword: `${action.post}Loading`,
      });
      return postService
        .getListPost({...action.postParams, page: 1})
        .then(result => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: `${action.post}Loading`,
          });
          return next({
            ...action,
            data: result.data,
            has_next: result.has_next,
          });
        })
        .catch(error => {
          console.log(error);
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: `${action.post}Loading`,
          });
        });

    case LOAD_TAG_HISTORY:
      return postService
        .getTagHistory()
        .then(response => {
          return next({...action, tagHistory: response});
        })
        .catch(error => {
          console.log(error.response);
        });

    case ADD_TAG:
      return postService
        .addTagHistory(action.keyword)
        .then(() => {
          postService.getTagHistory().then(response => {
            return next({...action, tagHistory: response});
          });
        })
        .catch(error => {
          console.log(error);
        });

    case DELETE_POST:
      store.dispatch({
        type: 'ACTION__$PROGRESS',
        LoadingKeyword: 'DeletePostLoading',
      });
      return postService
        .deletePost(action.id)
        .then(() => {
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'DeletePostLoading',
          });
          return next({...action});
        })
        .catch(error => {
          console.log(error.response);
          store.dispatch({
            type: 'ACTION__$DONE',
            LoadingKeyword: 'DeletePostLoading',
          });
        });

    case DELETE_TAG:
      return postService
        .deleteTagHistory(action.keyword)
        .then(() => {
          postService.getTagHistory().then(response => {
            return next({...action, tagHistory: response});
          });
        })
        .catch(error => {
          console.log(error.response);
        });

    case LIKE_POST:
      postService.likePost(action.id).catch(error => {
        console.log(error.response);
      });
      return next({...action});

    case UNLIKE_POST:
      postService.unlikePost(action.id).catch(error => {
        console.log(error.response);
      });
      return next({...action});

    default:
      return next(action);
  }
};

export default SNSMiddleware;
