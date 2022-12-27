import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import AnswerTypeLabel from "./AnswerTypeLabel";

export default class AnswerTypeQuestion extends Component {


    onPress(indexAnswer) {
        const {question, index} = this.props;
        const newAnswers = question.answers.map((answer, indexItem) => ({
            ...answer,
            checked: indexAnswer === indexItem
        }));
        this.props.onPress({...question, answers: [...newAnswers]}, index)
    }

    _renderChoice({item, index}) {
        return (
            <AnswerTypeLabel type={'Radio'} item={item} index={index} onPress={this.onPress.bind(this)}/>
        )
    }

    render() {
        const {answers, label} = this.props.question;
        return (
            <View>
                <View style={{paddingHorizontal: 15, marginVertical: 20}}>
                    <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold', lineHeight: 20}}>{label}</Text>
                </View>
                <FlatList
                    data={answers}
                    renderItem={this._renderChoice.bind(this)}
                    onEndReachedThreshold={0.8}
                />
            </View>
        )
    }
}