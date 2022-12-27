import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {
    Text,
    Keyboard,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    View,
    Modal,
    Platform,
    Dimensions,
    ScrollView,
    Linking, Image
} from 'react-native';
import {HeaderOnPress} from '../../../../components';
import {connect} from 'react-redux';
import moment from 'moment';
import stylesCommon from "../../../../style";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import ImageViewer from 'react-native-image-zoom-viewer';
import call from 'react-native-phone-call';
import color from "../../../color";
import {navigationService} from "../../../../carpon/services";
import {SingleColumnLayout} from "../../../layouts";
import ButtonText from "../../../../components/ButtonText";
import {getUserProfile} from "../../../Account/actions/accountAction";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {height, width} = Dimensions.get('window');

@screen('Insurance', {
    header: <HeaderOnPress title={'任意保険'} rightContent={{
        icon: 'IconEdit',
        color: '#FFF',
        nextScreen: 'UpdateInsurance'
    }}/>
})
@connect(state => ({
    myProfile: state.registration.userProfile.myProfile,
    optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_company : [],
    gradeList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_nonfleet_grade : [],
    accidentList: state.metadata.profileOptions ? state.metadata.profileOptions.accident_coefficient_applied_term : [],
    carInfo: state.getCar ? state.getCar.myCarInformation : {}
}), (dispatch) => ({
    loadListQuestion: (idSurvey) => dispatch({
        type: 'LOAD_LIST_QUESTION',
        idSurvey
    }),
    getUserProfile: () => dispatch(getUserProfile()),
}))
export class Insurance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageDetailOpen: false,
            imageDetail: null,
            imageFrontHeight: 0,
            imageBackHeight: 0
        }
    }

    componentDidMount() {
        viewPage('insurance', '任意保険');
        this.props.getUserProfile();
        // this.updateImageSize(this.props.myProfile);
    }

    getAnswerQuestion(list, value) {
        const choice = list.filter((item) => item.value === value);
        return choice[0] ? (choice[0].label || choice[0].name) : null;
    }

    getPhone(list, value) {
        const choice = list.filter((item) => item.value === value);
        return choice[0] ? choice[0].phone : null;
    }

    getUrl(list, value) {
        const choice = list.filter((item) => item.value === value);
        return choice[0] ? choice[0].url : null;
    }

    componentWillUnmount() {
        let updateScore = this.props.navigation.getParam('updateScore');
        if(updateScore) {
            let survey = this.props.navigation.getParam('survey');
            this.props.loadListQuestion(survey.id)
        }
    }

    componentWillReceiveProps(newProps) {
        const userProfile = this.props.myProfile;
        if (newProps.myProfile.insurance_image_front_signed_url !== userProfile.insurance_image_front_signed_url
            || newProps.myProfile.insurance_image_back_signed_url !== userProfile.insurance_image_back_signed_url) {
            this.updateImageSize(newProps.myProfile);
        }
    }

    updateImageSize(userProfile) {
        userProfile.insurance_image_front_signed_url && Image.getSize(userProfile.insurance_image_front_signed_url, (actualWidth, actualHeight) => {
            this.setState({imageFrontHeight : (width - 30) * actualHeight/actualWidth})
        });
        userProfile.insurance_image_back_signed_url && Image.getSize(userProfile.insurance_image_back_signed_url, (actualWidth, actualHeight) => {
            this.setState({imageBackHeight : (width - 30) * actualHeight/actualWidth})
        });
    }

    render() {
        const myProfile = this.props.myProfile;
        const insurance_company = this.getAnswerQuestion(this.props.optionsList, myProfile.insurance_company);
        const insurance_company_phone = this.getPhone(this.props.optionsList, myProfile.insurance_company);
        const grade = this.getAnswerQuestion(this.props.gradeList, myProfile.insurance_nonfleet_grade);
        const accident = this.getAnswerQuestion(this.props.accidentList, myProfile.accident_coefficient_applied_term);
        const url = this.getUrl(this.props.optionsList, myProfile.insurance_company);
        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}}>
                            <View style={styles.body}>
                                <View style={styles.rowItem}>
                                    <Text style={styles.title}>保険会社</Text>
                                    <Text style={styles.value}>{insurance_company}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={styles.width30}>
                                        <Text style={styles.title}>事故受付電話番号</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        insurance_company_phone && call({
                                            number: insurance_company_phone.split('-').join(''),
                                            prompt: false
                                        }).catch(console.error)
                                    }} style={styles.width70}>
                                        <Text style={{
                                            paddingRight: 10,
                                            textAlign: 'right',
                                            textDecorationLine: 'underline',
                                            color: color.active
                                        }}>{insurance_company_phone}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{borderColor: '#E5E5E5', borderBottomWidth: 1}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: 10
                                    }}>
                                        <Text style={styles.title}>任意保険満期</Text>
                                        <Text style={styles.value}>{myProfile.insurance_expiration_date && moment(myProfile.insurance_expiration_date).format('YYYY年M月D日')}</Text>
                                    </View>
                                    <Text style={{ fontSize: 12, color: '#F37B7D', padding: 15}}>保険証券をご確認の上、正しい日付を登録してください。</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <TouchableOpacity onPress={()=> navigationService.navigate('NonFleetDefinition')} style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={styles.title}>ノンフリート等級</Text>
                                        <View style={{ marginLeft: 10}}>
                                            <SvgImage
                                                source={SvgViews.IconHelp}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.value}>{grade}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.title}>保険証券番号</Text>
                                    <Text style={styles.value}>{myProfile.insurance_number}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.title}>前年事故有係数適用期間</Text>
                                    <Text style={styles.value}>{accident}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={styles.width30}>
                                        <Text style={styles.title}>契約確認ページURL</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => url && Linking.openURL(url)}
                                                      style={styles.width70}>
                                        <Text numberOfLines={1} style={[styles.value, {color: color.active, textDecorationLine: 'underline'}]}>{url}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ margin: 15, color: '#6F7579', fontSize: 13, lineHeight: 18}}>
                                    ※ご利用状況に基づいたメンテナンス情報をお届けします。定期的な更新をお願いします。
                                </Text>
                                {
                                    myProfile.insurance_image_front_signed_url && <View style={{paddingTop: 20}}>
                                        <Text style={styles.ImageTitle}>任意保険証券（表）</Text>
                                        <View style={{paddingTop: 15, alignItems: 'center'}}>
                                            {
                                                myProfile.insurance_image_front_signed_url &&
                                                <TouchableOpacity onPress={() => this.setState({
                                                    imageDetailOpen: true,
                                                    imageDetail: [{url: myProfile.insurance_image_front_signed_url}]
                                                })}>
                                                    <Image
                                                        style={{height: this.state.imageFrontHeight, width: width - 30}}
                                                        source={{uri: myProfile.insurance_image_front_signed_url}}
                                                    />
                                                </TouchableOpacity>
                                            }

                                        </View>
                                    </View>
                                }
                                {
                                    myProfile.insurance_image_back_signed_url && <View style={{paddingTop: 20}}>
                                        <Text style={styles.ImageTitle}>任意保険証券（裏）</Text>
                                        <View style={{paddingTop: 15, alignItems: 'center'}}>
                                            {
                                                myProfile.insurance_image_back_signed_url &&
                                                <TouchableOpacity onPress={() => this.setState({
                                                    imageDetailOpen: true,
                                                    imageDetail: [{url: myProfile.insurance_image_back_signed_url}]
                                                })}>
                                                    <Image
                                                        style={{height: this.state.imageBackHeight, width: width - 30}}
                                                        source={{uri: myProfile.insurance_image_back_signed_url}}
                                                    />
                                                </TouchableOpacity>
                                            }

                                        </View>
                                    </View>
                                }

                                <Modal visible={this.state.imageDetailOpen} transparent={true}>
                                    <View style={{
                                        backgroundColor: 'black',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingTop: isIphoneX() ? 50 : 30,
                                        paddingHorizontal: 15
                                    }}>
                                        <TouchableOpacity onPress={() => this.setState({imageDetailOpen: false, imageDetail: []})}>
                                            <SvgImage source={SvgViews.Remove}/>
                                        </TouchableOpacity>
                                        <View/>
                                    </View>
                                    <ImageViewer
                                        imageUrls={this.state.imageDetail}
                                        enableSwipeDown={true}
                                        onSwipeDown={() => this.setState({imageDetailOpen: false, imageDetail: []})}
                                        renderIndicator={() => null}
                                    />
                                </Modal>
                            </View>
                        </ScrollView>

                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)',
                            paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15,
                            position: 'absolute',
                            bottom: 0,
                            width: '100%'
                        }}>
                            <ButtonText disabled={false} title={'任意保険見積を見る'}
                                        onPress={() => navigationService.navigate((myProfile.estimation_type && !myProfile.need_make_insurance_for_new_car) ? 'InsuranceCompany' : 'RegisterInsurance')}/>
                        </View>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        height: '100%',
        textAlign: 'center',
        paddingBottom: 80,
        marginTop: 25,
        borderTopWidth: 1,
        borderColor: '#E5E5E5',
    },
    rowItem: {
        flexDirection: 'row',
        borderColor: '#E5E5E5',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        height: 45,
        alignItems: 'center'
    },
    width30: {
        width: '45%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        height: 45,
        justifyContent: 'center',
    },
    width70: {
        width: '55%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        height: 45,
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 14,
        paddingLeft: 15
    },
    ImageTitle: {
        fontWeight: 'bold',
        color: color.active,
        fontSize: 14,
        paddingLeft: 15,
    },
    value: {
        paddingRight: 15,
        textAlign: 'right'
    },
});

