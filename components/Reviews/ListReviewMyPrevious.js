import React, {Component} from 'react';
import {FlatList, Text, ActivityIndicator, View} from "react-native";
import {listReviewService} from "../../carpon/services";
import Review from "./Review";
import DividerNews from "../DividerNews";

export default class ListReviewMyPrevious extends Component {

    state = {
        has_next: true,
        listReview: [],
        page: 1
    };
    _renderItem = ({item, index}) => (
        <View>
            {
                index !== 0 &&
                <DividerNews style={{marginTop: -10}}/>
            }
            <Review key={index} review={item} index={0}/>
        </View>
    );

    loadReview(page) {
        listReviewService.getReviewUser(this.props.profile.id, page).then(response => {
            this.setState({
                listReview: page === 1 ? response.data : this.state.listReview.concat(response.data),
                has_next: response.has_next,
                page: page
            })
        })
    }


    componentDidMount() {
        this.loadReview(1);
    }

    handleLoadMore() {
        let page = this.state.page + 1;
        if (this.state.has_next) {
            this.loadReview(page)
        }
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
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };


    render() {
        return (
            <View>
                <View style={{
                    backgroundColor: '#EFEFEF',
                    borderTopWidth: 1,
                    borderTopColor: '#EFEFEF',
                    height: 40,
                    marginTop: 15
                }}>
                    <Text style={{
                        marginLeft: 10,
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        color: 'black'
                    }}>レビュー</Text>
                </View>
                <FlatList
                    data={this.state.listReview}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.8}
                    onEndReached={this.handleLoadMore.bind(this)}
                    ListFooterComponent={this.renderFooter.bind(this, this.state.has_next)}
                />
            </View>
        )
    }
}
