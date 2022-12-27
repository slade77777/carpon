import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, StyleSheet, View, SafeAreaView, ScrollView, Alert, Dimensions} from 'react-native';
import {SingleColumnLayout} from "../../layouts";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import HeaderOnPress from "../../../components/HeaderOnPress";
import Dropdown from "../../common/Dropdown";
import {InputText} from '../../../components';
import InsuranceCompleted from "./InsuranceCompleted";
import {connect}                   from 'react-redux';
import color                       from "../../color";
import {getUserProfile}            from "../../Account/actions/accountAction";
import {updateInsuranceProfile}    from "./action/InsuranceAction";
import Spinner                     from 'react-native-loading-spinner-overlay';
import {viewPage}                  from "../../Tracker";
import {navigationService}         from "../../services";
import _                           from "lodash";
import Area                        from "../../../area.json";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";
import {submitAppFlyer}            from "../../../App";

const {width, height} = Dimensions.get('window');
const unacceptableNormalCar = ['あ', 'い', 'う', 'え' , 'か' ,'き' ,'く','け','こ','を'];
const unacceptableMiniCar = ['り','れ'];

@screen('InsuranceQuestionList', {header: <HeaderOnPress title={'個別見積・お申し込み'}/>})
@connect(state => ({
    optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_company : [],
    carInfo: state.getCar,
    myProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    answers: state.metadata.answers,
    insuranceInfo: state.insurance,
    }),
    dispatch => ({
        getUserProfile: () => dispatch(getUserProfile()),
        updateInsuranceProfile: (answer) => dispatch(updateInsuranceProfile(answer))
    })
)


export class InsuranceQuestionList extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        loading: false,
        success: false,
        insurance_number: null,
        insurance_company: null
    };

    componentWillMount() {
        this.setState({
            success: false,
            insurance_company: this.props.myProfile.insurance_company,
            insurance_number: this.props.myProfile.insurance_number
        });
        viewPage('submit_individual_estimation', '任意保険個別見積_送信');
    }

    getCurrentCompany() {
        const id = this.props.navigation.getParam('company').id;
        const insuranceInfo = this.props.insuranceInfo.insuranceInfo;
        let currentCompany = null;
        insuranceInfo.map(company => {
            if (company.response_data && company.response_data.id === id) {
                currentCompany = company;
            }
        });
        return currentCompany;
    }

    handleUpdate() {
        const carInfo = this.props.carInfo.myCarInformation;
        let hiraganaRaw = carInfo.number.match(/[\u3040-\u309Fー]/)[0];
        const hiragana = !!_.findIndex(Area.hiragana, (item)=> {return item.value === hiraganaRaw}) ? hiraganaRaw : Area.hiragana[0].value;
        if ((carInfo.type === 0 && unacceptableNormalCar.includes(hiragana)) || (carInfo.type === 1 && unacceptableMiniCar.includes(hiragana))) {
            Alert.alert('個別見積もりできません', '業務用でご利用されているおクルマは個別見積できません。ご了承ください。');
        } else {
            this.setState({loading: true});
            const answer = {
                insurance_company: this.state.insurance_company,
                insurance_number: this.state.insurance_number,
                individual_company: this.props.navigation.getParam('company').id,
                id: this.props.carInfo.myCarInformation.id,
                estimation_type: 'individual'
            };
            this.props.updateInsuranceProfile(answer);
            setTimeout(() => {
                if (this.props.insuranceInfo.individualResult) {
                    const currentCompany = this.getCurrentCompany();
                    if (!currentCompany || currentCompany.response_data.status === '404') {
                        this.setState({success: false, loading: false});
                        setTimeout(() => {
                            Alert.alert('エラー', 'お見積もりできませんでした');
                        }, 100);
                    } else {
                        const user = this.props.myProfile;
                        if (user && user.id) {
                            const id = user.id;
                            submitAppFlyer('INS_ESTIMATE_COMP',
                                {
                                    user_id: id,
                                    insurance_company: this.state.insurance_company,
                                    insurance_number: this.state.insurance_number,
                                    individual_company: this.props.navigation.getParam('company').id,
                                    car_id: this.props.carInfo.myCarInformation.id,
                                },
                                id
                            )
                        }
                        const company = this.props.navigation.getParam('company');
                        if (company.id !== '23') {
                            this.setState({loading: false});
                            const companyImage = this.props.navigation.getParam('companyImage');
                            navigationService.clear('CompanySetting', {company, companyImage});
                        } else {
                            this.setState({loading: false, success: true});
                        }

                    }
                } else {
                    this.setState({success: false, loading: false});
                    setTimeout(() => {
                        Alert.alert('エラー', '現在の状況ではお見積もりできません');
                    }, 100);
                }
            }, 8000)
        }
    }


    handleOnSelect(item) {
        this.setState({ insurance_company: item});
    }

    render() {
        const company = this.props.navigation.getParam('company');
        const companyImage = this.props.navigation.getParam('companyImage');
        const optionList = this.props.optionsList.map((item) => {
            item.label = item.name;
            return item;
        });
        return (
            <View style={{ flex : 1}}>
                <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <ScrollView scrollIndicatorInsets={{right: 1}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={null}
                            textStyle={{color: 'white'}}
                        />
                        <View style={{height: '100%', backgroundColor: 'white'}}>
                            <View style={{paddingVertical: 20, marginHorizontal: 15}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    お申込みにあたり、以下項目にご回答ください。
                                </Text>
                            </View>
                            <View style={Styles.titleBackGround}>
                                <Text style={Styles.titleQuestion}>
                                    現在ご契約の保険会社
                                </Text>
                            </View>
                            <View style={{paddingHorizontal: 15, paddingBottom: 15}}>
                                <Dropdown
                                    label={'保険会社'}
                                    baseColor={color.active}
                                    data={optionList}
                                    value={this.state.insurance_company ? this.state.insurance_company : (optionList[0] && optionList[0].value)}
                                    onChangeText={(value) => this.handleOnSelect(value)}
                                />
                            </View>
                            <View style={Styles.titleBackGround}>
                                <Text style={Styles.titleQuestion}>
                                    現契約保険の証券番号
                                </Text>
                            </View>
                            <View style={{marginTop: 10, paddingHorizontal: 15}}>
                                <InputText
                                    style={{fontSize: 18}}
                                    title={'  '}
                                    placeholder={'例：1234567890'}
                                    value={this.state.insurance_number}
                                    onChangeText={(text) => this.setState({insurance_number: text})}
                                />
                            </View>
                        </View>
                    </ScrollView>
                }
                bottomContent={
                    (this.state.insurance_number && this.state.insurance_company) ?
                    <View style={{
                        backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%',

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
                    </View> : <View/>
                }
            />
                {
                    this.state.success ?  <InsuranceCompleted company={company} companyImage={companyImage}/> : <View/>
                }

            </View>
        )
    }
}


const Styles = StyleSheet.create({

    titleBackGround: {
        backgroundColor: '#F2F8F9',
        paddingHorizontal: 15,
    },
    titleQuestion: {
        color: '#4B9FA5',
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 15
    },
});
