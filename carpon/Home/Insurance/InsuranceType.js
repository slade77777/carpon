import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, StyleSheet, View, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import Spinner from 'react-native-loading-spinner-overlay';
import color from "../../color";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {myCarService, navigationService} from "../../services/index";
import moment from 'moment';
import {getCar} from "../MyCar/actions/getCar";
import QuestionRadioList from "./Question/component/QuestionRadioList";
import {AnswerProfileOptions} from "../../common/actions/metadata";
import {viewPage} from "../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

function getAge(date) {
    const currentDate = new Date();
    const registerDate = new Date(date);
    let months = currentDate.getMonth() - registerDate.getMonth();
    let years = currentDate.getFullYear() - registerDate.getFullYear();
    if (months < 0) {
        years -= 1;
    }
    return years;
}

@screen('InsuranceType', {header: <HeaderOnPress title={'任意保険簡易見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_nonfleet_grade : [],
    }),
        dispatch => ({getCar: () => dispatch(getCar()),
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export class InsuranceType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            type: this.props.userProfile.insurance_nonfleet_grade ? this.props.userProfile.insurance_nonfleet_grade : this.props.optionsList[0].value
        };
    }

    componentDidMount() {
        viewPage('insurance_rough_rank', '任意保険簡易見積_等級');
    }

    handleUpdate() {
        let grade = null;
        if (this.state.type) {
            grade = this.state.type;
        } else {
            const age = getAge(this.props.userProfile.birthday);
            grade = age - 19;
            if (grade < 6) {
                grade = 6
            }
            if (grade > 20) {
                grade = 20
            }
            let fleetChoice = {};
            this.props.optionsList.map(option => {
                if (parseInt(option.nttif_code) === grade) {
                    fleetChoice = option;
                    return true;
                }
            });
            if (fleetChoice) {
                grade = fleetChoice.value;
            }
        }
        const answers = this.props.answerList;
        const currentYear = new Date().getFullYear();
        const monthChoice = this.props.navigation.getParam('month');
        if (monthChoice) {
            answers.insurance_expiration_date = new Date(monthChoice >= new Date().getMonth() + 1 ? currentYear : currentYear + 1, monthChoice, 0);
        }
        answers.insurance_nonfleet_grade =  grade;
        this.props.AnswerProfileOptions(answers);
        navigationService.navigate('InsuranceColor', {estimation_type: 'easy'});
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}}>
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    現在のノンフリート等級を選択してください
                                </Text>
                            </View>
                            <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('NonFleetDefinition')} style={{paddingHorizontal: 20, marginTop: 20}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                                    <SvgImage
                                        source={SvgViews.IconHelp}
                                    />
                                    <Text style={{textAlign: 'right', color: '#999999'}}>
                                        ノンフリート等級とは
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <QuestionRadioList onClick={(val) => this.setState({ type: val})} answerList={[{value: null, label: 'わからない（年齢を基準に等級を設定）'}, ...this.props.optionsList]} type={this.state.type}/>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%',
                            height: isIphoneX() ? getBottomSpace() + 55  : 70,
                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D'}}
                                          onPress={() => this.handleUpdate()}>
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


const Styles = StyleSheet.create({
    radio: {
        width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#CDD6DD', alignItems: 'center', justifyContent: 'center'
    },
    inline: {
        paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', borderTopWidth: 1, borderColor: '#CDD6DD', paddingTop: 15, alignItems: 'center'
    },
    checked: {
        width: 15, height: 15, borderRadius: 10, borderWidth: 1, borderColor: color.active, backgroundColor: color.active
    }
});
