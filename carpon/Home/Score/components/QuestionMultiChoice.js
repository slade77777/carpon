import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View, ScrollView} from "react-native";
import AnswerTypeLabel from "./AnswerTypeLabel";
import {connect} from "react-redux";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {navigationService} from "../../../services/index";

@connect(() => ({}), (dispatch) => ({
    onChangeQuestion: (answer) => dispatch({
        type: 'CHANGE_QUESTION',
        answer
    })
}))
export default class QuestionMultiChoice extends Component {

    state = {
        answers: this.props.question.answer_data.answers,
        type: this.props.question.answer_data.type,
        title: this.props.question.title,
        id: this.props.question.id
    };

    onPress(indexAnswer, specialAnswer) {

        const {answers} = this.state;
        const {onChangeQuestion, question} = this.props;
        const answerChoice = answers[indexAnswer];

        let newAnswers = [];

        if (specialAnswer.status) {
            newAnswers = answers.map((answer, index) => ({
                ...answer,
                checked: indexAnswer === index ? !answer.checked : false
            }));
        } else if (answerChoice.negative && !this.state.answers[indexAnswer].checked) {
            newAnswers = answers.map((answer, index) => {
                if (answer.value === -1) {
                    return {
                        ...answer,
                        checked: false
                    }
                } else {
                    return {
                        ...answer,
                        checked: indexAnswer === index ? !answer.checked : false
                    }
                }
            });
        } else {
            newAnswers = answers.map((answer, index) => {
                if (answer.value === -1) {
                    return {
                        ...answer,
                        checked: false
                    }
                } else {
                    return {
                        ...answer,
                        checked: indexAnswer === index ? !answer.checked : (answer.negative ? false : answer.checked)
                    }
                }

            });
        }
        this.setState({answers: newAnswers});
        onChangeQuestion({...question.answer_data, answers: newAnswers, id: this.state.id})
    }

    _renderChoice(props) {
        return (
            <AnswerTypeLabel type={'CheckBox'} {...props} onPress={this.onPress.bind(this)}/>
        )
    }

    render() {
        const {answers, title} = this.state;
        const renderHeader = this.props.renderHeader;
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}}>
                {
                    renderHeader ? renderHeader :
                        <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                            <Text style={{
                                fontSize: 16,
                                color: '#333333',
                                fontWeight: 'bold',
                                lineHeight: 20
                            }}>{title}</Text>
                            {
                                this.props.question.about_driver && <TouchableOpacity activeOpacity={1} style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    padding: 10
                                }}
                                                                                      onPress={() => navigationService.navigate('AboutDriver')}
                                >
                                    <SvgImage fill={'#999999'} source={SvgViews.HelpIcon}/>
                                    <Text style={{paddingLeft: 3, color: '#999999', paddingVertical: 5}}>運転者について</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.props.question.note && <View style={{flexDirection: 'row'}}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#333333',
                                        fontWeight: 'bold',
                                        lineHeight: 20,
                                        marginBottom: 7
                                    }}>※</Text>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#333333',
                                        fontWeight: 'bold',
                                        lineHeight: 20
                                    }}>{this.props.question.note}</Text>
                                </View>
                            }
                        </View>
                }
                <FlatList
                    data={answers}
                    renderItem={this._renderChoice.bind(this)}
                    onEndReachedThreshold={0.8}
                />
                <View style={{height: 70}}/>
            </ScrollView>
        )
    }
}
