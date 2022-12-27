import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Alert} from "react-native";
import StarRate from "../Common/StarRate";
import {connect} from "react-redux";
import LabelRate from "./LabelRate";
import {ContentReviewTextUserPage} from "./ContentReviewTextUserPage";
import ButtonLike from "../Common/ButtonLike";
import {EditReview} from "../../carpon/Home/Review/components/EditReview";
import {listReviewService, navigationService} from "../../carpon/services";
import {addTrackerEvent} from "../../carpon/Tracker";
import {Like} from "../../carpon/Home/MyCar/actions/myCarAction";
import {DeleteReviewInMyPage} from "../../carpon/Home/Review/action/ReviewAction";

@connect(
    (state) => ({
        me: state.registration.userProfile.myProfile
    }),
    (dispatch) => ({
        like: () => dispatch(Like()),
        DeleteReview: (id) => dispatch(DeleteReviewInMyPage(id))
    })

)
export class ContentReviewMyPage extends Component {

    state = {
        id: this.props.id,
        loading: false,
        liked: this.props.liked,
        total_like: this.props.total_like
    };

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
        const {content} = this.props;
        const {total_rate} = content;
        const rate_overall = Number.parseFloat(total_rate).toFixed(1);
        return (
            <View style={{
                borderColor: '#83C0C5',
                borderWidth: 1.5,
                borderRadius: 2,
                marginTop: 20,
                backgroundColor: '#F8F8F8',
                padding: 15
            }}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <StarRate
                        starSize={20}
                        starCount={rate_overall}
                    />
                    <Text style={{fontSize: 30, marginLeft: 10}}>{`${rate_overall}`}</Text>
                </View>
                <LabelRate listRate={content}/>
                <View style={{marginTop: 10, borderTopWidth: 1, borderColor: '#E5E5E5'}}/>
                <View style={{paddingVertical: 10}}>
                    <ContentReviewTextUserPage content={content}/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <ButtonLike handleLike={this.handleLike.bind(this)} liked={this.state.liked}
                                total_like={this.state.total_like} loading={this.state.loading}/>
                    {
                        this.props.id === this.props.me.id &&
                        <EditReview handleSelectReview={(buttonIndex) => this.handleSelectReview(buttonIndex)}/>
                    }
                </View>
            </View>
        )
    }

}
