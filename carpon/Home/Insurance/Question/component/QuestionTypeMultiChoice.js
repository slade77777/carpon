import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View, ScrollView} from "react-native";
import AnswerTypeLabel from "../../../Score/components/AnswerTypeLabel";

export default class QuestionTypeMultiChoice extends Component {

    state = {
        answers: this.props.question.answers,
        type: this.props.question.type,
        title: this.props.question.title,
    };

    onPress(indexAnswer)  {
        const {answers} = this.state;
        const {onChangeQuestion} = this.props;
        const newAnswers = answers.map((answer, index) => ({
            ...answer,
            checked: indexAnswer === 0 ? (indexAnswer === index ? answer.checked : answer.checked) : (indexAnswer === index ? !answer.checked : answer.checked)
        }));
        this.setState({answers: newAnswers});
        onChangeQuestion({type : this.state.type, answers: newAnswers, title: this.state.title})
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
                            <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold', lineHeight: 20}}>{title}</Text>
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
