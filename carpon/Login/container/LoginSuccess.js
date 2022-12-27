import React, {Component} from 'react';
import {ActivityIndicator, ImageBackground, Text, View} from 'react-native';
import color from "../../../carpon/color";
import {images} from "../../../assets";
import {screen} from '../../../navigation';
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import {connect} from 'react-redux'
import {loadCarForUserLogin, loadingData, loadUser} from "../../FirstLoginPhase/actions/registration";
import {getCar, getCarPriceEstimate} from "../../Home/MyCar/actions/getCar";
import {changeScreenNumber, loadMetadata, loadReward, notifyMetadataBeforeLoad} from "../../common/actions/metadata";
import {updateNews} from "../../Home/News/action/newsAction";
import {updateReview} from "../../Home/Review/action/ReviewAction";
import {loadMyFollowing} from "../../common/actions/followAction";
import {getUserProfile} from "../../Account/actions/accountAction";
import {getInsuranceProfile} from "../../Home/Insurance/action/InsuranceAction";
import {getListRange, getListStores} from "../../Home/Inspection/actions/inspectionAction";
import {loadScoreHistory} from "../../Home/Score/actions/actions";
import {getListGasStations} from "../../Home/GasStation/actions/gasAction";
import {getListOilStores} from "../../Home/OilChange/actions/oilAction";
import {getCampaign} from "../../Home/MyCar/actions/myCarAction";
import {loadTagHistory, setKeyword} from "../../Home/SNS/action/SNSAction";

@screen('LoginSuccess', {header: null})
@connect((state) => ({
        loadedUser: state.registration.userProfile.confirmed,
        CarId: (state.registration && state.registration.carProfile.profile) ? state.registration.carProfile.profile.id : false,
        getCarStatus: state.getCar.getCar,
        store: state
    }),
    (dispatch) => ({
        loadingData: () => dispatch(loadingData()),
        loadUser: () => dispatch(loadUser()),
        getCarInfo: () => dispatch(getCar()),
        loadMetadata: () => dispatch(loadMetadata()),
        notifyMetadata: () => dispatch(notifyMetadataBeforeLoad()),
        loadNews: () => dispatch(updateNews()),
        updateReview: () => dispatch(updateReview()),
        loadMyFollowing: () => dispatch(loadMyFollowing()),
        getUserProfile: () => dispatch(getUserProfile()),
        getInsuranceProfile: () => dispatch(getInsuranceProfile()),
        removeFilterReview: () => dispatch({
            type: 'REMOVE_FILTER_REVIEW'
        }),
        loadCarForUserLogin: () => dispatch(loadCarForUserLogin()),
        getListRange: () => dispatch(getListRange()),
        getListStores: (range) => dispatch(getListStores(range)),
        getListOilStores: (range) => dispatch(getListOilStores(range)),
        getListGasStations: (range) => dispatch(getListGasStations(range)),
        loadScoreHistory: () => dispatch(loadScoreHistory()),
        getCarPriceEstimate: () => dispatch(getCarPriceEstimate()),
        loadReward: () => dispatch(loadReward()),
        getCampaign: () => dispatch(getCampaign()),
        loadTagHistory: () => dispatch(loadTagHistory()),
        changeScreenNumber: (number) => dispatch(changeScreenNumber(number)),
    }))
export class LoginSuccess extends Component {

    state = {
        opacity: 0,
        firstTime: true
    };

    componentDidMount() {
        this.props.getCarPriceEstimate();
        this.props.getListStores('30');
        this.props.getListOilStores('30');
        this.props.getCarInfo();
        this.props.notifyMetadata();
        this.props.loadMetadata();
        this.props.loadNews();
        this.props.updateReview();
        this.props.loadMyFollowing();
        this.props.removeFilterReview();
        this.props.getUserProfile();
        this.props.getInsuranceProfile();
        this.changeOpacity();
        this.props.getListRange();
        this.props.loadScoreHistory();
        this.props.loadReward();
        this.props.getCampaign();
        this.props.loadTagHistory();
        this.props.loadUser();
        setTimeout(() => {
            this.props.getListGasStations('5');
        }, 10000);
    }

    changeOpacity() {
        let time = 1;
        setTimeout(() => {
            setInterval(() => {
                this.state.opacity < 120 && this.setState({
                    opacity: time++
                })
            }, 5);
        }, 500)

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.loadedUser && (prevState.opacity > 118) && this.state.firstTime) {
            this.setState({firstTime: false});
            this.props.changeScreenNumber(this.props.CarId ? 0 : 2);
            this.handleNavigate()
        }

    }

    handleNavigate() {
        this.props.getCarStatus && this.props.loadCarForUserLogin();
        setTimeout(() => {
            this.props.loadingData();
        }, 600)
    }

    handleAnimationLoading() {
        const opacity = this.state.opacity / 1000;
        return 1 - opacity
    }

    render() {
        const {opacity} = this.state;
        const logoSize = {height: 20, width: 160};
        const logoBottomSize = {size: {h: 10, w: 150}};
        return (
            <View>
                <ImageBackground source={images.carpon} style={{width: '100%', height: '105%'}}/>
                <View style={{
                    zIndex: 50,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: `rgba(75,159,165,${this.handleAnimationLoading()})`,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {(opacity < 119) &&
                    <View style={{justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size={'large'}
                                                                                                      color={color.loadingColor}/></View>}
                    {
                        (opacity > 119) &&
                        <View style={{
                            flexDirection: 'column',
                            height: '100%',
                            marginRight: 15,
                            marginLeft: 15,
                            justifyContent: 'space-between'
                        }}>
                            <View/>
                            <Text style={{
                                fontSize: 23,
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center'
                            }}>クルマの維持費を見直そう。</Text>
                            <View style={{paddingBottom: 80}}>
                                <SvgImage source={() => SvgViews.CarponLogoWhite(logoSize)} width="180" height="30"
                                          style={{flex: 0}}/>
                                <SvgImage source={() => SvgViews.SplashBottom(logoBottomSize)}
                                          style={{flex: 0, marginTop: 5}}/>
                            </View>
                        </View>
                    }
                </View>
            </View>

        )
    }
}
