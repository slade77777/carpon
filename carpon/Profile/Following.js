import React, {Component} from 'react';
import {screen} from "../../navigation";
import {View, Text, SafeAreaView} from "react-native";
import HeaderOnPress from "../../components/HeaderOnPress";
import {connect} from 'react-redux';
import {loadMyFollower, loadFollowing, loadFollowerById, loadMyFollowing} from "../../carpon/common/actions/followAction";
import {Follow} from "./components/Follow";
import {viewPage} from "../Tracker";

@screen('Following', {header: <HeaderOnPress title="フォロー中"/>})
@connect(
    (state) => ({
        followings: state.followReducer.following,
        followers: state.followReducer.followers,
        followingsById: state.followReducer.followingById,
        followersById: state.followReducer.followersById,
        me: state.registration.userProfile.myProfile,

    }),
    (dispatch) => ({
        loadMyFollower: () => (dispatch(loadMyFollower())),
        loadFollowing: (id) => (dispatch(loadFollowing(id))),
        loadFollowerById : (id) => (dispatch(loadFollowerById(id))),
        loadMyFollowing: () => (dispatch(loadMyFollowing()))

    })
)
export class Follower extends Component {
    componentDidMount() {
        viewPage('list_following_users', 'フォロー中');
    }

    render() {
        const profileId = this.props.navigation.getParam('profileId');
        return(
            <View style={{ flex : 1}}>
                <View style={{height: '100%', backgroundColor: '#fff'}}>
                    <Follow profileId={profileId} screen={'Following'}/>
                </View>
            </View>
        )
    }
}
