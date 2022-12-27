import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, StyleSheet, View, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderCarpon from "../../../components/HeaderCarpon";
import color from "../../color";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {AnswerProfileOptions} from "../../common/actions/metadata";
import {navigationService} from "../../services/index";
import {userProfileService} from "../../services";
import {getUserProfile} from "../../Account/actions/accountAction";
import {viewPage} from "../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('RegisterInsurance', {header: <HeaderCarpon title={'任意保険簡易見積'}/>})
@connect(
    state => ({
        answerList: state.metadata.answers,
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }),
    dispatch => ({
        AnswerProfileOptions: (answer) => dispatch(AnswerProfileOptions(answer)),
        getUserProfile: () => {dispatch(getUserProfile())}
    })
)
export class RegisterInsurance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            hasInsurance: false
        };
    }

    componentDidMount() {
        viewPage('insurance_rough_presence', '任意保険簡易見積_有無');
    }

    handleUpdate() {
        const answers = this.props.answerList;
        answers.has_car_insurance =  this.state.hasInsurance;
        if (this.props.userProfile.insurance_expiration_date) {
            answers.insurance_expiration_date = this.props.userProfile.insurance_expiration_date
        }
        this.props.AnswerProfileOptions(answers);
        if (this.state.hasInsurance) {
            navigationService.navigate(this.props.userProfile.insurance_expiration_date ? 'InsuranceType' : 'InsurancePeriod');
        } else {
            Alert.alert(
                '簡易見積を終了します',
                '任意保険に加入されていない場合は簡易見積が作成出来ません。',
                [
                    {text: 'キャンセル', onPress: () => null},
                    {text: 'OK', onPress: () => {
                        this.updateInsurance()
                    }},
                ],
                {cancelable: false}
            )
        }
    }

    updateInsurance() {
        this.setState({loading: true});
        userProfileService.updateUser({has_car_insurance: false}).then(() => {
            this.props.getUserProfile();
            setTimeout(() => {
                navigationService.clear('MainTab');
                this.setState({loading: false});
            }, 1500)
        }).catch(() => {
            this.setState({loading: false});
            setTimeout(() => {
                alert('エラー');
            }, 100)
        })
    }

    render() {
        return (
            <View style={{flex : 1}}>
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
                                    任意保険に加入していますか？
                                </Text>
                            </View>
                            <View style={Styles.inline}>
                                <View style={{width: '50%', alignItems: 'flex-start', paddingLeft: 5}}>
                                    <Text>はい</Text>
                                </View>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ hasInsurance: true})} style={{justifyContent: 'center', alignItems : 'flex-end', width : '50%', paddingRight : 15}}>
                                    <View style={Styles.radio}>
                                        {
                                            this.state.hasInsurance && <View style={Styles.checked}/>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{...Styles.inline,  borderBottomWidth:1, borderColor: '#CDD6DD', paddingBottom: 15}}>
                                <View style={{width: '50%', alignItems: 'flex-start', paddingLeft: 5}}>
                                    <Text>いいえ</Text>
                                </View>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ hasInsurance: false})}
                                                  style={{justifyContent: 'center', alignItems : 'flex-end', width : '50%', paddingRight : 15}}>
                                    <View style={Styles.radio}>
                                        {
                                            !this.state.hasInsurance && <View style={Styles.checked}/>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
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
