import React, {Component} from 'react';
import {Text, View, Alert, Keyboard, InputAccessoryView, Platform} from 'react-native';
import {SingleColumnLayout} from "../../../layouts"
import {screen} from "../../../../navigation";
import {HeaderOnPress, InputText, ButtonText} from "../../../../components";
import WrapperQuestion from "./component/WrapperQuestion";
import {connect} from 'react-redux';
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";


@screen('Question116', {header: <HeaderOnPress title={'任意保険見積'}/>})

@connect(state => ({
        answers: state.metadata.answers,
    }),
        dispatch => ({answerThisQuestion: answer => dispatch(AnswerProfileOptions(answer))})
    )

export class Question116 extends Component {
    state = {
        text: this.props.answers.youngest_driver_age || null
    };

    componentDidMount() {
        viewPage('insurance_question_youngest_driver_age', '任意保険見積_最年少者年齢');
    }

    handleUpdate(){
        const answer = this.props.answers;
        answer.youngest_driver_age = this.state.text;
        if (answer.youngest_driver_age < 75) {
            this.props.answerThisQuestion(answer);
            navigationService.navigate('Question117', {doDetailAgain: false});
        } else {
            Alert.alert('エラー', '年齢を確認してください');
        }

    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <WrapperQuestion disabled={!this.state.text} handleNextQuestion={() => this.handleUpdate()} textButton={'次へ'}>
                <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                    <Text style={{fontSize: 16, color: '#333333', fontWeight: 'bold', lineHeight: 20}}>運転される友人・知人・親戚のうち一番若い方の年齢を入力してください</Text>
                    <View style={{paddingTop : 20}}>
                        <InputText
                            style={{fontSize: 18}}
                            placeholder='友人・知人・親戚のうち一番若い方の年齢'
                            autoFocus={true}
                            onChangeText={(event) => this.setState({text: event})}
                            inputAccessoryViewID={inputAccessoryViewID}
                            value={this.state.text || ''}
                            keyboardType={'numeric'}
                        />
                            {Platform.OS === 'ios'
                            && (
                                <InputAccessoryView nativeID={inputAccessoryViewID}>
                                    <View style={{backgroundColor: !this.state.text ? 'transparent' : '#BBB' , padding: 15}}>
                                        <ButtonText
                                            disabled={!this.state.text}
                                            keyboardType={'numeric'}
                                            title={'次へ'}
                                            onPress={() => this.handleUpdate()} textButton={'次へ'}
                                        />
                                    </View>
                                </InputAccessoryView>)
                            }
                    </View>
                </View>
            </WrapperQuestion>
        )
    }
}
