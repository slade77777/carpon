import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, TouchableOpacity, StyleSheet, ScrollView, View, Modal, Platform, Dimensions, SafeAreaView, Image} from 'react-native';
import {HeaderOnPress} from '../../../../components';
import {connect} from 'react-redux';
import stylesCommon from "../../../../style";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import ImageViewer from 'react-native-image-zoom-viewer';
import Era from "../../../common/Era";
import color from "../../../color";
import {getUserProfile} from "../../../Account/actions/accountAction";
import {viewPage} from "../../../Tracker";
import {isIphoneX} from "react-native-iphone-x-helper";

const {height, width} = Dimensions.get('window');

@screen('License', {
    header: <HeaderOnPress title={'運転免許証'} rightContent={{
        icon: 'IconEdit',
        color: '#FFF',
        nextScreen: 'UpdateLicense'
    }}/>
})
@connect(state => ({
    userProfile: state.registration.userProfile.myProfile,
    colorList: state.metadata.profileOptions ? state.metadata.profileOptions.color_of_driver_license : [],
}), (dispatch) => ({
    loadListQuestion: (idSurvey) => dispatch({
        type: 'LOAD_LIST_QUESTION',
        idSurvey
    }),
    getUserProfile: () => dispatch(getUserProfile()),
}))
export class License extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageDetailOpen: false,
            imageDetail: [],
            imageFrontHeight: 0,
            imageBackHeight: 0
        }
    }

    componentDidMount() {
        viewPage('driver_license', '運転免許証');
        this.props.getUserProfile();
        // this.updateImageSize(this.props.userProfile);
    }

    componentWillReceiveProps(newProps) {
        const userProfile = this.props.userProfile;
        if (newProps.userProfile.license_image_front_signed_url !== userProfile.license_image_front_signed_url
        || newProps.userProfile.license_image_back_signed_url !== userProfile.license_image_back_signed_url) {
            this.updateImageSize(newProps.userProfile);
        }
    }

    updateImageSize(userProfile) {
        userProfile.license_image_front_signed_url && Image.getSize(userProfile.license_image_front_signed_url, (actualWidth, actualHeight) => {
            this.setState({imageFrontHeight : (width - 30) * actualHeight/actualWidth})
        });
        userProfile.license_image_back_signed_url && Image.getSize(userProfile.license_image_back_signed_url, (actualWidth, actualHeight) => {
            this.setState({imageBackHeight : (width - 30) * actualHeight/actualWidth})
        });
    }

    componentWillUnmount() {
        let updateScore = this.props.navigation.getParam('updateScore');
        if (updateScore) {
            let survey = this.props.navigation.getParam('survey');
            this.props.loadListQuestion(survey.id)
        }
    }

    render() {
        const userProfile = this.props.userProfile;
        const colorChoice = this.props.colorList.find((item) => item.value === userProfile.color_of_driver_license);
        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={styles.body}>
                    <View style={{flexDirection: 'row', marginTop: 15, borderTopColor: '#E5E5E5', borderTopWidth: 1}}>
                        <View style={styles.width30}>
                            <Text style={styles.title}>種類（色）</Text>
                        </View>
                        <View style={styles.width70}>
                            <Text style={styles.value}>{colorChoice && colorChoice.label}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', backgroundColor: '#F6FAFB'}}>
                        <View style={styles.width30}>
                            <Text style={styles.title}>有効期限</Text>
                        </View>
                        <View style={styles.width70}>
                            <Text style={[styles.value, {color: '#008833'}]}>
                                {
                                    userProfile.license_expiration_date &&
                                    <Era date={userProfile.license_expiration_date}/>
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', borderColor: '#E5E5E5'}}>
                        <View style={styles.width30}>
                            <Text style={styles.title}>免許証番号</Text>
                        </View>
                        <View style={styles.width70}>
                            <Text style={styles.value}>{userProfile.license_number}</Text>
                        </View>
                    </View>
                    <View style={{margin: 15}}>
                        <Text style={{color: '#6F7579', fontSize: 13, lineHeight: 18}}>
                            ※ご利用状況に基づいたメンテナンス情報をお届けします。定期的な更新をお願いします。
                        </Text>
                    </View>
                    <View style={{paddingTop: 20}}>
                        <View style={{ marginHorizontal: 15}}>
                            {
                                userProfile.license_image_front_signed_url ?
                                    <View>
                                        <Text style={{ color: color.active, fontSize: 12, fontWeight: 'bold', marginBottom: 10}}>運転免許証 (表)</Text>
                                        <TouchableOpacity onPress={() => this.setState({
                                            imageDetailOpen: true,
                                            imageDetail: [{url: userProfile.license_image_front_signed_url}]
                                        })}>
                                            <Image
                                                style={{height: this.state.imageFrontHeight, width: width - 30}}
                                                source={{uri: userProfile.license_image_front_signed_url}}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View/>
                            }

                        </View>
                    </View>
                    <View style={{paddingTop: 20}}>
                        <View style={{paddingTop: 5, marginHorizontal: 15}}>
                            {
                                userProfile.license_image_back_signed_url ?
                                    <View>
                                        <Text style={{ color: color.active, fontSize: 12, fontWeight: 'bold', marginBottom: 10}}>運転免許証 (裏)</Text>
                                        <TouchableOpacity onPress={() => this.setState({
                                            imageDetailOpen: true,
                                            imageDetail: [{url: userProfile.license_image_back_signed_url}]
                                        })}>
                                            <Image
                                                style={{height: this.state.imageBackHeight, width: width - 30}}
                                                source={{uri: userProfile.license_image_back_signed_url}}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    : <View/>
                            }
                        </View>
                    </View>
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
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        height: height,
        textAlign: 'center',
    },
    mid: {
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        marginTop: 30,
        borderBottomWidth: 0,
        height: 230,
        marginHorizontal: 20,
        backgroundColor: '#CCCCCC'
    },
    width30: {
        width: '40%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        height: 45,
        justifyContent: 'center',
    },
    width70: {
        width: '60%',
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
    value: {
        paddingRight: 15,
        textAlign: 'right'
    },
});

