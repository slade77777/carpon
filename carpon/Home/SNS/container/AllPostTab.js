import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, View} from 'react-native';
import PostContent from '../components/PostContent';
import {connect} from 'react-redux';
import {getAllPost, loadMor, refreshPost} from '../action/SNSAction';
import {viewPage} from '../../../Tracker';
import SingleBanner from '../../../../components/SingleBanner/SingleBanner';

const defaultPost = [];

function renderItem({item, index}) {
  return <PostContent data={item} key={index.toString()} />;
}

function AllPostTab(props) {
  useEffect(() => {
    props.getAllPost();
  }, []);

  useEffect(() => {
    props.route.index === 0 && viewPage('new_posts', '新着投稿');
  }, [props.route.index]);

  function handleLoadMore() {
    props.loadMor({page: props.page + 1}, 'AllPost');
  }

  function handleRefresh() {
    props.refreshPost({}, 'AllPost');
  }

  const [posts, setPosts] = useState(defaultPost);

  useEffect(() => {
    setPosts(props.posts);
  }, [props.posts]);

  return (
    <View style={{height: '100%'}}>
      <FlatList
        extraData={posts ? posts.length : 0}
        refreshControl={
          <RefreshControl
            refreshing={props.loading}
            onRefresh={handleRefresh}
          />
        }
        ListHeaderComponent={<SingleBanner />}
        onEndReached={handleLoadMore}
        ListFooterComponent={renderFooter}
        renderItem={renderItem}
        data={posts}
        onEndReachedThreshold={3}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  function renderFooter() {
    if (!props.has_next) {
      return null;
    }
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" color="#CED0CE" />
      </View>
    );
  }
}

export default connect(
  state => ({
    userProfile: state.registration.userProfile.myProfile,
    posts: state.snsReducer.AllPost ? state.snsReducer.AllPost.data : [],
    page: state.snsReducer.AllPost ? state.snsReducer.AllPost.page : 1,
    has_next: state.snsReducer.AllPost
      ? state.snsReducer.AllPost.has_next
      : false,
    loading: state.snsReducer.AllPostLoading,
  }),
  dispatch => ({
    loadMor: (post, page) => dispatch(loadMor(post, page)),
    refreshPost: (postParams, post) => dispatch(refreshPost(postParams, post)),
    getAllPost: () => dispatch(getAllPost()),
  }),
)(AllPostTab);
