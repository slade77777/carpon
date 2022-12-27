import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, StyleSheet, View, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../../layouts";
import Spinner from 'react-native-loading-spinner-overlay';
import color from "../../../color";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import QuestionRadioList from './component/QuestionRadioList';
import {getCar} from "../../MyCar/actions/getCar";
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const answerList = [
    {
        label: '0回',
        value: 0
    },
    {
        label: '1回',
        value: 1
    },
    {
        label: '2回',
        value: 2
    },
    {
        label: '3回以上',
        value: 'more than 3'
    },
    {
        label: 'わからない',
        value: 'not known'
    }
];
@screen('Question91', {header: <HeaderOnPress title={'任意保険簡易見積'}/>})
@connect(
    state => ({
        carInfo: state.getCar,
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }),
    dispatch => ({getCar: () => {
        dispatch(getCar())
    }
    })
)
export class Question91 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            type: 0
        };
    }

    componentDidMount() {
        viewPage('insurance_question_count_of_accident', '任意保険_事故回数');
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 20 : 0}}>
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    現在ご加入保険期間中の事故回数を選択してください
                                </Text>
                            </View>
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                                    <SvgImage
                                        source={SvgViews.IconHelp}
                                    />
                                    <Text style={{textAlign: 'right', color: '#999999'}}>
                                        事故有係数適用期間について
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <QuestionRadioList onClick={(val) => this.setState({ type: val})} answerList={answerList} type={this.state.type}/>
                            <View style={{ height: 70}}/>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%',
                            height: isIphoneX() ? getBottomSpace() + 55  : 70,
                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D'}}
                                          onPress={() => navigationService.navigate('Question118')}>
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
