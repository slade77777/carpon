import React, {Component} from 'react';
import {ButtonText} from '../../../../components/index'
import {
    ActivityIndicator,
    Alert,
    InputAccessoryView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View, Dimensions
}                           from 'react-native'
import {screen}             from "../../../../navigation";
import {newsService}        from "../../../../carpon/services/index";
import Icon                 from 'react-native-vector-icons/Ionicons';
import {SingleColumnLayout} from "../../../layouts";
import HeaderOnPress        from "../../../../components/HeaderOnPress";
import {Comment}            from "../../MyCar/actions/myCarAction";
import {connect}            from "react-redux";
import UserProfileComponent from "../../../../components/Common/UserProfileComponent";
import {viewPage}           from "../../../Tracker";
import { submitAppFlyer }   from "../../../../App";

const {height} = Dimensions.get('window');

@screen('CommentEditor', {
    header: <HeaderOnPress leftComponent={<Icon name="md-close" size={30} color="#FFFFFF"/>} title={' '}/>
})
@connect(state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    }),
    dispatch => ({
        Comment: () => dispatch(Comment())
    }))
export class CommentEditor extends Component {


    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.navigation.getParam('comment') || '',
            is_saved: this.props.navigation.getParam('is_saved'),
            pop: this.props.navigation.getParam('pop') || 1,
            buttonStatus: false,
            disabled: false,
            textSubmit: 'あとで読む',
            loading: false,
            shareVisible: false
        }
    }

    componentDidMount() {
        const news_id = this.props.navigation.getParam('news_id');
        const news_title = this.props.navigation.getParam('title');
        viewPage('comment_news', `ニュース_コメント： ${news_id} (${news_title})`)
    }

    handleCheckInput() {
        const comment_id = this.props.navigation.getParam('comment_id');
        const news_id = this.props.navigation.getParam('news_id');
        this.setState({
            loading: true
        });
        if (this.state.comment) {
            if (comment_id) {
                newsService.editComment(comment_id, this.state.comment).then(() => {
                    this.props.Comment();
                    this.props.navigation.goBack(null);
                }).catch(() => {
                    Alert.alert(
                        'メッセージ',
                        'コメントを入力してください (必須)',
                        [
                            {text: 'やり直す', style: 'cancel'},
                        ],
                        {cancelable: false}
                    );
                }).finally(() => this.setState({loading: false}));
            } else {
                newsService.postReplyComment(news_id, this.state.comment).then(() => {
                    const user = this.props.userProfile;
                    if (user && user.id) {
                        const id = user.id;
                        newsService.getComments(news_id, 1).then(commentCollection => {
                            if (commentCollection.data.length === 1) {
                                submitAppFlyer('NEWS_COMMENT',
                                    {
                                        user_id: id,
                                        content: this.state.comment,
                                        news_id
                                    },
                                    id
                                );
                            }
                        })
                    }
                    this.props.Comment();
                    this.props.navigation.pop(this.state.pop);
                }).catch(() => {
                    Alert.alert(
                        'メッセージ',
                        'コメントを入力してください (必須)',
                        [
                            {text: 'やり直す', style: 'cancel'},
                        ],
                        {cancelable: false}
                    );
                }).finally(() => this.setState({loading: false}));
            }
        } else {
            if (this.state.is_saved) {
                newsService.unNewsClip(news_id).then(res => {
                    this.setState({is_saved: false});
                }).finally(() => this.setState({loading: false}));
            } else {
                newsService.postNewsClip(news_id).then(res => {
                    this.setState({is_saved: true});
                }).finally(() => this.setState({loading: false}));
            }
        }
    };

    onChangeText(text) {
        this.setState({
            comment: text
        });
    }

    handleCheckTextSubmit(comment, is_save) {
        if (comment.length) {
            return '投稿する'
        } else {
            return (
                is_save ? 'クリップを削除' : 'あとで読む'
            )
        }
    };

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        let shareOptions = {
            title: "News",
            message: "Share Information",
            url: this.props.navigation.getParam('link'),
            subject: "Share Link"
        };
        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={Styles.body}>
                            <View style={{padding: 15}}>
                                <UserProfileComponent/>
                            </View>
                            <View style={Styles.input}>
                                <View style={{
                                    paddingHorizontal: 15
                                }}>
                                    <TextInput inputAccessoryViewID={inputAccessoryViewID}
                                               value={this.state.comment}
                                               multiline={true}
                                               autoFocus={true}
                                               style={Styles.initHeightInput}
                                               onChangeText={this.onChangeText.bind(this)}>
                                    </TextInput>
                                </View>
                            </View>
                        </View>
                    }
                    bottomContent={Platform.OS === 'ios'
                        ? (<InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={Styles.button}>
                                <View style={{width: '100%', padding: 15}}>
                                    <ButtonText
                                        style={{width: '100%'}}
                                        title={this.handleCheckTextSubmit(this.state.comment, this.state.is_saved)}
                                        onPress={this.handleCheckInput.bind(this)}/>
                                </View>
                                {
                                    this.state.loading ?
                                        <View style={{
                                            position: 'absolute',
                                            top: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#F37B7D',
                                            opacity: 0.5,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <ActivityIndicator size="small" color="#fff"/>
                                        </View> : null
                                }
                            </View>
                        </InputAccessoryView>)
                        : <View style={Styles.button}>
                            <View style={{width: '100%', padding: 15}}>
                                <ButtonText
                                    style={{width: '100%'}}
                                    title={this.handleCheckTextSubmit(this.state.comment, this.state.is_saved)}
                                    onPress={this.handleCheckInput.bind(this)}/>
                            </View>
                            {
                                this.state.loading ?
                                    <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#F37B7D',
                                        opacity: 0.5,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <ActivityIndicator size="small" color="#fff"/>
                                    </View> : null
                            }
                        </View>
                    }
                />

            </View>
        );
    }
}

const Styles = StyleSheet.create({
    body: {
        height: height * 0.28,
        flexDirection: 'column',
    },
    input: {
        height: '100%',
        borderWidth: 0.5,
        borderColor: '#CCCCCC',
    },
    icon: {
        marginLeft: '4%',
        marginRight: '4%',
        width: 40,
        height: 40
    },
    mid: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        alignItems: 'center',
        height: 74,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    initHeightInput: {
        height: '100%',
        width: '100%',
        borderWidth: 0,
        textAlignVertical: 'top'
    }
});

