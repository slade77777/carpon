import React, {Component} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {SceneMap, TabView} from 'react-native-tab-view';
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import {navigationService} from '../../../services/index';
import AllPostTab from './AllPostTab';
import AllNewsScreen from '../../News/container/AllNewsScreen';
import PopularityPostTab from './PopularityPostTab';
import TaggedPostTab from './TaggedPostTab';
import color from '../../../color';
import ActionSheet from 'react-native-actionsheet';
import {default as MultiImagePicker} from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {addTrackerEvent} from '../../../Tracker';
import {updateOptNews} from '../../News/action/newsAction';
import {changePostTab} from '../action/SNSAction';
import {SNSNavTab} from '../SNSContext';

@connect(
  state => ({
    isFirstTimeOpenNews: state.registration.userProfile.isFirstTimeOpenNews,
    TabNumber: state.snsReducer.postTabNumber
      ? state.snsReducer.postTabNumber
      : 0,
    keyword: state.snsReducer.keyword ? state.snsReducer.keyword : null,
  }),
  dispatch => ({
    updateOptNews: optNews => dispatch(updateOptNews(optNews)),
    changePostTab: tab => dispatch(changePostTab(tab)),
  }),
)
@SNSNavTab()
export default class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: this.props.keyword,
    };
  }

  handleOtpNews() {
    const isFirstTimeOpenNews = this.props.isFirstTimeOpenNews;
    isFirstTimeOpenNews &&
      Alert.alert(
        'マイカーニュースをお届け',
        'マイカーに関するおトクな情報をご登録メールアドレスにお届けしてもよろしいですか？',
        [
          {
            text: 'いいえ',
            onPress: () => {
              addTrackerEvent('news_mail_status_change', {
                user_permits_mail_news: false,
              });
              this.props.updateOptNews({optin_news: 0});
            },
          },
          {
            text: 'はい',
            onPress: () => {
              addTrackerEvent('news_mail_status_change', {
                user_permits_mail_news: true,
              });
              this.props.updateOptNews({optin_news: 1});
            },
          },
        ],
      );
  }

  _handleIndexChange = index => {
    const [{tabIndex}, {focusTab}] = this.props.tabNavigator;
    if (tabIndex === index) return;
    index === 3 && this.handleOtpNews();
    focusTab(index);
  };

  _renderTabBar = props => {
    const [{tabIndex}] = this.props.tabNavigator;
    return (
      <View
        style={{
          height: 40,
          flexDirection: 'row',
          backgroundColor: '#333333',
        }}>
        {props.navigationState.routes.map((route, i) => {
          const textColor = tabIndex === i ? '#4B9FA5' : '#FFFFFF';
          const borderColor = tabIndex === i ? '#4B9FA5' : '#333333';
          return (
            <TouchableOpacity
              activeOpacity={1}
              key={i}
              style={{
                width: '25%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 2,
                borderBottomColor: borderColor,
              }}
              delayPressIn={0}
              delayPressOut={0}
              onPress={() => this._handleIndexChange(i)}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: textColor,
                }}>
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  _renderScene = SceneMap({
    AllPost: AllPostTab,
    AllNewsScreen: AllNewsScreen,
    Popularity: PopularityPostTab,
    Tagged: TaggedPostTab,
  });

  render() {
    const [{tabIndex}] = this.props.tabNavigator;
    let navigationState = {
      index: tabIndex,
      routes: [
        {
          title: 'すべて',
          key: 'AllPost',
          index: tabIndex,
        },
        {
          title: '人気',
          key: 'Popularity',
          index: tabIndex,
        },
        {
          title: '#タグ',
          key: 'Tagged',
          index: tabIndex,
        },
        {
          title: 'ニュース',
          key: 'AllNewsScreen',
          index: tabIndex,
        },
      ],
    };
    return (
      <View
        style={{
          height: '100%',
          alignContent: 'flex-start',
          backgroundColor: '#EFEFEF',
        }}>
        <TabView
          navigationState={navigationState}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
          lazy={true}
        />
        {tabIndex !== 3 && (
          <TouchableOpacity
            onPress={() => this.ActionSheet.show()}
            style={{
              position: 'absolute',
              zIndex: 10,
              bottom: 15,
              right: 15,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: color.red,
              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.16,
              shadowRadius: 1.18,
              elevation: 2,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: color.red,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <SvgImage
                source={() => SvgViews.Camera({width: 18, height: 16})}
              />
            </View>
          </TouchableOpacity>
        )}
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={['カメラロールから選択', '写真を撮る', 'キャンセル']}
          cancelButtonIndex={2}
          onPress={this.handleCarPhoto.bind(this)}
        />
      </View>
    );
  }

  async requestFilePermission() {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (!granted) {
      Alert.alert(
        '写真へのアクセスを許可',
        '写真の利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
        [
          {
            text: 'いいえ',
          },
          {
            text: 'はい',
            onPress: () => AndroidOpenSettings.appDetailsSettings(),
          },
        ],
      );
    }
  }

  async requestCameraPermission() {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (!granted) {
      Alert.alert(
        'カメラへのアクセスを許可',
        'カメラの利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
        [
          {
            text: 'いいえ',
          },
          {
            text: 'はい',
            onPress: () => AndroidOpenSettings.appDetailsSettings(),
          },
        ],
      );
    }
  }

  handleCarPhoto(buttonIndex) {
    const options = {
      title: 'Select Image',
      maxWidth: 1500,
      maxHeight: 900,
      quality: 0.5,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    switch (buttonIndex) {
      case 0:
        Platform.OS === 'android' && this.requestFilePermission();

        if (Platform.OS === 'ios') {
          MultiImagePicker.openPicker({
            mediaType: 'photo',
            multiple: true,
            maxFiles: 3,
          })
            .then(response => {
              const carSource = [];
              response.map(image => {
                carSource.push({
                  uri: image.path,
                });
              });
              carSource &&
                navigationService.navigate('DefaultImageEditor', {
                  carSource: carSource,
                  updateCar: url => this.uploadImage(url),
                });
            })
            .catch(error => {
              if (
                Platform.OS === 'ios' &&
                error.toString().includes('Cannot access images')
              ) {
                Alert.alert(
                  '写真へのアクセスを許可',
                  '写真の利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                  [
                    {
                      text: 'いいえ',
                    },
                    {
                      text: 'はい',
                      onPress: () => Linking.openURL('app-settings:'),
                    },
                  ],
                );
              }
            });
        } else {
          ImagePicker.launchImageLibrary(options, response => {
            const source = response.uri;
            source &&
              navigationService.navigate('DefaultImageEditor', {
                carSource: source,
                updateCar: url => this.uploadImage(url),
              });
          });
        }

        break;
      case 1:
        Platform.OS === 'android' && this.requestCameraPermission();
        ImagePicker.launchCamera(options, response => {
          if (
            Platform.OS === 'ios' &&
            response.error === 'Camera permissions not granted'
          ) {
            Alert.alert(
              'カメラへのアクセスを許可',
              'カメラの利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
              [
                {
                  text: 'いいえ',
                },
                {
                  text: 'はい',
                  onPress: () => Linking.openURL('app-settings:'),
                },
              ],
            );
          } else {
            const source = response.uri;
            source &&
              navigationService.navigate('DefaultImageEditor', {
                carSource: source,
                updateCar: url => this.uploadImage(url),
              });
          }
        });
        break;
      default:
        return true;
    }
  }

  uploadImage(source) {
    navigationService.navigate('NewPostForm', {imageUrl: source});
  }
}
