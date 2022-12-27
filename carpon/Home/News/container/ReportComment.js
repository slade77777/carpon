import React, {Component} from 'react';
import {HeaderOnPress, TextinputMultiline} from '../../../../components/index'
import {View, Keyboard, StyleSheet, Text} from 'react-native'
import {screen} from "../../../../navigation";
import {navigationService, newsService} from "../../../../carpon/services/index";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {viewPage} from "../../../Tracker";

@screen('ReportComment', {
    header: <HeaderOnPress title='問題を報告'/>
})
export class ReportComment extends Component {
    state ={
        comment: null,
    };

    componentDidMount() {
        const news = this.props.navigation.getParam('news');
        if (news) {
            viewPage('claim_news_comment', `ニュース_コメントクレーム： ${news.id} (${news.title})`)
        }
    }

    handleSubmit = () => {
        let commentId = this.props.navigation.getParam('commentId');
        this.state.comment && newsService.postReportComment(commentId, this.state.comment).then((res) => {
            res.status === 200 && navigationService.goBack()
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

