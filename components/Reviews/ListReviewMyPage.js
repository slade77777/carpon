import React, {Component} from 'react';
import {FlatList, Text, View, TouchableOpacity, Dimensions} from "react-native";
import ButtonText from "../ButtonText";
import {listReviewService, navigationService} from "../../carpon/services";
import Review from "./Review";
import {connect} from 'react-redux';
import LabelFurtherDisplay from "./LabelFurtherDisplay";
import _ from 'lodash'
import {requestSuccess} from "../../carpon/Home/Review/action/ReviewAction";
import MyPageReview from "./MyPageReview";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const {width, height} = Dimensions.get('window');
@connect(state => ({
    confirmedCar: state.registration.carProfile.confirmed,
    userProfile: state.registration.userProfile.myProfile,
    reviewDeletedId: state.review.reviewDeletedId,
    LoadReviewMyPage: state.review.LoadReviewMyPage
}),
    dispatch => ({
        requestSuccess: (key) => dispatch(requestSuccess(key)),
    })
)
export default class ListReviewMyPage extends Component {

    state = {
        reviews: [],
        page: 1,
        imgSkeleton : [1, 2, 3],
        showMoreTimes: 1,
        has_next: false,
        loading : true
    };

    _renderItem = ({item, index}) => (
        <View key={index}>
            <MyPageReview otherUser={this.props.userProfile.id !== this.props.profile.id} key={index} review={item} index={index} screen={'myPage'}/>
        </View>
    );

    componentDidMount() {
        this.loadReview(1)
    }

    componentWillReceiveProps(props) {
        this.props.reviewDeletedId !== props.reviewDeletedId && this.handleRemoveReview(props.reviewDeletedId);
        if(props.LoadReviewMyPage){
            this.loadReview(1);
            this.props.requestSuccess('LoadReviewMyPage')
        }
    }

    loadReview(page) {
        listReviewService.getReviewUser(this.props.profile.id, page).then(response => {
            this.setState({
                reviews: response.data,
                has_next: response.has_next,
                loading : false
            })
        })
    }

    handleRemoveReview(id) {
        let reviews = this.state.reviews;
        _.remove(reviews, (review) => {
            return review.id === id
        });
        return this.setState({reviews: reviews});
    }

    handleShowMore() {
        let hasNext = this.state.has_next;
        this.setState({
            showMoreTimes: this.state.showMoreTimes + 1
        });
        if (hasNext) {
            this.loadReview(this.state.page + 1);
        }
    }

    handleShowButtonShowMore() {
        let showMoreTimes = this.state.showMoreTimes;
        let numberOfNews = 5 * showMoreTimes;
        return (this.state.reviews.length > 5) && (numberOfNews < this.state.reviews.length)
    }

    handleShowReview() {
        let showMoreTimes = this.state.showMoreTimes;
        let numberOfReview = 5 * showMoreTimes;
        return this.state.reviews.slice(0, numberOfReview)
    }

    render() {
        const {loading} = this.state;
        return (
            <View style={{backgroundColor: '#FFF'}}>
                {
                    loading && <View style={{marginTop : 10}}>
                        {this.state.imgSkeleton.map((item, index) => {
                            return <SkeletonPlaceholder key={index} backgroundColor={'#EAEAEA'}>
                                <SkeletonPlaceholder.Item marginTop={10} paddingHorizontal={15} flexDirection="row" alignItems="center">
                                    <SkeletonPlaceholder.Item width={100} height={60}/>
                                    <SkeletonPlaceholder.Item marginLeft={20}>
                                        <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
                                        <SkeletonPlaceholder.Item
                                            marginTop={6}
                                            width={80}
                                            height={20}
                                            borderRadius={4}
                                        />
                                    </SkeletonPlaceholder.Item>
                                </SkeletonPlaceholder.Item>
                                <SkeletonPlaceholder.Item marginTop={10} paddingHorizontal={15} flexDirection="row" alignItems="center">
                                    <SkeletonPlaceholder.Item width={width - 30} height={200}/>
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder>
                        })}
                    </View>

                }
                <FlatList
                    style={{marginTop: 5}}
                    data={this.handleShowReview()}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.8}
                />

                {
                    this.handleShowButtonShowMore() ?
                        <LabelFurtherDisplay
                            onPress={() => this.handleShowMore()}
                        />
                        :
                        <View/>
                }
                {
                    this.props.linkToReview &&
                    <View style={{paddingHorizontal: 15, borderTopWidth: 0.5, borderTopColor: '#E5E5E5'}}>
                        <View style={{marginVertical: 20}}>
                            <ButtonText disabled={!this.props.confirmedCar} title={'レビューを投稿する'}
                                        onPress={() => navigationService.navigate('ReviewSubmissionForm')}/>
                        </View>
                    </View>
                }
            </View>
        )
    }
}
