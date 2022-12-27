import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, View, Alert, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../../layouts";
import Spinner from 'react-native-loading-spinner-overlay';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import QuestionRadioList from './component/QuestionRadioList';
import {navigationService} from "../../../services/index";
import Icon from 'react-native-vector-icons/Ionicons';
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('Question92', {header: <HeaderOnPress
    leftComponent={<Icon name="md-close" size={30} color="#FFFFFF"/>}
    onPress={() => Alert.alert(
        '詳細見積をキャンセルします',
        'ここまでの登録内容を保存し、見積作成を終了します。',
        [
            {
                text: 'はい',
                onPress: () => {
                    navigationService.clear('InsuranceCompany');
                },
            },
            {text: 'いいえ'},
        ],
        {cancelable: false}
    )}
    title={'任意保険見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        answer: state.metadata.answers ? state.metadata.answers.accident_coefficient_applied_term : null,
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.accident_coefficient_applied_term : [],
        myProfile: state.registration.userProfile.myProfile,
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export class Question92 extends Component {
    constructor(props) {
        super(props);
        let userAnswer = props.answer || props.myProfile.accident_coefficient_applied_term || props.optionsList[0].value
        userAnswer = (userAnswer && userAnswer !== 8) ? userAnswer : this.props.optionsList[0].value;
        this.state = {
            loading: false,
            type: userAnswer
        };
    }

    componentDidMount() {
        viewPage('insurance_question_accident_coefficient_applied_term', '任意保険_事故有係数適用期間')
    }

    handleNextQuestion() {
        const answers = this.props.answerList;
        answers.accident_coefficient_applied_term = this.state.type;
        this.props.AnswerProfileOptions(answers);
        navigationService.navigate('Question106')
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
                                    現在ご加入の保険証券に記載されている事故有係数適用期間を選択してください
                                </Text>
                            </View>
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}
                                      onPress={()=> navigationService.navigate('AboutNonFleet')}
                                >
                                    <SvgImage
                                        source={SvgViews.IconHelp}
                                    />
                                    <Text style={{textAlign: 'right', color: '#999999'}}>
                                        事故有係数適用期間について
                                    </Text>
                                </TouchableOpacity>
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
