import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView, PanResponder} from 'react-native';
import { WebView } from 'react-native-webview';
import {screen} from "../../../../navigation";
import IconShareHeader from "../../../../components/Header/Icon/IconShareHeader";
import IconArrowHeader from "../../../../components/Header/Icon/IconArrowHeader";
import HeaderCarpon from "../../../../components/HeaderCarpon";
import FooterIconRight from "../../../../components/FooterIconRight";
import ps from 'qs';
import WebViewLoading from "../../../../components/WebViewLoading";
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {height} = Dimensions.get('window');

@screen('NewsDetailFull', ({navigation}) => {
    return {
        header: <HeaderCarpon
            rightComponent={<IconShareHeader link={navigation.getParam('news').link} isSharable={true}/>}
            leftComponent={<IconArrowHeader/>}
        />
    }
})
export class NewsDetailFull extends Component {

    constructor(props) {
        super(props);
        this.state = {
            news: {},
            isShowComment: true
        };
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy >= 0) {
                    this.setState({isShowComment: true})
                } else {
                    this.setState({isShowComment: false})
                }
            },
        });
    }

    componentDidMount() {
        const news = this.props.navigation.getParam('news');
        viewPage('news_webview', `ニュース_WebView：${news.id} (${news.title})`)
    }


    render() {

        const news = this.props.navigation.getParam('news');
        const [path, queryString] = typeof news.link === 'string' ? news.link.split('?') : ['', ''];
        let query = ps.parse(queryString);
        query.ad = 'none';
        const newUrl = path + '?' + ps.stringify(query);
        const url = news.origin === 'CarMe' ? newUrl :  news.link;

        return (
            <View style={Styles.main}>
                <View style={{flex: 1}}>
                    <WebView
                        source={{uri: url}}
                        useWebKit={true}
                        renderLoading={() => (<WebViewLoading/>)}
                        startInLoadingState={false}
                        style={{minHeight: this.state.isShowComment ? height * 0.8 : height * 0.9}}
                        showsVerticalScrollIndicator={false}
                        contentInset={{bottom: isIphoneX() ? getBottomSpace() : 0}}
                    />
                </View>
                {
                    !news.commented && this.state.isShowComment &&
                        <View style={{marginBottom: isIphoneX() ? getBottomSpace() : 0}}>
                            <FooterIconRight onPress={() => navigationService.navigate('CommentEditor', {
                                news_id: news.id,
                                is_saved: news.is_saved,
                                link: news.link,
                                pop: 2,
                                title: news.title
                            })}/>
                        </View>

                }
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#F5F5F5',
        flex: 1
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFF'
    },
    header: {
        backgroundColor: '#F3D625',
        fontSize: 14,
        flexDirection: 'row',
    },
    titleHeader: {
        fontSize: 19, fontWeight: 'bold', color: '#FFFFFF'
    }
});

