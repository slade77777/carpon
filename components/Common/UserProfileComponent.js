import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Dimensions} from "react-native";
import ImageLoader from '../ImageLoader';
import {navigationService} from "../../carpon/services";
import {connect} from "react-redux";
import LabelCertification from "./LabelCertification";
import {SvgImage, SvgViews} from "./SvgImage";
import _ from "lodash";

const {width} = Dimensions.get('window');

export class CarInfo extends Component {

    getCarLabel() {
        const {maker_name, car_name} = this.props.car;
        return `${(maker_name ? ((car_name && car_name.substring(0, maker_name.length) === maker_name) ? '' : maker_name) : '')} ${car_name ? car_name : ''}オーナー`
            ;
    }

    render() {
        return (
            <Text style={{fontSize: 12, color: '#666666', textAlign: 'left'}}>
                {this.getCarLabel()}
            </Text>
        )
    }
}

export class MemberRankStatus extends Component {
    render() {
        const rank = this.props.rank ? this.props.rank : 1;
        switch (rank) {
            case 1:
                return <SvgImage source={SvgViews.IconREGULAR}/>;
            case 2:
                return <SvgImage source={SvgViews.IconGOLD}/>;
            case 3:
                return <SvgImage source={SvgViews.PlatinumStatus}/>;
            default:
                return <SvgImage source={SvgViews.IconREGULAR}/>
        }
    }
}

export class UserComponent extends Component {

    constructor(props) {
        super(props);
        this.handleNavigate =  _.debounce(this.handleNavigate,300);
    }

    getUserLabel() {
        const {email, display_name} = this.props.profile;
        if (display_name) {
            return display_name;
        } else {
            return email;
        }
    }

    handleRenderUIVersion() {

        const {version, profile} = this.props;
        const nameSize = this.props.nameSize ? this.props.nameSize : 15;
        const {maker_name, car_name, certificate} = profile;
        const userLabel = this.getUserLabel();
        const otherUser = this.props.otherUser ? this.props.otherUser : false;

        if (version === 12) {
            return (<View style={{marginLeft: 15, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: nameSize, fontWeight: 'bold'}}>{userLabel}</Text>
                    <View style={{paddingLeft: 15}}>
                        {maker_name ? <CarInfo car={{maker_name, car_name}}/> : <View style={{height: 18}}/>}
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <MemberRankStatus rank={profile.rank}/>
                    <View style={{paddingHorizontal: 7}}>{certificate && <LabelCertification/>}</View>
                </View>
            </View>);
        } else {
            return (<View style={{marginLeft: 15, justifyContent: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: nameSize, fontWeight: 'bold'}}>{userLabel}</Text>
                    <View style={{paddingHorizontal: 5}}>
                        <MemberRankStatus rank={profile.rank}/>
                    </View>
                    {certificate && <LabelCertification/>}
                </View>
                <View style={{width: otherUser ? width - 195 : width - 165}}>
                    {maker_name ? <CarInfo car={{maker_name, car_name}}/> : <View style={{height: 18}}/>}
                </View>
            </View>);
        }
    }

    handleNavigate() {
        const {profile} = this.props;
        return navigationService.push('MyPageScreen', {profile: profile})
    }

    render() {
        const {profile} = this.props;
        const imageSize = this.props.imageSize ? this.props.imageSize : false;
        const avatar = profile ? profile.avatar : false;

        return (
            <TouchableOpacity
                style={{flexDirection: 'row'}}
                activeOpacity={1}
                onPress={() => { this.handleNavigate() }}
            >
                {
                    profile.email === "deleted@carpon.jp" ?
                        <View>
                            {
                                imageSize === 60 ? <SvgImage source={SvgViews.BigDeletedAvatar}/>
                                    : <SvgImage source={SvgViews.DeletedAvatar}/>
                            }
                        </View>
                        :
                        <View>
                            {
                                avatar ? <ImageLoader
                                    style={{
                                        width: imageSize ? imageSize : 40,
                                        height: imageSize ? imageSize : 40,
                                        borderRadius: imageSize ? imageSize / 2 : 20,
                                        borderWidth: 1,
                                        borderColor: '#CCCCCC',
                                    }}
                                    source={{uri: avatar}}
                                /> : <View style={{width: 50, height: 50, backgroundColor: 'grey'}}/>
                            }
                        </View>
                }
                {
                    this.handleRenderUIVersion()
                }
            </TouchableOpacity>
        )
    }
}

