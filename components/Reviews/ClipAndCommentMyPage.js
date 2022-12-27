import React, {Component} from 'react';
import {View, TouchableOpacity, Dimensions, FlatList, Text} from "react-native";
import ButtonText from "../ButtonText";
import {navigationService, newsService} from "../../carpon/services";
import LabelFurtherDisplay from "./LabelFurtherDisplay";
import AfterNews from "../Common/AfterNews";
import store from "../../carpon/store";
import {connect} from "react-redux";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {changePostTab} from "../../carpon/Home/SNS/action/SNSAction";
import {SNSNavTab} from "../../carpon/Home/SNS/SNSContext";
import {changeScreenNumber} from "../../carpon/common/actions/metadata";
const {width, height} = Dimensions.get('window');
@connect((state) => ({
    me: state.registration.userProfile.myProfile,
}),
    dispatch => ({
        changePostTab: (tab) => dispatch(changePostTab(tab)),
        changeScreenNumber: (number) => dispatch(changeScreenNumber(number)),
    })
)
@SNSNavTab()
export default class ClipAndCommentMyPageYouView extends Component {

    state = {
        page: 1,
        showMoreTimes: 1,
        has_next: false,
        imgSkeleton: [1, 2, 3, 4],
        loading : true,
        myNews: []
    };

    actionNavigate(news_id) {
        navigationService.navigate('NewsDetailScreen', {
            news_id: news_id
        })
    }

    _renderItem = ({item, index}) => {
        return (
            <AfterNews mypage={true} news={item} key={index} onPress={this.actionNavigate.bind(this, item.id)}/>
        )
    };

    handleNavigate() {
        const [{}, {focusTab}] = this.props.tabNavigator;
        store.dispatch({type: 'SIDE_MENU_STATE', state: false});
        focusTab(3);
        this.props.changeScreenNumber(2);
        return navigationService.popToTop()
    }

    componentDidMount() {
        this.handleLoadNews(1)
    }

    handleLoadNews(page) {
        newsService.getAllNews({type: this.props.type, profile_id: this.props.profile.id, page: page}).then(response => {
            this.setState({
                myNews: page > 1 ? this.state.myNews.concat(response.data) : response.data,
                has_next: response.has_next,
                loading : false
            })
        });
    }

    handleShowMore() {
        let hasNext = this.state.has_next;
        this.setState({
            showMoreTimes: this.state.showMoreTimes + 1
        });
        if (hasNext) {
            this.handleLoadNews(this.state.page + 1);
        }
    }

    handleShowButtonShowMore() {
        let showMoreTimes = this.state.showMoreTimes;
        let numberOfNews = 5 * showMoreTimes;
        return (this.state.myNews.length > 5) && (numberOfNews < this.state.myNews.length)
    }

    handleShowNews() {
        let showMoreTimes = this.state.showMoreTimes;
        let numberOfNews = 5 * showMoreTimes;
        return this.state.myNews.slice(0, numberOfNews)
    }

    render() {
        return (
            <View>
                {
                    this.state.loading &&
                        <View>
                            {
                                this.state.imgSkeleton.map((item, index) => {
                                    return <SkeletonPlaceholder key={index} backgroundColor={'#EAEAEA'}>
                                        <SkeletonPlaceholder.Item marginTop={20} flexDirection="row" paddingHorizontal={15} justifyContent={"space-between"}>
                                            <SkeletonPlaceholder.Item flexDirection={"column"}>
                                                <SkeletonPlaceholder.Item width={250} height={30}/>
                                                <SkeletonPlaceholder.Item marginTop={10} flexDirection={"row"} justifyContent={"space-between"}>
                                                    <SkeletonPlaceholder.Item width={60} height={20}></SkeletonPlaceholder.Item>
                                                    <SkeletonPlaceholder.Item width={60} height={20}></SkeletonPlaceholder.Item>

                                                </SkeletonPlaceholder.Item>

                                            </SkeletonPlaceholder.Item>
                                            <SkeletonPlaceholder.Item marginLeft={10} width={120} height={60}>

                                            </SkeletonPlaceholder.Item>


                                        </SkeletonPlaceholder.Item>
                                        <SkeletonPlaceholder.Item marginTop={10} paddingHorizontal={15} flexDirection={"row"}>
                                            <SkeletonPlaceholder.Item width={width - 30} height={150}/>
                                        </SkeletonPlaceholder.Item>
                                    </SkeletonPlaceholder>
                                })
                            }
                        </View>

                }
                <FlatList
                    data={this.handleShowNews()}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.8}
                />
                {
                    this.handleShowButtonShowMore() ?
                        <LabelFurtherDisplay
                            onPress={() => this.handleShowMore()}
                        />
                        :
                        <View/>
                }
                {
                    this.props.profile.id === this.props.me.id &&
                    <View style={{paddingHorizontal: 15}}>
                        <View style={{marginVertical: 20}}>
                            <ButtonText title={'ニュースを見る'}
                                        onPress={() => this.handleNavigate()}
                            />
                        </View>
                    </View>
                }

            </View>
        );
    }
}
