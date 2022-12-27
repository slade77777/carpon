import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Dimensions, Alert} from 'react-native';
import {SingleColumnLayout} from "../../../layouts"
import {screen} from "../../../../navigation";
import {HeaderOnPress} from "../../../../components";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import WrapperQuestion from './component/WrapperQuestion';
import {connect} from 'react-redux';
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {navigationService} from "../../../services";
import {isIphoneX} from "react-native-iphone-x-helper";


@screen('Question1055', {header: <HeaderOnPress title={'任意保険見積'}/>})

@connect(state => ({
        options: state.metadata.profileOptions,
        answerList: state.metadata.answers
    }),
    dispatch => ({AnswerProfileOptions: answer => dispatch(AnswerProfileOptions(answer))})
)


export class Question1055 extends Component {

    state = {
        familyDriverBirthday: null,
        question_1: {
            answer: null
        },
        question_2: {
            answer: null
        },
    };

    componentDidMount() {
        this.pushAnswerPropsToState()
    }

    pushAnswerPropsToState() {
        const currentScreen = this.props.navigation.getParam('currentScreen');
        switch(currentScreen) {
            case 1:
                return this.handleChildData('first_family');
            case 2:
                return this.handleChildData('second_family');
            case 3:
                return this.handleChildData('third_family');
            case 4:
                return this.handleChildData('fourth_family');
        }
    }

    handleChildData(child) {
        let driverGender = child + '_driver_gender';
        let driverType = child + '_driver_type';
        let driverBirthday = child + '_driver_birthday';

        const {answerList} = this.props;

        return this.setState({
            question_1: Object.assign(this.state.question_1, {answer: answerList[driverGender]}),
            question_2: Object.assign(this.state.question_2, {answer: answerList[driverType]}),
            familyDriverBirthday: answerList[driverBirthday],
        });
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        if(moment(new Date()).unix() >= moment(date).unix()){
            this.setState({
                familyDriverBirthday: date,
            });
            this._hideDateTimePicker();
        }else{
            Alert.alert('エラー', '日付が無効です。');
            return false;
        }
    };

