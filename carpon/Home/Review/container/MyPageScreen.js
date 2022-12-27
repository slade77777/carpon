import React, {Component} from 'react';
import {FollowInformation, UserComponentOfMyPage} from "../../../../components/Common/UserProfileComponent";
import {screen} from "../../../../navigation";
import {Dimensions, ScrollView, StatusBar, Text, TouchableOpacity, View, StyleSheet, Platform} from "react-native";
import ListReviewMyPage from "../../../../components/Reviews/ListReviewMyPage";
import ClipAndCommentMyPage from "../../../../components/Reviews/ClipAndCommentMyPage";
import connect from "react-redux/es/connect/connect";
import {userProfileService} from "../../../../carpon/services/index";
import {FollowComponent} from "../../../../components/Common/FollowComponent";
import SliderImageMyPage from "../../../../components/SliderImageMyPage";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {loadReview, resetLoading, resetStatusReload} from "../action/ReviewAction";
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";
import {SceneMap, TabView} from "react-native-tab-view";
import ListImagePost from "../../SNS/components/ListImagePost";
import SelfIntroduction from "../../SNS/components/SelfIntroduction";
import MyPageHeader from "../../../../components/MyPageHeader";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const {width, height} = Dimensions.get('window');

export class ProfileSection extends Component {

    state = {
        loading: true,
        loadedData: {}
    };

    load() {
        this.setState({
            loading: true
        }, () => {
            this.props.loadData().then(loadedData => {
                this.setState({
                    loadedData: loadedData,
                    loading: false
                }, () => this.props.onLoaded && this.props.onLoaded());

            }).catch(error => {
                console.log(error.response);
            })
        });
    }

    componentDidMount(): void {
        this.load()
    }

    render() {
        const {renderView, renderPlaceHolder} = this.props;

        return this.state.loading ? renderPlaceHolder() : renderView(this.state.loadedData);
    }
}

@screen('MyPageScreen', ({navigation}) => ({
    header: <MyPageHeader navigation={navigation}/>
}))
@connect(state => ({
        myProfile: state.registration.userProfile.myProfile,
        loading: state.review.loading,
        Reload: state.review.reload
    }),
    dispatch => ({
        resetStatusReload: () => dispatch(resetStatusReload()),
        resetLoading: () => dispatch(resetLoading()),
        loadReview: () => dispatch(loadReview()),
    })
)
export class MyPageScreen extends Component {

    constructor(props) {
        super(props);

        this.references = {
            profile: React.createRef(),
            listReview: React.createRef(),
            listNews: React.createRef(),
        };

        this.state = {
            refreshing: false,
            profile: this.props.myProfile,
            images: [],
            indexRouter: 0,
            routers: [
                {
                    title: 'フォト日記',
                    key: 'ListImagePost',
                },
                {
                    title: 'レビュー',
                    key: 'ListReview',
                },
                {
                    title: 'クリップ',
                    key: 'ListNewClip',
                }
            ],
            targetProfile: {},
            currentTab: 0
        }
    }

    loadProfile() {
        this.setState({refreshing: true}, () => {
            this.references.profile.current && this.references.profile.current.load();
            this.references.listReview.current && this.references.listReview.current.load();
            this.references.listNews.current && this.references.listNews.current.load();
        });
    }

    onRefresh() {
        this.loadProfile();
    }

    componentWillMount() {
        if (!this.props.navigation.getParam('profile')) {
            const id = this.props.navigation.getParam('profile_id');
            if (id) {
                userProfileService.getUserProfileBy(id).then(response => {
                    this.setState({targetProfile: response});
                    this.loadProfile();
                })
            }
        } else {
            this.setState({targetProfile: this.props.navigation.getParam('profile')})
        }
    }

