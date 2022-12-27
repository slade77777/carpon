import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, StyleSheet, View, TouchableOpacity, Platform, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import Spinner from 'react-native-loading-spinner-overlay';
import color from "../../color";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {myCarService, navigationService} from "../../services/index";
import {getCar} from "../MyCar/actions/getCar";
import QuestionRadioList from "./Question/component/QuestionRadioList";
import {AnswerProfileOptions} from "../../common/actions/metadata";
import {viewPage} from "../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('InsuranceColor', ({navigation}) => ({ header: <HeaderOnPress
    title={(navigation.getParam('estimation_type') === 'detail' || navigation.getParam('estimation_type') === 'individual') ? '任意保険詳細見積' : '任意保険簡易見積'}/>
}))
@connect(
    state => ({
        answerList: state.metadata.answers,
        answer: state.metadata.answers ? state.metadata.answers.color_of_driver_license : null,
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.color_of_driver_license : [],
    }),
    dispatch => ({
        getCar: () => dispatch(getCar()),
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer)),
        setLoading: () => {
            dispatch({
                type: 'SET_LOADING_INSURANCE',
            })
        },
    })
)
export class InsuranceColor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            options: [],
            type: this.props.userProfile.color_of_driver_license || this.props.optionsList[0].value
        };
    }

    componentDidMount() {
        viewPage('insurance_rough_license', '任意保険簡易見積_免許色')
    }

    handleUpdate() {
        const answers = this.props.answerList;
        answers.color_of_driver_license =  this.state.type;
        this.props.AnswerProfileOptions(answers);
        if (this.props.navigation.getParam('willGoBack')) {
            navigationService.clear('Question117', {doDetailAgain: false})
        } else {
            this.props.setLoading();
            navigationService.navigate('LoadingInsurance', {estimation_type: 'easy'});
        }
    }

    render() {
        return (
            <View style={{ flex : 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{height: '100%', backgroundColor: 'white'}}>
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    運転免許証は何色ですか？
                                </Text>
                            </View>
                            <QuestionRadioList onClick={(val) => this.setState({ type: val})} answerList={this.props.optionsList} type={this.state.type}/>
                        </View>
                    }
                    bottomContent={
                        <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%',

                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D'}}
                                          onPress={() => this.handleUpdate()}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>{(this.props.navigation.getParam('estimation_type') === 'detail' || this.props.navigation.getParam('estimation_type') === 'individual') ? '保存する' : '簡易見積作成'}</Text>
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
