import React, {Component} from 'react';
import {View, TouchableOpacity, Text, FlatList, StyleSheet} from "react-native";
import ImageLoader from "../ImageLoader";
import {connect} from "react-redux";
import {getDetailReview} from "../../carpon/Home/Review/action/ReviewAction";
import {SvgImage, SvgViews} from "../Common/SvgImage";
import _ from 'lodash';

@connect(() => ({}), dispatch => ({
    getDetailReview: review_id => dispatch(getDetailReview(review_id)),
}))
export default class PastReviews extends Component {

    handleReviewList() {

        const currentReviewId = this.props.reviewID;
        let currentCarId = this.props.profile.car_id;
        return _.filter(this.props.pastReview, (element) => {
            return ((element.id !== currentReviewId) && (element.car_id === currentCarId))
        });
    }

    handleNavigate(review) {
        this.props.getDetailReview(review.id);
        this.props.navigation.push('VehicleReviewDetailsScreen', {review_id: review.id, profile: review.sender})
    }

    _renderItem = ({item, index}) => {
        const years = Math.trunc(item.car_age / 12);
        const months = (item.car_age % 12) || 12;
        return (
            <View>
                <TouchableOpacity key={index} style={{
                    backgroundColor: '#FFFFFF',
                    flexDirection: 'row',
                    height: 70,
                    borderColor: '#E5E5E5',
                    borderBottomWidth: 1,
                    borderTopWidth: index === 0 ? 1: 0,
                    paddingHorizontal: 15
                }} onPress={this.handleNavigate.bind(this, item)}>
                    <View style={styles.iconRight}>
                        {
                            item.image_url ?
                                <ImageLoader
                                    style={{width: 50, height: 50, backgroundColor: '#CCCCCC'}}
                                    source={{uri: item.image_url}}
                                />
                                :
                                <View style={{width: 50, height: 50, backgroundColor: '#CCCCCC'}}/>
                        }
                    </View>
                    <View style={styles.center}>
                        <View style={{flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 15}}>
                            <Text style={{fontSize: 13, color: '#666666'}} numberOfLines={1}>
                                {`第${item.edition}版`}
                                {/*<Text>{' ' + item.maker_name + ' ' + item.car_name}</Text>*/}
                            </Text>
                            <Text style={{fontSize: 13, color: '#666666', paddingTop: 5}} numberOfLines={1}>
                                {`走行距離：${item.car_mileage_kiro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}km／車齢：${years ? `${years}年` : ''} ${months ? `${months}ヶ月` : ''}`}
                            </Text>
                        </View>
                        {
                            item.content && <Text style={{fontSize: 10, color: '#666666'}}>{item.content}</Text>
                        }
                    </View>
                    <View style={{width: '10%', alignItems: 'flex-end', justifyContent: 'center', marginRight: 15}}>
                        <SvgImage source={SvgViews.IcRight}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    render() {
        return (
            this.handleReviewList().length > 0 ?
                <View>
                    <View style={{
                        backgroundColor: '#F8F8F8',
                        height: 45,
                        borderBottomColor: "#4B9FA5",
                        borderBottomWidth: 3,
                        marginBottom: 10,
                        borderTopColor: '#e5e5e5',
                        borderTopWidth: 1
                    }}>
                        <Text style={{
                            marginLeft: 15,
                            color: 'black',
                            fontSize: 14,
                            marginTop: 'auto',
                            marginBottom: 'auto',
                        }}>{this.props.title}</Text>
                    </View>
                    <FlatList
                        data={this.handleReviewList()}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={0.8}
                        style={{paddingBottom: 10}}
                    />
                </View>
                :
                <View/>
        )
    }
}


const styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        height: 70,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        paddingHorizontal: 15
    },
    iconRight: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        margin: 'auto',
        width: '75%',
        justifyContent: 'center'
    },
});

