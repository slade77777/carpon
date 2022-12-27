import React, {Component} from 'react';
import {View} from "react-native";
import LabelComment from "./LabelComment";
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {UserComponent} from "./UserProfileComponent";

export default class UserProfileForAllNews extends Component {

    render() {
        const {comment, sender, create_date} = this.props.last_comment;
        return (
                <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <UserComponent profile={sender} date={create_date}/>
                    <LabelComment comment={comment} style={{fontSize: 12, marginTop: hp('1.5%'),  width : 270}}/>
                </View>
        )
    }

}
