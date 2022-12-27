import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View, ScrollView} from "react-native";
import {connect} from "react-redux";
import AnswerTypeLabel from "../../../Score/components/AnswerTypeLabel";
import AnswerTypeInput from "../../../Score/components/AnswerTypeInput";
import AnswerTypeListQuestion from "../../../Score/components/AnswerTypeListQuestion";
import AnswerTypeSelectBoxGroup from "../../../Score/components/AnswerTypeSelectBoxGroup";

export default class QuestionTypeSingle extends Component {

    state = {
        answers: this.props.question.answer_data.answers,
        type: this.props.question.answer_data.type,
        title: this.props.question.title,
        id: this.props.question.id,
        typeAnswer: {
            label: AnswerTypeLabel,
            input: AnswerTypeInput,
            list_question: AnswerTypeListQuestion,
            selectBox_group: AnswerTypeSelectBoxGroup,
        }
    };

    onPress(indexAnswer) {
        const {answers} = this.state;
        const {onChangeQuestion, question} = this.props;
        const newAnswers = answers.map((answer, index) => ({
            ...answer,
            checked: indexAnswer === index
        }));
        this.setState({answers: newAnswers});
        onChangeQuestion({...question.answer_data, answers: newAnswers, id: this.state.id})
    }


    onChangeData(answer, index) {
        const newAnswers = this.state.answers;
        const {onChangeQuestion, question} = this.props;
        newAnswers[index] = answer;
        this.setState({answers: [...newAnswers]});
        onChangeQuestion({...question.answer_data, answers: newAnswers, id: this.state.id})
    }

    _renderChoice({item, index}) {
        const CheckComponent = (Object.keys(this.state.typeAnswer).includes(item.type)) ? this.state.typeAnswer[item.type] : 'label';
        return (
            <CheckComponent type={'Radio'} item={item} index={index} onPress={this.onPress.bind(this)}
                            onChangeData={this.onChangeData.bind(this)}/>
        )
    }

    render() {
        const {answers, title} = this.state;
        const renderHeader = this.props.renderHeader;
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}}>
                {
                    renderHeader ? renderHeader :
                        <View style={{paddingHorizontal: 15, marginVertical: 20}}>
                            <Text style={{
                                fontSize: 16,
                                color: '#333333',
                                fontWeight: 'bold',
                                lineHeight: 20
                            }}>{title}</Text>
                        </View>
                }
                <FlatList
                    data={answers}
                    renderItem={this._renderChoice.bind(this)}
                    onEndReachedThreshold={0.8}
                />
            </ScrollView>
        )
    }
}
