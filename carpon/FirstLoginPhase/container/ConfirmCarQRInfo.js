import React, {Component} from 'react';
import {screen} from "../../../navigation";
import LottieView from 'lottie-react-native';
import {navigationService} from "../../services";
import {View , Text, TouchableOpacity, Image, StyleSheet, Animated, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {getCar, getRecall} from "../../Home/MyCar/actions/getCar";
import {HeaderOnlyColor} from "../../../components";
import {confirmCarProfile} from "../actions/registration";
import color from "../../color";
import {viewPage} from "../../Tracker";
const {width, height} = Dimensions.get('window');
import Overlay from 'react-native-modal-overlay';
import ButtonText from "../../../components/ButtonText";

@screen('ConfirmCarQRInfo', {header: <HeaderOnlyColor/>})
@connect(state => ({
        carProfile: state.registration.carProfile,
        myCarInfo: state.getCar ? state.getCar.myCarInformation : null,
        answering: state.answerSurvey.answering ? state.answerSurvey.answering.status: false,
        surveyId: state.answerSurvey.answering ? state.answerSurvey.answering.surveyId: false,
        myProfile: state.registration.userProfile.myProfile,
    }),
    dispatch => ({
        getCarInfo: () => dispatch(getCar()),
        confirmCarProfile: (profile) => dispatch(confirmCarProfile(profile)),
        getRecall: (id, form) => dispatch(getRecall(id, form)),
        answerQuestionSuccess: (surveyId) => dispatch({
            type: 'ANSWER_SUCCESS',
            surveyId: surveyId
        }),
    })
)
export class ConfirmCarQRInfo extends Component{

    constructor() {
        super();
        this.springValue = new Animated.Value(0.3);
        this.state = {
            disabled: true,
            isShowModal: false
        };
    }

    componentDidMount() {
        viewPage('complete_qr_adding', 'QR追加完了');
        if (this.props.navigation.getParam('isAddQR') || this.props.carProfile.switchCar ||this.props.navigation.getParam('addCarFromMainTab')) {
            this.props.getCarInfo();
            this.props.getRecall(this.props.myCarInfo.id, this.props.myCarInfo.form);
        }
        setTimeout(() => {
            if (this.props.myProfile.need_make_insurance_for_new_car && !this.props.navigation.getParam('isAddQR')) {
                this.setState({isShowModal: true})
            } else {
                if (this.props.navigation.getParam('isAddQR')) {
                    navigationService.clear('MainTab')
                } else {
                    const carProfile = this.props.carProfile.profile || {};
                    this.props.confirmCarProfile(carProfile);
                }
            }
        }, 3500);
    }

    render(){
        return(
            <View style={styles.container}>
                <Overlay visible={this.state.isShowModal} onClose={() => this.setState({isShowModal: false})}
                         childrenWrapperStyle={{borderRadius: 5, backgroundColor: '#F8F8F8'}}
                         closeOnTouchOutside={false}>
                    <View>
                        <Text style={{
                            color: '#4B9FA5',
                            fontSize: 18,
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>自動車保険の簡易見積</Text>
                        <Text style={{color: 'black', marginVertical: 10, fontSize: 17, lineHeight: 24}}>
                            新しい自動車の任意保険見積もりを開始します。
                        </Text>
                        <ButtonText title={'OK'} onPress={() => {
                            this.setState({isShowModal: false}, () => navigationService.clear('RegisterInsurance'))
                        }}/>
                    </View>
                </Overlay>
                <View style={{ backgroundColor: color.active, zIndex: 0, height, width}}>
                    <LottieView
                        source={require('../../../assets/Carpon_Certification_Mycar.json')}
                        autoPlay
                        loop={false}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
    container: {
        backgroundColor: 'rgb(75, 159, 165)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapper: {
        flex: 2, justifyContent: 'space-between' , width: '100%', alignItems: 'center',position: 'absolute', top: '4%', left: 0
    },
    header: {
        borderWidth: 1.5, borderColor: 'white', padding: 15,marginVertical: '5%',marginLeft: '5%' , width: '90%'
    },
    text_1: {
        fontSize: 40 , fontWeight: 'bold', textAlign: 'center', color: 'white', fontFamily: 'DIN Condensed', letterSpacing: 4
    },
    button: {
        padding: 15,marginHorizontal: '4%', borderRadius: 2  ,backgroundColor: 'white',top: 0
    },
    buttonText: {
        color: '#4B9FA5', textAlign: 'center',fontWeight: 'bold'
    }
});
