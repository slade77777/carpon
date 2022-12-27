import React, {Component} from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from "../../../../navigation";
import WrapperQuestion from "./component/WrapperQuestion";
import QuestionTypeSingle from "./component/QuestionTypeSingle";
import {viewPage} from "../../../Tracker";

@screen('Question21', {header: <HeaderOnPress title={'任意保険見積'}/>})
export default class Question21 extends Component {
    state = {
        question: {
            answer_data: {
                type: "single_choice",
                answers: [
                    {
                        checked: false,
                        key: 76394,
                        label: "同じ",
                        type: "label",
                    }, {
                        checked: false,
                        key: 76394,
                        label: "異なる",
                        type: "label",
                    }
                ]
            },
            id: 854,
            title: "現契約の「車両所有者」と新しい契約の「車両所有者」は同じですか？",
        }
    };

    componentDidMount() {
        viewPage('insurance_question_owner_changing', '任意保険_所有者変更有無')
    }

    render() {

        return (
            <WrapperQuestion textButton={'保存する'}>
                <QuestionTypeSingle question={this.state.question}/>
            </WrapperQuestion>
        )
    }
}
