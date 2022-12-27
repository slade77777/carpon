import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView, StyleSheet, Platform, InputAccessoryView} from 'react-native';
import {SingleColumnLayout} from "../../../layouts"
import {screen} from "../../../../navigation";
import {HeaderOnPress} from "../../../../components";
import WrapperQuestion from "./component/WrapperQuestion";
import Dropdown from "../../../common/Dropdown";
import color from "../../../color";
import {connect} from "react-redux";
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import {navigationService} from "../../../services/index";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import Overlay from 'react-native-modal-overlay';
import ButtonText from "../../../../components/ButtonText";
import {viewPage} from "../../../Tracker";
import {isIphoneX} from "react-native-iphone-x-helper";

@screen('Question119', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        InterpersonalList: state.metadata.profileOptions ? state.metadata.profileOptions.対人賠償保険 : [],
        ObjectiveList: state.metadata.profileOptions ? state.metadata.profileOptions.対物賠償保険 : [],
        PersonalList: state.metadata.profileOptions ? state.metadata.profileOptions.人身傷害保険 : [],
        VehicleInsurance: state.metadata.profileOptions ? state.metadata.profileOptions.車両保険 : [],
        LawyerExpenses: state.metadata.profileOptions ? state.metadata.profileOptions.弁護士費用補償特約 : [],
        PassengerAccidentList: state.metadata.profileOptions ? state.metadata.profileOptions.搭乗者傷害保険 : [],
        bodyRequest: state.insurance.bodyRequest,
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer)),
        setLoading: () => {
            dispatch({
                type: 'SET_LOADING_INSURANCE',
            })
        },
    })
)
export class Question119 extends Component {

    state = {
        interpersonalChoice: this.props.answerList.対人賠償保険 || this.props.InterpersonalList[0].value,
        objectiveListChoice: this.props.answerList.対物賠償保険 || this.props.bodyRequest.対物賠償保険 || this.props.ObjectiveList[0].value,
        personalChoice: this.props.answerList.人身傷害保険 || this.props.bodyRequest.人身傷害保険 || this.props.PersonalList[0].value,
        VehicleInsuranceChoice: this.props.answerList.車両保険 || this.props.bodyRequest.車両保険 || this.props.VehicleInsurance[2].value,
        LawyerExpenseChoice: this.props.answerList.弁護士費用補償特約 || this.props.bodyRequest.弁護士費用補償特約 || this.props.LawyerExpenses[0].value,
        passengerAccidentChoice: this.props.answerList.搭乗者傷害保険 || this.props.bodyRequest.搭乗者傷害保険 || this.props.PassengerAccidentList[0].value,
        modalVisible: false
    };

    componentDidMount() {
        viewPage('insurance_question_other_drivers', '任意保険見積_保証内容');
    }

    handleNextQuestion() {
        const answers = this.props.answerList;
        answers.対人賠償保険 = this.state.interpersonalChoice;
        answers.対物賠償保険 = this.state.objectiveListChoice;
        answers.人身傷害保険 = this.state.personalChoice;
        answers.車両保険 = this.state.VehicleInsuranceChoice;
        answers.弁護士費用補償特約 = this.state.LawyerExpenseChoice;
        answers.搭乗者傷害保険 = this.state.passengerAccidentChoice;
        this.props.AnswerProfileOptions(answers);
        this.props.setLoading();
        navigationService.navigate('LoadingInsurance', {estimation_type: 'detail'})
    }

