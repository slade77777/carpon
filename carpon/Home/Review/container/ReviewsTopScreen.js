import React, {Component} from 'react';
import StatusFilter from "../../../../components/Reviews/StatusFilter";
import Review from "../../../../components/Reviews/Review";
import {ActivityIndicator, RefreshControl, SafeAreaView, SectionList, Text, View, Alert, Platform} from "react-native";
import {connect} from "react-redux";
import RateCar from "../../../../components/Reviews/RateCar";
import StatusModel from "../../../../components/Reviews/StatusModel";
import {getListReview, getReviewSummary, updateReview} from "../action/ReviewAction";
import _ from 'lodash';
import moment from 'moment';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/perf'
import ReviewForm from "../components/ReviewForm";
import CarponRate from "./CarponRate";

@connect(state => ({
    review: state.review,
    carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : {},
    myProfile: state.registration.userProfile.myProfile,
}), dispatch => ({
    updateReview: (page) => {
        dispatch(updateReview(page))
    },
    getReviewSummary: (params, page) => dispatch(getReviewSummary(params, page)),
    getReviewModelCar: (params, page) => dispatch(getListReview(params, page)),
}))
export default class ReviewsTopScreen extends Component {

    constructor(props) {
        super(props);
        this.trace = null;
    }

    state = {
        page: 1,
        rateCarpon: false,
        firstRate: true
    };

    componentDidMount() {
        this.trace = firebase.perf().newTrace('reviews');
        this.trace.start().then(
            () => {
                console.log('trace start')
            }
        );
        this.props.updateReview(1);
    }

    componentWillUnmount() {
        this.trace.stop().then(() => {
            console.log('trace end');
        });
    }

    renderItem({item, index}) {
        const {summaryLoaded, showMessage} = this.props.review;
        if (item.type === 'summary') {
            return (
                summaryLoaded ?
                <View style={{backgroundColor: 'white'}} renderToHardwareTextureAndroid={true}>
                    <RateCar summary={item} showMessage={showMessage}/>
                    <StatusModel summary={item}/>
                </View>
                    : null
            )
        } else {
            return <Review review={item} key={index}/>
        }
    }

    handleCheckService(page) {
        if (!_.isEmpty(this.props.review.reviewParameters)) {
            this.props.getReviewModelCar(this.props.review.reviewParameters, page)
        } else {
            this.props.updateReview(page);
        }
        this.setState({
            page: page
        })
    }

    handleLoadMore() {
        const page = this.state.page + 1;
        if (!this.props.review.refresh && this.props.review.has_next) {
            this.handleCheckService(page)
        }
    }

    handleRefresh() {
        if (!this.props.review.refresh) {
            this.handleCheckService(1);
        }
    }

    renderFooter(ready) {
        if (!ready) {
            return null;
        }
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };

    groupDate(reviews, summary) {
        const data = [];
        reviews.map(review => {
            if (data[(new Date(review.create_date)).setHours(0, 0, 0, 0)]) {
                data[(new Date(review.create_date)).setHours(0, 0, 0, 0)].data.push(review);
            } else {
                data[(new Date(review.create_date)).setHours(0, 0, 0, 0)] = {};
                data[(new Date(review.create_date)).setHours(0, 0, 0, 0)].data = [];
                data[(new Date(review.create_date)).setHours(0, 0, 0, 0)].title = moment(new Date(review.create_date)).format('YYYY年M月D日');
                data[(new Date(review.create_date)).setHours(0, 0, 0, 0)].data.push(review);
            }
        });
        summary.type = 'summary';
        const ReviewList = [{title: '', data: [summary]}];
        for (const group in data) {
            ReviewList.push(data[group])
        }
        return ReviewList;
    }

    renderSectionHeader(title) {
        return (
            title ?
                <View style={{width: '100%', backgroundColor: 'white', borderColor: '#E5E5E5', borderBottomWidth: 1}}>
                    <View style={{
                        borderColor: '#CCCCCC',
                        borderRadius: 15,
                        width: 184,
                        height: 30,
                        borderWidth: 1,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        justifyContent: 'center',
                        marginVertical: 15
                    }}>
                        <Text style={{fontSize: 12, textAlign: 'center'}}>{title}</Text>
                    </View>
                </View> : <View/>
        )
    }

    handleTurnOffRateAlert() {
        this.setState({firstRate: false})
    }

    render() {
        const {reviews, summary, refresh, summaryParameters, has_next} = this.props.review;
        const data = this.groupDate(reviews, summary);
        if (this.props.review.pastReview.length === 0 && this.props.carInfo.length > 0) {
            return (<ReviewForm isFirstReview={true} navigation={this.props.navigation}/>)
        } else {
            return (
                <View style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF'
                }}>
                    <View renderToHardwareTextureAndroid={true} style={{
                        backgroundColor: 'white',
                    }}>
                        {
                            this.props.review.reviewAppStatus && this.state.firstRate &&
                            <CarponRate handleTurnOffRateAlert={()=> this.handleTurnOffRateAlert()}/>
                        }
                        <StatusFilter summaryParameters={summaryParameters}/>
                        {
                            this.props.review.pastReview.length > 0 &&
                            <SectionList
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refresh}
                                        onRefresh={this.handleRefresh.bind(this)}
                                    />
                                }
                                extraData={this.props.review.summaryLoaded}
                                renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
                                onEndReached={this.handleLoadMore.bind(this)}
                                ListFooterComponent={this.renderFooter.bind(this, has_next)}
                                renderItem={this.renderItem.bind(this)}
                                onEndReachedThreshold={0.8}
                                sections={data}
                                removeClippedSubviews={Platform.OS === 'android'}
                                style={{marginBottom: 38}}
                            />
                        }
                    </View>
                </View>
            )
        }
    }
}
