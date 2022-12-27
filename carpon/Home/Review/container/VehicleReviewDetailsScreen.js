import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {SafeAreaView, ScrollView, View} from 'react-native';
import DetailReview from "../../../../components/Reviews/DetailReview";
import PastReviews from "../../../../components/Reviews/PastReviews";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {connect} from "react-redux";
import {listReviewService, userProfileService} from "../../../../carpon/services/index";
import {ProfileSection} from "./MyPageScreen";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {viewPage} from "../../../Tracker";

@screen('VehicleReviewDetailsScreen', {header: <HeaderOnPress title={'レビュー'}/>})
@connect(state => ({
    myProfile: state.registration.userProfile.myProfile,
    review: state.review,
    loading: state.review.loading
}), () => ({}))
export class VehicleReviewDetailsScreen extends Component {

    constructor(props) {
        super(props);
        this.references = {
            profile: React.createRef(),
            pastReview: React.createRef(),
            detailReview: React.createRef(),
        };

        this.state = {
            refreshing: false,
            profile: null,
        }
    }

    loadProfile() {
        this.setState({refreshing: true}, () => {
            this.references.profile.current && this.references.profile.current.load();
            this.references.pastReview.current && this.references.pastReview.current.load();
            this.references.detailReview.current && this.references.detailReview.current.load();
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
                    this.setState({profile: response})
                    this.loadProfile();
                })
            }
        } else {
            this.setState({profile: this.props.navigation.getParam('profile')})
        }
    }

    componentDidMount() {
        viewPage('review_detail', `レビュー詳細： ${this.props.navigation.getParam('review_id')}`)
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            this.loadProfile();
        })
    }

    componentWillUnmount() {
        this.willFocusListener.remove();
    }

    render() {
        const profile = this.state.profile;
        const review_id = this.props.navigation.getParam('review_id');
        return (
            <View style={{flex: 1}}>
                {
                    (this.state.refreshing || this.props.loading) &&
                    <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '105%'}}/>
                }
                <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#fff'}}>
                    <ProfileSection
                        ref={this.references.detailReview}
                        loadData={
                            () => {
                                return listReviewService.getReviewDetail(review_id);
                            }
                        }
                        onLoaded={() =>
                            setTimeout(() => {
                                this.setState({refreshing: false})
                            }, 300)
                        }
                        renderPlaceHolder={() => null}
                        renderView={review => {
                            if (profile) {
                                return <DetailReview detailReview={review} profile={profile}/>
                            } else {
                                return <View/>
                            }
                        }}
                    />
                    <ProfileSection
                        ref={this.references.pastReview}
                        loadData={() => {
                            return listReviewService.getPastReview(profile ? profile.id : this.props.navigation.getParam('profile_id'), 1);
                        }}
                        renderPlaceHolder={() => null}
                        renderView={pastReview => {
                            if (profile) {
                                return <PastReviews reviewID={review_id} title={'過去のレビュー'}
                                                    pastReview={pastReview.data}
                                                    profile={profile} navigation={this.props.navigation}/>
                            } else {
                                return <View/>
                            }
                        }}
                    />
                </ScrollView>
            </View>
        )
    }
}
