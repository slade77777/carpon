import React, {Component} from 'react'
import {View, Image, Dimensions, Platform, Alert, Linking} from 'react-native'
import {screen} from "../navigation";
import {connect} from "react-redux";
import {images} from '../assets/index'
import {initialize, resetState} from "./FirstLoginPhase/actions/registration";
import {
    changeScreenNumber,
    loadMetadata,
    loadReward,
    notifyMetadataBeforeLoad,
    resetTab
} from "./common/actions/metadata";
import {updateNews} from "./Home/News/action/newsAction";
import {commonService, navigationService} from "./services/index";
import {getCar, getCarPriceEstimate} from "./Home/MyCar/actions/getCar";
import {updateReview} from "./Home/Review/action/ReviewAction";
import {loadMyFollowing} from "./common/actions/followAction";
import lodash from 'lodash';
import {getUserProfile} from "./Account/actions/accountAction";
import {userProfileService} from "./services";
import {BackgroundLogo} from "./common/BackgroundLogo";
import {getInsuranceProfile} from "./Home/Insurance/action/InsuranceAction";
import {getListRange, getListStores} from "./Home/Inspection/actions/inspectionAction";
import {loadScoreHistory} from "./Home/Score/actions/actions";
import {getListGasStations} from "./Home/GasStation/actions/gasAction";
import LottieView from 'lottie-react-native';
import firebase from '@react-native-firebase/app';
import {SvgImage, SvgViews} from "../components/Common/SvgImage";
import {getListOilStores} from "./Home/OilChange/actions/oilAction";
import VersionNumber from 'react-native-version-number';
import semver from 'semver';
import {getCampaign} from "./Home/MyCar/actions/myCarAction";
import {viewPage} from "./Tracker";
import '@react-native-firebase/perf';
import {changePostTab, loadTagHistory, setKeyword, setPost} from "./Home/SNS/action/SNSAction";

const {height} = Dimensions.get('window');

@screen('SplashScreen', {header: null})
@connect(state => ({
    registerUserSuccess: state.registration ? state.registration.userProfile.confirmed : false,
    metadataReady: state.metadata ? state.metadata.ready : false,
    CarId: (state.registration && state.registration.carProfile.profile) ? state.registration.carProfile.profile.id : false,
    hoyu_id: (state.registration && state.registration.carProfile.profile.hoyu_id) ? state.registration.carProfile.profile.hoyu_id : false,
    registration: state.registration,
    following: state.followReducer ? state.followReducer.following : [],
    token: state.registration ? state.registration.credential.token : false,
    inspectionReducer: state.inspectionReducer,
    store: state
}), dispatch => ({
    initialize: () => dispatch(initialize()),
    loadMetadata: () => dispatch(loadMetadata()),
    notifyMetadata: () => dispatch(notifyMetadataBeforeLoad()),
    loadNews: () => dispatch(updateNews()),
    getCarInfo: () => dispatch(getCar()),
    updateReview: () => dispatch(updateReview()),
    loadMyFollowing: () => dispatch(loadMyFollowing()),
    getUserProfile: () => dispatch(getUserProfile()),
    getInsuranceProfile: () => dispatch(getInsuranceProfile()),
    loadScoreHistory: () => dispatch(loadScoreHistory()),
    getListGasStations: (range) => dispatch(getListGasStations(range)),
    removeFilterReview: () => dispatch({
        type: 'REMOVE_FILTER_REVIEW'
    }),
    getListRange: () => dispatch(getListRange()),
    getListStores: (range) => dispatch(getListStores(range)),
    getListOilStores: (range) => dispatch(getListOilStores(range)),
    getCarPriceEstimate: () => dispatch(getCarPriceEstimate()),
    resetState: () => dispatch(resetState()),
    getCampaign: () => dispatch(getCampaign()),
    loadReward: () => dispatch(loadReward()),
    resetTab: () => dispatch(resetTab()),
    changePostTab: (tab) => dispatch(changePostTab(tab)),
    changeScreenNumber: (number) => dispatch(changeScreenNumber(number)),
    setPost: (id) => dispatch(setPost(id)),
    loadTagHistory: () => dispatch(loadTagHistory()),
    setKeyword: (keyword) => dispatch(setKeyword(keyword)),
}))

