import React, {Component} from 'react';
import {View, Text} from 'react-native';
import ContentReview from "./ContentReview";
import momentJA from "../../carpon/services/momentJA";
import Divider from "../Common/Divider";

export default class ReviewMyPage extends Component {


    render() {
        const {sender, create_date, ...content} = this.props.review;
        return (
            <View style={{backgroundColor: '#FFFFFF'}}>
                <Text style={{fontSize: 12}}>
                    {momentJA(create_date).format('YYYY年MM月DD日')}
                </Text>
                <ContentReview content={content} profile={sender}/>
                {
                    this.props.index < 1 &&
                    <Divider  style={{marginTop: 15, marginBottom: 15}}/>
                }
            </View>
        )
    }
}
