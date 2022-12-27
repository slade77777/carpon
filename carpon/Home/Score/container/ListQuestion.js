import React, {Component} from 'react';
import {View, Text, Dimensions, TouchableOpacity, Alert, FlatList, SafeAreaView} from 'react-native';
import {screen} from "../../../../navigation";
import HeaderCarpon from "../../../../components/HeaderCarpon";
import {navigationService} from "../../../services";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {connect} from "react-redux";
import color from "../../../color";
import {ScoreUpStatus} from "../components/ScoreUpStatus";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');

class Header extends Component {

    render() {
        return (
            <HeaderCarpon
                title={this.props.title}
                leftComponent={
                    <TouchableOpacity activeOpacity={1} style={{
                        alignItems: 'flex-start',
                        flex: 1,
                        justifyContent: 'center',
                        paddingLeft: 15
                    }}
                                      onPress={() => navigationService.goBack(null)}
                    >
                        <SvgImage source={SvgViews.Remove}/>
                    </TouchableOpacity>
                }
            />
        )
    }
}

@screen('ListQuestion', ({navigation}) => ({
    header: <Header title={navigation.getParam('survey') ? navigation.getParam('survey').name : ''}
                    Score={navigation.getParam('Score')}/>
}))
@connect(state => ({
    answerSurvey: state.answerSurvey,
    myCarInformation: state.getCar.myCarInformation,
    loading: state.answerSurvey.loading

}), dispatch => ({
    loadListQuestion: (idSurvey) => dispatch({
        type: 'LOAD_LIST_QUESTION',
        idSurvey
    }),
    answerQuestion: (surveyId) => dispatch({
        type: 'ANSWERING',
        surveyId: surveyId,
    })
}))
export class ListQuestion extends Component {

    constructor(props) {
        super(props);
        this.survey = this.props.navigation.getParam('survey')
    }

    componentDidMount() {
        const survey = this.survey ? this.survey : this.props.answerSurvey.answering;
        this.willFocusEvent = this.props.navigation.addListener('willFocus', () => {
            this.props.loadListQuestion(survey.id);
        });
        if (this.props.navigation.getParam('index')) {
            this.handleNavigate(this.props.navigation.state.params, this.props.navigation.getParam('index'))
        }
        viewPage('car_life_question_list', `カーライフ質問リスト： ${survey.id - 1} (${survey.title})`)
    }

    componentWillUnmount() {
        this.willFocusEvent.remove();
    }

    handleReAnswerQuestionCarCertificate(item) {
        const surveyId = this.survey ? this.survey.id : this.props.answerSurvey.answering.surveyId;
        if (item.has_answer) {
            Alert.alert(
                'この車は認証されています。',
                '他の車を変更したいですか。',
                [
                    {
                        text: 'いいえ',
                    },
                    {
                        text: 'はい',
                        onPress: () => {
                            navigationService.navigate('UpdateCar', {isAddQR: true})
                        }
                    }
                ])
        } else {
            this.props.answerQuestion(surveyId);
            return navigationService.navigate('PrepareCameraQR', {isAddQR: true})
        }
    }

    handleNavigate(item, index) {
        switch (item.id) {
            case 95:
                return this.handleReAnswerQuestionCarCertificate(item);
            case 96:
                return navigationService.navigate('MyCarProfile', {updateScore: true, survey: this.survey});
            case 97:
                return navigationService.navigate('AccountSetting', {updateScore: true, survey: this.survey});
            case 98:
                return navigationService.navigate('Insurance', {updateScore: true, survey: this.survey});
            case 99:
                return navigationService.navigate('License', {updateScore: true, survey: this.survey});
            default :
                return navigationService.navigate('AnswerQuestion', {
                    index: index,
                    survey: this.survey,
                    id: this.survey.id
                })
        }
    }

    _renderQuestion({item, index}) {
        return (
            <TouchableOpacity activeOpacity={1}
                              key={index}
                              onPress={() => !item.disabled ? this.handleNavigate(item, index) : ({})}
                              style={{
                                  height: 75,
                                  borderWidth: 0.5,
                                  borderColor: '#E5E5E5',
                                  paddingHorizontal: 15,
                                  opacity: !item.disabled ? 1 : 0.5,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                              }}
            >
                <View style={{flexDirection: 'row', flex: 1, paddingRight: 15, alignItems: 'center'}}>
                    <View>
                        <SvgImage source={SvgViews[item['has_answer'] ? 'IconDone' : 'IconDoneFalse']}/>
                    </View>
                    <View style={{marginLeft: 15, flex: 1}}>
                        <Text numberOfLines={2}
                              style={{fontSize: 13, color: '#333333', lineHeight: 20}}>{item.title}</Text>
                        {
                            item.note && <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 13, color: '#333333'}}>※</Text>
                                <Text style={{fontSize: 13, color: '#333333', marginTop: 2}}>{item.note}</Text>
                            </View>
                        }
                    </View>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <SvgImage source={() => SvgViews.ArrowLeft({fill: color.active})}/>
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const {listQuestion, updated} = this.props.answerSurvey;
        const answeredQuestionNumber = listQuestion.filter(question => question['has_answer']).length;
        const statusAnswerSurvey = answeredQuestionNumber / listQuestion.length;
        const unanswerQuestion = listQuestion.length - answeredQuestionNumber;
        const statusPostfix = unanswerQuestion ? `（あと${unanswerQuestion}問）` : '';
        return (
            <View style={{flex: 1}}>
                {this.props.loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                {
                    !updated ?
                        <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
                            <ScoreUpStatus label={'INPUT STATUS :percentage' + statusPostfix}
                                           progress={statusAnswerSurvey}/>
                            <View style={{flex: 1}}>
                                {
                                    listQuestion.map((item, index) => {
                                        return (
                                            this._renderQuestion({item, index})
                                        )
                                    })
                                }
                            </View>
                        </View> :
                        <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
                            <ScoreUpStatus label={'INPUT STATUS :percentage' + statusPostfix}
                                           progress={statusAnswerSurvey}/>
                            <View style={{flex: 1}}>
                                <FlatList
                                    style={{flex: 1}}
                                    data={listQuestion}
                                    renderItem={this._renderQuestion.bind(this)}
                                    onEndReachedThreshold={0.8}
                                    contentInset={{bottom: isIphoneX() ? getBottomSpace() : 0}}
                                />
                            </View>
                        </View>
                }
            </View>
        )
    }
}
