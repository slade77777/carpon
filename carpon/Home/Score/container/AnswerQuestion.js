import React, {Component} from 'react';
import {
    View, Text, Dimensions, TouchableOpacity, ScrollView, Keyboard, SafeAreaView, Platform,
    ActivityIndicator
} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import QuestionSingle from "../components/QuestionSingle";
import {screen} from "../../../../navigation";
import QuestionMultiChoice from "../components/QuestionMultiChoice";
import {SceneMap, TabView} from "react-native-tab-view";
import _ from "lodash";
import {connect} from "react-redux";
import {navigationService} from "../../../services";
import ChooseOneQuestion from "../components/ChooseOneQuestion";
import QuestionInputText from "../components/QuestionInputText";
import QuestionSelectDate from "../components/QuestionSelectDate";
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper'
import {ScoreUpStatus} from "../components/ScoreUpStatus";
import {getUserProfile} from "../../../Account/actions/accountAction";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {onChangeQuestion, answerQuestion} from "../actions/actions";
import {viewPage} from "../../../Tracker";

@screen('AnswerQuestion', ({navigation}) => ({
    header: <HeaderOnPress title={navigation.getParam('survey') ? navigation.getParam('survey').name : ''}/>
}))
@connect(state => ({
    answerSurvey: state.answerSurvey
}), dispatch => ({
    getUserProfile: () => dispatch(getUserProfile()),
    handleAnswerQuestion: (question, index, idSurvey) => dispatch(answerQuestion(question, index, idSurvey)),
    onChangeQuestion: (question, index) => dispatch(onChangeQuestion(question, index))
}))
export class AnswerQuestion extends Component {

    constructor(props) {
        super(props);
        this.scene = SceneMap(this.initObjectScene(this.props.answerSurvey.listQuestion));
    }

    state = {
        typeQuestion: {
            multi_choice: QuestionMultiChoice,
            single_choice: QuestionSingle,
            single_singleInputField: QuestionSingle,
            single_selectBox: QuestionSingle,
            choose_one: ChooseOneQuestion,
            single_choice_select_car: QuestionSingle,
            input_text: QuestionInputText,
            select_date: QuestionSelectDate,
            single_choice_input_group: QuestionSingle,
            keyboardHeight: 0,
            default: () => (<View/>)
        },
        routes: this.props.answerSurvey.listQuestion,
        index: parseInt(this.props.navigation.getParam('index')),
        TouchableSuccess: true
    };

    initObjectScene(newListQuestion) {
        const {typeQuestion} = this.state;
        return _.reduce(newListQuestion, function (obj, value) {
            const type = (Object.keys(typeQuestion).includes(value['answer_data'].type)) ? value['answer_data'].type : 'default';
            const QuestionComponent = typeQuestion[type];
            obj[value.key] = () => <QuestionComponent question={value}/>;
            return obj;
        }, {});
    }

    componentDidMount() {
        const question = this.props.answerSurvey.listQuestion[this.state.index];
        this.handleLogQuestion(question);
        this.props.onChangeQuestion({...question['answer_data']});
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => this.keyboardDidShow(event));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (event) => this.keyboardDidHide(event));
    }

    handleLogQuestion(question) {
        viewPage('car_life_question', `カーライフ質問：${question.id} (${question.title})`)
    }

    keyboardDidShow = (event) => {
        this.setState({keyboardHeight: event.endCoordinates.height - getBottomSpace()})
    };

    keyboardDidHide = () => {
        this.setState({keyboardHeight: 0})
    };

    _handleIndexChange = index => {
        const question = this.props.answerSurvey.listQuestion[index];
        this.props.onChangeQuestion({...question['answer_data']});
        this.setState({index});
    };

    handleAnswerQuestion() {
        let idSurvey = this.props.navigation.getParam('id');
        const question = this.props.answerSurvey.listQuestion[this.state.index];
        question.answer_data = this.props.answerSurvey.answer;
        question.has_answer = true;
        this.props.handleAnswerQuestion(question, this.state.index, idSurvey);
    }

    handleCheckGoBack(question) {
        if (question.key_value === 'has_car_insurance' || question.key_value === 'has_autoloan') {
            let answer = question.answer_data.answers.find(item => item.checked);
            return !answer.value
        }
    }

    handleNextQuestion(nextProps) {
        const question = nextProps.answerSurvey.listQuestion[this.state.index];
        if (nextProps.answerSurvey.answerSuccess) {
            const index = this.state.index + 1;
            const lengthListQuestion = nextProps.answerSurvey.listQuestion.length - 1;
            if (index > lengthListQuestion || this.handleCheckGoBack(question)) {
                this.setState({TouchableSuccess: false});
                return navigationService.goBack()
            } else {
                const indexScreen = index > lengthListQuestion ? 0 : index;
                const question = nextProps.answerSurvey.listQuestion[indexScreen];
                this.handleLogQuestion(question);
                this.props.onChangeQuestion({...question['answer_data']});
                this.setState({index: indexScreen});
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.state.TouchableSuccess && this.handleNextQuestion(nextProps)
    }

    _renderScene() {
        return this.scene;
    }


    componentWillUnmount() {
        this.props.getUserProfile();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    render() {
        const {submit, checked, listQuestion, loading} = this.props.answerSurvey;
        const answeredQuestionNumber = listQuestion.filter(question => question['has_answer']).length;
        const statusAnswerSurvey = answeredQuestionNumber / listQuestion.length;
        const unanswerQuestion = listQuestion.length - answeredQuestionNumber;
        const statusPostfix = unanswerQuestion ? `（あと${unanswerQuestion}問）` : '';
        const backgroundColor = checked ? '#F06A6D' : '#CCCCCC';
        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: '#FFFFFF', height: '100%'}}>
                    <ScoreUpStatus label={'INPUT STATUS :percentage' + statusPostfix} progress={statusAnswerSurvey}/>
                    <TabView
                        useNativeDriver
                        initialLayout={{
                            height: Dimensions.get('window').height,
                            width: Dimensions.get('window').width
                        }}
                        swipeEnabled={false}
                        tabBarPosition={'bottom'}
                        navigationState={this.state}
                        renderScene={this._renderScene()}
                        renderTabBar={() => null}
                        onIndexChange={this._handleIndexChange}
                        style={{marginBottom: isIphoneX() ? 19 : 0}}
                    />
                    {
                        Platform.OS === 'ios' ? <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)',
                            paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace() : 15,
                            position: 'absolute',
                            bottom: this.state.keyboardHeight || 0,
                            width: '100%'
                        }}>
                            {loading && <LoadingComponent style={{margin: 15}} loadingSize={'small'}
                                                          size={{w: '100%', h: '100%'}}/>}
                            <ButtonCarpon onPress={() => this.handleAnswerQuestion()} opacity={1}
                                          style={{backgroundColor, borderRadius: 6}} loading={!submit}
                                          disabled={!checked}>
                                <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>回答する</Text>
                            </ButtonCarpon>
                        </View> : <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)',
                            padding: 15,
                            position: 'absolute',
                            bottom: 0,
                            width: '100%'
                        }}>
                            {loading && <LoadingComponent style={{margin: 15}} loadingSize={'small'}
                                                          size={{w: '100%', h: '100%'}}/>}
                            <ButtonCarpon onPress={() => this.handleAnswerQuestion()} opacity={1}
                                          style={{backgroundColor, borderRadius: 6}} loading={!submit}
                                          disabled={!checked}>
                                <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>回答する</Text>
                            </ButtonCarpon>
                        </View>
                    }
                </View>
            </View>
        )
    }
}
