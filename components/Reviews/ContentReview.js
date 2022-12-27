import React, {Component} from 'react';
import {Text, View} from "react-native";
import LabelTitleReview from "./LabelTitleReview";
import StarRate from "../Common/StarRate";
import {UserComponent} from "../Common/UserProfileComponent";
import {connect} from "react-redux";
import LabelRate from "./LabelRate";
import Divider from "../Common/Divider";
import {FollowComponent} from "../Common/FollowComponent";
import ButtonLike from "../Common/ButtonLike";

@connect(
    (state) => ({
        me: state.registration.userProfile.myProfile
    }),
    () => ({})
)
export default class ContentReview extends Component {


    render() {
        const {me, profile: sender, content} = this.props;
        const otherUser = me && me.id !== sender.id;
        const {review_text, total_rate} = content;
        const rate_overall = Number.parseFloat(total_rate).toFixed(1);
        return (
            <View style={{
                borderColor: '#83C0C5',
                borderWidth: 1.5,
                borderRadius: 2,
                marginVertical: 10,
                backgroundColor: '#F8F8F8',
                padding: 15
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/*<Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>評価：</Text>*/}
                    <StarRate
                        starSize={20}
                        starCount={rate_overall}
                    />
                    <Text style={{fontSize: 30, marginLeft: 10}}>{`${rate_overall}`}</Text>
                </View>
                <LabelRate listRate={content}/>
                <View style={{marginTop: 15, borderTopWidth: 1, borderColor: '#E5E5E5'}}/>
                <View style={{ justifyContent: 'center', marginTop: 15}}>
                    <UserComponent otherUser={otherUser} profile={sender}/>
                </View>
                <View style={{marginLeft: 55}}>
                    <LabelTitleReview title={review_text}/>
                </View>
                {
                    !(this.props.screen === 'myPage') &&
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10}}>
                        <ButtonLike handleLike={() => this.props.handleLike()} liked={this.props.liked}
                                    total_like={this.props.total_like} loading={this.props.loading}/>
                        {otherUser && <FollowComponent profile={sender}/>}
                    </View>
                }
            </View>
        )
    }

}
