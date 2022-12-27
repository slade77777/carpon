import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {Image} from 'react-native-elements';
import {navigationService, userProfileService} from '../../../services';
import {connect} from 'react-redux';
import {setLikeStatus, setPost} from '../action/SNSAction';
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import _ from 'lodash';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function ImagePost(props) {
  function debounceImage() {
    props.setPost(props.post.id);
    props.setLikeStatus(props.post.liked, props.post.totalLikePost);
    navigationService.push('CommentPost', {
      postId: props.post.id,
      post: props.post,
    });
  }

  const ImageResizeUri =
    props.post.imageThumbSm || props.post.image || props.post.imageThumb;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={_.debounce(debounceImage, 300)}>
      <Image
        source={{
          uri: ImageResizeUri,
        }}
        style={styles.image}
        PlaceholderContent={<ActivityIndicator size="small" color="#CED0CE" />}
      />
    </TouchableOpacity>
  );
}

function ListImagePost(props) {
  const [images, setImages] = useState([]);
  const [imgSkeleton] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
  ]);
  const [loading, setLoading] = useState(true);
  const heightData = isIphoneX() ? windowHeight - 180 : windowHeight - 120;

  useEffect(() => {
    loadPostImage(props.profileId);
  }, [props.profileId, props.ImagePostInMyPageDeleting]);

  function loadPostImage(id) {
    userProfileService
      .getPostImageByUser(props.profileId)
      .then(response => {
        setImages(response.data);
        setLoading(false);
      })
      .catch(error => {});
  }

  return (
    <View
      style={{
        paddingBottom: getBottomSpace(),
        minHeight: heightData,
      }}>
      {loading && (
        <SkeletonPlaceholder backgroundColor={'#EAEAEA'}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            flexWrap="wrap"
            alignItems="center"
            paddingHorizontal={1}>
            {imgSkeleton.map((item, index) => {
              return (
                <SkeletonPlaceholder.Item
                  backgroundColor={'#EAEAEA'}
                  key={index}
                  marginTop={1}
                  marginLeft={1}
                  width={windowWidth / 3 - 2}
                  height={((windowWidth / 3) * 135) / 136}
                />
              );
            })}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      )}

      <FlatList
        data={images}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 1,
        }}
        renderItem={(item, index) => {
          return (
            <ImagePost
              setLikeStatus={(liked, total_like_post) =>
                props.setLikeStatus(liked, total_like_post)
              }
              setPost={id => props.setPost(id)}
              key={index}
              post={item.item}
            />
          );
        }}
        keyExtractor={(item, index) => item.id}
        onEndReachedThreshold={0.8}
        maxToRenderPerBatch={20}
        windowSize={11}
      />
    </View>
  );
}

export default React.memo(
  connect(
    state => ({
      ImagePostInMyPageDeleting: state.snsReducer.ImagePostInMyPageDeleting,
    }),
    dispatch => ({
      setPost: id => dispatch(setPost(id)),
      setLikeStatus: (liked, total_like_post) =>
        dispatch(setLikeStatus(liked, total_like_post)),
    }),
  )(ListImagePost),
);

const styles = StyleSheet.create({
  wrapImage: {},
  image: {
    width: windowWidth / 3 - 2,
    resizeMode: 'cover',
    justifyContent: 'center',
    height: ((windowWidth / 3) * 135) / 136,
    marginBottom: 1,
    marginLeft: 1,
  },
});
