import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Keyboard, ScrollView, View, Alert, Platform, InputAccessoryView, SafeAreaView, Dimensions} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import {navigationService, userProfileService} from "../../../carpon/services";
import {getUserProfile} from "../actions/accountAction";
import Spinner from 'react-native-loading-spinner-overlay';
import Dropdown from '../../common/Dropdown';
import color from "../../color";
import UpdateInputText from "../../../components/UpdateInputText";
import Icon from 'react-native-vector-icons/FontAwesome';
import regexPostCode from '../../postCodeRegex';
import {identifyUser, viewPage} from "../../Tracker";
import {getBottomSpace} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');
@screen('UpdateAddress', {header: <HeaderOnPress title={'ご住所'}/>})
@connect(
    state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        provinceList: state.metadata.profileOptions ? state.metadata.profileOptions.driving_area : [],
    }),
    dispatch => ({
        getUserProfile: () => {
            dispatch(getUserProfile())
        }
    })
)
export class UpdateAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_code: this.props.userProfile ? this.props.userProfile.post_code : null,
            province: this.props.userProfile.province || (props.provinceList[0] ? props.provinceList[0].value : null),
            address: this.props.userProfile.address || null,
            apartment_number: this.props.userProfile ? this.props.userProfile.apartment_number : null,
            mansion_room_number: this.props.userProfile ? this.props.userProfile.mansion_room_number : null,
            province_katakana: this.props.userProfile ? this.props.userProfile.province_katakana : null,
            address_katakana: this.props.userProfile ? this.props.userProfile.address_katakana : null,
            loading: false,
            spaceBottom: 20
        };
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        viewPage('edit_address', '住所変更')
    }

    keyboardWillShow(e) {
        this.setState({spaceBottom: e.endCoordinates.height - getBottomSpace()});
    }

    keyboardWillHide(e) {
        this.setState({spaceBottom: 20});

    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove()
    }

    generateAddress(text) {
        this.setState({post_code: text});
        if (regexPostCode.test(text)) {
            fetch('https://www.kurumaerabi.com/api/postal.php?v=2&zip1=' + text.substring(0, 3) + '&zip2=' + text.substring(3, 7))
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.address1 && responseJson.address2) {
                        const provinceChoice = this.props.provinceList.find((item) => item.label === responseJson.address1);
                        this.setState({
                            province: provinceChoice.value,
                            address: responseJson.address2,
                            province_katakana: responseJson.address_kana1,
                            address_katakana: responseJson.address_kana2,
                        })
                    }
                }).catch((error) => {
                console.error(error);
            });
        }
    }

    handleUpdate() {
        this.setState({loading: true});
        const {address, apartment_number, mansion_room_number, post_code, province, province_katakana, address_katakana} = this.state;
        const profile = this.props.userProfile;
        const provinceChoice = this.props.provinceList.find((item) => item.value === province);
        identifyUser({
            user_id: profile.id,
            user_prefecture: provinceChoice ? provinceChoice.label : null
        });
        userProfileService.updateUserProfile({
            address, apartment_number, mansion_room_number, post_code, province, province_katakana, address_katakana
        }).then(response => {
            this.props.getUserProfile();
            Alert.alert(
                '更新完了',
                '登録情報を更新しました。',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                        navigationService.goBack()
                    }},
                ],
                {cancelable: false}
            );
        }).catch(error => {
            Alert.alert(
                'エラー',
                'エラー',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                    }},
                ],
                {cancelable: false});
            }
        );
    }

    scrollToCenter(key) {
        if (Platform.OS === 'ios') {
            this[key].measure((fx, fy) => {
                this.myScroll.scrollTo({x: 0, y: fy, animated: true})
            })
        }
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        const notValidate = !this.state.address || !this.state.province || !this.state.post_code || !this.state.apartment_number || !regexPostCode.test(this.state.post_code);
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <ScrollView scrollIndicatorInsets={{right: 1}} style={{height: height, backgroundColor: '#FFF'}} ref={(ref) => this.myScroll = ref}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={null}
                            textStyle={{color: 'white'}}
                        />
                        <View style={{paddingHorizontal: 15, marginVertical: 20}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='郵便番号'
                                keyboardType={'numeric'}
                                value={this.state.post_code}
                                maxLength={7}
                                onChangeText={(val) => this.generateAddress(val)}
                                validationIcon={(this.state.post_code && regexPostCode.test(this.state.post_code)) ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginBottom: 10}}>
                            <Dropdown
                                label={'都道府県'}
                                containerStyle={{ height: 70}}
                                baseColor={color.active}
                                value={this.state.province || (this.props.provinceList[0] && this.props.provinceList[0].value)  || ''}
                                data={this.props.provinceList}
                                onChangeText={(value) => this.setState({province: value})}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginVertical: 15}}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='市区町村'
                                value={this.state.address}
                                onChangeText={(val) => this.setState({address: val})}
                                validationIcon={this.state.address ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginVertical: 15}} ref={view => {
                            this.apartment = view;
                        }}>
                            <UpdateInputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='番地以下'
                                value={this.state.apartment_number}
                                onFocus={() => this.scrollToCenter('apartment')}
                                onChangeText={(val) => this.setState({apartment_number: val})}
                                validationIcon={this.state.apartment_number ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginVertical: 15}} ref={view => {
                            this.mansion = view;
                        }}>
                            <InputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='マンション名・号室（任意）'
                                onFocus={() => this.scrollToCenter('mansion')}
                                value={this.state.mansion_room_number}
                                onChangeText={(val) => this.setState({mansion_room_number: val})}
                            />
                        </View>
                        <View style={{height: this.state.spaceBottom}}/>
                    </ScrollView>
                }
                bottomContent={
                    Platform.OS === 'ios' ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            {
                                 <View style={{padding: 15}}>
                                    <ButtonText disabled={notValidate} title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                                </View>
                            }
                        </InputAccessoryView>
                        :  <View style={{paddingHorizontal: 15, marginBottom: 15}}>
                            <ButtonText disabled={notValidate} title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                        </View>
                }
            />
            </SafeAreaView>
        )
    }
}

