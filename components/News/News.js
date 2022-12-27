import React, {Component} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, View} from "react-native";
import AfterNews from "../Common/AfterNews";
import FirstNews from "../Common/FirstNews";
import {navigationService, newsService} from "../../carpon/services";

export default class News extends Component {

    state = {
        page: 1,
        listNews: [],
        has_next: false,
        isLoading: false,
        updated: false
    };

    componentDidMount() {
        this.loadNews(this.props.newsParameters, 1)
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
    }

    renderNews = (updated, {item, index}) => (
        <View  renderToHardwareTextureAndroid={true}>
            {
                index === 0 ?
                    <FirstNews updated={updated} news={item} key={index}
                               onPress={this.onPress.bind(this, item.id)}/>
                    : <AfterNews updated={updated} news={item} key={index}
                                 onPress={this.onPress.bind(this, item.id)}/>
            }
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
            car_name_code: props['name_code'],
            page: page
        }).then(result => {
            this.setState({
                page: page,
                listNews: page === 1 ? result.data : this.state.listNews.concat(result.data),
                has_next: result.has_next,
                isLoading: false,
                updated: true
            })
        }).finally(() => {
            this.setState({
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
        return (
            <View style={{height: '100%'}}>
                <FlatList
                    // refreshing={this.state.isLoading}
                    // onRefresh={this.onRefresh.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
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
    }

}
