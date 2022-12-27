import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {navigationService} from "../../../services";
import Loading from "../../../../components/Loading";
import * as Progress from 'react-native-progress';
import {connect} from "react-redux";
import {ScoreUpStatus} from "../components/ScoreUpStatus";

@connect((state) => ({
    userProfile: state.registration.userProfile,
    dataSurvey: state.answerSurvey.dataSurvey
}), (dispatch) => ({
    resetStateListQuestionReducer: () => dispatch({
        type: 'RESET_STATE_LIST_QUESTION',

    }),
    loadListSurvey: () => dispatch({
        type: "LOAD_LIST_SURVEY"
    })
}))
export default class CarLifeScore extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadListSurvey();
        this.props.resetStateListQuestionReducer();
        this.willFocusEvent = this.props.navigation.addListener('willFocus', () => {
            this.props.loadListSurvey();
            this.props.resetStateListQuestionReducer()
        });
        if (this.props.navigation.getParam('nextScreen') === 'ScoreQuestion') {
            const {groups} = this.props.dataSurvey;
            const params = this.props.navigation.state.params;
            navigationService.navigate('ListQuestion', {survey: groups[parseInt(params.group)], ...params})
        }
    }


    componentWillUnmount() {
        this.willFocusEvent.remove();
    }


    faceArray(number) {
        let array = [];
        for (let i = 1; i <= number; i++) {
            array.push(i);
        }
        return array
    }

    calculateCompletionPercentage({groups_question, groups_answer}) {
        let value = Math.round((groups_answer / groups_question) * 100);
        return value / 100;
    }

    render() {
        const {groups, isLoading, groups_question, groups_answer} = this.props.dataSurvey;
        const padding = 10;
        const width = (Dimensions.get('window').width - 30) / 3 - padding;
        const compare = 3 + ((padding * 3) / width);
        const surplus = groups ? this.faceArray(compare - (groups.length % compare)) : [];
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFFFFF'}}>
                <ScoreUpStatus label={'SCOREUP STATUS :percentage'} progress={this.calculateCompletionPercentage({groups_question, groups_answer})} />
                <View style={{padding: 15}}>
                    <Text style={{
                        fontSize: 17,
                        color: '#333333',
                        fontWeight: 'bold',
                        lineHeight: 22,
                        marginTop: 15,
                        marginBottom: 15
                    }}>あなたとおクルマについて教えてください。</Text>
                    {
                        !isLoading ?
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Loading/>
                            </View> :
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',

                            }}>
                                {
                                    groups ? groups.map((survey, index) => (
                                        <TouchableOpacity activeOpacity={1}
                                                          key={index}
                                                          onPress={() => navigationService.navigate('ListQuestion', {survey})}
                                                          style={{marginTop: 30}}
                                        >
                                            <View
                                                style={{
                                                    width: width,
                                                    height: width, justifyContent: 'center', alignItems: 'center',
                                                    borderRadius: width / 2,
                                                    borderWidth: 4,
                                                    borderColor: '#EFEFEF',
                                                }}>
                                                <View>
                                                    <Progress.Circle size={width} color={'#4B9FA5'}
                                                                     progress={parseFloat((survey['total_answer'] / survey['total_question']).toFixed(1))}
                                                                     borderWidth={0} thickness={4}/>
                                                    <View style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        flex: 1,
                                                        width: width,
                                                        height: width,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <SvgImage source={SvgViews[survey.icon]}/>
                                                    </View>
                                                </View>
                                            </View>
                                            <Text style={{
                                                fontSize: 12,
                                                color: '#333333',
                                                textAlign: 'center',
                                                width: width,
                                                paddingTop: 5
                                            }} numberOfLines={1}>{survey.title}</Text>
                                        </TouchableOpacity>
                                    )) : <View/>
                                }
                                {
                                    surplus.map((index) => (
                                        <View key={index} style={{
                                            width: width,
                                            height: width
                                        }}/>
                                    ))
                                }
                            </View>
                    }
                    <View style={{height: 40}}/>
                </View>
            </ScrollView>
        )
    }
}
