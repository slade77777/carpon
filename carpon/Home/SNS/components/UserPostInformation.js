import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Dimensions, Image} from 'react-native';
import {navigationService} from '../../../services';
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import LabelCertification from '../../../../components/Common/LabelCertification';
import {
  CarInfo,
  MemberRankStatus,
} from '../../../../components/Common/UserProfileComponent';
import _ from 'lodash';

export class UserPostInformation extends Component {
  componentDidMount(): void {
    this.handleNavigate = _.debounce(this.handleNavigate, 300);
  }

  handleNavigate() {
    const {profile} = this.props;
    return navigationService.push('MyPageScreen', {profile: profile});
  }

  getUserLabel() {
    const {email, display_name} = this.props.profile;
    if (display_name) {
      return display_name;
    } else {
      return email;
    }
  }

  render() {
    const {profile} = this.props;
    const isMainPost = this.props.isMainPost ? this.props.isMainPost : false;
    const avatar = profile ? profile.avatar : false;
    const {maker_name, car_name, certificate} = profile;

    return (
      <TouchableOpacity
        style={{flexDirection: 'row', width: 189.91, height: 40}}
        activeOpacity={1}
        onPress={() => {
          this.handleNavigate();
        }}>
        {profile.email === 'deleted@carpon.jp' ? (
          <View>
            {isMainPost === 60 ? (
              <SvgImage source={SvgViews.BigDeletedAvatar} />
            ) : (
              <SvgImage source={SvgViews.DeletedAvatar} />
            )}
          </View>
        ) : (
          <View>
            {avatar ? (
              <Image
                style={{
                  width: isMainPost ? 60 : 40,
                  height: isMainPost ? 60 : 40,
                  borderRadius: isMainPost ? 30 : 20,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                }}
                source={{uri: avatar}}
              />
            ) : (
              <View style={{width: 50, height: 50, backgroundColor: 'grey'}} />
            )}
          </View>
        )}
        <View
          style={{
            marginLeft: 15,
            height: isMainPost ? 60 : 40,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: isMainPost ? 16 : 14,
              fontWeight: 'bold',
            }}>
            {this.getUserLabel()}
          </Text>
          <Text
            style={{
              fontSize: 10,
              paddingBottom: 3,
            }}>
            {profile.car_name}
          </Text>
          {isMainPost && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{paddingRight: 5}}>
                <MemberRankStatus rank={profile.rank} />
              </View>
              {certificate && <LabelCertification />}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
