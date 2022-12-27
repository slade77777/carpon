import React, {Component} from 'react';
import {View, SafeAreaView, Text, ScrollView, TouchableOpacity} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from "../../../../navigation";
import {connect} from "react-redux";
import {SingleColumnLayout} from "../../../layouts";
import QuestionRadioList from "./component/QuestionRadioList";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {navigationService} from "../../../services";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('Question90', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        answer: state.metadata.answers ? state.metadata.answers.insurance_nonfleet_grade : null,
        myProfile: state.registration.userProfile.myProfile,
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_nonfleet_grade : []
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export class Question90 extends Component {

    state = {
        type: this.props.answer || this.props.myProfile.insurance_nonfleet_grade || this.props.optionsList[0].value
    };

    componentDidMount() {
        viewPage('insurance_question_non_fleet_grade', '任意保険_ノンフリートグレード');
    }

    handleNextQuestion() {
        const answers = this.props.answerList;
        answers.insurance_nonfleet_grade =  this.state.type;
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
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 19 : 0}}>
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    現在ご加入の保険証券に記載されているノンフリート等級を選択してください
                                </Text>
                            </View>
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}
                                                  onPress={()=> navigationService.navigate('NonFleetDefinition')}
                                >
                                    <SvgImage
                                        source={SvgViews.IconHelp}
                                    />
                                    <Text style={{textAlign: 'right', color: '#999999'}}>
                                        ノンフリート等級について
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <QuestionRadioList onClick={(val) => this.setState({ type: val})} answerList={this.props.optionsList} type={this.state.type}/>
                            <View style={{ height: 70}}/>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)' ,paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%',
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
