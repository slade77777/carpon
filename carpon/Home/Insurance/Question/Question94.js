import React, {Component} from 'react';
import {View, SafeAreaView, Text, ScrollView} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from "../../../../navigation";
import {connect} from "react-redux";
import {SingleColumnLayout} from "../../../layouts";
import QuestionRadioList from "./component/QuestionRadioList";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {navigationService} from "../../../services";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('Question94', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        answer: state.metadata.answers ? state.metadata.answers.purpose_of_use : null,
        myProfile: state.registration.userProfile.myProfile,
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.purpose_of_use : []
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export default class Question94 extends Component {

    state = {
        type: this.props.answer || this.props.myProfile.purpose_of_use || this.props.optionsList[0].value
    };

    handleNextQuestion() {
        const answers = this.props.answerList;
        answers.purpose_of_use =  this.state.type;
        this.props.AnswerProfileOptions(answers);
        if (!this.props.navigation.getParam('willGoBack')) {
            navigationService.navigate('Question118')
        } else {
            navigationService.clear('Question117', {doDetailAgain: false})
        }
    }

    componentDidMount() {
        viewPage('insurance_question_purpose_of_use', '任意保険_使用目的');
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 20 : 0}}>
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    おクルマの主な使用目的を選択してください
                                </Text>
                            </View>
                            <QuestionRadioList onClick={(val) => this.setState({ type: val})} answerList={this.props.optionsList} type={this.state.type}/>
                            <View style={{ height: 70}}/>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%',
                            height: isIphoneX() ? getBottomSpace() + 55  : 70,
                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D'}}
                                          onPress={() => this.handleNextQuestion()}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>保存する</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </View>
        )
    }
}
