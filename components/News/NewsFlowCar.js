import React, {Component} from 'react';
import {ActivityIndicator, FlatList, View, Text, RefreshControl} from "react-native";
import AfterNews from "../Common/AfterNews";
import {navigationService, newsService} from "../../carpon/services";
import {connect} from "react-redux";
import {SvgImage, SvgViews} from "../Common/SvgImage";


@connect(state => ({
    newsReducer: state.news,
    userProfile: state.registration.userProfile
}))
export default class NewsFlowCar extends Component {

    state = {
        page: 1,
        listNews: [],
        has_next: false,
        loadNewsOtherUser: false,
        has_next_other_user: false,
        isLoading: false,
        updated: false
    };

    componentDidMount() {
        this.loadNews(this.props.newsParameters, 1)
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.newsReducer.updateClip) {
            this.onRefresh()
        }
    }

    onPress(news_id) {
        navigationService.navigate('NewsDetailScreen', {news_id: news_id})
    }

    onRefresh() {
        this.loadNews(this.props.newsParameters, 1)
    }

    handleLoadMore() {
        if (this.state.has_next) {
            const page = this.state.page + 1;
            this.loadNews(this.props.newsParameters, page)
        }
        if (this.state.loadNewsOtherUser && this.state.has_next_other_user) {
            const page = this.state.page + 1;
            this.handleLoadNewsOtherUser(page)
        }
    }

    handleLoadNewsOtherUser(page) {
        const {userProfile} = this.props;
        newsService.getNewsOtherUser({
            id: userProfile.myProfile.id,
            page: page
        }).then(result => {
            this.setState({
                page: page,
                listNews: this.state.listNews.concat(result.data),
                has_next_other_user: result.has_next,
                isLoading: false,
                updated: true
            });
        }).catch(() => {
            this.setState({
                isLoading: false,
                updated: false
            })
        })
        ;
    }

    renderNews = (updated, {item, index}) => (
        <View renderToHardwareTextureAndroid={true}>
            <AfterNews updated={updated} news={item} key={index} onPress={this.onPress.bind(this, item.id)}/>
        </View>
    );

    loadNews(props, page) {
        // if (props === 1) {
        //     this.setState({isLoading: true, listNews: []});
        // } else {
        //     this.setState({isLoading: true});
        // }

        newsService.getAllNews({
            type: props.type,
            maker_code: props['maker_code'],
            car_name_code: props['car_name_code'],
            page: page,
            profile_id: props.profile_id ? props.profile_id : props.myProfile
        }).then(result => {
            this.setState({
                page: page,
                listNews: page === 1 ? result.data : this.state.listNews.concat(result.data),
                has_next: result.has_next,
                isLoading: false,
                updated: true
            });
            if (props.type === 'my') {
                if(result.data.length === 10 && !result.has_next){
                    this.handleLoadNewsOtherUser(1);
                    this.setState({page :1})
                } else  if(result.data.length < 10){
                    this.handleLoadNewsOtherUser(1);
                    this.setState({page :1})
                }
            }
        }).finally(() => {
            this.setState({
                isLoading: false,
                updated: false
            })
        })
    }

    renderFooter(ready) {
        if (!ready) {
            return null;
        }
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" color="#CED0CE"/>
            </View>
        );
    };

    render() {
        if (this.state.listNews.length > 0) {
            return (
                <View style={{height: '100%'}}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isLoading}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                        // refreshing={this.state.isLoading}
                        // onRefresh={this.onRefresh.bind(this)}
                        extraData={this.state.updated}
                        data={this.state.listNews}
                        renderItem={this.renderNews.bind(this, this.state.updated)}
                        onEndReached={this.handleLoadMore.bind(this)}
                        ListFooterComponent={this.renderFooter.bind(this, this.state.has_next)}
                        onEndReachedThreshold={1}
                        keyExtractor = { (item, index) => index.toString() }
                    />
                </View>
            )
        } else {
            return (
                <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <SvgImage source={SvgViews.MediumIconCar}/>
                    <Text style={{ marginTop: 15, fontSize: 17, color: '#999999', fontWeight: 'bold'}}>配信されたニュースはありません</Text>
                </View>
            )
        }

    }

}
