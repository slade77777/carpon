import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, View, Alert, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../../layouts";
import Spinner from 'react-native-loading-spinner-overlay';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import QuestionRadioList from './component/QuestionRadioList';
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('Question106', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        answer: state.metadata.answers ? state.metadata.answers.driving_area : null,
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.driving_area : [],
        myProfile: state.registration.userProfile.myProfile,
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export class Question106 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            type: this.props.answer || this.props.myProfile.province || this.props.optionsList[0].value
        };
    }

    componentDidMount() {
        viewPage('insurance_question_driving_area', '任意保険見積_使用地域');
    }

    handleNextQuestion() {
        const answers = this.props.answerList;
        answers.driving_area =  this.state.type;
        this.props.AnswerProfileOptions(answers);
        if (this.props.myProfile.estimation_type === 'detail' || this.props.myProfile.estimation_type === 'individual') {
            navigationService.navigate('Question118')
        } else {
            if (this.props.myProfile && (this.props.answerList.insurance_company || this.props.myProfile.insurance_company)) {
                navigationService.navigate('Question94')
            } else {
                navigationService.navigate('Question89')
            }
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}}>
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    マイカーを主に使用する地域を選択してください
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
                                }}>次へ</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </View>
        )
    }
}
