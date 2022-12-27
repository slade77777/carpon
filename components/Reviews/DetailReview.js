import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Alert} from "react-native";
import momentJA from "../../carpon/services/momentJA";
import ImageLoader from "../ImageLoader";
import TableInfoCar from "./TableInfoCar";
import {listReviewService, navigationService} from "../../carpon/services";
import ButtonLike from "../Common/ButtonLike";
import LabelMileageAndAgeCar from "./LabelMileageAndAgeCar";
import {connect} from 'react-redux'
import {DeleteReview, updateReview} from "../../carpon/Home/Review/action/ReviewAction";
import {SvgImage, SvgViews} from "../Common/SvgImage";
import {UserComponent} from "../Common/UserProfileComponent";
import {Like} from '../../carpon/Home/MyCar/actions/myCarAction'
import {EditReview} from "../../carpon/Home/Review/components/EditReview";
import {addTrackerEvent} from "../../carpon/Tracker";

@connect(state => ({
        pastReview: state.review.pastReview ? state.review.pastReview: [],
        loading: state.review.loading
    }),
    dispatch => ({
        updateReview: (page) => {
            dispatch(updateReview(page))
        },
        like: ()=> dispatch(Like()),
        DeleteReview: (id)=> dispatch(DeleteReview(id))
    })
    )
export default class DetailReview extends Component {

    constructor(props) {
        super(props);
        this.state = this.props.detailReview;
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

    handleLike = () => {
        let {id, liked} = this.state;
        this.setState({loading: true});
        if (liked) {
            return this.unlikeReview(id)
        } else {
            return this.likeReview(id)
        }
    };

    likeReview(id) {
        return listReviewService.likeReview(id)
            .then(setTimeout(() => {
                this.reloadComment(true);
                addTrackerEvent('review_like', {review_id: id})
            }, 500))
            .finally(setTimeout(() => this.setState({loading: false}), 500))
    }

    unlikeReview(id) {
        return listReviewService.unlikeReview(id)
            .then(setTimeout(() => this.reloadComment(false), 500))
            .finally(setTimeout(() => this.setState({loading: false}), 500))
    }

    reloadComment(liked) {
        this.props.updateReview();
        this.props.like();
        this.setState({
            liked: liked,
            total_like: liked ? this.state.total_like + 1 : this.state.total_like - 1
        })
    }

    componentDidMount() {
        let pastReviewId = this.props.pastReview.map((element) => element.id);
        this.setState({myReviewId: pastReviewId})
    }

    handleShowThreeDots() {
        let myReviewId = this.state.myReviewId ? this.state.myReviewId : [];
        return !!myReviewId.find((element) => element === this.state.id)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.detailReview) {
            this.setState(nextProps.detailReview)
        }
    }

    render() {
        const {profile} = this.props;
        const {image_url, create_date, total_rate, review_text, review_nice_thing, review_other, liked, total_like, maker_name, car_name, grade_name, edition, ...rate} = this.state;
        const rate_overall = Number.parseFloat(total_rate).toFixed(1);
        return (
            <View>
                <View style={{paddingHorizontal: 15, paddingTop: 30}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: 'bold',
                            color: '#333333'
                        }}>{`${maker_name} ${car_name} ${grade_name}`}</Text>
                    </View>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', marginTop: 7}}>
                        <LabelMileageAndAgeCar style={{flexDirection: 'row'}} carInfo={this.state}/>
                        <Text style={{fontSize: 12, marginLeft: 10, color: '#666666'}}>{momentJA(create_date).fromNow()}</Text>
                    </View>
                </View>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    margin: 15,
                    padding: 15
                }}
                                  onPress={()=> navigationService.navigate('MyPageScreen', {profile: profile})}
                >
                    <UserComponent profile={profile} create_date={null}/>
                    <SvgImage source={SvgViews.IcRight} />
                </TouchableOpacity>
                <View style={{
                    marginTop: 15,
                    height: 50,
                    backgroundColor: '#F8F8F8',
                    borderTopColor: '#CCC',
                    borderBottomColor: "#4B9FA5",
                    borderBottomWidth: 2,
                    borderTopWidth: 0.5,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#262525',
                    }}>{`レビュー（第${edition || 1}版）`}</Text>
                    {
                        this.handleShowThreeDots() &&
                        <EditReview handleSelectReview={(buttonIndex) => this.handleSelectReview(buttonIndex)}/>
                    }
                </View>
                <View style={{padding: 15}}>
                    {
                        image_url ?
                            <ImageLoader
                                source={{uri: image_url}}
                                style={{height: 200}}
                            /> :
                            <View style={{height: 230, backgroundColor: '#CCCCCC'}}/>
                    }
                    <TableInfoCar rate={rate} rate_overall={rate_overall} profile={this.props.profile}/>
                    <Text style={{
                        marginTop: 20,
                        fontSize: 16,
                        marginBottom: 5,
                        color: '#333333'

                    }}>{review_text}</Text>
                </View>
                <View style={{
                    height: 45,
                    backgroundColor: '#F2F8F9',
                    borderColor: '#707070',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#4B9FA5',
                        marginLeft: 15
                    }}>良いところ</Text>
                </View>
                <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                    <Text style={{fontSize: 16, color: '#333333'}}>{review_nice_thing}</Text>
                </View>
                <View style={{
                    height: 45,
                    backgroundColor: '#F2F8F9',
                    borderColor: '#707070',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#4B9FA5',
                        marginLeft: 15
                    }}>イマイチなところ</Text>
                </View>
                <View style={{paddingHorizontal: 15, paddingTop: 15, paddingBottom: 25}}>
                    <Text style={{fontSize: 16, color: '#333333'}}>{review_other}</Text>
                    <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <ButtonLike handleLike={this.handleLike.bind(this)} liked={liked} total_like={total_like}
                                    loading={this.state.loading}/>
                        <View/>
                    </View>
                </View>
            </View>
        );
    }
}
