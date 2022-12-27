import React, {Component} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import {screen} from "../../../navigation";
import {SvgImage} from "../../../components/Common/SvgImage";
import SvgViews from "../../../assets/svg/index";
import {navigationService} from "../../services/index";
import {connect} from "react-redux";
import {viewPage} from "../../Tracker";

@screen('InsuranceSplash', {header: null})
@connect(
    state => ({
        answers: state.metadata.answers,
        myProfile: state.registration.userProfile.myProfile
    })
)
export default class InsuranceSplash extends Component {

    componentDidMount() {
        viewPage('splash_insurance_detail_estimation', '任意保険詳細見積の開始');
    }

    render() {
        let nextScreen = '';
        const myProfile = this.props.myProfile;
        if (myProfile.estimation_type === "easy" && !myProfile.has_individual_estimation && parseInt(this.props.answers.guaranteed_drivers) === 0) {
            if (myProfile.accident_coefficient_applied_term) {
                nextScreen = 'Question106'
            } else {
                nextScreen = 'Question92'
            }
        } else {
            nextScreen = 'Question117'
        }
        return (
            <View style={{
                zIndex: 50,
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: `rgba(75,159,165,0.8)`,
                justifyContent: 'center'
            }}>
                <View style={{
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',
                    padding: 25
                }}>
                    <View/>
                    <View>
                        <SvgImage source={SvgViews.InsuranceSplash}/>
                        <Text style={{fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 15}}>任意保険詳細見積</Text>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#fff',
                            textAlign: 'center',
                            marginTop: 10,
                            lineHeight: 21
                        }}>詳しい条件で一括見積を作成します。
                            お見積りに必要な情報をお伺いしますので
                            ご回答ください。</Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => navigationService.clear(nextScreen)}
                            style={{
                                backgroundColor: '#FFF',
                                height: 50,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 15
                            }}>
                            <Text style={{fontSize: 20, color: '#4b9fa5', fontWeight: 'bold'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
