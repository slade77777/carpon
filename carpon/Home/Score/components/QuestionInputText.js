import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View, ScrollView} from "react-native";
import AnswerTypeLabel from "./AnswerTypeLabel";
import AnswerTypeListQuestion from "./AnswerTypeListQuestion";
import AnswerTypeInput from "./AnswerTypeInput";
import AnswerTypeSelectBoxGroup from "./AnswerTypeSelectBoxGroup";
import {connect} from "react-redux";
import {AnswerTypeSelectCar} from "./AnswerTypeSelectCar";
@connect(() => ({}), (dispatch) => ({
    onChangeQuestion: (answer) => dispatch({
        type: 'CHANGE_QUESTION',
        answer
    })
}))
export default class QuestionInputText extends Component {

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
            select_car: AnswerTypeSelectCar
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
            <CheckComponent type={'none'} hiddenChecked={true} item={item} index={index} onPress={this.onPress.bind(this)}
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
                        <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                            <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold', lineHeight: 20}}>{title}</Text>
                            {
                                this.props.question.note && <View style={{ flexDirection: 'row'}}>
                                    <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold', lineHeight: 20, marginBottom: 7}}>※</Text>
                                    <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold', lineHeight: 20}}>{this.props.question.note}</Text>
                                </View>
                            }
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