    renderTopContent = () => {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <View style={{height: '100%'}}>
                <View style={{paddingHorizontal: 15, marginTop: 20}}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                        補償内容を選択してください
                    </Text>
                </View>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>対人賠償保険</Text>
                </View>
                <View style={Styles.dropdownLayout}>
                    <Dropdown
                        label={null}
                        baseColor={color.active}
                        value={this.state.interpersonalChoice}
                        data={this.props.InterpersonalList}
                        onChangeText={(value) => this.setState({interpersonalChoice: value})}
                    />
                </View>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>対物賠償保険（免責金額0円）</Text>
                </View>
                <View style={Styles.dropdownLayout}>
                    <Dropdown
                        label={null}
                        baseColor={color.active}
                        value={this.state.objectiveListChoice}
                        data={this.props.ObjectiveList}
                        onChangeText={(value) => this.setState({objectiveListChoice: value})}
                    />
                </View>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>人身傷害保険</Text>
                </View>
                <View style={Styles.dropdownLayout}>
                    <Dropdown
                        label={null}
                        baseColor={color.active}
                        value={this.state.personalChoice}
                        data={this.props.PersonalList}
                        onChangeText={(value) => this.setState({personalChoice: value})}
                    />
                </View>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>搭乗者傷害保険</Text>
                </View>
                <View style={Styles.dropdownLayout}>
                    <Dropdown
                        label={null}
                        baseColor={color.active}
                        value={this.state.passengerAccidentChoice}
                        data={this.props.PassengerAccidentList}
                        onChangeText={(value) => this.setState({passengerAccidentChoice: value})}
                    />
                </View>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>車両保険</Text>
                </View>
                <View style={{paddingHorizontal: 20, marginTop: 10}}>
                    <TouchableOpacity onPress={() => this.setState({ modalVisible: true})} style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                        <SvgImage
                            source={SvgViews.IconHelp}
                        />
                        <Text style={{textAlign: 'right', color: '#999999'}}>
                            車両保険について
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.optionLayout}>
                    {
                        this.props.VehicleInsurance.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => this.setState({VehicleInsuranceChoice: item.value})}
                                              style={item.value === this.state.VehicleInsuranceChoice ? Styles.optionButtonChoice : Styles.optionButton}
                            ><Text style={{color: item.value === this.state.VehicleInsuranceChoice ? 'white' : '#CCCCCC'}}>
                                {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>弁護士費用補償特約</Text>
                </View>
                <View style={Styles.optionLayout}>
                    {
                        this.props.LawyerExpenses.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => this.setState({LawyerExpenseChoice: item.value})}
                                              style={item.value === this.state.LawyerExpenseChoice ? Styles.optionButtonChoice : Styles.optionButton}
                            ><Text style={{color: item.value === this.state.LawyerExpenseChoice ? 'white' : '#CCCCCC'}}>
                                {item.label}
                            </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <Overlay visible={this.state.modalVisible} onClose={() => this.setState({ modalVisible: false})}
                         childrenWrapperStyle={{ borderRadius: 10, backgroundColor: '#F8F8F8'}} closeOnTouchOutside={true}>
                    <View>
                        <Text style={{ color: '#333333', fontSize: 18, lineHeight: 20, textAlign: 'center', fontWeight: 'bold'}}>車両保険について</Text>
                        <Text style={{ color: '#333333', fontSize: 17, marginVertical: 15, lineHeight: 24}}>「車両保険」とは、自分の車の損害に対して修理費用等が支払われる保険で、補償の範囲の違いにより「一般」と「エコノミー」があります。「一般」は運転に自信が無い人などの補償充実派向け。一方「エコノミー」は、費用が抑えられる分、自損事故や当て逃げなどの場合は補償されません。詳しくは各保険会社のHPでご確認ください。</Text>
                        <View>
                            <ButtonText title={'OK'} onPress={() => this.setState({ modalVisible: false})}/>
                        </View>
                    </View>
                </Overlay>
            </View>
        )
    };

    render() {
        return (
            <WrapperQuestion handleNextQuestion={() => this.handleNextQuestion()} textButton={'次へ'}>
                <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 20 : 0}} style={{backgroundColor: 'white'}}>
                    <SingleColumnLayout
                        backgroundColor={'white'}
                        topContent={this.renderTopContent()}
                        bottomContent={() => {}}
                    />
                    <View style={{ height: 70}}/>
                </ScrollView>
            </WrapperQuestion>

        )
    }
}

const Styles = StyleSheet.create({
    header: {backgroundColor: '#F2F8F9', padding: 15, marginTop: 10},
    textHeader: {color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'},
    dropdownLayout: {height: 50, width: '100%', paddingHorizontal: 15, marginBottom: 20},
    optionLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        padding: 15
    },
    optionButton: {
        width: '49%',
        backgroundColor: '#EFEFEF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5
    },
    optionButtonChoice: {
        width: '49%',
        backgroundColor: '#4B9FA5',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5
    }
});
