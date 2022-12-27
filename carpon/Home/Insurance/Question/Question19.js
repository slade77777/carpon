import React, {Component} from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from "../../../../navigation";
import WrapperQuestion from "./component/WrapperQuestion";
import Dropdown from "../../../common/Dropdown";
import {connect} from "react-redux";
import {viewPage} from "../../../Tracker";

@screen('Question19', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect( state => ({
        answers: state.metadata.profileOptions
    }),
    () => ({})
    )
export class Question19 extends Component {
    state = {
        question: {
            answer_data: {
                type: "single_choice",
                answers: this.props.answers.insurance_car_owner
            },
            id: 854,
            title: "車両所有者についてご回答ください",
        }
    };

    componentDidMount() {
        viewPage('insurance_question_owner', '任意保険_所有者')
    }

    render() {

        const {question} = this.state;
        return (
            <WrapperQuestion textButton={'保存する'}>
                <View>
                    <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                        <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold', lineHeight: 20}}>{question.title}</Text>
                    </View>
                    <View style={{height: 37, backgroundColor : '#F2F8F9', flexDirection: 'row', alignItems:  'center'}}>
                        <Text style={{color : '#4B9FA5', fontSize : 15, paddingHorizontal : 15}}>車両所有者</Text>
                    </View>
                    <View style={{paddingHorizontal: 15}}>
                        <Dropdown
                            label={'契約者の配偶者'}
                        />
                    </View>
                    <View style={{height: 37, backgroundColor : '#F2F8F9', flexDirection: 'row', alignItems:  'center', marginTop: 15}}>
                        <Text style={{color : '#4B9FA5', fontSize : 15, paddingHorizontal : 15}}>車両所有者名</Text>
                    </View>
                    <View style={{paddingHorizontal: 15}}>
                        <Dropdown
                            label={'姓名または会社名（漢字）'}
                        />
                        <Dropdown
                            label={'姓名または会社名（カナ）'}
                        />
                    </View>
                </View>
            </WrapperQuestion>
        )
    }
}