    renderView() {
        const {options} = this.props;
        const questions = [
            {
                name: 'question_1',
                title: '性別',
                answer: options.fourth_family_driver_gender
            },
            {
                name: 'question_2',
                title: '属性',
                answer: options.fourth_family_driver_type
            },
        ];

        return (
            <View>
                <Text style={{
                    fontSize: 17,
                    padding: 15,
                    fontWeight: 'bold'
                }}>運転される、配偶者または子供を除く同居の親族（{this.props.navigation.getParam('currentScreen')}人目）について、以下ご回答ください</Text>
                {
                    questions.map((question, index) => {
                        const questionName = question.name;
                        return <View key={index}>
                            <View style={{backgroundColor: '#F2F8F9', padding: 15}}>
                                <Text
                                    style={{color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'}}>{question.title}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor: 'white',
                                padding: 15,
                                flexWrap: 'wrap'
                            }}>
                                {
                                    question.answer.map((answer, key) => (
                                        <TouchableOpacity
                                            key={key}
                                            onPress={() => this.handleAnswerQuestion(questionName, answer.value)}
                                            style={{
                                                width: '49%',
                                                backgroundColor: this.state[questionName].answer === answer.value  ? '#4B9FA5' : '#EFEFEF',
                                                padding: 15,
                                                borderRadius: 5,
                                                alignItems: 'center',
                                                marginTop: 15
                                            }}><Text style={{
                                            color: this.state[questionName].answer === answer.value ? 'white' : '#CCCCCC',
                                            fontWeight: 'bold'
                                        }}>{answer.label}</Text>
                                        </TouchableOpacity>))
                                }
                            </View>
                        </View>
                    })
                }
                <View style={{backgroundColor: '#F2F8F9',padding: 15}}>
                    <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'}}>生年月日</Text>
                </View>
                <View style={{padding: 15}}>
                    <TouchableOpacity style={{borderBottomColor: '#CCCCCC', borderBottomWidth: 1}}
                                      onPress={this._showDateTimePicker}>
                        {
                            this.state.familyDriverBirthday ?
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: 18,
                                        color: '#999',
                                        paddingVertical: 10
                                    }}>
                                        {moment(this.state.familyDriverBirthday).format('YYYYMMDD')}
                                    </Text>
                                    <Icon
                                        name="angle-down"
                                        size={30}
                                        color={'#CCCCCC'}
                                        style={{textAlign: 'right', flex: 1,}}
                                    />
                                </View>
                                :
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: 18,
                                        paddingVertical: 10,
                                        marginTop: 0,
                                        color: '#CCCCCC',
                                        flex: 1
                                    }}>
                                        生年月日
                                    </Text>
                                    <Icon
                                        name="angle-down"
                                        size={30}
                                        color={'#CCCCCC'}
                                        style={{textAlign: 'right', flex: 1,}}
                                    />
                                </View>
                        }
                    </TouchableOpacity>
                </View>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    confirmTextIOS={'設定'}
                    cancelTextIOS={'キャンセル'}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    headerTextIOS={'生年月日'}
                    date={new Date(this.state.familyDriverBirthday)}
                />
            </View>
        )
    }

    handleAnswerQuestion(field, value) {
        this.setState({
            [field]: Object.assign(this.state[field], {answer: value})
        })
    }

    buildData(family) {

        let driverGender = family + '_driver_gender';
        let driverType = family + '_driver_type';
        let familyDriverBirthday = family + '_driver_birthday';

        return {
            [driverGender]: this.state.question_1.answer,
            [driverType]: this.state.question_2.answer,
            [familyDriverBirthday]: this.state.familyDriverBirthday
        };
    }

    handleIndexScreen() {
        let indexScreen = 4;
        let indexScreenArr = [];
        const guaranteedDrivers = this.props.answerList.guaranteed_drivers;
        let guaranteedDriversArr = guaranteedDrivers.split(',');
        guaranteedDriversArr.map(item => {
            if(parseInt(item) > indexScreen) {
                indexScreenArr.push(parseInt(item))
            }
        });
        return indexScreenArr[0]
    }

    handleNavigate() {
        switch (this.handleIndexScreen()) {
            case 5:
                return navigationService.navigate('Question116');
            default:
                return navigationService.navigate('Question117', {doDetailAgain: false});

        }
    }

    handleNextQuestion() {
        const numberScreen = this.props.navigation.getParam('numberScreen');
        const currentScreen = this.props.navigation.getParam('currentScreen');
        if (currentScreen < numberScreen) {
            this.props.navigation.push('Question1055', {currentScreen: currentScreen + 1, numberScreen: numberScreen})
        } else {
            this.handleNavigate()
        }
        const answers = this.props.answerList;
        switch (currentScreen) {
            case 1:
                const AnswersOfUser1 = {...answers, ...this.buildData('first_family')};
                return this.props.AnswerProfileOptions(AnswersOfUser1);
            case 2:
                const AnswersOfUser2 = {...answers, ...this.buildData('second_family')};
                return this.props.AnswerProfileOptions(AnswersOfUser2);
            case 3:
                const AnswersOfUser3 = {...answers, ...this.buildData('third_family')};
                return this.props.AnswerProfileOptions(AnswersOfUser3);
            case 4:
                const AnswersOfUser4 = {...answers, ...this.buildData('fourth_family')};
                return this.props.AnswerProfileOptions(AnswersOfUser4);
        }

    }

    render() {
        const {familyDriverBirthday, question_1, question_2} = this.state;
        return (
            <WrapperQuestion
                disabled={(familyDriverBirthday && question_1.answer && question_2.answer) === null}
                handleNextQuestion={this.handleNextQuestion.bind(this)}
                textButton={'次へ'}>
                <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 20 : 0}} style={{backgroundColor: 'white'}}>
                    <SingleColumnLayout
                        backgroundColor={'white'}
                        topContent={this.renderView()}
                    />
                </ScrollView>
            </WrapperQuestion>

        )
    }
}
