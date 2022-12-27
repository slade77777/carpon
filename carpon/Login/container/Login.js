import React , {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {screen} from '../../../navigation';
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import {LoginFormFields} from "./LoginFormFields";
import {connect} from "react-redux";
import {resetState} from "../../FirstLoginPhase/actions/registration";
import {navigationService} from "../../services/index";
import LinkText from "../../common/LinkText";
import {viewPage} from "../../Tracker";
import color from "../../color";
import {images} from "../../../assets";
import {isIphoneX} from "react-native-iphone-x-helper";

const {height, width} = Dimensions.get('window');

@screen('Login', {header: null})
@connect(() => ({}),
    dispatch => ({
        resetState: () => dispatch(resetState())
    })
)
export class Login extends Component{

    state = {
        acceptPolicy: true
    }

    componentDidMount() {
        viewPage('login', 'ログイン');
    }

    render() {
        const acceptPolicy = this.state.acceptPolicy;
        return(
            <View style={{width: '100%' , height: '100%'}}>
                <View style={{width: '100%' , height: '100%', backgroundColor: color.active}}>
                    <View style={{width, height: width * 526/382 + (isIphoneX() ? 50 : 0), justifyContent: 'center', paddingTop: 30}}>
                        <Image source={images.LoginCar} style={{width, height: width * 526/382}}/>
                    </View>
                </View>
                <View style={{
                    paddingHorizontal: 15,
                    position : 'absolute',
                    width : '100%',
                    height : '100%',
                }}>
                    <View style={{marginTop: height/2 - 48, height: 40, alignItems: 'flex-end', marginRight: 20}}>
                        <SvgImage source={() => SvgViews.Text4Login()}/>
                    </View>
                    <View style={{ height: height/2 - 100, flexDirection: 'column', justifyContent: 'space-between', marginBottom: 50}}>
                        <View style={{alignItems: 'center'}}>
                            <SvgImage source={() => SvgViews.CarponLogoWhite({width: 260, height: 45})}/>
                        </View>
                        <View style={{ alignItems: 'center'}}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => acceptPolicy && navigationService.navigate('RegisterPhoneNumber')}
                                style={{
                                    backgroundColor: acceptPolicy ? '#FF7279' : '#CCCCCC',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 46,
                                    marginTop: 25,
                                    width: 240,
                                    borderRadius: 30,
                                }}
                            >
                                <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>使ってみる</Text>
                            </TouchableOpacity>
                            <View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{color: '#fff', fontSize: 14}}>すでにアカウントをお持ちの方は<LinkText navigatedTo={'LoginFormFields'} style={{ textDecorationLine: 'underline' }}>ログイン</LinkText></Text>
                            </View>
                            <View style={{ marginTop: 30, borderColor: 'white', borderWidth: 1, padding: 15, flexDirection: 'row', borderRadius: 5}}>
                                <TouchableOpacity
                                    onPress={() => this.setState({acceptPolicy: !acceptPolicy})}
                                    style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: acceptPolicy ? 'white' : color.active, borderColor: 'white', borderWidth: 0.5}}>
                                    {
                                        acceptPolicy && <SvgImage source={SvgViews.CheckedLogin}/>
                                    }
                                </TouchableOpacity>
                                <View style={{marginLeft: 10}}>
                                    <Text style={{width: 240, color: 'white', fontSize: 12}}><LinkText navigatedTo={'PrivacyPolicy'} style={{ textDecorationLine: 'underline' }}>個人情報の取り扱い</LinkText>並びに<LinkText navigatedTo={'TermsOfService'} style={{ textDecorationLine: 'underline' }}>利用規約</LinkText>に同意しCarponを利用します。</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ position: 'absolute', bottom: 35, flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    <Text style={{color: '#fff', fontSize: 12}}>© FABRICA COMMUNICATIONS CO., LTD.</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        ButtonLogin: {
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            borderWidth: 1,
            borderRadius: 3,
            borderColor: '#fff',
        },
        Text: {
            color: '#fff',
            fontSize: 12,
            textAlign: 'center'
        },
        TextUnderline: {
            textDecorationLine: 'underline',
            color: '#fff',
            fontSize: 12,
            textAlign: 'center'
        }
    }
);
