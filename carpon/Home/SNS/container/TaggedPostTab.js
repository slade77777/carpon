import React, { Component }                 from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Keyboard,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
}                                           from 'react-native';
import { postService }                      from '../../../services';
import { SvgImage, SvgViews }               from '../../../../components/Common/SvgImage';
import ListTag                              from '../components/ListTag';
import PostContent                          from '../components/PostContent';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { getBottomSpace }                   from 'react-native-iphone-x-helper';
import {
    addTagBy,
    deleteTagBy,
    getPostByTag,
    loadMorPostTag,
    setKeyword,
}                                           from '../action/SNSAction';
import { connect }                          from 'react-redux';
import { viewPage }                         from '../../../Tracker';
import SingleBanner                         from '../../../../components/SingleBanner/SingleBanner';
import PostSkeleton                         from "./PostSkeleton";

const { width } = Dimensions.get('window');

@connect(
    state => ({
        posts: state.snsReducer.TaggedPost ? state.snsReducer.TaggedPost.data : [],
        page: state.snsReducer.TaggedPost ? state.snsReducer.TaggedPost.page : 1,
        hasNext: state.snsReducer.TaggedPost
            ? state.snsReducer.TaggedPost.has_next
            : false,
        initialLoading: state.snsReducer.InitialTaggedPostLoading,
        loading: state.snsReducer.TaggedPostLoading,
        keyword: state.snsReducer.keyword ? state.snsReducer.keyword : '',
        tagHistory: state.snsReducer.tagHistory ? state.snsReducer.tagHistory : [],
    }),
    dispatch => ({
        loadMorPostTag: (keyword, page) => dispatch(loadMorPostTag(keyword, page)),
        getPostByTag: keyword => dispatch(getPostByTag(keyword)),
        addTagBy: keyword => dispatch(addTagBy(keyword)),
        deleteTagBy: keyword => dispatch(deleteTagBy(keyword)),
        setKeyword: keyword => dispatch(setKeyword(keyword)),
    }),
)
export default class TaggedPostTab extends Component {

    state = {
        listTag: [],
        loading: false,
        deletingTag: null,
        keyword: '',
        focus: false,
        keywordSearch: '',
    };

    componentDidMount() {
        const { tagHistory, keyword } = this.props;
        const keyWordHistory          = tagHistory[0] ? tagHistory[0].keyword : '';
        const keywordCurrent          = keyword ? keyword : keyWordHistory;
        keywordCurrent && this.props.setKeyword(keywordCurrent);
        this.LoadTag();
    }

    componentWillReceiveProps(nextProps) {
        const { tagHistory, keyword } = nextProps;
        const keyWordHistory          = tagHistory[0] ? tagHistory[0].keyword : '';
        const keywordCurrent          = keyword ? keyword : keyWordHistory;
        if (nextProps.keyword !== this.state.keyword) {
            this.scrollToOffset();
            this.setState({ keyword: nextProps.keyword });
            this.props.getPostByTag(nextProps.keyword);
            viewPage('tagged_posts', `タグ投稿：${ nextProps.keyword }`);
        }
        nextProps.route.index === 2 &&
        nextProps.route.index !== this.props.route.index &&
        viewPage('tagged_posts', `タグ投稿：${ keywordCurrent }`);
    }

    scrollToOffset = () => {
        this.flatList.scrollToOffset({ animated: false, offset: 0 });
    };

    LoadTag() {
        const { tagHistory, keyword } = this.props;
        const keyWordHistory          = tagHistory[0] ? tagHistory[0].keyword : '';
        const keywordCurrent          = keyword ? keyword : keyWordHistory;
        keywordCurrent && this.props.getPostByTag(keywordCurrent);
    }

    getListTag(keyword) {
        postService
            .getListTag(keyword, 3)
            .then(response => {
                this.setState({ listTag: response || [] });
            })
            .catch(() => {
                this.setState({ listTag: [] });
            });
    }

    handleLoadMore = () => {
        const { tagHistory, keyword } = this.props;
        const keyWordHistory          = tagHistory[0] ? tagHistory[0].keyword : '';
        const keywordCurrent          = keyword ? keyword : keyWordHistory;
        if (this.props.hasNext) {
            keywordCurrent &&
            this.props.loadMorPostTag(keywordCurrent, this.props.page + 1);
        }
    };

