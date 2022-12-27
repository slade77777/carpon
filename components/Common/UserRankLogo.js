import React, {Component} from 'react';
import {Text, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import {SvgImage, SvgViews} from "./SvgImage";

@connect(state => ({
    myProfile: state.registration.userProfile.myProfile
}))

export default class UserRankLogo extends Component {

    UserRank() {
        const profile = this.props.myProfile ? this.props.myProfile : {};
        switch (profile.rank) {
            case 1:
                return SvgViews.LogoRegular;
            case 2:
                return SvgViews.LogoGold;
            case 3:
                return SvgViews.LogoPlatinum;
            default :
                return SvgViews.LogoRegular;
        }
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.props.onPressLeft()}
                              style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
                <SvgImage source={this.UserRank()} style={{paddingHorizontal: 3}}/>
                <Text style={{fontSize: 14, color: '#fff', marginLeft: 3}}>{this.props.myProfile.total_score}
                    <Text style={{fontSize: 10, color: '#fff'}}>pts</Text>
                </Text>
            </TouchableOpacity>
        )
    }

}
