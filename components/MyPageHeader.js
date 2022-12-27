import React, {Component} from 'react';
import {navigationService, userProfileService} from '../carpon/services';
import {TouchableOpacity, Text, Platform, Keyboard, View} from 'react-native';
import {SvgImage, SvgViews} from '../components/Common/SvgImage';
import HeaderCarpon from './HeaderCarpon';

export default class MyPageHeader extends Component {
  state = {
    profile: {
      nick_name: '',
      last_name: '',
      first_name: '',
    },
  };

  onPress() {
    if (this.props.navigation && this.props.navigation.getParam('pop')) {
      this.props.navigation.pop(this.props.navigation.getParam('pop'));
    } else {
      if (Platform.OS === 'ios') {
        Keyboard.dismiss();
        setTimeout(() => navigationService.goBack(null), 500);
      } else {
        navigationService.goBack(null);
      }
    }
  }

  componentDidMount() {
    const profileId = this.props.navigation.getParam('profile_id');
    if (profileId) {
      userProfileService.getUserProfileBy(profileId).then(response => {
        this.setState({profile: response});
      });
    } else {
      this.setState({profile: this.props.navigation.getParam('profile')});
    }
  }

  showName(profile) {
    return profile.nick_name
      ? profile.nick_name
      : profile.last_name + profile.first_name;
  }

  render() {
    const {profile} = this.state;
    return (
      <HeaderCarpon
        leftComponent={
          <TouchableOpacity
            onPress={() => {
              this.props.onPress ? this.props.onPress() : this.onPress();
            }}
            style={{
              alignItems: 'flex-start',
              flex: 1,
              justifyContent: 'center',
              width: 100,
              height: 100,
            }}>
            <View style={{paddingLeft: 15}}>
              <SvgImage source={SvgViews.ActionBarBack} />
            </View>
          </TouchableOpacity>
        }
        centerComponent={
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
            }}>
            {this.showName(profile ? profile : this.state.profile)}
            さんのマイページ
          </Text>
        }
      />
    );
  }
}
