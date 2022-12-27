import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Clipboard,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {navigationService} from '../../../services';
import momentJA from '../../../services/momentJA';
import {UserPostInformation} from './UserPostInformation';
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import ButtonLike from '../../../../components/Common/ButtonLike';
import {FollowComponent} from '../../../../components/Common/FollowComponent';
import ActionSheet from 'react-native-actions-sheet';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ContentInPostList from './ContentInPostList';
import {
  deletePostBy,
  likePostBy,
  setLikeStatus,
  setPost,
  unlikePostBy,
} from '../action/SNSAction';
import {getBottomSpace} from 'react-native-iphone-x-helper';

const {width} = Dimensions.get('window');

function PostContent(props) {
  const [imageSize, setImageSize] = useState({width: 0, height: 0});
  const [loadingImage, setLoadingImage] = useState(true);
  const {
    id,
    sender,
    create_date,
    image_thumb,
    content,
    liked,
    total_like_post,
    total_comment,
    tag,
    has_comment,
    position_x,
    position_y,
    image,
  } = props.data;
  const actionSheetRef = useRef(null);
  const imageResize = image ? image : image_thumb;

  const RATIO = 2 / 3;
  const VIEW_BOX_WIDTH = width - 30;
  const VIEW_BOX_HEIGHT = VIEW_BOX_WIDTH * RATIO;

  const Y_OFFSET_LIMIT = VIEW_BOX_HEIGHT - imageSize.height;
  const X_OFFSET_LIMIT = VIEW_BOX_WIDTH - imageSize.width;

  const myPostSetting = [
    {
      title: '投稿を編集',
      color: '#007AFF',
      order: 'first',
      onPress: () => {
        navigationService.navigate('EditPostForm', {post_id: id});
        closeActionSheet();
      },
    },
    {
      title: '投稿を削除',
      color: '#007AFF',
      order: '',
      onPress: () => {
        handleAlertDeletePost();
      },
    },
    {
      title: '投稿をコピー',
      color: '#007AFF',
      order: 'last',
      onPress: () => {
        Clipboard.setString(content);
        closeActionSheet();
      },
    },
  ];

  function closeActionSheet() {
    return actionSheetRef.current.setModalVisible(false);
  }

  function handleAlertDeletePost() {
    return Alert.alert('投稿の削除', '本当に削除してよろしいでしょうか？', [
      {
        text: 'いいえ',
        style: 'cancel',
      },
      {
        text: 'はい',
        onPress: () => {
          props.deletePostBy(id);
          props.isDetail && navigationService.goBack();
          closeActionSheet();
        },
      },
    ]);
  }

  const userSetting = [
    {
      title: '投稿をコピー',
      onPress: () => {
        Clipboard.setString(content);
        closeActionSheet();
      },
      color: '#007AFF',
      order: 'first',
    },
    {
      title: '問題を報告',
      onPress: () => navigationService.navigate('ClaimPost', {post_id: id}),
      color: '#FF0000',
      order: 'last',
    },
  ];

  useEffect(() => {
    Image.getSize(imageResize, (actualWidth, actualHeight) => {
      const isLandscape = actualHeight / actualWidth < 2 / 3;
      const imageHeight = isLandscape
        ? VIEW_BOX_HEIGHT
        : (VIEW_BOX_WIDTH * actualHeight) / actualWidth;
      const imageWidth = isLandscape
        ? (VIEW_BOX_HEIGHT * actualWidth) / actualHeight
        : VIEW_BOX_WIDTH;
      const imageSize = {width: imageWidth, height: imageHeight};
      setImageSize(imageSize);
    });
  }, [imageResize]);

  const handleLike = () => {
    let post = props.data;
    post.liked ? props.unlikePostBy(post.id) : props.likePostBy(post.id);
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#4b9fa5',
        paddingHorizontal: 15,
        paddingTop: 25,
        paddingBottom: 15,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <UserPostInformation profile={sender} />
        <TouchableOpacity
          style={{
            padding: 6,
            width: 45,
            height: 33.75,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            alignSelf: 'stretch',
            borderRadius: 3,
          }}
          onPress={() => {
            actionSheetRef.current.setModalVisible(true);
          }}>
          <SvgImage source={SvgViews.Anything} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{zIndex: 0}}
        onPress={() => goToDetail()}
        activeOpacity={1}>
        <ImageBackground
          onLoadEnd={() => {
            setLoadingImage(false);
          }}
          source={{uri: imageResize}}
          imageStyle={{
            top: position_y
              ? position_y < Y_OFFSET_LIMIT
                ? Y_OFFSET_LIMIT
                : position_y
              : 0,
            left: position_x
              ? position_x < X_OFFSET_LIMIT
                ? X_OFFSET_LIMIT
                : position_x
              : 0,
            height: imageSize.height,
            width: imageSize.width,
          }}
          style={{
            backgroundColor: '#CCCCCC',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            resizeMode: 'cover',
            width: width - 30,
            height: ((width - 30) * 2) / 3,
            marginVertical: 15,
            position: 'relative',
          }}>
          {loadingImage && (
            <SkeletonPlaceholder backgroundColor={'#EAEAEA'} speed={1000}>
              <View
                style={{height: ((width - 30) * 2) / 3, width: width - 30}}
              />
            </SkeletonPlaceholder>
          )}
        </ImageBackground>
      </TouchableOpacity>
      <View style={{zIndex: 2}}>
        <Text
          style={{
            fontSize: 14,
            paddingBottom: 9,
            color: '#999',
          }}>
          {momentJA(create_date).fromNow()}
        </Text>
        <ContentInPostList
          content={content}
          tags={tag}
          onShowMore={() => goToDetail('content')}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 20,
          paddingBottom: 5,
          zIndex: 2,
        }}>
        <ButtonLike
          handleLike={() => handleLike()}
          liked={liked}
          total_like={total_like_post}
        />
        {sender.id !== props.userProfile.id && (
          <FollowComponent profile={sender} />
        )}
      </View>

      <TouchableOpacity
        onPress={() => goToDetail('comment')}
        style={{
          flexDirection: 'row',
          paddingTop: 15,
          paddingBottom: 7.5,
          zIndex: 2,
        }}>
        <SvgImage
          style={{width: 18, height: 16.5}}
          source={SvgViews.CommentIcon}
        />
        <Text
          style={{
            fontSize: 13,
            lineHeight: 17,
            marginLeft: 5,
            color: '#262626',
          }}>
          {has_comment
            ? total_comment > 0
              ? `コメントを見る (${total_comment}件)`
              : 'コメントを書く'
            : '投稿を見る'}
        </Text>
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        footerHeight={0}
        defaultOverlayOpacity={0.5}
        containerStyle={{
          width: width - 20,
          bottom: getBottomSpace(),
          backgroundColor: '#878787',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        {(sender.id === props.userProfile.id ? myPostSetting : userSetting).map(
          (item, index) => {
            return (
              <TouchableOpacity
                style={{
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#999',
                  backgroundColor: '#DDDDDF',
                  width: width - 20,
                  borderTopLeftRadius: item.order === 'first' ? 10 : 0,
                  borderTopRightRadius: item.order === 'first' ? 10 : 0,
                  borderBottomLeftRadius: item.order === 'last' ? 10 : 0,
                  borderBottomRightRadius: item.order === 'last' ? 10 : 0,
                }}
                key={index}
                onPress={() => item.onPress()}>
                <Text style={{fontSize: 20, color: item.color}}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          },
        )}
        <TouchableOpacity
          style={{
            height: 62,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 0.5,
            backgroundColor: '#FFF',
            borderRadius: 10,
            marginTop: 5,
            width: width - 20,
          }}
          onPress={() => closeActionSheet()}>
          <Text style={{fontSize: 20, color: '#007AFF'}}>キャンセル</Text>
        </TouchableOpacity>
      </ActionSheet>
    </View>
  );

  function goToDetail(section = null) {
    props.setPost(props.data.id);
    props.setLikeStatus(liked, total_like_post);
    navigationService.navigate('CommentPost', {
      section,
      postId: props.data.id,
      changePost: post => {
        let data = props.data;
        Object.assign(data, post);
        this.setState({});
      },
    });
  }
}

export default React.memo(
  connect(
    state => ({
      userProfile: state.registration.userProfile.myProfile,
      LikePostLoading: state.snsReducer.LikePostLoading,
    }),
    dispatch => ({
      unlikePostBy: id => dispatch(unlikePostBy(id)),
      likePostBy: id => dispatch(likePostBy(id)),
      deletePostBy: id => dispatch(deletePostBy(id)),
      setPost: id => dispatch(setPost(id)),
      setLikeStatus: (liked, total_like_post) =>
        dispatch(setLikeStatus(liked, total_like_post)),
    }),
  )(PostContent),
);
