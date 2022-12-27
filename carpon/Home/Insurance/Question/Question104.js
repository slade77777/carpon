import React, {Component} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity, Platform, Alert} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from "../../../../navigation";
import WrapperQuestion from "./component/WrapperQuestion";
import {connect} from "react-redux";
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {navigationService} from "../../../services";
import {viewPage} from "../../../Tracker";

@screen('Question104', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        answer: state.metadata.answers ? state.metadata.answers.insurance_expiration_date : null,
        myProfile: state.registration.userProfile.myProfile,
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_expiration_date : []
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export default class Question104 extends Component {
    state = {
        isDateTimePickerVisible: false,
        date: this.props.answer || this.props.myProfile.insurance_expiration_date
    };

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({date});
        this._hideDateTimePicker();
    };

    componentDidMount() {
        viewPage('insurance_question_expiration_date', '任意保険_満期日');
    }

    handleNextQuestion() {
        const answers = this.props.answerList;
        answers.insurance_expiration_date = this.state.date;
        this.props.AnswerProfileOptions(answers);
        if (!this.props.navigation.getParam('willGoBack')) {
            if (this.props.myProfile.estimation_type === 'detail' || this.props.myProfile.estimation_type === 'individual') {
                navigationService.navigate('Question118')
            } else {
                navigationService.navigate('Question23')
            }
        } else {
            navigationService.clear('Question117', {doDetailAgain: false})
        }
    }

    render() {
        return (
            <WrapperQuestion textButton={'保存する'} handleNextQuestion={() => this.handleNextQuestion()}>
                <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                    <Text style={{
                        fontSize: 16,
                        color: '#333333',
                        fontWeight: 'bold',
                        lineHeight: 20
                    }}>現在ご加入の保険証券に記載されている満期日を選択してください</Text>
                    <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight: 'bold', marginVertical: 10}}>満期日</Text>
                    <View>
                        <TouchableOpacity activeOpacity={1} style={{borderBottomColor: '#CCCCCC', borderBottomWidth: 1,}}
                                          onPress={this._showDateTimePicker}>
                            {
                                this.state.date ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{
                                            fontSize: 13,
                                            color: 'black',
                                            paddingVertical: 10
                                        }}>
                                            {moment(this.state.date).format('YYYY年M月D日')}
                                        </Text>
                                        <Icon
                                            name="angle-down"
                                            size={30}
                                            color={'#CCCCCC'}
                                            style={{textAlign: 'right', flex: 1}}
                                        />
                                    </View>
                                    :
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{
                                            fontSize: 13,
                                            marginTop: 0,
                                            color: '#CCCCCC',
                                            flex: 1
                                        }}>
                                            満期日
                                        </Text>
                                        <Icon
                                            name="angle-down"
                                            size={30}
                                            color={'#CCCCCC'}
                                            style={{textAlign: 'right', flex: 1}}
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
                        headerTextIOS={'満期日'}
                        date={new Date(this.state.date)}
                    />
                </View>
            </WrapperQuestion>
        )
    }
}
