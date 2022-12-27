import React, {Component} from 'react';
import HeaderNewsDetail from "../../../../components/HeaderNewsDetail";
import ButtonText from "../../../../components/ButtonText";
import {screen} from "../../../../navigation";
import CommentNewsDetail from "../../../../components/Common/CommentNewsDetail";
import {Text, View, SafeAreaView, ScrollView} from "react-native";
import FooterIconRight from "../../../../components/FooterIconRight";
import momentJA from "../../../../carpon/services/momentJA";
import {navigationService, newsService} from "../../../../carpon/services/index";
import {connect} from "react-redux";
import {SingleColumnLayout} from "../../../layouts";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/analytics';
import '@react-native-firebase/crashlytics';
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {viewPage} from "../../../Tracker";
import {Comment} from "../../MyCar/actions/myCarAction";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";
let Analytics = firebase.analytics();
let Crashlytics = firebase.crashlytics();

@screen('NewsDetailScreen', ({navigation}) => {
    return {
        header: <HeaderNewsDetail news_id={navigation.getParam('news_id')}/>
    }
})
@connect(
    state => {
        const userProfile = state.registration.userProfile.myProfile || {};
        const carProfile = state.registration.carProfile.profile || {};
        return {
            userAsSender: {
                avatar: userProfile.avatar,
                car_name: carProfile.car_name,
                email: userProfile.email,
                first_name: userProfile.firstName,
                followed: false,
                grade_name: carProfile.grade_name,
                id: userProfile.id,
                last_name: userProfile.lastName,
                level: userProfile.level,
                maker_name: carProfile.maker_name,
                total_follower: userProfile.total_follower,
                total_following: userProfile.total_following
            }
        }
    },
    dispatch => ({
        Comment: () => dispatch(Comment())
    })
)
export class NewsDetailScreen extends Component {

    constructor(props) {
        super(props);
        Analytics.setAnalyticsCollectionEnabled(true);
        this.state = {
            news: {},
            comments: [],
            position: 0,
            currentPosition: 0,
            maxPosition: 100,
            isSet: false,
            viewHeight: 0,
            topComments: [],
            userFollowerComments: [],
            loading: false,
            isLogged: false
        };
    }

    componentDidMount() {
        this.loadNewsDetail();
        this.news_id = this.props.navigation.getParam('news_id');
        this.willFocusEvent = this.props.navigation.addListener('willFocus', () => {
            this.loadComments();
            this.loadNewsDetail();
        });
    }

    componentWillUnmount() {
        this.willFocusEvent.remove();
    }

    loadNewsDetail() {
        const user = this.props.userProfile;
        return newsService.getNewsDetail(this.props.navigation.getParam('news_id')).then(res => {
            if (!this.state.isLogged) {
                Analytics.logEvent('view_news_detail', {
                    news_id: res.data.id,
                    news_source: res.data.origin,
                    news_name: res.data.title,
                });
                Crashlytics.log('view_news_detail');
                if (user && user.id) {
                    const id = user.id;
                    Crashlytics.setUserId(id.toString());
                }
                viewPage('news_detail', `ニュース_WebView：${res.data.id} (${res.data.title})`);
                this.setState({isLogged: true})
            }
            this.setState({news: res.data})
        });
    }

    loadComments() {
        this.setState({
            loading: true
        }, () => {
            newsService.getComments(this.news_id)
                .then(commentCollection => {
                    this.setState({
                        userFollowerComments: commentCollection.comment_user_follower,
                        topComments: commentCollection.data.slice(0, 3),
                        comments: commentCollection.data.slice(3),
                        loading: false
                    })
                })
                .catch(() => {
                    this.setState({loading: false})
                })
        });
    }

    handleOnPress = () => {
        const news = this.state.news;
        navigationService.navigate('NewsDetailFull', {news});
    };

    renderComment(comment, title) {
        return (
            <View>
                <View style={{
                    borderBottomColor: '#4B9FA5',
                    backgroundColor: '#F8F8F8',
                    borderBottomWidth: 2,
                    marginTop: 25,
                    width: '100%',
                    height: 45,
                    justifyContent: 'center',
                }}>
                    <Text
                        style={{paddingLeft: 15, fontSize: 17, color: '#262525', fontWeight: 'bold', marginBottom: -5}}>
                        {title}
                    </Text>
                </View>
                {
                    comment.map((comment, index) => {
                        return (
                            <View
                                key={index}
                                style={{
                                    paddingHorizontal: 15,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#4b9fa5'
                                }}>
                                <CommentNewsDetail key={index} comment={{...comment}}
                                                   loadingComment={this.state.loadingComment}
                                                   deleteComment={(comment) => this.handleDeleteComment(comment)}
                                                   navigation={this.props.navigation} news={this.state.news}
                                />
                            </View>
                        )
                    })
                }
            </View>
        )
    };

    handleDeleteComment(comment) {
        newsService.deleteComemnt(comment.id).then(response => {
            response === 200 &&
            this.loadComments();
            this.loadNewsDetail();
            this.props.Comment();
        })
    }

    handleRenderNews() {
        const news = this.state.news;
        return (
            <View style={{paddingHorizontal: 15, paddingTop: 25}}>
                <Text style={{color: '#333', fontWeight: 'bold', lineHeight: 20, fontSize: 20}}>
                    {news.title}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Text style={{fontSize: 12, position: 'absolute', left: 0, color: '#666666'}}>
                        {news.origin ? news.origin : ""}
                    </Text>
                    <Text style={{fontSize: 12, position: 'absolute', right: 0, color: '#666666'}}>
                        {momentJA(news.issued).fromNow()}
                    </Text>
                </View>
                <Text style={{marginTop: 25, textAlign: 'justify', fontSize: 16, color: '#333333', lineHeight: 21}}>
                    {news.summary}
                </Text>
                <ButtonText title={'続きを読む'} style={{marginTop: 15}}
                            onPress={this.handleOnPress}/>
            </View>
        )
    }

    render() {
        const {news, topComments, userFollowerComments, comments, loading} = this.state;
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                {loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}}
                            style={{height: '100%'}}
                            contentInset={{bottom: 50}}
                        >
                            {this.handleRenderNews()}
                            {this.renderComment(topComments, '注目のコメント')}
                            {this.renderComment(userFollowerComments, 'フォローしているユーザーのコメント')}
                            {this.renderComment(comments, 'その他のコメント')}
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            position: 'absolute', bottom: isIphoneX() ? getBottomSpace() : 0, width: '100%'
                        }}>
                            {
                                !news.commented &&
                                <FooterIconRight onPress={() => navigationService.navigate('CommentEditor', {
                                    news_id: news.id,
                                    is_saved: news.is_saved,
                                    link: news.link,
                                    title: news.title
                                })}/>
                            }
                        </View>
                    }
                />
            </View>
        )
    }
}
