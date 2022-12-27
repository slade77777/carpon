import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {screen} from "../../../navigation";
import {carInformationService, navigationService, userProfileService} from "../../services/index";
import {connect} from "react-redux";
import {getCar} from "../../Home/MyCar/actions/getCar";
import {updateReview} from "../../Home/Review/action/ReviewAction";
import {loadMyFollowing} from "../../common/actions/followAction";

@screen('LoadInformationCar', {header: null})
@connect(() => ({}), dispatch => ({
    saveInfoCar: (carProfile) => dispatch({
        type: 'HAS_REGISTER_CAR',
        carProfile
    }),
    saveInfoUser: (carProfile, userProfile) => dispatch({
        type: 'HAS_REGISTER_USER',
        carProfile,
        userProfile
    }),
    saveInfoProfile: (userProfile) => dispatch({
        type: 'HAS_REGISTER_PROFILE',
        userProfile
    }),
    getCarInfo: () => dispatch(getCar()),
    updateReview: () => dispatch(updateReview()),
    loadMyFollowing: () => dispatch(loadMyFollowing()),
}))
export default class LoadInformationCar extends Component {

    componentDidMount() {
        carInformationService.getProfileMyCar().then(carProfile => {
            userProfileService.getUserProfile().then(userProfile => {
                if (userProfile['email_verified']) {
                    this.props.getCarInfo();
                    this.props.updateReview();
                    this.props.loadMyFollowing();
                    this.props.saveInfoUser(carProfile, userProfile);
                } else {
                    this.props.saveInfoCar(carProfile)
                }
            }).catch(() => {
                this.props.saveInfoCar(carProfile)
            })
        }).catch(() => {
            userProfileService.getUserProfile().then(userProfile => {
                if (userProfile['email_verified']) {
                    this.props.updateReview();
                    this.props.loadMyFollowing();
                    this.props.saveInfoProfile(userProfile);
                } else {
                    navigationService.clear('CarType');
                }
            }).catch(() => {
                navigationService.clear('CarType');
            });
        })
    }

    render() {
        return (
            <View style={{backgroundColor: '#4B9FA5', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#FFFFFF"/>
            </View>
        );
    }
}