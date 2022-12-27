import React, {Component} from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {ScrollView, Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import {screen} from "../../../../navigation";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {navigationService, surveyService} from "../../../services";
import {connect} from 'react-redux';
import moment from 'moment';
import {loadScoreHistory} from "../actions/actions";
import {loadUser} from "../../../FirstLoginPhase/actions/registration";
import Config from 'react-native-config';
import {viewPage} from "../../../Tracker";

const max_point = Config.MAX_SCORE || 1000;
const batchAction = [
    'post_comment',
    'remove_comment',
    'like_comment',
    'get_like_on_comment',
    'comment_more_than_20_characters',
    'unlike_comment',
    'get_unlike_on_comment',
    'unFollow',
    'post_review',
    'unlike_review',
    'delete_review',
    'update_review',
    'like_review',
    'following',
    'followed'
];
@screen('ScoreHistory', {header: <HeaderOnPress title="スコアアップヒストリー"/>})

@connect(state => ({
    userProfile: state.registration.userProfile.myProfile,
    scoreHistory: state.answerSurvey.scoreHistory,
    dataSurvey : state.answerSurvey.dataSurvey
}),
    dispatch => ({
        loadScoreHistory: ()=> {
            dispatch(loadScoreHistory());
                dispatch(loadUser())
        },

    })
)

export class ScoreHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stickyHeader: false,
            scoreHistory: []
        };
    }

    componentWillMount() {
        viewPage('score_history', 'スコアヒストリー');
        // this.props.loadScoreHistory();
    }

    componentDidMount() {
        let history = [];
        const allRecord = this.props.scoreHistory;
        allRecord.map(record => {
            if (record.isUp) {
                record.display = '▲'+ record.displayText;
            } else {
                record.display = '▼ ︎'+ record.displayText;
            }
            if (batchAction.includes(record.action)) {
                if (!history[`batch${moment(record.create_date).format('YYYYMD')}`]) {
                    history[`batch${moment(record.create_date).format('YYYYMD')}`] = record;
                } else {
                    let batchRecord = history[`batch${moment(record.create_date).format('YYYYMD')}`];
                    if (!batchRecord.display.includes('他')) {
                        if (batchRecord.display.includes('／')) {
                            batchRecord.display = batchRecord.display + '／他';
                        } else {
                            batchRecord.display = batchRecord.display + '／' + record.display;
                        }
                        history[`batch${moment(record.create_date).format('YYYYMD')}`] = batchRecord;
                    }
                }
            } else {
                history[`${record.action}${moment(record.create_date).format('YYYYMDHms')}`] = record;
            }
        })
        this.setState({scoreHistory: history})
    }

    render() {
        const history = this.state.scoreHistory;
        const {groups_answer, groups_question} = this.props.dataSurvey;
        let percent_survey_answer = Math.round((this.props.userProfile.total_score/max_point)*100);
        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={{flex: 1, backgroundColor: 'white', flexDirection: 'column'}}
                    // onScrollEndDrag={() => this.setState({stickyHeader: true})}
                            onScroll={() => this.setState({stickyHeader: true})}
                >
                    < View style={{flex: 1, backgroundColor: '#4b9fa5'}}>
                        <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('ScoreRank')}>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', padding: 10}}>
                                <SvgImage source={SvgViews.HelpIcon}/>
                                <Text style={{paddingLeft: 3, color: 'white', paddingVertical: 15}}>ランクについて</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 4, alignItems: 'center', paddingBottom: 40}}>
                            <AnimatedCircularProgress
                                size={200}
                                width={1.5}
                                fill={percent_survey_answer || 0}
                                tintColor="white"
                                // onAnimationComplete={() => console.log('onAnimationComplete')}
                                backgroundColor="#4b9fa5"
                                rotation={360}
                                duration={1500}
                            >
                                {
                                    () => (
                                        <View>
                                            <Text style={{color: 'white', fontWeight: '500', fontSize: 50}}>
                                                {this.props.userProfile.total_score || 0}
                                            </Text>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 16,
                                                textAlign: 'right',
                                            }}>pts</Text>
                                        </View>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </View>
                    </View>
                    <View style={{flex: 3}}>
                        {
                            Object.keys(history).map(function (key, index) {
                                const value = history[key]
                                return (
                                    <View key={index} style={{
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#e5e5e5',
                                        padding: 20,
                                    }}>
                                        <View style={{flex: 1}}>
                                            <Text style={{
                                                color: '#666666',
                                                lineHeight: 30,
                                                fontSize: 12
                                            }}>{moment(value.create_date).format('YYYY年M月D日H時m分')}</Text>
                                            <Text style={{fontSize: 10, color: '#666666', lineHeight: 21}}>{value.display}</Text>
                                        </View>
                                        <View style={{
                                            flex: 1,
                                            color: '#666666',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{fontSize: 26, flex: 5, textAlign: 'right'}}>{value.score}</Text>
                                            <Text style={{fontSize: 14, flex: 1, lineHeight: 25, marginTop: 5}}>pts</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }

                    </View>
                </ScrollView>
            </View>
        )
    }
}
