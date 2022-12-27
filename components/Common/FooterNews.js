import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from "react-native";
import ImageLoader from '../ImageLoader';
import {ButtonClip} from "../ButtonClip";
import {navigationService, newsService} from "../../carpon/services";
import {connect} from "react-redux";
import {addTrackerEvent} from "../../carpon/Tracker";

@connect(state => ({
    newsReducer: state.news
}), dispatch => ({
    clipNews: (newsClip) => dispatch({
        type: 'UPDATE_CLIP_NEW',
        newsClip
    }),
    updateClipSuccess: () => dispatch({
        type: 'UPDATE_CLIP_NEW_SUCCESS',
    }),
}))
export default class FooterNews extends Component {

    constructor(props) {
        super(props);
        this.handleClip = this.handleClip.bind(this);
        this.handleUnclip = this.handleUnclip.bind(this);
    }

    state = {
        loading: false,
    };

    handleClip(id) {
        this.setState({loading: true});
        return newsService.postNewsClip(id)
            .then(res => {
                addTrackerEvent('news_clip', {news_id: id});
                this.props.clipNews(res)
            })
            .finally(() => {
                this.setState({loading: false});
                this.props.updateClipSuccess()
            })
    };

    handleUnclip(id) {
        this.setState({loading: true});
        return newsService.unNewsClip(id)
            .then(res => {
                this.props.clipNews(res)
            })
            .finally(() => {
                this.setState({loading: false});
                this.props.updateClipSuccess()
            })
    };


    renderClipsUIs() {
        const {total_clip} = this.props.news;
        return (
            total_clip ?
                <TouchableOpacity
                    onPress={()=> navigationService.navigate('NewsDetailScreen', {news_id: this.props.news.id})}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', flex: 0, marginLeft: 6}}>
                        {
                            this.props.news['clip_profiles'].map((user, index) => (
                                <ImageLoader
                                    key={index}
                                    source={{uri: user.avatar}}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        marginLeft: -6,
                                        borderRadius: 12,
                                        borderColor: '#ebebeb',
                                        borderWidth: 1
                                    }}
                                />
                            ))
                        }
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Text style={{
                            fontWeight: 'bold',
                            marginLeft: 5,
                            fontSize: 17,
                            color: 'black',
                        }}>{total_clip}</Text>
                        <Text style={{fontSize: 11, color:'#666666'}}> Clips</Text>
                    </View>
                </TouchableOpacity> : <View/>
        )
    }

    render() {
        const {news} = this.props;
        return (
            <View style={{flexDirection: 'row', justifyContent: "space-between", height: 40, alignItems: 'center'}}>
                {this.renderClipsUIs()}
                {!this.props.showButtonClip &&
                <ButtonClip handleClip={this.handleClip} loading={this.state.loading} handleUnclip={this.handleUnclip}
                            news={news}/>}
            </View>
        )
    }

}
