import React, { Component }             from 'react';
import { connect }                      from "react-redux";
import { postFollow, postUnFollow }     from "../../carpon/common/actions/followAction";
import color                            from "../../carpon/color";
import { SvgImage, SvgViews }           from "./SvgImage";
import { TouchableOpacity, View, Text } from "react-native";
import LoadingComponent                 from "./LoadingComponent";
import _                                from "lodash";

@connect((state) => ({
        followingUsers: state.followReducer.following,
        followReady: state.followReducer.followReady
    }),
    dispatch => (
        {
            postFollow: id => dispatch(postFollow(id)),
            postUnFollow: id => dispatch(postUnFollow(id))
        }
    )
)

export class FollowComponent extends Component {

    constructor(props) {
        super(props);
        this.handleUnFollow = _.debounce(this.handleUnFollow, 100);
    }

    profile = {
        avatar: this.props.profile.avatar,
        car_name: this.props.profile.car_name,
        email: this.props.profile.email,
        first_name: this.props.profile.first_name,
        grade_name: this.props.profile.grade_name,
        id: this.props.profile.id,
        last_name: this.props.profile.last_name,
        maker_name: this.props.profile.maker_name,
        display_name: this.props.profile.display_name,
    };

    state = {
        loading: false
    };

    handlePostFollower = () => {
        this.props.postFollow(this.profile);
        console.log('post follower', this.profile);
    };

    handleUnFollow = () => {
        this.props.postUnFollow(this.profile);
        console.log('un-follower', this.profile);
    };

    handleFollow() {
        this.setState({ loading: true });
        this.followed() ? this.handleUnFollow() : this.handlePostFollower();
    };

    componentWillReceiveProps(newsProps) {
        newsProps.followReady && this.setState({ loading: false })
    };

    /** improve the speed of the component instead of using componentWillReceiveProps

     static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.followReady !== prevState.followReady) {
            return { state : nextProps.followReady}
        }
        return null;
    }

     componentDidUpdate(prevProps) {
        if (prevProps.followReady !== this.props.followReady) {
            this.setState({loading: false})
        }
    }

     **/

    followed() {
        const followingUsersId = this.props.followingUsers ? this.props.followingUsers.map(followingUser => followingUser.id) : [];
        return followingUsersId.includes(this.profile.id);
    }

    render() {
        const followed = this.followed();
        return (
            <TouchableOpacity onPress={ () => { !this.state.loading && this.handleFollow() }}>
                {
                    followed ?
                        <View style={ {
                            borderRadius: 2,
                            width: 80,
                            height: 30,
                            backgroundColor: color.active,
                            justifyContent: 'center',
                            alignItems: 'center'
                        } }>
                            <Text style={ { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' } }>フォロー中</Text>
                        </View> :
                        <View style={ {
                            borderRadius: 2,
                            borderColor: '#E5E5E5',
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            width: 80,
                            height: 30,
                            backgroundColor: '#FFFFFF'
                        } }>
                            <SvgImage source={ () => SvgViews.FollowIcon() }/>
                            <Text style={ {
                                color: '#CCCCCC',
                                fontWeight: 'bold',
                                fontSize: 10,
                                marginLeft: 5
                            } }>フォロー</Text>
                        </View>
                }
                {
                    this.state.loading && <LoadingComponent size={ { w: 80, h: 30 } }/>
                }
            </TouchableOpacity>
        )
    }
}
