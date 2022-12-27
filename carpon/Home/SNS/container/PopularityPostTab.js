import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PostContent from '../components/PostContent';
import {postService} from '../../../services';
import color from '../../../color';
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import {useSNSContext} from '../SNSContext';
import {connect} from 'react-redux';
import {
  getPopularityPost,
  loadMor,
  refreshPost,
  setKeyword,
} from '../action/SNSAction';
import {viewPage} from '../../../Tracker';
import SingleBanner from '../../../../components/SingleBanner/SingleBanner';

function PopularityPostTab(props) {
  useEffect(() => {
    resetPage();
    props.getPopularityPost();
  }, []);

  useEffect(() => {
    props.route.index === 1 && viewPage('popular_posts', '人気投稿');
  }, [props.route.index]);

  const [{}, {focusTab}] = useSNSContext();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hashTagList, setHasTagList] = useState([]);
  const [isExpand, setIsExpand] = useState(false);

  const getPopularTagList = () => {
    postService
      .getPopularTag()
      .then(response => {
        setHasTagList(response);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const resetPage = () => {
    setLoading(true);
    getListPost(1);
    getPopularTagList();
  };

  const getListPost = page => {
    const params = {
      page,
      popular: true,
    };
    postService
      .getListPost(params)
      .then(response => {
        setPosts(page > 1 ? [...posts, ...response.data] : response.data);
        setHasNext(response.has_next);
        setPage(page);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  function handleLoadMore() {
    props.loadMor({popular: true, page: props.page + 1}, 'PopularityPost');
  }

  function handleRefresh() {
    props.refreshPost({popular: true}, 'PopularityPost');
    !loading && getPopularTagList();
  }

  const renderItem = ({item, index}) => {
    return <PostContent data={item} key={index} />;
  };

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

  let dataList = hashTagList;
  if (!isExpand) dataList = hashTagList.slice(0, 5);
  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      <FlatList
        extraData={props.post ? props.post.length : 0}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            <SingleBanner />
            <View style={{paddingVertical: 20, paddingLeft: 15}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>人気のタグ</Text>
            </View>
            <View style={{borderTopWidth: 0.5, borderColor: '#707070'}}>
              {dataList.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    focusTab(2);
                    props.setKeyword(item.keyword);
                  }}
                  style={{
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    borderBottomWidth: 0.5,
                    borderColor: '#707070',
                  }}
                  key={index}>
                  <Text
                    style={{
                      color: '#262626',
                      fontSize: 14,
                      fontWeight: 'bold',
                      lineHeight: 20,
                    }}>
                    #
                    {item.keyword && item.keyword.length >= 20
                      ? item.keyword.substring(0, 20) + '...'
                      : item.keyword}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: color.active,
                        fontSize: 13,
                        lineHeight: 20,
                        minWidth: 30,
                        maxWidth: 40,
                      }}>
                      {item.total}件
                    </Text>

                    <SvgImage fill={color.active} source={SvgViews.ArrowLeft} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {hashTagList.length > 5 && (
              <TouchableOpacity
                onPress={() => {
                  setIsExpand(!isExpand);
                }}
                style={{alignItems: 'flex-end'}}>
                <Text
                  style={{
                    margin: 15,
                    color: color.active,
                    textDecorationLine: 'underline',
                  }}>
                  {isExpand ? '戻す' : 'もっと見る'}
                </Text>
              </TouchableOpacity>
            )}
            <View style={{paddingTop: 20, paddingLeft: 15}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>人気の投稿</Text>
            </View>
          </View>
        }
        onEndReached={handleLoadMore}
        ListFooterComponent={renderFooter}
        renderItem={renderItem}
        onEndReachedThreshold={3}
        data={props.posts}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default connect(
  state => ({
    userProfile: state.registration.userProfile.myProfile,
    posts: state.snsReducer.PopularityPost
      ? state.snsReducer.PopularityPost.data
      : [],
    page: state.snsReducer.PopularityPost
      ? state.snsReducer.PopularityPost.page
      : 1,
    has_next: state.snsReducer.PopularityPost
      ? state.snsReducer.PopularityPost.has_next
      : false,
    loading: state.snsReducer.PopularityPostLoading,
  }),
  dispatch => ({
    loadMor: (post, page) => dispatch(loadMor(post, page)),
    refreshPost: (postParams, post) => dispatch(refreshPost(postParams, post)),
    setKeyword: keyword => dispatch(setKeyword(keyword)),
    getPopularityPost: () => dispatch(getPopularityPost()),
  }),
)(PopularityPostTab);
