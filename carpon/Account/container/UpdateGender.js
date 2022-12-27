import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, StyleSheet, View, Alert, Platform, TouchableOpacity} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import {navigationService, userProfileService} from "../../../carpon/services";
import {getUserProfile} from "../actions/accountAction";
import Spinner from 'react-native-loading-spinner-overlay';
import color from "../../color";
import {identifyUser, viewPage} from "../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('UpdateGender', {header: <HeaderOnPress title={'性別'}/>})
@connect(
    state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }),
    dispatch => ({
        getUserProfile: () => {
            dispatch(getUserProfile())
        }
    })
)
export class UpdateGender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: this.props.userProfile ? this.props.userProfile.gender : null,
            loading: false
        };
    }

    componentDidMount() {
        viewPage('edit_gender', '性別変更');
    }

    handleUpdate() {
        this.setState({loading: true});
        const {gender} = this.state;
        const profile = this.props.userProfile;
        identifyUser({
            user_id: profile.id,
            user_is_male: gender === 'm'
        });
        userProfileService.updateUserProfile({gender}).then(response => {
            this.props.getUserProfile();
            Alert.alert(
                '更新完了',
                '登録情報を更新しました。',
                [
                    {text: 'OK', onPress: () => navigationService.goBack()},
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
                {cancelable: false}
            );
        })
    }

    render() {
        return (
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <View style={{height: '100%', backgroundColor: 'white'}}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={null}
                            textStyle={{color: 'white'}}
                        />
                        <View style={Styles.inline}>
                            <View style={{width: '50%', alignItems: 'flex-start', paddingLeft: 5}}>
                                <Text>男性</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ gender: 'm'})} style={{justifyContent: 'center', alignItems : 'flex-end', width : '50%', paddingRight : 15}}>
                                <View style={Styles.radio}>
                                    {
                                        this.state.gender === 'm' && <View style={Styles.checked}/>
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{...Styles.inline,  borderBottomWidth:1, borderColor: '#CDD6DD', paddingBottom: 15}}>
                            <View style={{width: '50%', alignItems: 'flex-start', paddingLeft: 5}}>
                                <Text>女性</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ gender: 'f'})}
                                              style={{justifyContent: 'center', alignItems : 'flex-end', width : '50%', paddingRight : 15}}>
                                <View style={Styles.radio}>
                                    {
                                        this.state.gender === 'f' && <View style={Styles.checked}/>
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                bottomContent={
                    <View style={{paddingHorizontal: 15, marginBottom: isIphoneX() ? getBottomSpace() + 20 : 15}}>
                        <ButtonText disabled={!this.state.gender} title={'設定を保存する'} onPress={() => this.handleUpdate()}/>
                    </View>
                }
            />
        )
    }
}

const Styles = StyleSheet.create({
    radio: {
        width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#CDD6DD', alignItems: 'center', justifyContent: 'center'
    },
    inline: {
        paddingHorizontal: 15, marginTop: 20, flexDirection: 'row', borderTopWidth: 1, borderColor: '#CDD6DD', paddingTop: 15, alignItems: 'center'
    },
    checked: {
        width: 15, height: 15, borderRadius: 10, borderWidth: 1, borderColor: color.active, backgroundColor: color.active
    }
});
