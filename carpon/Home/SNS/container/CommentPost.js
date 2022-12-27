import React, { Component }    from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
}                              from 'react-native';
import { screen }              from '../../../../navigation';
import {
  navigationService,
  postService,
}                              from '../../../../carpon/services/index';
import HeaderOnPress           from '../../../../components/HeaderOnPress';
import { connect }             from 'react-redux';
import Spinner                 from 'react-native-loading-spinner-overlay';
import { getBottomSpace }      from 'react-native-iphone-x-helper';
import Comment                 from '../components/Comment';
import {
  extractTag,
  extractTagFromText,
  selectTag,
  selectUserTagged,
}                              from './NewPostForm';
import _                       from 'lodash';
import ListUser                from '../components/ListUser';
import ListTag                 from '../components/ListTag';
import { TextInputPost }       from '../components/TextInputPost';
import { viewPage }            from '../../../Tracker';
import {
  setLikeStatus,
  setPost
}                              from '../action/SNSAction';
import PostContentInDetailPage from '../components/PostContentInDetailPage';

@screen('CommentPost', ({navigation}) => {
  const clearToMainTab = navigation.getParam('clearToMainTab');
  return {
    header: (
      <HeaderOnPress
        title={'詳細'}
        onPress={() =>
          clearToMainTab
            ? navigationService.clear('MainTab', {tabNumber: 2})
            : navigationService.goBack()
        }
      />
    ),
  };
})
@connect(
  state => ({
    userProfile: state.registration.userProfile
      ? state.registration.userProfile.myProfile
      : {},
    currentScreen: state.metadata.currentScreen
      ? state.metadata.currentScreen
      : null,
    postId: state.snsReducer.detailPost.postId,
    liked: state.snsReducer.detailPost.liked,
    total_like_post: state.snsReducer.detailPost.totalLike,
  }),
  dispatch => ({
    setPost: id => dispatch(setPost(id)),
    setLikeStatus: (liked, total_like_post) =>
      dispatch(setLikeStatus(liked, total_like_post)),
  }),
)
export class CommentPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spaceBottom: 0,
      comments: [],
      loading: false,
      allHasNext: false,
      comment: '',
      listTag: [],
      listUser: [],
      taggedUsers: [],
      textPosition: 0,
      startTag: null,
      postData: null,
      commentId: null,
      postId: null,
    };
    this.getListTag = _.debounce(this.getListTag, 200);
    this.getListUser = _.debounce(this.getListUser, 200);
    this.flatList = React.createRef();
    this.inputText = React.createRef();
    this.lastCommentRef = React.createRef();
    this.contentView = React.createRef();
    this.firstLoad = true;
  }

  componentDidMount() {
    const postId = this.props.navigation.getParam('postId');
    this.getPostData(postId);
    this.setState({postId: postId}, () => {
      this.getListComment();
    });
    viewPage('post_detail', `投稿_詳細：${postId}`);
  }

  scrollToSection() {
    const section = this.props.navigation.getParam('section');

    switch (section) {
      case 'comment':
        // this.lastCommentRef.measure((fx, fy, width, height, px, py) => {
        //     this.flatList.scrollTo({x: 0, y: Platform.OS === 'ios' ? fy : py - 50, animated: true})
        // });
        this.flatList.scrollToEnd();
        break;
      case 'content':
        this.contentView.measure((fx, fy, width, height, px, py) => {
          this.flatList.scrollTo({
            x: 0,
            y: Platform.OS === 'ios' ? fy : py - 50,
            animated: true,
          });
        });
        break;
      default:
        return;
    }
  }

  getPostData(postId) {
    return postService
      .getDetailPost(postId)
      .then(response => {
        this.props.setPost(postId);
        this.props.setLikeStatus(response.liked, response.total_like_post);
        this.setState({postData: response});
        const navigation = this.props.navigation;
        if (navigation) {
          const changePost = navigation.getParam('changePost');
          changePost && changePost(response);
        }
      })
      .catch(error => {});
  }

  getListComment(isScrollBottom) {
    return new Promise((resolve, reject) => {
      postService
        .getPostComment(this.state.postId)
        .then(response => {
          this.setState({comments: response.data}, () => {
            setTimeout(() => {
              isScrollBottom &&
                this.flatList &&
                this.flatList.scrollToEnd({animated: true});
            }, 100);
          });
          resolve('Success!');
        })
        .catch(error => {
          reject(new Error(error));
        });
    });
  }

  handleLoadMore() {
    // this.getListComment(true);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardWillShow(e) {
    this.setState({spaceBottom: e.endCoordinates.height - getBottomSpace()});
  }

  keyboardWillHide(e) {
    this.setState({spaceBottom: 0});
  }

  onTextChange(text) {
    this.setState({comment: text});
    let keyword = null;
    const currentText = text[this.state.textPosition];
    if (currentText === ' ') {
      this.setState({startTag: null});
    }
    if (currentText === '#') {
      this.setState({startTag: this.state.textPosition});
      return this.getListTag('', 3);
    }
    if (currentText === '@') {
      this.setState({startTag: this.state.textPosition});
      return this.getListUser('', 3);
    }
    if (this.state.startTag !== null) {
      keyword = text.substring(
        this.state.startTag,
        this.state.textPosition + 1,
      );
    }
    if (keyword) {
      if (keyword.charAt(0) === '#') {
        return this.getListTag(keyword.replace('#', ''), 3);
      }
      if (keyword.charAt(0) === '@') {
        return this.getListUser(keyword.replace('@', ''), 3);
      }
    }
    this.setState({listTag: [], listUser: []});
  }

  getListTag(keyword) {
    postService.getListTag(keyword, 3).then(response => {
      this.setState({listTag: response || []});
    });
  }

  getListUser(keyword) {
    postService
      .getListUser(keyword, 3, this.state.postData.id)
      .then(response => {
        this.setState({listUser: response || []});
      });
  }

  selectUserTag(user) {
    const {taggedUsers, comment, startTag, textPosition} = this.state;
    let tagUsers = taggedUsers;
    tagUsers.push({
      content: user.nickName || user.lastName + user.firstName,
      type: 'user',
      tag_user_id: user.id,
    });
    this.setState({
      comment: selectUserTagged(user, comment, startTag, textPosition),
      listUser: [],
      taggedUsers: tagUsers,
      startTag: null,
    });
  }

  selectTag(tag) {
    const {comment, startTag, textPosition} = this.state;
    this.setState({
      comment: selectTag(tag, comment, startTag, textPosition),
      listTag: [],
      startTag: null,
    });
  }

  handleSubmit() {
    Keyboard.dismiss();
    this.setState({loading: true});
    let tag_content = extractTag(this.state.comment, this.state.taggedUsers);
    if (this.state.commentId) {
      postService
        .updateComment({
          comment_id: this.state.commentId,
          tag_content,
          comment: this.state.comment,
        })
        .then(response => {
          this.setState({
            loading: false,
            commentId: null,
            comment: '',
            taggedUsers: [],
          });
          this.getListComment();
        })
        .catch(error => {
          this.setState({loading: false});
        });
    } else {
      postService
        .createComment({
          comment: this.state.comment,
          tag_content,
          post_id: this.props.navigation.getParam('postId'),
        })
        .then(response => {
          this.setState({
            loading: false,
            commentId: null,
            comment: '',
            taggedUsers: [],
          });
          this.getPostData(this.state.postId);
          this.getListComment(true);
        })
        .catch(error => {
          this.setState({loading: false});
        });
    }
  }

  render() {
    const {comments, listTag, listUser, comment, postData} = this.state;
    const inputText = extractTagFromText(comment);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F8F8F8'}}>
        <Spinner
          visible={this.state.loading}
          textContent={null}
          textStyle={{color: 'white'}}
        />
        <ScrollView
          scrollIndicatorInsets={{right: 1}}
          style={Styles.body}
          ref={ref => (this.flatList = ref)}>
          {postData && (
            <PostContentInDetailPage
              data={{
                ...postData,
                total_like_post: this.props.total_like_post,
                liked: this.props.liked,
              }}
              onImageLoaded={() => {
                this.scrollToSection();
              }}
            />
          )}
          <View ref={view => (this.contentView = view)} />
          {postData && postData.has_comment && (
            <FlatList
              extraData={comments}
              onEndReached={this.handleLoadMore.bind(this)}
              renderItem={this.renderItem.bind(this)}
              onEndReachedThreshold={0.8}
              data={comments}
              removeClippedSubviews={Platform.OS === 'android'}
            />
          )}
          <View
            ref={view => {
              this.lastCommentRef = view;
            }}
          />
        </ScrollView>
        <View style={{marginBottom: this.state.spaceBottom}}>
          {listTag.length > 0 && (
            <ListTag
              selectHashTag={tag => this.selectTag(tag)}
              listTag={this.state.listTag}
            />
          )}
          {listUser.length > 0 && (
            <ListUser
              selectUserTag={user => this.selectUserTag(user)}
              listUser={this.state.listUser}
            />
          )}
          {postData && postData.has_comment && (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#F8F8F8',
                alignItems: 'flex-end',
              }}>
              <TextInputPost
                ref={this.inputText}
                handleSubmit={() => this.handleSubmit()}
                hasComment={this.state.comment.length > 0}
                placeholder={'コメントを入力…'}
                maxLength={500}
                inputText={inputText}
                onSelectionChange={({nativeEvent: {selection}}) => {
                  if (Platform.OS === 'ios') {
                    this.setState({textPosition: selection.start - 1});
                  } else {
                    this.setState({textPosition: selection.start});
                  }
                }}
                onChangeText={text => this.onTextChange(text)}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  editCommentOpen(id, comment) {
    this.setState({commentId: id, comment});
    this.inputText.current && this.inputText.current.focus();
  }

  renderItem({item, index}) {
    return (
      <Comment
        refreshList={() => {
          this.getPostData(this.state.postId);
          this.getListComment();
        }}
        editComment={(id, content) => this.editCommentOpen(id, content)}
        data={item}
        key={item.id}
      />
    );
  }

  renderFooter(ready) {
    if (!ready) {
      return null;
    }
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: 'white',
  },
  inputComment: {
    height: 70,
    fontSize: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
    width: '100%',
  },
});
