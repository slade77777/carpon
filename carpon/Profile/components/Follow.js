import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Text, ScrollView} from "react-native";
import  {UserComponent} from "../../../components/Common/UserProfileComponent";
import {connect} from 'react-redux';
import {loadMyFollower, loadFollowing, loadFollowerById, loadMyFollowing} from "../../../carpon/common/actions/followAction";
import {FollowComponent} from "../../../components/Common/FollowComponent";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@connect(
    (state) => ({
        followings: state.followReducer.following,
        followers: state.followReducer.followers,
        followingsById: state.followReducer.followingById,
        followersById: state.followReducer.followersById,
        me: state.registration.userProfile.myProfile,
        store: state

    }),
    (dispatch) => ({
        loadMyFollower: () => (dispatch(loadMyFollower())),
        loadFollowing: (id) => (dispatch(loadFollowing(id))),
        loadFollowerById : (id) => (dispatch(loadFollowerById(id))),
        loadMyFollowing: () => (dispatch(loadMyFollowing()))

    })
)
export class Follow extends Component {

    constructor(props) {
        super (props)
    }

    loadData() {
        const {profileId, screen, me} = this.props;
        // console.log('follower',this.props);
        if(screen === 'Follower') {
            profileId === me.id ? this.props.loadMyFollower() : this.props.loadFollowerById(profileId);
        }else if(screen === 'Following'){
            profileId === me.id ? this.props.loadMyFollowing() : this.props.loadFollowing(profileId);
        }
    }

    componentDidMount() {
        this.loadData();
    }

    handleDataFollow() {
        const {profileId, screen, me} = this.props;
        if(screen === 'Follower') {
            return profileId === me.id ? this.props.followers : this.props.followersById;
        }else if(screen === 'Following') {
            return profileId === me.id ? this.props.followings : this.props.followingsById;
        }
    }

    render() {
        const {me} = this.props;
        return(
            <View style={StyleSheet.container}>
                <FlatList
                    style={{height: '100%'}}
                    scrollIndicatorInsets={{right: 1}}
                    contentInset={{ bottom: isIphoneX() ? getBottomSpace() : 0 }}
                    data={this.handleDataFollow()}
                    renderItem={({item}) =>
                        <View style={Styles.item}>
                            <UserComponent profile={item}/>
                            {/*{ console.log('item',item)}*/}
                            {me && me.id !== item.id && <FollowComponent profile={item}/>}
                        </View>}
                />
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#CED0CE',
        padding: 15,
    },
    container: {
        backgroundColor: '#fff'
    }
});
