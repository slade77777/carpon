import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {View, Animated, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import {updateNews} from "../../Home/News/action/newsAction";
import {loadCar, loadingData, loadUser} from "../actions/registration";
import {updateReview} from "../../Home/Review/action/ReviewAction";
import {getCar, getCarPriceEstimate} from "../../Home/MyCar/actions/getCar";
import {changeScreenNumber, loadMetadata, loadReward, notifyMetadataBeforeLoad} from "../../common/actions/metadata";
import {getUserProfile} from "../../Account/actions/accountAction";
import {getInsuranceProfile} from "../../Home/Insurance/action/InsuranceAction";
import {Logo} from "../../../components/Common/Logo";
import {BackgroundLogo} from "../../common/BackgroundLogo";
import {getListRange, getListStores} from "../../Home/Inspection/actions/inspectionAction";
import {loadMyFollowing} from "../../common/actions/followAction";
import {loadScoreHistory} from "../../Home/Score/actions/actions";
import {getListGasStations} from "../../Home/GasStation/actions/gasAction";
import {getListOilStores} from "../../Home/OilChange/actions/oilAction";
import {getCampaign} from "../../Home/MyCar/actions/myCarAction";
import {identifyUser, viewPage} from "../../Tracker";
import {loadTagHistory} from "../../Home/SNS/action/SNSAction";

@screen('LoadingMetaData', {header: null})
@connect(state => ({
        newsReady: state.news.update,
        profileReady: state.registration.userProfile.confirmed,
        profile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        provinceList: state.metadata.profileOptions ? state.metadata.profileOptions.driving_area : [],
        CarId: (state.registration && state.registration.carProfile.profile) ? state.registration.carProfile.profile.id : false,

    }), (dispatch) => ({
        loadingData: () => dispatch(loadingData()),
        loadNews: () => dispatch(updateNews()),
        updateReview: () => dispatch(updateReview()),
        loadMetadata: () => dispatch(loadMetadata()),
        loadUser: ()=> dispatch(loadUser()),
        getCarInfo: () => dispatch(getCar()),
        notifyMetadata: () => dispatch(notifyMetadataBeforeLoad()),
        getUserProfile: () => dispatch(getUserProfile()),
        getInsuranceProfile: () => dispatch(getInsuranceProfile()),
        getListRange: ()=> dispatch(getListRange()),
        loadMyFollowing: () => dispatch(loadMyFollowing()),
        getListStores: (range) => dispatch(getListStores(range)),
        getListOilStores: (range) => dispatch(getListOilStores(range)),
        getListGasStations: (range) => dispatch(getListGasStations(range)),
        loadScoreHistory: ()=> dispatch(loadScoreHistory()),
        getCampaign: ()=> dispatch(getCampaign()),
        getCarPriceEstimate: () => dispatch(getCarPriceEstimate()),
        changeScreenNumber: (number) => dispatch(changeScreenNumber(number)),
        loadReward: () => dispatch(loadReward()),
        loadTagHistory: () => dispatch(loadTagHistory()),
        removeFilterReview : () => dispatch({
                type : 'REMOVE_FILTER_REVIEW'
            })
        })
)
export class LoadingMetaData extends Component {

    constructor() {
        super();
        this.state = ({
            isShowed: true,
            isPassed: false
        });
        this._opacityAnimationValue = new Animated.Value(1);
    }

    componentDidMount() {
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
        this.props.getInsuranceProfile();
        this.props.getListRange();
        this.props.getUserProfile();
        this.props.loadScoreHistory();
        this.props.loadReward();
        this.props.getCampaign();
        this.props.loadTagHistory();
        this.props.changeScreenNumber( this.props.CarId ? 0 : 2);

        setTimeout(() => {
            this.props.getListGasStations('5');
        }, 10000);
        const profile = this.props.profile;
        setTimeout(() => {
            let provinceChoice = null;
            if (this.props.provinceList) {
                provinceChoice = this.props.provinceList.find((item) => item.value === profile.province);
            }
            identifyUser({
                user_id: profile.id,
                user_is_male: profile.gender === 'm',
                user_birthday_date: (new Date(profile.birthday).getTime())/1000,
                user_birthday_month: (new Date(profile.birthday)).getMonth() + 1,
                user_prefecture: provinceChoice ? provinceChoice.label : null
            });
            viewPage('load_metadata', 'メタデータローディング');
        }, 5000);
    }

    componentWillReceiveProps(props) {
        if (props.newsReady &&
            props.profileReady) {
            if (!this.state.isPassed) {
                this.setState({isPassed: true});
                setTimeout(() => {
                    this.props.loadingData();
                }, 3000);
            }
        }
    }

    render() {
        return (
                <Animated.View style={{
                    opacity: this._opacityAnimationValue,
                }}>
                    <View style={styles.view}>
                        <BackgroundLogo/>
                        <View style={styles.logo}>
                            <Logo/>
                        </View>
                    </View>
                </Animated.View>
        )
    }
}

const styles = StyleSheet.create(
    {
        logo: {
            position : 'absolute',
            width : '100%',
            height : '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        view: {
            backgroundColor: '#4B9FA5',
            position: 'relative',
            alignItems: 'center'
        },
        logoBottom: {
            position: 'absolute',
            top: '82%',
            backgroundColor: 'transparent',
            alignItems: 'center'
        }
    }
);
