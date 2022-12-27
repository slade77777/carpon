import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import ViewMoreText from 'react-native-view-more-text';
import color from "../../carpon/color";


export class ContentReviewTextUserPage extends Component {

    renderViewMore(onPress){
        return(
            <Text onPress={onPress} style={{color: color.active, fontSize: 13, marginVertical: 3}}>(続きを読む)</Text>
        )
    }

    renderViewLess(onPress){
        return(
            <Text onPress={onPress} style={{color: color.active, fontSize: 13, marginVertical: 3}}>(続きを読む)</Text>
        )
    }

    render() {
        const {content} = this.props;
        return (
            <ViewMoreText
                numberOfLines={2}
                renderViewMore={this.renderViewMore}
                renderViewLess={this.renderViewLess}
                textStyle={{textAlign: 'left'}}
            >
                <Text style={{fontSize: 12, color: '#262626', lineHeight: 18}}>
                    {content.review_text}
                </Text>
                <Text style={{fontSize: 12, color: '#262626', lineHeight: 18}}>
                    {content.review_other}
                </Text>
                <Text style={{fontSize: 12, color: '#262626', lineHeight: 18}}>
                    {content.review_nice_thing}
                </Text>
            </ViewMoreText>
        )
    }
}
