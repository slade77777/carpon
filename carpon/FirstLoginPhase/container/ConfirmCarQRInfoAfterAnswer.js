import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {images} from '../../../assets/index';
import {navigationService} from "../../services";
import {View , Text, TouchableOpacity, Image, StyleSheet, Animated, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {getCar, getRecall} from "../../Home/MyCar/actions/getCar";
import {HeaderOnlyColor} from "../../../components";
import {confirmCarProfile} from "../actions/registration";
import {viewPage} from "../../Tracker";

@screen('ConfirmCarQRInfoAfterAnswer', {header: <HeaderOnlyColor/>})
@connect(state => ({
        carProfile: state.registration.carProfile,
        myCarInfo: state.getCar ? state.getCar.myCarInformation : null,
        answering: state.answerSurvey.answering ? state.answerSurvey.answering.status: false,
        surveyId: state.answerSurvey.answering ? state.answerSurvey.answering.surveyId: false
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
export class ConfirmCarQRInfoAfterAnswer extends Component{

    constructor() {
        super();
        this.springValue = new Animated.Value(0.3);
        this.state = {disabled: true};
    }

    spring () {
        this.springValue.setValue(0.3);
        Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 1
            }
        ).start(() => this.setState({disabled: false}));
    }

    handleNavigate() {
        this.props.answerQuestionSuccess(this.props.surveyId);
        navigationService.pop(6)
    }

    componentDidMount() {
        viewPage('congratulate_certified', 'マイカー認定');
        if (this.props.navigation.getParam('isAddQR') || this.props.carProfile.switchCar ||this.props.navigation.getParam('addCarFromMainTab')) {
            this.props.getCarInfo();
            this.props.getRecall(this.props.myCarInfo.id, this.props.myCarInfo.form);
        }
        this.setState({
            loading: true
        });
        setTimeout(() => {
            this.setState({
                loading: false
            });
            this.spring();
        }, 1500);
    }

    render(){
        const {carProfile} = this.props;
        return(
            <View style={styles.container}>
                {
                    this.state.loading &&
                    <ActivityIndicator size="large" color="#FFF"/>
                }
                <View style={styles.wrapper}>
                    {
                        !this.state.loading &&
                        <View>
                            <Animated.View style={{width: '100%', alignItems: 'center', marginTop: 0,transform: [{scale: this.springValue}] }}>
                                <Image source={images.logoCertified} style={{justifyContent: 'center', width: 300, height: 315}}/>
                            </Animated.View>
                        </View>
                    }
                    {
                        !this.state.disabled &&
                        <View style={{width: '100%', marginTop: 20}}>
                            <View style={styles.header}>
                                <Text style={styles.text}>{carProfile.profile.car_name || this.props.myCarInfo.car_name}</Text>
                            </View>
                            <Text style={[styles.text, {fontWeight: 'bold'}]}>マイカー認定しました</Text>
                        </View>
                    }
                </View>
                <View style={{ width: '100%', position: 'absolute', bottom: '8%'}}>
                    {this.state.disabled ? null : <TouchableOpacity
                        onPress={() => this.handleNavigate()}
                        style={styles.button}><Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>}
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