export class UserComponentOfMyPage extends Component {

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
        const imageSize = this.props.imageSize ? this.props.imageSize : false;
        const nameSize = this.props.nameSize ? this.props.nameSize : 15;
        const {maker_name, car_name, certificate} = profile;
        const avatar = profile ? profile.avatar : false;
        const userLabel = this.getUserLabel();
        const otherUser = this.props.otherUser ? this.props.otherUser : false;
        return (
            <TouchableOpacity
                style={{flexDirection: 'row'}}
                activeOpacity={this.props.isLoginUser ? 0.2 : 1}
                onPress={() => {
                    this.props.isLoginUser && navigationService.navigate('AccountSetting')
                }}
            >
                {
                    profile.email === "deleted@carpon.jp" ?
                        <View>
                            {
                                imageSize === 60 ? <SvgImage source={SvgViews.BigDeletedAvatar}/>
                                    : <SvgImage source={SvgViews.DeletedAvatar}/>
                            }
                        </View>
                        : <View>
                            {
                                avatar ? <ImageLoader
                                    style={{
                                        width: imageSize ? imageSize : 60,
                                        height: imageSize ? imageSize : 60,
                                        borderRadius: imageSize ? imageSize / 2 : 30,
                                        borderWidth: 1,
                                        borderColor: '#CCCCCC',
                                    }}
                                    source={{uri: avatar}}
                                /> : <View style={{width: 50, height: 50, backgroundColor: 'grey'}}/>
                            }
                        </View>
                }
                <View style={{marginLeft: 15, justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: nameSize, fontWeight: 'bold'}}>{userLabel}</Text>
                    </View>
                    <View style={{width: otherUser ? width - 195 : width - 165}}>
                        {maker_name ? <CarInfo car={{maker_name, car_name}}/> : <View style={{height: 18}}/>}
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <MemberRankStatus rank={profile.rank}/>
                        <View style={{paddingHorizontal: 7}}>{certificate && <LabelCertification/>}</View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

@connect(state => {
        return ({
            profile: {
                ...state.registration.userProfile.myProfile,
                maker_name: state.registration.carProfile.profile ? state.registration.carProfile.profile.maker_name : null,
                car_name: state.registration.carProfile.profile ? state.registration.carProfile.profile.car_name : null,
                grade_name: state.registration.carProfile.profile ? state.registration.carProfile.profile.grade_name : null,
                myProfile: true
            }
        })
    }
)
export default class UserProfileComponent extends Component {

    render() {
        const {profile} = this.props;
        return (
            <UserComponent profile={profile}/>
        )
    }
}

export class FollowInformation extends Component {
    render() {
        const {totalFollower, totalFollowing, profileId} = this.props;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}
            >
                <TouchableOpacity style={{
                    borderWidth: 1,
                    borderColor: '#EFEFEF',
                    backgroundColor: '#F8F8F8',
                    height: 30,
                    borderRadius: 15,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '47%'
                }}
                                  onPress={() => {
                                      navigationService.push('Following', {profileId: profileId})
                                  }}
                >
                    <Text style={{
                        fontSize: 15,
                        fontWeight: 'bold'
                    }}>{totalFollowing}</Text>
                    <Text style={{fontSize: 14, color: '#333'}}> フォロー</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderWidth: 1,
                    borderColor: '#EFEFEF',
                    backgroundColor: '#F8F8F8',
                    height: 30,
                    borderRadius: 15,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '47%'
                }}
                                  onPress={() => {
                                      navigationService.push('Follower', {profileId: profileId})
                                  }}
                >
                    <Text style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginLeft: 10
                    }}>{totalFollower}</Text>
                    <Text style={{fontSize: 14, color: '#333'}}> フォロワー</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

@connect(state => ({
    totalFollower: state.followReducer.followers.length,
    totalFollowing: state.followReducer.following.length,
    profileId: state.registration.userProfile.myProfile.id
}))
export class MyFollowInformation extends Component {

    render() {
        const {totalFollowing, totalFollower} = this.props;
        return (
            <FollowInformation
                totalFollower={totalFollower}
                totalFollowing={totalFollowing}
                profileId={this.props.profileId}
            />

        )
    }
}
