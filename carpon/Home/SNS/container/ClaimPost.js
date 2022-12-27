import React, {Component} from 'react';
import {HeaderOnPress, TextinputMultiline} from '../../../../components/index'
import {View, Keyboard, StyleSheet, Text} from 'react-native'
import {screen} from "../../../../navigation";
import {navigationService, newsService, postService} from "../../../../carpon/services/index";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {viewPage} from "../../../Tracker";

@screen('ClaimPost', {
    header: <HeaderOnPress title='問題を報告'/>
})
export class ClaimPost extends Component {
    state ={
        comment: null,
    };

    handleSubmit = () => {
        const comment = this.state.comment;
        let commentId = this.props.navigation.getParam('comment_id');
        let postId = this.props.navigation.getParam('post_id');
        comment && postService.reportPost({
            comment_id: commentId,
            comment,
            post_id: postId
        }).then(() => {
            navigationService.goBack()
        })
    };

    onChangText = (text) => {
        this.setState({ comment: text})
    };

    render() {
        return (
            <View style={Styles.body} onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                <View style={Styles.top}>
                    <TextinputMultiline onChangeText={(text) => this.onChangText(text)} style={{padding : 10}}/>
                </View>
                <View style={{marginTop: '5%'}}>
                    <ButtonCarpon style={Styles.button}
                                  autoFocus={'true'}
                                  onPress={this.handleSubmit}>
                        <Text style={Styles.text}>報告する</Text>
                    </ButtonCarpon>
                </View>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    top: {
        height: '40%',
    },
    body: {
        backgroundColor: '#FFFFFF',
        padding: '4%',
        height: '100%',
    },
    button: {
        backgroundColor: '#D99D2A',
        borderRadius: 5,
        height: 40,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff'
    }
});

