import React, {Component} from 'react';
import {Text, Dimensions, View, TouchableOpacity, Alert} from 'react-native';
import momentJA from "../../carpon/services/momentJA";
import ImageLoader from "../ImageLoader";
import {navigationService} from "../../carpon/services";
import {ContentReviewMyPage} from "./ContentReviewMyPage";
import {connect} from "react-redux";
import {Like} from "../../carpon/Home/MyCar/actions/myCarAction";
import {DeleteReviewInMyPage} from "../../carpon/Home/Review/action/ReviewAction";

const {width} = Dimensions.get('window');
@connect(() => ({}),
    dispatch => ({
        like: () => dispatch(Like()),
        DeleteReview: (id) => dispatch(DeleteReviewInMyPage(id))
    }))
export default class MyPageReview extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.review;
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


    render() {
        const {id, sender, create_date, image_url, maker_name, car_name, grade_name, liked, total_like, edition, ...content} = this.state;
        return (
            <View style={{backgroundColor: '#FFF'}}>
                <View style={{paddingHorizontal: 15, paddingTop: 20}}>
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
                                color: '#262626'
                            }}>{`${maker_name} ${car_name} ${grade_name}`}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 12, color: '#666666'}}>{`第${edition || 1}版`}</Text>
                                <Text style={{fontSize: 12, color: '#666666'}}>{momentJA(create_date).fromNow()}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.actionNavigate.bind(this)}>
                        <ContentReviewMyPage id={id} liked={liked} total_like={total_like} content={content} profile={sender}/>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}
