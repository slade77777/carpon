import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from "../../../../navigation";
import WrapperQuestion from "./component/WrapperQuestion";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import QuestionTypeMultiChoice from "./component/QuestionTypeMultiChoice";
import {handleValidateQuestion} from "./validateQuestion";
import {connect} from 'react-redux';
import {AnswerProfileOptions} from "../../../common/actions/metadata";
import lodash from 'lodash';
import {navigationService} from "../../../services";
import {viewPage} from "../../../Tracker";

@screen('Question118', {header: <HeaderOnPress title={'任意保険見積'}/>})
@connect(state => ({
        answerList: state.metadata.answers,
        profileOptions: state.metadata.profileOptions,
        guaranteed_drivers: state.registration.userProfile.myProfile.guaranteed_drivers,
        answersOfMetadata: state.metadata.answers.guaranteed_drivers,
        store: state
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export class Question118 extends Component {

    componentDidMount() {
        viewPage('insurance_question_drivers', '任意保険_運転者');
    }

    makeChecked(item, index) {
        if(index === 0) {
            return true
        }
        return this.props.answersOfMetadata.includes(item.value.toString());
    }
    state = {
        question: {
            type: "multi_choice",
            answers: this.props.profileOptions.guaranteed_drivers.map((item,index) => {
                return {
                    value: item.value,
                    label: item.label,
                    checked: this.makeChecked(item, index)
                }
            }),
            title: "現在ご加入の保険で補償される運転者を選択してください",
        },
        checked: true
    };

    renderHeader = (question) => {
        return (
            <View style={{paddingHorizontal: 15, marginVertical: 20}}>
                <View>
                    <Text style={{
                        fontSize: 16,
                        color: '#333333',
                        fontWeight: 'bold',
                        lineHeight: 20
                    }}>{question.title}</Text>
                </View>
                <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row', justifyContent: 'flex-end', padding: 10}}
                                  onPress={()=> navigationService.navigate('AboutDriver')}
                >
                    <SvgImage fill={'#999999'} source={SvgViews.HelpIcon}/>
                    <Text style={{paddingLeft: 3, color: '#999999', paddingVertical: 5}}>運転者について</Text>
                </TouchableOpacity>
            </View>
        )
    };

    handleNextQuestion() {

        if (this.state.checked) {
            let data = this.state.question.answers.filter(item => item.checked);
            let value = data.map(item => item.value);
            const answers = this.props.answerList;
            answers.guaranteed_drivers =  value.join();
            this.props.AnswerProfileOptions({answers, ...this.resetChecker()});
            this.handleNavigate()
        }
    }

    resetChecker() {

        const Spouse = this.state.question.answers ? this.state.question.answers[1].checked : false;
        const child = this.state.question.answers ? this.state.question.answers[2].checked : false;
        const family = this.state.question.answers ? this.state.question.answers[3].checked : false;
        const youngest = this.state.question.answers ? this.state.question.answers[4].checked : false;
        const answers = this.props.answerList;

        let SpouseDefault = this.resetSpouse();
        let childDefault = this.handleResetData('child');
        let familyDefault = this.handleResetData('family');
        let youngestDefault =  this.resetYoungest();

        let Object = answers;

        if(!Spouse) {
            Object = {
                ...Object,
                ...SpouseDefault
            };
        }
        if(!child) {

            Object = {
                ...Object,
                ...childDefault
            };
        }
        if(!family) {
            Object = {
                ...Object,
                ...familyDefault
            };
        }
        if(!youngest) {
            Object = {
                ...Object,
                ...youngestDefault
            }
        }
        return Object
    }

    resetChild(child){

        let driverGender = child +'_driver_gender';
        let driverMaritalStatus = child +'_driver_marital_status';
        let driverLiving = child +'_driver_living';
        let driverLivinghood = child +'_driver_livinghood';
        let driverBirthday = child +'_driver_birthday';

        return {
            [driverGender]: null,
            [driverMaritalStatus]: null,
            [driverLiving]: null,
            [driverLivinghood]: null,
            [driverBirthday]: null,
            number_of_children_driver: null
        };
    }

    resetFamily(value){

        let driverGender = value +'_driver_gender';
        let driverType = value +'_driver_type';
        let driverBirthday = value +'_driver_birthday';

        return {
            [driverGender]: null,
            [driverType]: null,
            [driverBirthday]: null,
            number_of_familiy_driver: null
        };
    }

    resetSpouse() {
        return {
            spouse_living: null,
            spouse_birthday: null
        }
    }

    resetYoungest() {
        return {youngest_driver_age: null}
    }

    handleResetData(value) {
        let child = ['first_child', 'second_child', 'third_child', 'fourth_child'];
        let family = ['first_family', 'second_family', 'third_family', 'fourth_family'];
        if(value === 'child') {
            let Object = {};

            child.map(item => {
                Object = {
                    ...Object,
                    ...this.resetChild(item)
                }
            });

            return Object;
        }else if(value === 'family'){
            let Object = {};
            family.map(item => {
                Object = {
                    ...Object,
                    ...this.resetFamily(item)
                }
            });
            return Object;
        }
    }

    handleNavigate() {
        const YourSpouse = this.state.question.answers ? this.state.question.answers[1].checked : false;
        const child = this.state.question.answers ? this.state.question.answers[2].checked : false;
        const RelativesLiving = this.state.question.answers ? this.state.question.answers[3].checked : false;
        const other = this.state.question.answers ? this.state.question.answers[4].checked : false;
        if(YourSpouse) {
            navigationService.navigate('Question105')
        }else if(child) {
            navigationService.navigate('Question1051')
        }else if(RelativesLiving) {
            navigationService.navigate('Question1054')
        }else if(other){
            navigationService.navigate('Question116')
        }else {
            navigationService.navigate('Question117', {doDetailAgain: false})
        }
    }

    onChangeQuestion(item) {
        let checked = handleValidateQuestion(item);
        this.setState({
            question: item,
            checked: checked
        });

    }

    render() {
        return (
            <WrapperQuestion handleNextQuestion={this.handleNextQuestion.bind(this)} textButton={'次へ'}
                             disabled={!this.state.checked}>
                <QuestionTypeMultiChoice onChangeQuestion={this.onChangeQuestion.bind(this)}
                                         question={this.state.question}
                                         renderHeader={this.renderHeader(this.state.question)}/>
                <View style={{ height: 70}}/>
            </WrapperQuestion>
        )
    }
}
