import React, {Component} from 'react';
import {
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Linking,
    PermissionsAndroid,
    Platform
} from 'react-native';
import {screen} from "../../../navigation";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {connect} from 'react-redux';
import color from "../../color";
import {updateAvatar} from '../actions/accountAction';
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import Spinner from 'react-native-loading-spinner-overlay';
import {navigationService, userProfileService} from "./../../../carpon/services";
import {$$_CARPON_CLEAR} from "../../../carpon/services/Storage";
import {viewPage} from "../../Tracker";
import {submitAppFlyer} from "../../../App";

@screen('ConfirmDelete', {header: <HeaderOnPress title={'退会について'}/>})
@connect(state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }),
    dispatch => ({
        updateAvatar: (data) => {
            dispatch(updateAvatar(data))
        },
        loadListQuestion: (idSurvey) => dispatch({
            type: 'LOAD_LIST_QUESTION',
            idSurvey
        }),
        clear: () => dispatch({
            type: $$_CARPON_CLEAR
        })
    })
)
export class ConfirmDelete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        viewPage('delete_account', '退会')
    }

    deleteUser() {
        Alert.alert(
            '本当に退会しますか？',
            '消去された情報は復元出来ません。',
            [
                {
                    text: 'キャンセル'
                },
                {
                    text: '退会する',
                    onPress: () => {
                        navigationService.clear('Login');
                        userProfileService.removeUser().then(() => {
                            const user = this.props.userProfile;
                            if (user && user.id) {
                                const id = user.id;
                                submitAppFlyer('UNSUBSCRIBE',
                                    {
                                        user_id: id,
                                        email: user.email,
                                    },
                                    id
                                )
                            }
                            this.props.clear();
                        }).catch((error) => {
                            console.log(error);
                        })}
                },
            ],
            {cancelable: true}
        );
    }

    render() {
        const userProfile = this.props.userProfile;
        let rank = '';
        if (userProfile.rank === 1) {
            rank = 'レギュラーランク'
        }
        if (userProfile.rank === 2) {
            rank = 'ゴールドランク'
        }
        if (userProfile.rank === 3) {
            rank = 'ランクアップミッション'
        }
        const accountComponent = [
            {
                label: 'カーライフスコア',
                value: userProfile.total_score,
                unit: '点'
            },
            {
                label: '特典',
                value: rank,
                unit: ''
            },
            {
                label: 'クリップしたニュース',
                value: userProfile.total_clip ? userProfile.total_clip.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0,
                unit: '件'
            },
            {
                label: 'フォローしたユーザ',
                value: userProfile.total_following ? userProfile.total_following.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0,
                unit: 'ユーザ'
            },
            {
                label: 'フォローされたユーザ',
                value: userProfile.total_follower ? userProfile.total_follower.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0,
                unit: 'ユーザ'
            },
        ];
        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFFFFF'}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={null}
                        textStyle={{color: 'white'}}
                    />
                    <View style={{marginTop: 15}}>
                        <Text style={{margin: 15, color: '#666666', fontSize: 17, lineHeight: 24}}>
                            退会すると以下情報が完全に消去されます。復元はできません。
                        </Text>
                    </View>
                    <View style={{
                        padding: 15,
                        backgroundColor: '#F8F8F8',
                        borderBottomWidth: 2,
                        borderBottomColor: color.active
                    }}>
                        <Text style={{fontWeight: 'bold'}}>登録されているマイカー情報</Text>
                    </View>
                    {
                        accountComponent.map(function (item, index) {
                            return (
                                <View style={{
                                        minHeight: 60,
                                        justifyContent: 'center',
                                        borderBottomWidth: 1,
                                        borderTopWidth: index === 0 ? 1 : 0,
                                        borderColor: '#E5E3E3'
                                    }}
                                    key={index}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15}}>
                                        <View style={{justifyContent: 'center'}}>
                                            <Text style={{
                                                fontSize: 14,
                                                color: 'black',
                                                fontWeight: 'bold',
                                            }}>
                                                {item.label}
                                            </Text>
                                        </View>
                                        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                                            <Text style={{textAlign: 'right', color: color.active, fontSize: 18}}>
                                                {item.value}
                                            </Text>
                                            <Text style={{textAlign: 'right', color: '#666666', fontSize: 14, marginTop: 4}}>
                                                {item.unit}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <Text style={{margin: 15, color: '#666666', fontSize: 17, lineHeight: 24}}>
                        ご理解の上、退会を希望される場合は以下よりお願いします。
                    </Text>
                    <Text style={{margin: 15, color: '#F37B7D', fontSize: 17, lineHeight: 24}}>
                        ※退会後90日間は、同じ電話番号でご登録いただけません。ご了承ください。
                    </Text>
                    <View style={{ margin: 15}}>
                        <ButtonCarpon disabled={this.state.disabled}
                                      style={{backgroundColor: '#F37B7D'}}
                                      onPress={() => this.deleteUser()}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 14,
                                color: '#FFFFFF'
                            }}>退会する</Text>
                        </ButtonCarpon>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
