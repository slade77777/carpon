import React, {Component} from 'react';
import {Text, Dimensions, View, TouchableOpacity, Alert} from 'react-native';
import momentJA from "../../carpon/services/momentJA";
import ImageLoader from "../ImageLoader";
import ButtonLike from "../Common/ButtonLike";
import {listReviewService, navigationService} from "../../carpon/services";
import {ContentReviewMyPage} from "./ContentReviewMyPage";
import ContentReview from "./ContentReview";
import {connect} from "react-redux";
import {Like} from "../../carpon/Home/MyCar/actions/myCarAction";
import {DeleteReviewInMyPage} from "../../carpon/Home/Review/action/ReviewAction";
import {EditReview} from "../../carpon/Home/Review/components/EditReview";
import {addTrackerEvent} from "../../carpon/Tracker";

const {width} = Dimensions.get('window');
@connect(() => ({}),
    dispatch => ({
        like: () => dispatch(Like()),
        DeleteReview: (id) => dispatch(DeleteReviewInMyPage(id))
    }))
export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.review;
    }

    handleLike = () => {
        let {id, liked} = this.state;
        this.setState({loading: true});
        if (!liked) {
            this.likeReview(id);
        } else {
            this.unlikeReview(id);
            this.props.like();
        }
    };

    likeReview(id) {
        return listReviewService.likeReview(id)
            .finally(setTimeout(() => {
                this.reloadComment(true);
                this.props.like();
                this.setState({loading: false});
                addTrackerEvent('review_like', {review_id: id})
            }, 500))
    }

    unlikeReview(id) {
        return listReviewService.unlikeReview(id)
            .then(setTimeout(() => this.reloadComment(false), 500))
            .finally(setTimeout(() => {
                this.setState({loading: false});
                this.props.like();
            }, 500));
    }

    reloadComment(liked) {
        this.setState({
            liked: liked,
            total_like: liked ? this.state.total_like + 1 : this.state.total_like - 1
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.review) {
            this.setState(nextProps.review)
        }
    }

    actionNavigate() {
        navigationService.navigate('VehicleReviewDetailsScreen', {
            review_id: this.state.id,
            review: this.state,
            profile: this.state.sender
        })
    }

    handleSelectReview(buttonIndex) {
        const contentReview = this.state;
        let {id} = this.state;

        switch (buttonIndex) {
            case 0:
                return navigationService.navigate('ReviewSubmissionForm', {contentReview: contentReview});
            case 1:
                return Alert.alert(
                    'レビューの削除',
                    '本当に削除してよろしいでしょうか？',
                    [
                        {text: 'はい', onPress: () => this.props.DeleteReview(id)},
                        {text: 'いいえ', style: 'cancel'}
                    ]
                );
            default:
                return true;
        }
    }


    render() {
        const {sender, create_date, image_url, maker_name, car_name, grade_name, liked, total_like, edition, ...content} = this.state;
        return (
            <View style={{backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#E5E5E5'}}>
                <View style={{padding: 15}}>
                    <TouchableOpacity onPress={this.actionNavigate.bind(this)}
                                      style={{flexDirection: 'row', width: width - 30}}>
                        <View style={{width: '26%'}}>
                            {
                                image_url ?
                                    <ImageLoader
                                        style={{width: '100%', height: 56, backgroundColor: '#CCCCCC'}}
                                        source={{uri: image_url}}
                                    />
                                    :
                                    <View style={{width: '100%', height: 56, backgroundColor: '#CCCCCC'}}/>
                            }
                        </View>
                        <View style={{justifyContent: 'space-between', width: '74%', paddingLeft: 15}}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}>{`${maker_name} ${car_name} ${grade_name}`}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 12, color: '#666666'}}>{`第${edition || 1}版`}</Text>
                                <Text style={{fontSize: 12, color: '#666666'}}>{momentJA(create_date).fromNow()}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.actionNavigate.bind(this)}>
                        {
                            this.props.screen === 'myPage' ?
                                <ContentReviewMyPage content={content} profile={sender}/> :
                                <ContentReview handleLike={() => this.handleLike()} liked={liked} content={content}
                                               profile={sender} total_like={total_like} loading={this.state.loading}/>
                        }
                    </TouchableOpacity>

                    {
                        this.props.screen === 'myPage' &&
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <ButtonLike handleLike={this.handleLike.bind(this)} liked={liked}
                                        total_like={total_like} loading={this.state.loading}/>
                            {
                                !this.props.otherUser &&
                                <EditReview handleSelectReview={(buttonIndex) => this.handleSelectReview(buttonIndex)}/>
                            }
                        </View>
                    }
                </View>
            </View>
        )
    }
}
