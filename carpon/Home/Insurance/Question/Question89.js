import React, {Component} from 'react';
import {View, SafeAreaView, Text, ScrollView} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from "../../../../navigation";
import {SingleColumnLayout} from "../../../layouts";
import QuestionRadioList from "./component/QuestionRadioList";
import {connect} from "react-redux";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {getCar} from "../../MyCar/actions/getCar";
import Spinner from "react-native-loading-spinner-overlay";
import {navigationService} from "../../../services";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('Question89', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        answer: state.metadata.answers ? state.metadata.answers.insurance_company : null,
        myProfile: state.registration.userProfile.myProfile,
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_company : []
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer)),
        getCar: (answer) => dispatch(getCar())
    })
)
export default class Question89 extends Component {

    constructor(props) {
        super(props);
        const currentInsurance = this.props.answer || (props.myProfile ? props.myProfile.insurance_company : null);
        let currentInsuranceChoice = props.optionsList[0].value;
        if (currentInsurance) {
            const insurance = props.optionsList.find((item) => item.value === currentInsurance);
            currentInsuranceChoice = insurance.value
        }
        this.state = {
            loading: false,
            type: currentInsuranceChoice,
        };
    }

    componentDidMount() {
        viewPage('insurance_question_current_company', '任意保険_現保険会社');
    }

    handleNextQuestion() {
        const answers = this.props.answerList;
        answers.insurance_company =  this.state.type;
        this.props.AnswerProfileOptions(answers);
        if (!this.props.navigation.getParam('willGoBack')) {
            if (this.props.myProfile.estimation_type === 'detail' || this.props.myProfile.estimation_type === 'individual') {
                navigationService.navigate('Question118')
            } else {
                navigationService.navigate('Question104')
            }
        } else {
            navigationService.clear('Question117', {doDetailAgain: false})
        }
    }


    render() {
        return (
            <View style={{ flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 19 : 0}}>
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    現在ご加入されている保険会社を選択してください
                                </Text>
                            </View>
                            <QuestionRadioList onClick={(val) => this.setState({ type: val})} answerList={this.props.optionsList} type={this.state.type}/>
                            <View style={{ height: 70}}/>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace() : 15, position: 'absolute', bottom: 0, width: '100%',
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