    handleRefresh = () => {
        const { tagHistory, keyword } = this.props;
        const keyWordHistory          = tagHistory[0] ? tagHistory[0].keyword : '';
        const keywordCurrent          = keyword ? keyword : keyWordHistory;
        keywordCurrent && this.props.getPostByTag(keywordCurrent);
    };

    deleteTag(keyword) {
        this.props.deleteTagBy(keyword);
    }

    addTag(keyword) {
        this.props.addTagBy(keyword);
    }

    selectHashTag(tag) {
        this.setState({ listTag: [] });
        Keyboard.dismiss();
        this.props.setKeyword(tag);
        // this.props.getPostByTag(tag); componentWillReceiveProps have loaded Post
        this.setState({ keywordSearch: '' });
    }

    render() {
        const { tagHistory, posts, keyword, loading } = this.props;
        const { keywordSearch }                       = this.state;
        const keyWordHistory                          = tagHistory[0] ? tagHistory[0].keyword : '';
        const keywordCurrent                          = keyword ? keyword : keyWordHistory;
        const deleteTag                               = this.state.deletingTag || keywordCurrent;

        return (
            <View style={ Styles.body } renderToHardwareTextureAndroid={ true }>
                <View
                    style={ {
                        flexDirection: 'row',
                        width: '100%',
                        height: 40,
                        backgroundColor: '#E5E5E5',
                        borderBottomWidth: 1,
                        borderColor: '#CCC',
                    } }>
                    <ScrollView horizontal={ true }>
                        { tagHistory.map((route, i) => {
                            const color =
                                      (keyword || keyWordHistory) === route.keyword
                                          ? '#4B9FA5'
                                          : '#999999';
                            const title = route.keyword;
                            return (
                                <TouchableOpacity
                                    key={ route.id }
                                    style={ {
                                        paddingHorizontal: 15,
                                        height: 40,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#E5E5E5',
                                    } }
                                    onPress={ () => {
                                        this.selectHashTag(route.keyword);
                                    } }>
                                    {
                                        <Text
                                            style={ {
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                color,
                                            } }>
                                            #
                                            { title && title.length >= 8
                                                ? title.substring(0, 8) + '...'
                                                : title }
                                        </Text>
                                    }
                                </TouchableOpacity>
                            );
                        }) }
                    </ScrollView>
                </View>
                {
                    <View
                        style={ {
                            width: '100%',
                            height: 60,
                            backgroundColor: '#E5E5E5',
                            padding: 10,
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: Platform.OS === 'ios' ? 0.15 : 10,
                            zIndex: 2,
                            borderBottomWidth: 0.5,
                            borderColor: '#D8D8D8',
                            elevation: Platform.OS === 'ios' ? 0 : 10,
                        } }>
                        <Text
                            style={ {
                                fontSize: 16,
                                position: 'absolute',
                                top: 19.5,
                                left: 15,
                                zIndex: 3,
                                fontWeight: this.state.focus ? 'bold' : 'normal',
                                width: 20,
                                height: 30,
                                textAlign: 'center',
                                color:
                                    this.state.focus || this.state.keywordSearch
                                        ? '#000'
                                        : '#CCC',
                            } }>
                            #
                        </Text>
                        <TextInput
                            editable
                            placeholder={ 'タグ検索' }
                            value={ keywordSearch }
                            onChangeText={ text => {
                                this.setState({ keywordSearch: text });
                                this.getListTag(text);
                            } }
                            onFocus={ () => {
                                this.setState({ focus: true });
                            } }
                            onBlur={ () => {
                                this.setState({ focus: false });
                            } }
                            style={ {
                                width: width - 20,
                                borderWidth: 1,
                                borderColor: '#CCCCCC',
                                height: 40,
                                paddingLeft: 22,
                                borderRadius: 5,
                                backgroundColor: 'white',
                            } }
                        />
                    </View>
                }
                { this.state.keywordSearch ? (
                    <View
                        style={ {
                            position: 'absolute',
                            top: 100,
                            left: 0,
                            zIndex: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            width: '100%',
                        } }>
                        <ListTag
                            selectHashTag={ tag => {
                                this.selectHashTag(tag.content);
                            } }
                            listTag={ this.state.listTag }
                        />
                    </View>
                ) : (
                    <View/>
                ) }
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={ loading }
                            onRefresh={ this.handleRefresh }
                        />
                    }
                    ref={ ref => (this.flatList = ref) }
                    onEndReached={ this.handleLoadMore }
                    ListFooterComponent={ this.renderFooter }
                    ListHeaderComponent={ this.renderHeader }
                    renderItem={ this.renderItem }
                    onEndReachedThreshold={ 3 }
                    showsVerticalScrollIndicator={ false }
                    data={ posts }
                />
                <ActionSheet
                    ref={ o => (this.ActionSheet = o) }
                    title={
                        <View
                            style={ {
                                paddingHorizontal: 10,
                                width: width - 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            } }>
                            <Text style={ { fontSize: 15, color: '#262626' } }>
                                <Text style={ { fontWeight: 'bold' } }>
                                    #
                                    { deleteTag.length >= 8
                                        ? keywordCurrent.substring(0, 8) + '...'
                                        : keywordCurrent }
                                </Text>
                                のピンを外しますか
                            </Text>
                        </View>
                    }
                    options={ [ 'ピンを外す', 'キャンセル' ] }
                    destructiveButtonIndex={ 0 }
                    cancelButtonIndex={ 1 }
                    styles={ {
                        wrapper: {
                            flex: 1,
                            flexDirection: 'row',
                            marginBottom: getBottomSpace(),
                        },
                        body: {
                            flex: 1,
                            alignSelf: 'flex-end',
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                        },
                        buttonBox: {
                            height: 55,
                            marginTop: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#FFFFFF',
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            marginHorizontal: 10,
                        },
                        titleBox: {
                            height: 55,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#FFFFFF',
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            marginHorizontal: 10,
                            borderBottomWidth: 0.5,
                            borderColor: '#707070',
                        },
                        cancelButtonBox: {
                            height: 60,
                            marginTop: 6,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#FFFFFF',
                            borderRadius: 5,
                            marginHorizontal: 10,
                        },
                    } }
                    onPress={ this.handleDeleteTag }
                />
            </View>
        );
    }

    renderItem = ({ item, index }) => {
        // If loading:
        if (this.props.initialLoading) {
            return <PostSkeleton/>
        }
        return <PostContent data={ item } key={ index.toString() }/>;
    };

    renderFooter = () => {
        if (!this.props.hasNext) {
            return <View style={ { height: 90 } }/>;
        }
        return (
            <View
                style={ {
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: '#CED0CE',
                } }>
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };

    renderHeader = () => {
        const { tagHistory, keyword } = this.props;
        const keyWordHistory          = tagHistory[0] ? tagHistory[0].keyword : '';
        const keywordCurrent          = keyword ? keyword : keyWordHistory;
        const isPinned                = tagHistory.find(tag => tag.keyword === keywordCurrent);
        const title                   = keyword || keyWordHistory;

        return (
            !!title && (
                <View
                    style={ {
                        backgroundColor: '#fff',
                        flexDirection: 'column',
                    } }>
                    <View>
                        <SingleBanner/>
                    </View>
                    <View
                        style={ {
                            paddingTop: 25,
                            paddingBottom: 15,
                            paddingLeft: 15,
                            backgroundColor: 'white',
                            flexDirection: 'row',
                        } }>
                        <Text
                            style={ {
                                fontSize: 20,
                                fontWeight: 'bold',
                                lineHeight: 30,
                                marginRight: 15,
                                bottom: 5,
                                maxWidth: width - 65,
                            } }>
                            #{ title }
                        </Text>
                        <TouchableOpacity
                            onPress={ () =>
                                !isPinned
                                    ? this.addTag(keyword)
                                    : this.setState({ deletingTag: keyword }, () => {
                                        this.ActionSheet.show();
                                    })
                            }>
                            <SvgImage
                                source={ () =>
                                    SvgViews.Pin({ fill: isPinned ? '#F37B7D' : '#ccc' })
                                }
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        );
    };

    handleDeleteTag = index => {
        const { tagHistory, keyword } = this.props;
        const { deletingTag }         = this.state;
        const keyWordHistory          = tagHistory[0] ? tagHistory[0].keyword : '';
        const keywordCurrent          = keyword ? keyword : keyWordHistory;
        if (index === 0) {
            this.deleteTag(deletingTag ? deletingTag : keywordCurrent);
        }
    };
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#F8F8F8',
        height: '100%',
    },
    buttonPlus: {
        width: 50,
        height: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        borderLeftColor: '#707070',
        borderLeftWidth: 0.5,
    },
});