export class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.trace = null;
    }

    state = {
        dataTimeLoading: 0,
        login: false
    };

    registrationComplete() {
        this.props.getCarPriceEstimate();
        this.props.getListStores('30');
        this.props.getListOilStores('30');
        this.props.notifyMetadata();
        this.props.loadMetadata();
        this.props.loadNews();
        this.props.getCarInfo();
        this.props.updateReview();
        this.props.loadMyFollowing();
        this.props.removeFilterReview();
        this.props.getUserProfile();
        this.props.getInsuranceProfile();
        this.props.getListRange();
        this.props.loadScoreHistory();
        this.props.getCampaign();
        this.props.loadReward();
        this.props.resetTab();
        this.props.changePostTab(0);
        this.props.changeScreenNumber( this.props.CarId ? 0 : 2);
        this.props.setPost(null);
        this.props.loadTagHistory();
        this.props.setKeyword('')
    }

    componentWillMount() {
        this.loadImages(images);
        this.props.resetState()

    }

    componentDidMount() {
        viewPage('splash', 'スプラッシュスクリーン');
        this.checkAppVersion();
        this.trace = firebase.perf().newTrace('splash_screen');
        this.trace.start().then(
            () => {
                console.log('trace start')
            }
        );
        setTimeout(() => {
            this.changeOpacity();
        }, 5300);
        setTimeout(() => {
            this.loginChecker();
        }, 100);
    }

    checkAppVersion() {
        commonService.getAppversion(Platform.OS).then((response) => {
            let newestVersionApp = response.version;
            if (newestVersionApp) {
                if (semver.lt(VersionNumber.appVersion, newestVersionApp)) {
                    Alert.alert(
                        '”Carpon”はアップデートの必要があります',
                        'アプリが正常に動作するために最新バージョンをインストールしてください。',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    Linking.openURL(response.app_url);
                                }
                            }
                        ],
                        {cancelable: true}
                    )
                }
            }
        })
    }

    changeOpacity() {
        let time = 1;
        this.AnimationTime = setInterval(() => {
            this.state.dataTimeLoading < 10 && this.setState({dataTimeLoading: time++});
        }, 100);
    }

    componentWillUnmount() {
        clearInterval(this.AnimationTime);
        this.trace.stop().then(() => {
            console.log('trace end');
        });
    }

    static isDataReady(props) {
        return props.metadataReady &&
            props.registerUserSuccess &&
            lodash.isArray(props.following);
    }

    registrationUnDoneCarInfo() {
        return this.props.initialize();
    }

    registrationChecker() {
        if (this.props.registerUserSuccess) {
            return this.registrationComplete();
        } else {
            return this.registrationUnDoneCarInfo();
        }
    }

    loginChecker() {
        const {token} = this.props;
        if (token) {
            userProfileService.getToken(token)
                .then(response => {
                    response && this.registrationChecker()
                })
                .catch(() => {
                    this.setState({login: true})
                });
        } else {
            this.setState({login: true})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.login) {
            navigationService.clear('Login');
        } else if (!!prevState.dataTimeLoading  && SplashScreen.isDataReady(prevProps)) {
            if (prevProps.registerUserSuccess && !prevProps.CarId) {
                setTimeout(() => {
                    this.props.getListGasStations('5');
                }, 2000);
                navigationService.clear('MainTab', {tabNumber: 2, ...this.props.navigation.state.params});
            } else if (prevProps.registerUserSuccess && prevProps.CarId && !prevProps.hoyu_id) {
                navigationService.clear('UpdateCarPending');
            } else {
                setTimeout(() => {
                    this.props.getListGasStations('5');
                }, 2000);
                navigationService.clear('MainTab', {...this.props.navigation.state.params});
            }
        }
    }

    loadImages(images) {
        return Promise.all(Object.keys(images).map((i) => {
            let img = {
                ...Image.resolveAssetSource(images[i]),
                cache: 'force-cache'
            };
            return Image.prefetch(img.uri);
        }));
    }

    render() {
        return (
            <View>
                <BackgroundLogo/>
                <View style={{
                    zIndex: 1,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: `rgba(75, 159, 165, 1)`,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <LottieView
                        source={require('../assets/Carpon_App-Top_Animation-bg_190925.json')}
                        style={{width: '100%',height: '100%'}}
                        resize={'cover'}
                        loop={false}
                        autoPlay
                        autoSize={true}
                    />
                    <View style={{position: 'absolute', top: height / 2 + 50, left: 0}}>
                        <LottieView
                            source={require('../assets/Carpon_App-Top_Animation-bar_190925.json')}
                            style={{width: '100%', height: '100%'}}
                            resize={'cover'}
                            loop={false}
                            autoPlay
                        />
                    </View>
                </View>
                <View style={{
                    position: 'absolute',
                    zIndex: 4,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <SvgImage source={SvgViews.AppName}/>
                </View>
            </View>
        )
    }
}
