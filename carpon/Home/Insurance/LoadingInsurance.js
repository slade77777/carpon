import React, {Component}                          from 'react';
import {screen}                                    from "../../../navigation";
import {Text, StyleSheet, View, Dimensions, Alert} from 'react-native';
import {connect}                                   from 'react-redux';
import color                                       from "../../color";
import LottieView                                  from 'lottie-react-native';
import {navigationService}                         from "../../services/index";
import {updateInsuranceProfile}                    from "./action/InsuranceAction";
import {AnswerProfileOptions}                      from "../../common/actions/metadata";
import {identifyUser, viewPage}                    from "../../Tracker";
import { submitAppFlyer }                          from "../../../App";

@screen('LoadingInsurance', {header: null})
@connect(
    state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        answerProfileOptions: state.metadata.answers,
        myCarInfo: state.getCar ? state.getCar.myCarInformation : null,
        insuranceInfo: state.insurance,
        insuranceCompanies: state.insurance.insuranceInfo,
        store: state,
        colorList: state.metadata.profileOptions ? state.metadata.profileOptions.color_of_driver_license : [],
    }),
    dispatch => ({
        updateInsuranceProfile: (answer) => dispatch(updateInsuranceProfile(answer)),
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer))
    })
)
export class LoadingInsurance extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        updated: false,
        loading: false
    };

    submitAppFlyer() {
        const user = this.props.userProfile;
        const answer = this.props.answerProfileOptions;
        const estimationType = this.props.navigation.getParam('estimation_type');
        if (user && user.id && estimationType) {
            const id = user.id;
            submitAppFlyer(estimationType === 'easy' ? 'INS_EASY_COMP' : 'INS_DETAIL_COMP',
                {
                    user_id: id,
                    email: user.email,
                    insurance_company_id: answer.insurance_company,
                },
                user.id
            )
        }
    }

    handleUpdateAnswerProfileOptions() {
        const answer = this.props.answerProfileOptions;
        answer.estimation_type = this.props.navigation.getParam('estimation_type') || 'detail';
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        if (answer.insurance_expiration_date || this.props.userProfile.insurance_expiration_date) {
            const insuranceDate = new Date(answer.insurance_expiration_date || this.props.userProfile.insurance_expiration_date);
            const month = insuranceDate.getMonth();
            const day = insuranceDate.getDate();
            answer.insurance_expiration_date = new Date(insuranceDate < new Date() ? currentYear + 1 : insuranceDate.getFullYear(), month, day);
        } else {
            const carEffectiveMonth = new Date(this.props.myCarInfo.effective_date).getMonth() + 1;
            answer.insurance_expiration_date = new Date(currentMonth <= carEffectiveMonth ? currentYear : currentYear + 1, carEffectiveMonth, 0)
        }
        if (answer.insurance_expiration_date < new Date()) {
            const insuranceDate = new Date(answer.insurance_expiration_date);
            const month = insuranceDate.getMonth();
            const day = insuranceDate.getDate();
            answer.insurance_expiration_date = new Date(currentYear + 1, month, day);
        }
        if (answer.estimation_type === 'detail') {
            if (!answer.color_of_driver_license) {
                answer.color_of_driver_license = this.props.userProfile.color_of_driver_license || 1
            }
            if (!answer.insurance_nonfleet_grade) {
                answer.insurance_nonfleet_grade = this.props.userProfile.insurance_nonfleet_grade || 1
            }
            if (!answer.yearly_mileage_plan) {
                answer.yearly_mileage_plan = this.props.userProfile.yearly_mileage_plan || 1
            }
            if (!answer.purpose_of_use) {
                answer.purpose_of_use = this.props.userProfile.purpose_of_use || 1
            }
        }
        if (!answer.insurance_company) answer.insurance_company = this.props.userProfile.insurance_company;
        if (!answer.accident_coefficient_applied_term) answer.accident_coefficient_applied_term = this.props.userProfile.accident_coefficient_applied_term;
        this.props.AnswerProfileOptions(answer);
        this.props.updateInsuranceProfile(answer);
        this.submitAppFlyer();
        if (answer.estimation_type === 'easy') {
            const profile = this.props.userProfile;
            const colorChoice = this.props.colorList.find((item) => item.value === answer.color_of_driver_license);
            identifyUser({
                user_id: profile.id,
                user_profile_license_color: colorChoice ? colorChoice.label : null
            });
        }
    }


    componentDidMount() {
        viewPage('load_insurance_estimation', '任意保険見積ローディング');
        this.handleUpdateAnswerProfileOptions();
    }

    componentDidUpdate() {
        if (!this.props.insuranceInfo.isLoadingInsurance) {
            if (this.props.insuranceCompanies && this.props.insuranceCompanies.length > 0) {
                navigationService.clear('InsuranceCompany')
            } else {
                Alert.alert(
                    'エラー',
                    '見積もり処理が正常に行えませんでした',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigationService.clear('MainTab')
                            }, style: 'destructive',
                        }
                    ],
                    {cancelable: false}
                );
            }
        }
    }

    render() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: Dimensions.get('window').height, backgroundColor: color.active}}>
                <Text style={{ position: 'absolute', top: Dimensions.get('window').height/2 - 80, fontSize: 14, color: '#FFFFFF'}}>{this.props.navigation.getParam('estimation_type') === 'easy' ? '簡易見積作成中…' : '詳細見積作成中…'}</Text>
                <LottieView
                    source={require('../../../assets/Loading_handle.json')}
                    style={{ width: Dimensions.get('window').width }}
                    autoPlay
                    loop
                />
            </View>
        )
    }
}