    componentDidMount() {
        viewPage('mypage', 'マイページ');
        this.props.resetLoading();
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            this.props.loadReview();
            this.loadProfile();
        })
    }

    componentWillUnmount() {
        this.willFocusListener.remove();
    }

    handleReloadProfile() {
        this.props.resetStatusReload();
        this.loadProfile();
    }

    componentWillReceiveProps(props) {
        props.Reload && this.handleReloadProfile();
    }

    _renderTabBar = props => {
        const tabIndex = this.state.indexRouter;
        return (
            <View style={{
                height: 40,
                flex: 1,
                flexDirection: 'row',
                backgroundColor: '#333333'
            }}>
                {props.navigationState.routes.map((route, i) => {
                    const textColor = tabIndex === i ? '#4B9FA5' : '#FFFFFF';
                    const borderColor = tabIndex === i ? '#4B9FA5' : '#333333';
                    return (
                        <TouchableOpacity
                            activeOpacity={1}
                            key={i}
                            style={{
                                height: '100%',
                                width: '33.33%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderBottomWidth: 2,
                                borderBottomColor: borderColor,
                            }}
                            delayPressIn={0}
                            delayPressOut={0}
                            onPress={() => this._handleIndexChange(i)}>
                            <Text style={{
                                fontSize: 13,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: textColor
                            }}>{route.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    _handleIndexChange = index => {
        this.setState({
            indexRouter: index
        }, () => {

        });


    };

    renderComponentReview = () => {
        const profile = this.state.targetProfile;
        const heightData = isIphoneX() ? height - 180 : height - 120;
        return (
            profile ? <View style={{minHeight: heightData}}>
                {
                    this.props.myProfile.id === profile.id ?
                        <ListReviewMyPage linkToReview={true} profile={profile}/>
                        :
                        <ListReviewMyPage profile={profile}/>
                }
                <View style={{height: 20}}/>
            </View> : <View/>
        )
    };

    renderComponentNewClip = () => {
        const profile = this.state.targetProfile;
        const heightData = isIphoneX() ? height - 180 : height - 120;
        return (
            profile ?
                <View style={{minHeight: heightData }}>
                    <ClipAndCommentMyPage type={'my'} profile={profile}/>
                    <View style={{height: 20}}/>
                </View> : null
        )
    };

    _renderScene = SceneMap({
        'ListImagePost': () => <ListImagePost profileId={this.state.targetProfile.id}/>,
        'ListReview': () => this.renderComponentReview(),
        'ListNewClip': () => this.renderComponentNewClip(),
    });


    renderProfileSection = () => {

        const {myProfile} = this.props;
        const profile = myProfile.id === this.state.targetProfile.id ? myProfile : this.state.targetProfile;
        return <ProfileSection
            ref={this.references.profile}
            renderPlaceHolder={() => {
                return (
                    <SkeletonPlaceholder backgroundColor={'#EAEAEA'}>
                        <View style={{height: 311, width: '100%'}}/>
                    </SkeletonPlaceholder>
                )
            }}
            renderView={newProfile => {
                if (profile) {
                    return (
                        <View>
                            <View style={{height: 311, width: '100%'}}>
                                <SliderImageMyPage height={311} heightImage={311} profile_id={profile.id}
                                                   onPress={() => (myProfile.id === profile.id && !!myProfile.car_id) && navigationService.navigate('MyCarProfile')}/>
                            </View>
                            <View style={{paddingTop: 25, paddingHorizontal: 15, marginBottom: 20}}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    <UserComponentOfMyPage isLoginUser={myProfile.id === profile.id}
                                                           otherUser={myProfile.id !== profile.id}
                                                           profile={newProfile} create_date={null}
                                                           nameSize={17}
                                    />
                                    {myProfile.id !== newProfile.id && <FollowComponent profile={newProfile}/>}
                                </View>
                                <View style={{
                                    justifyContent: 'center',
                                    width: width - 105,
                                    marginLeft: 75,
                                    paddingTop: 15,
                                    paddingBottom: 10
                                }}>
                                    <FollowInformation totalFollower={newProfile.total_follower}
                                                       totalFollowing={newProfile.total_following}
                                                       profileId={newProfile.id}/>
                                </View>
                                <SelfIntroduction me={this.props.myProfile.id === this.state.targetProfile.id}
                                                  isSelf={profile.self_introduction}
                                                  text={profile.self_introduction}/>
                            </View>
                        </View>
                    )
                } else {
                    return <View/>
                }
            }}
            onLoaded={() =>
                setTimeout(() => {
                    this.setState({refreshing: false})
                }, 300)
            }
            loadData={() => {
                if (profile) {
                    return userProfileService.getUserProfileBy(profile.id)
                } else {
                    return userProfileService.getUserProfileBy(this.props.navigation.getParam('profile_id'))
                }
            }}
        />
    };

    render() {
        const {routers, indexRouter} = this.state;
        let navigationState = {
            index: indexRouter,
            routes: routers
        };
        return (
            <View
                style={{flex: 1, backgroundColor: '#212121'}}>
                {
                    (this.state.refreshing || this.props.loading) &&
                    <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '110%'}}/>
                }
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                />
                <ScrollView
                    scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFF'}}
                    contentInset={{bottom: isIphoneX() ? 15 : 0}}
                    stickyHeaderIndices={[1]}
                >
                    <View>
                        {this.renderProfileSection()}
                    </View>

                    <View>
                        {
                            this._renderTabBar({navigationState})
                        }
                    </View>

                    <View style={{
                        flex: 1,
                        alignContent: 'flex-start',
                        backgroundColor: '#FFF',
                        paddingBottom: getBottomSpace()
                    }}>
                        <TabView
                            navigationState={navigationState}
                            renderScene={() => null}
                            renderTabBar={() => null}
                            onIndexChange={this._handleIndexChange}
                            lazy={true}
                            lazyPreloadDistance={0}
                            // renderLazyPlaceholder={null}
                            removeClippedSubviews={true}
                        />


                        {
                            indexRouter === 0 && <ListImagePost profileId={this.state.targetProfile.id}/>
                        }
                        {
                            indexRouter === 1 && this.renderComponentReview()
                        }
                        {
                            indexRouter === 2 && this.renderComponentNewClip()
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    skeletonPlaceholder : {
        flexDirection : 'row',
    }
});



