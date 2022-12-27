import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Clipboard,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {navigationService} from '../../../services';
import momentJA from '../../../services/momentJA';
import {UserPostInformation} from './UserPostInformation';
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import ContentPostText from './ContentPostText';
import ButtonLike from '../../../../components/Common/ButtonLike';
import {FollowComponent} from '../../../../components/Common/FollowComponent';
import ActionSheet from 'react-native-actions-sheet';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {deletePostBy, likePostBy, unlikePostBy} from '../action/SNSAction';
import {getBottomSpace} from 'react-native-iphone-x-helper';

const {width} = Dimensions.get('window');

function PostContentInDetailPage(props) {
  const [imageHeight, setImageHeight] = useState((width / 2) * 3);
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadImageSize, setLoadSizeImage] = useState(true);
  const {
    id,
    sender,
    create_date,
    image_thumb,
    content,
    liked,
    total_like_post,
    tag,
    image,
  } = props.data;
  const actionSheetRef = useRef(null);
  const imageResize = image ? image : image_thumb;

  const RATIO = 2 / 3;
  const VIEW_BOX_WIDTH = width - 30;
  const VIEW_BOX_HEIGHT = VIEW_BOX_WIDTH * RATIO;

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
          navigationService.goBack();
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
    setLoadSizeImage(true);
    Image.getSize(imageResize, (actualWidth, actualHeight) => {
      const isLandscape = actualHeight / actualWidth < 2 / 3;
      const imageHeight = isLandscape
        ? VIEW_BOX_HEIGHT
        : (VIEW_BOX_WIDTH * actualHeight) / actualWidth;
      setImageHeight(imageHeight);
      setLoadSizeImage(false);
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 60,
        }}>
        <UserPostInformation isMainPost={true} profile={sender} />
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
      <TouchableOpacity style={{zIndex: 0}} activeOpacity={1}>
        <View style={{marginVertical: 20}}>
          {loadImageSize ? (
            <SkeletonPlaceholder backgroundColor={'#EAEAEA'} speed={1000}>
              {
                <View
                  style={{
                    height: (width * 2) / 3,
                    width: '100%',
                  }}
                />
              }
            </SkeletonPlaceholder>
          ) : (
            <Image
              source={{uri: image_thumb}}
              onLoadEnd={() => {
                setLoadingImage(false);
              }}
              style={{
                height: imageHeight,
                resizeMode: 'contain',
              }}
            />
          )}
        </View>
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
        <ContentPostText
          content={content}
          tags={tag}
          style={{fontSize: 17, marginTop: 15, color: '#333'}}
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
}

export default connect(
  state => ({
    userProfile: state.registration.userProfile.myProfile,
    LikePostLoading: state.snsReducer.LikePostLoading,
  }),
  dispatch => ({
    unlikePostBy: id => dispatch(unlikePostBy(id)),
    likePostBy: id => dispatch(likePostBy(id)),
    deletePostBy: id => dispatch(deletePostBy(id)),
  }),
)(PostContentInDetailPage);
