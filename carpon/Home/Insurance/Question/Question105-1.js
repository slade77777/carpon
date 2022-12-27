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

@screen('Question1051', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(
    state => ({
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.number_of_children_driver : [],
        answerList: state.metadata.answers
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) =>  dispatch(AnswerProfileOptions(answer))
    })
)
export class Question1051 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            child: this.props.optionsList[0].value
        };
    }

    componentDidMount() {
        viewPage('insurance_question_number_of_children_drivers', '任意保険_運転者子供人数');
        const number_of_children_driver = this.props.answerList.number_of_children_driver;
        number_of_children_driver ? this.setState({child: number_of_children_driver}) : this.setState({child: this.props.optionsList[0].value})
    }

    handleAnswerThisQuestion() {
        const answer = this.props.answerList;
        answer.number_of_children_driver = this.state.child;
        this.props.AnswerProfileOptions(answer);
        this.handleResetChild(this.state.child);
        navigationService.navigate('Question1053',{numberScreen: this.state.child, currentScreen : 1})
    };

    buildDataRaw(child){

        let driverGender = child +'_driver_gender';
        let driverMaritalStatus = child +'_driver_marital_status';
        let driverLiving = child +'_driver_living';
        let driverLivinghood = child +'_driver_livinghood';
        let driverBirthday = child +'_driver_birthday';

        return {
            [driverGender]: null,
            [driverMaritalStatus]: null,
            [driverLiving]: null,
            [driverLivinghood]: null,
            [driverBirthday]: null
        };
    }

    handleResetChild(numberOfChild) {
        const answerList = this.props.answerList;
        switch (numberOfChild) {
            case 1:
                const AnswersOfUser2 = {...answerList, ...this.buildDataRaw('second_child'), ...this.buildDataRaw('third_child'), ...this.buildDataRaw('fourth_child')};
                return this.props.AnswerProfileOptions(AnswersOfUser2);
            case 2:
                const AnswersOfUser3 = {...answerList, ...this.buildDataRaw('third_child'), ...this.buildDataRaw('fourth_child')};
                return this.props.AnswerProfileOptions(AnswersOfUser3);
            case 3:
                const AnswersOfUser4 = {...answerList, ...this.buildDataRaw('fourth_child')};
                return this.props.AnswerProfileOptions(AnswersOfUser4);
            default:
                return answerList
        }
    }

    render() {
        return (
            <View style={{ flex: 1}}>
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
                                    運転されるお子さまは何人いますか？
                                </Text>
                            </View>
                            <QuestionRadioList onClick={(val) => this.setState({ child: val})} answerList={this.props.optionsList} type={this.state.child}/>
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
                                          onPress={() => {this.handleAnswerThisQuestion()}}>
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
