import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Alert} from 'react-native';
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
import {viewPage} from "../../../Tracker";
import {isIphoneX} from "react-native-iphone-x-helper";


@screen('Question105', {header: <HeaderOnPress title={'任意保険見積'}/>})

@connect(state => ({
        options: state.metadata.profileOptions ? state.metadata.profileOptions : [],
        answers: state.metadata.answers
    }),
    dispatch => ({
        answerThisQuestion: (answer) => dispatch(AnswerProfileOptions(answer))
    }))

export class Question105 extends Component {

    state = {
        spouseBirthday: this.props.answers.spouse_birthday || null,
        selectedIndex: null,
        selectedValue: this.props.answers.spouse_living || null
    };

    componentDidMount() {
        viewPage('insurance_question_spouse', '任意保険見積_配偶者');
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        if (moment(new Date()).unix() >= moment(date).unix()) {
            this.setState({spouseBirthday: date});
            this._hideDateTimePicker();
        } else {
            Alert.alert('エラー', '日付が無効です。');
            return false;
        }
    };

    handleAnswerThisQuestion(key, title, value) {
        this.setState({selectedValue: value, selectedIndex: key})
    }

    handleUpdate() {
        const answer = this.props.answers;
        answer.spouse_living = this.state.selectedValue;
        answer.spouse_birthday = this.state.spouseBirthday;
        this.props.answerThisQuestion(answer);
        this.handleNavigate()
    }

    handleIndexScreen() {
        let indexScreen = 2;
        let indexScreenArr = [];
        const guaranteedDrivers = this.props.answers.guaranteed_drivers;
        let guaranteedDriversArr = guaranteedDrivers.split(',');
        guaranteedDriversArr.map(item => {
            if (parseInt(item) > indexScreen) {
                indexScreenArr.push(parseInt(item))
            }
        });
        return indexScreenArr[0]
    }

    handleNavigate() {
        switch (this.handleIndexScreen()) {
            case 3:
                return navigationService.navigate('Question1051');
            case 4:
                return navigationService.navigate('Question1054');
            case 5:
                return navigationService.navigate('Question116');
            default:
                return navigationService.navigate('Question117', {doDetailAgain: false});

        }
    }

    renderTopContent = () => {
        const {options} = this.props;
        const questionContent = [
            {
                title: '配偶者のお住まい',
                options: options.spouse_living
            }
        ];
        return (
            <View style={{height: '100%'}}>
                <Text style={{fontSize: 17, padding: 15, fontWeight: 'bold'}}>配偶者について、以下ご回答ください</Text>
                {questionContent.map((question, index) => (
                        <View key={index}>
                            <View style={{backgroundColor: '#F2F8F9', padding: 15}}>
                                <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'}}>{question.title}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor: 'white',
                                padding: 15,
                                flexWrap: 'wrap'
                            }}>
                                {question.options.map((option, key) => (
                                    <TouchableOpacity activeOpacity={1}
                                        onPress={() => this.handleAnswerThisQuestion(key, question.title, option.value)}
                                        key={key} style={{
                                        width: '49%',
                                        backgroundColor: key === this.state.selectedIndex || option.value === this.state.selectedValue ? '#4b9fa6' : '#EFEFEF',
                                        padding: 15,
                                        borderRadius: 5,
                                        alignItems: 'center',
                                        marginTop: 10
                                    }}><Text style={{
                                        color: key === this.state.selectedIndex || option.value === this.state.selectedValue ? 'white' : '#CCCCCC',
                                        fontWeight: 'bold'
                                    }}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))
                                }
                            </View>
                        </View>
                    )
                )}
                <View style={{backgroundColor: '#F2F8F9', padding: 15}}>
                    <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'}}>配偶者の生年月日</Text>
                </View>
                <View style={{padding: 15}}>
                    <TouchableOpacity activeOpacity={1} style={{borderBottomColor: '#CCCCCC', borderBottomWidth: 1,}}
                                      onPress={this._showDateTimePicker}>
                        {
                            this.state.spouseBirthday ?
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: 18,
                                        color: '#999999',
                                        paddingVertical: 10
                                    }}>
                                        {moment(this.state.spouseBirthday).format('YYYYMMDD')}
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
                                        配偶者の生年月日
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
                    headerTextIOS={'配偶者の生年月日'}
                    date={new Date(this.state.spouseBirthday)}
                />
            </View>
        )
    };

    renderBottomContent = () => {

    };

    render() {
        const {spouseBirthday, selectedValue} = this.state;
        return (
            <WrapperQuestion handleNextQuestion={() => this.handleUpdate()}
                             disabled={(spouseBirthday && selectedValue) === null} textButton={'次へ'}>
                <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 20 : 0}} style={{backgroundColor: 'white'}}>
                    <SingleColumnLayout
                        backgroundColor={'white'}
                        topContent={this.renderTopContent()}
                        bottomContent={this.renderBottomContent()}
                    />
                    <View style={{ height: 70}}/>
                </ScrollView>
            </WrapperQuestion>
        )
    }
}
