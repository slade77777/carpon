import React, {Component} from 'react';
import {
    ScrollView,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    SafeAreaView, Image, Linking
} from 'react-native';
import {screen} from '../../../navigation';
import {SvgImage, SvgViews} from '../../../components/Common/SvgImage'
import {images} from "../../../assets/index";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {navigationService} from "../../services/index";
import Overlay from 'react-native-modal-overlay';
import ButtonText from "../../../components/ButtonText";
import ImageLoader from "../../../components/ImageLoader";
import {SingleColumnLayout} from "../../layouts";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {connect} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import {viewPage} from "../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {width} = Dimensions.get('window');
const companyImages = [ images.sbiCompany, images.mitsuiCompany, images.adultCompany];

@screen('RecommendInsurances', ({navigation}) => ({ header: <HeaderOnPress
    leftComponent={<Icon name="md-close" size={30} color="#FFFFFF"/>}
    onPress={() => navigationService.clear('MainTab')}
    title={'おすすめの任意保険'}/>
}))
@connect(
    state => ({
        myProfile: state.registration.userProfile.myProfile,
        companyList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_company : []
    }),
    dispatch => ({})
)
export class RecommendInsurances extends Component {
    componentDidMount() {
        viewPage('insurance_recommendations', 'おすすめの任意保険');
    }

    render() {
        let companyShow = [];
        const companyList = this.props.companyList.filter(item => item.useAsDefault);
        companyList.length > 0 && companyList.map((company, index) => {
            companyShow.push(
                <TouchableOpacity activeOpacity={1} onPress={() => Linking.openURL(company.url)} key={index}>
                    <View style={{
                        paddingHorizontal: 16,
                        height: 105,
                        flexDirection: 'row',
                        borderTopWidth: 1,
                        borderTopColor: '#E5E5E5',
                        alignItems: 'center'
                    }}>
                        <View style={{justifyContent: 'center', alignItems: 'center',  borderColor: '#EFEFEF',
                            borderWidth: 1, marginVertical: 13, overflow: 'hidden', width: width/5, height: width/5}}>
                            <Image source={companyImages[index]} style={{ width: width/5 - 10, height: width/5 - 10}}/>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            width: '66%',
                            paddingLeft: 20
                        }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', paddingBottom: 5}}>{company.name}</Text>
                            <Text style={{ fontSize: 13, color: '#666666', lineHeight: 15}}>
                                {company.description}
                            </Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'flex-end', width: 45}}>
                            <SvgImage source={SvgViews.MoveNext}/>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        });
        return (
            <View style={{flex : 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <ScrollView contentInset={{ bottom: 25 }}
                                    scrollIndicatorInsets={{right: 1}}>
                            <View style={{marginTop: 25, borderBottomWidth: 1, borderBottomColor: '#E5E5E5'}}>
                                {companyShow}
                            </View>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            borderColor: '#4B9FA5',
                            borderWidth: 1,
                            marginHorizontal: 15,
                            marginTop: 15,
                            height: 205,
                            marginBottom: isIphoneX() ? getBottomSpace() : 15
                        }}>
                            <View style={{
                                marginHorizontal: 15,
                                marginVertical: 15
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    paddingBottom: 12,
                                    fontWeight: 'bold'
                                }}>任意保険ご加入済の方へ</Text>
                                <Text style={{
                                    fontSize: 17,
                                    color: '#666666',
                                    paddingBottom: 12,
                                    lineHeight: 22
                                }}>現在ご加入の保険について数個ご回答いただくだけで、おすすめ任意保険のお見積りが簡単に作成出来ます。次回更新時の参考にご利用ください。</Text>
                                <ButtonCarpon disabled={false}
                                                      style={{backgroundColor: '#F37B7D'}}
                                                      onPress={() => navigationService.navigate('RegisterInsurance')}>
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: 14,
                                                color: '#FFFFFF'
                                            }}>任意保険簡易見積</Text>
                                        </ButtonCarpon>
                            </View>
                        </View>
                    }
                />
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    button: {
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        color: '#CCCCCC',
        borderRadius: 5,
        borderWidth: 0.5,
    },
    content: {width: '60%', flexDirection: 'column', justifyContent: 'center'}
});
