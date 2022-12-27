import React, {Component, createRef} from 'react';
import {ButtonText} from '../../../../components/index';
import {
  Alert,
  Dimensions,
  Image,
  InputAccessoryView,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {screen} from '../../../../navigation';
import {
  navigationService,
  postService,
  uploadingService,
} from '../../../../carpon/services/index';
import Icon from 'react-native-vector-icons/Ionicons';
import {SingleColumnLayout} from '../../../layouts';
import HeaderOnPress from '../../../../components/HeaderOnPress';
import {connect} from 'react-redux';
import {UserPostInformation} from '../components/UserPostInformation';
import color from '../../../color';
import ImageZoom from 'react-native-image-pan-zoom';
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';

const {width} = Dimensions.get('window');

export function extractTag(content, userList) {
  let tag_content = [];
  const newText = content.split(/([#,@]\S+)/);
  Array.isArray(newText) &&
    newText.map(text => {
      if (isTag(text)) {
        tag_content.push({
          content: text.replace('#', ''),
          type: 'hashtag',
        });
      }
      if (isUser(text)) {
        const userChoice = userList.find(
          user => user.content === text.replace('@', ''),
        );
        if (userChoice) tag_content.push(userChoice);
      }
    });
  return tag_content;
}

export function selectTag(tag, content, startTag, textPosition) {
  return (
    content.substring(0, startTag) +
    '#' +
    tag.content +
    content.substring(textPosition + 1, content.length)
  );
}

export function selectUserTagged(user, comment, startTag, textPosition) {
  return (
    comment.substring(0, startTag) +
    '@' +
    (user.nickName || user.lastName + user.firstName) +
    ' ' +
    comment.substring(textPosition + 1, comment.length)
  );
}

export function isTag(text) {
  return new RegExp(/#\S+/).test(text);
}

export function isUser(text) {
  return new RegExp(/@\S+/).test(text);
}

export function extractTagFromText(content) {
  const value = content.split(/([#,@]\S+)/);
  return value.map((text, key) => {
    return (
      <Text
        key={key}
        style={{color: isTag(text) || isUser(text) ? color.active : '#333333'}}>
        {text}
      </Text>
    );
  });
}

export function extractHashTagFromText(content) {
  const value = content.split(/(#\S+)/);
  return value.map((text, key) => {
    return (
      <Text key={key} style={{color: isTag(text) ? color.active : '#333333'}}>
        {text}
      </Text>
    );
  });
}

@screen('NewPostForm', {
  header: (
    <HeaderOnPress
      leftComponent={<Icon name="md-close" size={30} color="#FFFFFF" />}
      title={'新規投稿'}
    />
  ),
})
@connect(state => ({
  userProfile: state.registration.userProfile
    ? state.registration.userProfile.myProfile
    : {},
}))
export class NewPostForm extends Component {
  constructor(props) {
    super(props);
    this.postContentInputRef = createRef();
    this.state = {
      image_thumb: this.props.navigation.getParam('imageUrl'),
      content: '',
      loading: false,
      title: '',
      has_comment: true,
      imageWidth: 0,
      imageHeight: 0,
      listTag: [],
      listUser: [],
      taggedUsers: [],
      textPosition: 0,
      startTag: null,
      positionX: 0,
      positionY: 0,
      deltaY: 0,
      deltaX: 0,
      scale: 1,
      actualWidth: 0,
      actualHeight: 0,
      showFrame: false,
    };
  }

  componentDidMount() {
    this.setState({loading: true});
    this.updateImageSize(this.state.image_thumb);
  }

  imageRowChecker(width, height) {
    return width / height > 3 / 2;
  }

  updateImageSize(imageUrl) {
    const screenWidth = width - 30;
    imageUrl &&
      Image.getSize(imageUrl, (actualWidth, actualHeight) => {
        const deltaY =
          ((actualHeight * screenWidth) / actualWidth - (screenWidth * 2) / 3) /
          2;
        const deltaX =
          ((actualWidth * screenWidth * 2) / 3 / actualHeight - screenWidth) /
          2;
        this.setState({
          deltaY: deltaY,
          deltaX: deltaX,
          positionY: this.imageRowChecker(actualWidth, actualHeight)
            ? 0
            : 0 - deltaY,
          positionX: this.imageRowChecker(actualWidth, actualHeight)
            ? 0 - deltaX
            : 0,
          actualWidth: actualWidth,
          actualHeight: actualHeight,
        });
        const bodyFormData = new FormData();
        bodyFormData.append('image', {
          uri: this.state.image_thumb,
          type: 'image/jpeg',
          name: 'avatar',
        });
        bodyFormData.append('width', actualWidth);
        bodyFormData.append('height', actualHeight);
        uploadingService
          .uploadPostImage(bodyFormData)
          .then(response => {
            this.setState({
              imageHeight: this.imageRowChecker(actualWidth, actualHeight)
                ? (screenWidth * 2) / 3
                : (actualHeight * screenWidth) / actualWidth,
              imageWidth: this.imageRowChecker(actualWidth, actualHeight)
                ? (actualWidth * screenWidth * 2) / 3 / actualHeight
                : screenWidth,
              actualWidth,
              actualHeight,
              image_thumb: response.url,
              loading: false,
            });

            this.postContentInputRef.current.focus();
          })
          .catch(error => {
            Alert.alert(
              'エラー',
              '画像をアップロードできませんでした',
              [
                {
                  text: '投稿をキャンセル',
                  onPress: () => {
                    navigationService.goBack();
                  },
                },
                {
                  text: '再度アップロード',
                  onPress: () => {
                    this.updateImageSize(this.state.image_thumb);
                  },
                },
              ],
              {cancelable: false},
            );
          });
      });
  }

  onChangeText(text) {
    this.setState({content: text});
  }

  handleUpdate() {
    const {
      image_thumb,
      content,
      title,
      has_comment,
      positionX,
      positionY,
      actualWidth,
      actualHeight,
    } = this.state;
    const tag_content = extractTag(content, []);
    const data = {
      image_thumb,
      content,
      tag_content,
      title,
      has_comment,
      position_x: positionX,
      position_y: positionY,
      width: actualWidth,
      height: actualHeight,
    };
    this.setState({loading: true});
    postService
      .createPost(data)
      .then(result => {
        navigationService.navigate('CommentPost', {
          postId: result.id,
          clearToMainTab: true,
          changePost: post => {
            let data = props.data;
            Object.assign(data, post);
            this.setState({});
          },
        });
      })
      .catch(error => {
        Alert.alert(
          'エラー',
          'エラー',
          [
            {
              text: 'OK',
              onPress: () => {
                this.setState({loading: false});
              },
            },
          ],
          {cancelable: false},
        );
      });
  }

  render() {
    const {
      content,
      loading,
      imageHeight,
      imageWidth,
      actualWidth,
      actualHeight,
    } = this.state;
    const inputText = extractHashTagFromText(content);
    let frameCol = [];
    let frameRow = [];
    for (let i = 1; i <= 4; i++) {
      frameCol.push(
        <View
          style={{
            width: 0.5,
            height: ((width - 30) * 2) / 3,
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            top: 0,
            left:
              i === 1
                ? (i * (width - 30) * 2) / 19
                : ((i * 5 - 3) * (width - 30)) / 19,
            zIndex: 2,
          }}
        />,
      );
    }
    for (let r = 1; r <= 2; r++) {
      frameRow.push(
        <View
          style={{
            width: width - 30,
            height: 0.5,
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            top: (r * (width - 30) * 2) / 9,
            left: 0,
            zIndex: 2,
          }}
        />,
      );
    }
    const inputAccessoryViewID = 'inputAccessoryViewID';

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SingleColumnLayout
          backgroundColor="white"
          topContent={
            <ScrollView
              contentInset={{bottom: 80}}
              scrollIndicatorInsets={{right: 1}}
              style={Styles.body}
              onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
              <View style={{margin: 15, paddingTop: 15}}>
                <UserPostInformation
                  isMainPost={true}
                  profile={this.props.userProfile}
                />
                <View style={Styles.input}>
                  <TextInput
                    ref={this.postContentInputRef}
                    inputAccessoryViewID={inputAccessoryViewID}
                    multiline={true}
                    style={Styles.initHeightInput}
                    onSelectionChange={({nativeEvent: {selection}}) => {
                      if (Platform.OS === 'ios') {
                        this.setState({textPosition: selection.start - 1});
                      } else {
                        this.setState({textPosition: selection.start});
                      }
                    }}
                    placeholder={'#ハッシュタグ を付けて写真を投稿しよう'}
                    onChangeText={this.onChangeText.bind(this)}>
                    <Text>{inputText}</Text>
                  </TextInput>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.setState({has_comment: !this.state.has_comment});
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 20,
                    alignItems: 'center',
                    paddingRight: 20,
                  }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 2,
                      paddingBottom: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: this.state.has_comment
                        ? '#4B9FA5'
                        : '#EFEFEF',
                    }}>
                    <SvgImage source={SvgViews.IconDoneWhite} />
                  </View>
                  <Text
                    style={{marginLeft: 10, color: '#333333', fontSize: 17}}>
                    コメントを受け付ける
                  </Text>
                </TouchableOpacity>
                {loading ? (
                  <SkeletonPlaceholder backgroundColor={'#EAEAEA'} speed={1000}>
                    <View
                      style={{
                        width: width - 30,
                        height: ((width - 30) * 2) / 3,
                      }}
                    />
                  </SkeletonPlaceholder>
                ) : (
                  <View
                    style={{width: width - 30, height: ((width - 30) * 2) / 3}}>
                    {this.state.showFrame && frameCol}
                    {this.state.showFrame && frameRow}
                    <ImageZoom
                      scale={1}
                      cropWidth={width - 30}
                      cropHeight={((width - 30) * 2) / 3}
                      imageWidth={imageWidth}
                      imageHeight={imageHeight}
                      enableDoubleClickZoom={false}
                      pinchToZoom={false}
                      renderIndicator={() => null}
                      saveToLocalByLongPress={false}
                      enableCenterFocus={false}
                      onMove={data => {
                        this.setState({
                          positionX: this.imageRowChecker(
                            actualWidth,
                            actualHeight,
                          )
                            ? data.positionX - this.state.deltaX
                            : 0,
                          positionY: this.imageRowChecker(
                            actualWidth,
                            actualHeight,
                          )
                            ? 0
                            : data.positionY - this.state.deltaY,
                          scale: data.scale,
                          showFrame: true,
                        });
                        setTimeout(() => {
                          this.setState({showFrame: false});
                        }, 500);
                      }}>
                      <Image
                        style={{width: imageWidth, height: imageHeight}}
                        source={{uri: this.state.image_thumb}}
                      />
                    </ImageZoom>
                  </View>
                )}
              </View>
            </ScrollView>
          }
          bottomContent={
            <View>
              {Platform.OS === 'ios' && (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                  <View
                    style={{
                      backgroundColor: 'rgba(112, 112, 112, 0.5)',
                      padding: 15,
                    }}>
                    <ButtonText
                      activeOpacity={loading ? 1 : 0.5}
                      style={{backgroundColor: loading ? '#CCC' : '#F37B7D'}}
                      title={'投稿する'}
                      onPress={() => !loading && this.handleUpdate()}
                    />
                  </View>
                </InputAccessoryView>
              )}
              <View
                style={{
                  backgroundColor: 'rgba(112, 112, 112, 0.5)',
                  paddingTop: 15,
                  paddingHorizontal: 15,
                  paddingBottom: isIphoneX() ? getBottomSpace() : 15,
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                }}>
                <ButtonText
                  activeOpacity={loading ? 1 : 0.5}
                  style={{backgroundColor: loading ? '#CCC' : '#F37B7D'}}
                  title={'投稿する'}
                  onPress={() => !loading && this.handleUpdate()}
                />
              </View>
            </View>
          }
        />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: 'white',
  },
  input: {
    paddingTop: 10,
    height: 120,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#CCCCCC',
    marginTop: 45,
    paddingVertical: 5,
  },
  icon: {
    marginLeft: '4%',
    marginRight: '4%',
    width: 40,
    height: 40,
  },
  mid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    height: 74,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  initHeightInput: {
    height: 110,
    fontSize: 16,
    color: '#262626',
    width: '100%',
    borderWidth: 0,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif',
  },
});
