import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, View, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../../layouts";
import Spinner from 'react-native-loading-spinner-overlay';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import QuestionRadioList from './component/QuestionRadioList';
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";


const answerList = [
    {
        label: '1人',
        value: 1
    },
    {
        label: '2人',
        value: 2
    },
    {
        label: '3人',
        value: 3
    },
    {
        label: '4人',
        value: 4
    }
];
@screen('Question1054', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(
    state => ({
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.number_of_familiy_driver : [],
        answers: state.metadata.answers
    }),
    dispatch => ({
        AnswerProfileOptions:(answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export class Question1054 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            type: this.props.optionsList[0].value
        };
    }

    componentDidMount() {
        viewPage('insurance_question_number_of_drivers', '任意保険見積_運転者人数');
        const number_of_familiy_driver = this.props.answers.number_of_familiy_driver;
        number_of_familiy_driver ? this.setState({type: number_of_familiy_driver}) : this.setState({type: this.props.optionsList[0].value})
    }

    handleUpdateAnswer(){
        const answer = this.props.answers;
        answer.number_of_familiy_driver = this.state.type;
        this.props.AnswerProfileOptions(answer);
        this.handleResetChild(this.state.type);
        navigationService.navigate('Question1055',{currentScreen: 1, numberScreen: this.state.type});
    }

    buildDataRaw(child){

        let driverGender = child +'_driver_gender';
        let driverType = child +'_driver_type';
        let driverBirthday = child +'_driver_birthday';

        return {
            [driverGender]: null,
            [driverType]: null,
            [driverBirthday]: null
        };
    }

    handleResetChild(numberOfChild) {
        const answers = this.props.answers;
        switch (numberOfChild) {
            case 1:
                const AnswersOfUser2 = {...answers, ...this.buildDataRaw('second_family'), ...this.buildDataRaw('third_family'), ...this.buildDataRaw('fourth_family')};
                return this.props.AnswerProfileOptions(AnswersOfUser2);
            case 2:
                const AnswersOfUser3 = {...answers, ...this.buildDataRaw('third_family'), ...this.buildDataRaw('fourth_family')};
                return this.props.AnswerProfileOptions(AnswersOfUser3);
            case 3:
                const AnswersOfUser4 = {...answers, ...this.buildDataRaw('fourth_family')};
                return this.props.AnswerProfileOptions(AnswersOfUser4);
            default:
                return answers
        }
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 20 : 0}}>
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    運転される同居の親族（配偶者または子供を除く）は何人いますか？
                                </Text>
                            </View>
                            <QuestionRadioList onClick={(val) => this.setState({ type: val})} answerList={this.props.optionsList} type={this.state.type}/>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%',
                            height: isIphoneX() ? getBottomSpace() + 55  : 70,
                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D'}}
                                          onPress={() => this.handleUpdateAnswer()}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>次へ</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </View>
        )
    }
}
