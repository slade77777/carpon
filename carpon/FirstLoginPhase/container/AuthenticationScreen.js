import React, {Component} from 'react';
import {Linking, Platform, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {screen} from "../../../navigation";
import {navigationService} from "../../services/index";
import HeaderCarpon from "../../../components/HeaderCarpon";
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import Config from 'react-native-config';
import InAppBrowser from 'react-native-inappbrowser-reborn'
import jwtDecode from 'jwt-decode';
import JapaneseText from "../../../components/JapaneseText";
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import {viewPage} from "../../Tracker";
import color from "../../color";

GoogleSignin.configure({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
    loginHint: '',
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID
});

@screen('AuthenticationScreen', ({navigation}) => ({
    header: <HeaderCarpon title={'ユーザー登録'} navigation={navigation} onPress={() =>
        navigation.pop(navigation.getParam('pop'))
    }/>
}))
export default class AuthenticationScreen extends Component {

    componentDidMount() {
        if (Platform.OS === 'android') {
            Linking.addEventListener('url', this.handleDeepLink);
        }
        viewPage('select_sns', 'SNS連携');
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleDeepLink);
    }

    handleDeepLink(result) {
        if (result.url && result.url.split('#user=').length > 1) {
            navigationService.navigate('UserProfile', {userYahooInfo: jwtDecode((result.url.split('#user=')[1]))})
        }
    }

    render() {

        let ScreenContent = [
            {
                logo: 'FaceBookLogo',
                title: 'Facebookの情報を使って登録',
                action: () => this.loginFacebook(),
            },
            {
                logo: 'GoogleLogo',
                title: 'Googleの情報を使って登録',
                action: () => this.signInGoogle(),
            },
            {
                logo: 'YahooLogo',
                title: 'Yahoo!の情報を使って登録',
                action: () => this.loginYahoo(),
            },
            {
                emptyObject: true,
                title: 'または'
            },
            {
                logo: 'CarPonLogo',
                title: '新規登録',
                action: () => navigationService.navigate('UserProfile'),
            },

        ];

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <View style={{backgroundColor: '#FFFFFF', height: '100%'}}>
                    <JapaneseText
                        style={{
                            fontSize: 16,
                            lineHeight: 20,
                            color: '#333333',
                            paddingVertical: 30,
                            paddingHorizontal: 15
                        }}
                        value={'ご利用中のSNSと連携すると、ユーザー登録が簡単になります。'}/>

                    {
                        ScreenContent.map((element, index) => {
                            if (element.emptyObject) {
                                return <View style={{
                                    height: 62,
                                    borderTopWidth: 1,
                                    alignItems: 'center',
                                    borderColor: '#E5E5E5',
                                    justifyContent: 'center'
                                }} key={index}>
                                    <Text style={{fontSize: 18, color: '#333'}}>{element.title}</Text>
                                </View>
                            } else {
                                return <TouchableOpacity
                                    key={index}
                                    activeOpacity={1}
                                    onPress={element.action}
                                    style={{
                                        height: 95,
                                        borderTopWidth: 1,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        borderColor: '#E5E5E5',
                                        justifyContent: 'space-between'
                                    }}>
                                    <View style={{paddingLeft: 15, flexDirection: 'row', alignItems: 'center'}}>
                                        <SvgImage source={() => SvgViews[element.logo]()}/>
                                        <Text
                                            style={{fontSize: 18, fontWeight: 'bold', color: '#333', paddingLeft: 15}}>
                                            {element.title}
                                        </Text>
                                    </View>
                                    <View style={{paddingRight: 15}}>
                                        <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                                    </View>
                                </TouchableOpacity>
                            }

                        })
                    }
                    <View style={{borderTopColor: '#E5E5E5', borderTopWidth: 1}}/>
                </View>
            </SafeAreaView>
        );
    }

    async loginYahoo() {
        const url = Config.YAHOO_LINK + '&state=' + Platform.OS;
        try {
            if (await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.openAuth(url, 'callback', {
                    // iOS Properties
                    dismissButtonStyle: 'cancel',
                    preferredBarTintColor: 'gray',
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: '#6200EE',
                    secondaryToolbarColor: 'black',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_right',
                        endExit: 'slide_out_left',
                    },
                    headers: {
                        'my-custom-header': 'my custom header value'
                    },
                });
                if (result && result.url) {
                    if (result.url.split('#user=').length > 1) {
                        navigationService.navigate('UserProfile', {userYahooInfo: jwtDecode((result.url.split('#user=')[1]))})
                    } else {
                        alert('エラー');
                    }
                }
            } else {
                Linking.openURL(url)
            }
        } catch (error) {
            alert(error.message);
        }
    }

    loginFacebook() {
        if (Platform.OS === "android") {
            LoginManager.setLoginBehavior("web_only");
        }
        LoginManager.logOut();
        LoginManager.logInWithPermissions(["public_profile", "email"]).then(
            function (result) {
                if (result.isCancelled) {
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            fetch('https://graph.facebook.com/v4.0/me?locale=ja_JP&fields=' +
                                'birthday,first_name,last_name,gender,short_name,email' +
                                '&access_token=' + data.accessToken.toString())
                                .then((response) => response.json())
                                .then((json) => {
                                    navigationService.navigate('UserProfile', {userFBInfo: json})
                                })
                                .catch(() => {
                                    alert(JSON.stringify('fail'))
                                })
                        }
                    )
                }
            },
        );
    }

    signInGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            navigationService.navigate('UserProfile', {userGoogleInfo: userInfo.user})
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };
}
