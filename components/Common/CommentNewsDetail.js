import React, {Component} from 'react';
import {UserComponent} from "./UserProfileComponent";
import {View, Clipboard, Text, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import {navigationService, newsService} from "../../carpon/services";
import ActionSheet from 'react-native-actionsheet'
import ButtonLike from "./ButtonLike";
import {SvgImage, SvgViews} from '../../components/Common/SvgImage'
import {FollowComponent} from "./FollowComponent";
import {Like} from "../../carpon/Home/MyCar/actions/myCarAction";
import momentJA from "../../carpon/services/momentJA";
import {addTrackerEvent} from "../../carpon/Tracker";


@connect(state => ({
        me: state.registration.userProfile.myProfile
    }),
    dispatch => ({
        Like: () => dispatch(Like())
    })
)
export default class CommentNewsDetail extends Component {

    constructor(props) {
        super(props);
        this.myActionSheetPress = this.myActionSheetPress.bind(this);
        this.otherActionSheetPress = this.otherActionSheetPress.bind(this);
    }

    componentWillMount() {
        this.setState({...this.props.comment})
    }

    handleLike = () => {
        let comment = this.state;
        this.setState({loading: true});
        if (!comment.liked) {
            return this.likeComment(comment.id)
        } else {
            return this.unLikeComment(comment.id)
        }
    };

    likeComment(id) {
        return newsService.likeComment(id)
            .then(setTimeout(() => this.reloadComment(true), 500))
            .finally(setTimeout(() => {
                this.setState({loading: false});
                addTrackerEvent('comment_like', {comment_id: id})
                this.props.Like()
            }, 500));
    }

    unLikeComment(id) {
        return newsService.unlikeComment(id)
            .then(setTimeout(() => this.reloadComment(false), 500))
            .finally(setTimeout(() => {
                this.setState({loading: false});
                this.props.Like()
            }, 500));
    }

    reloadComment(liked) {
        this.setState({
            liked: liked,
            total_like: liked ? this.state.total_like + 1 : this.state.total_like - 1
        })
    }

    showActionSheet = () => {
        let {me, comment} = this.props;
        if (me && me.id !== comment['profile_id']) {
            this.OtherActionSheet.show();
        } else {
            this.MyActionSheet.show();
        }
    };

    myActionSheetPress(buttonIndex) {
        let {comment} = this.props;
        if (buttonIndex === 1) {
            const news = this.props.news;
            navigationService.navigate('CommentEditor', {comment_id : this.state.id,
                comment : this.state.comment,
                news_id: news.id,
                title: news.title
            })
        }
        if (buttonIndex === 2) {
            this.props.deleteComment(comment)
        }
    }

    otherActionSheetPress(buttonIndex) {
        let {comment} = this.props;
        const commentId = comment.id;
        if (buttonIndex === 1) {
            Clipboard.setString(this.state.comment)
        }
        if (buttonIndex === 2) {
            this.props.navigation.navigate('ReportComment', { commentId, news: this.props.news });
        }
    }

    render() {
        const {liked, total_like, sender, create_date} = this.state;
        const senderId = sender ? sender.id : '';
        const me = this.props.me;
        return (
            <View style={{paddingBottom: 20}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 15,
                    paddingBottom: 15,
                }}>
                    {sender && <UserComponent version={12} profile={sender}/>}
                    <Text style={{fontSize: 12, position: 'absolute', right: 0, color: '#666666'}}>
                        {momentJA(create_date).fromNow()}
                    </Text>
                </View>
                <Text style={{paddingTop: 0}}>{this.props.comment.comment}</Text>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    height: 40,
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                }}>
                    <ButtonLike handleLike={this.handleLike} liked={liked} total_like={total_like}
                                loading={this.state.loading}/>
                    <View style={{flexDirection: 'row'}}>
                        {sender && me && me.id !== senderId && <FollowComponent profile={this.state.sender}/>}
                        <TouchableOpacity
                            style={{paddingLeft: 10}}
                            onPress={this.showActionSheet.bind(this)}
                        >
                            <View style={{borderRadius: 2,borderColor: '#E5E5E5', borderWidth: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: 80, height: 30, backgroundColor: '#FFFFFF'}}>
                                <SvgImage
                                    source={() => SvgViews.IconEdit({fill: '#CCC', width: 10, height: 10})}
                                />
                                <Text style={{ color: '#CCCCCC', fontWeight: 'bold', fontSize: 10, marginLeft: 7}}>編集する</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <ActionSheet
                    ref={o => this.MyActionSheet = o}
                    options={[
                        'キャンセル',
                        'コメントを編集',
                        'コメントを削除'
                    ]}
                    cancelButtonIndex={0}
                    onPress={this.myActionSheetPress}
                />
                <ActionSheet
                    ref={o => this.OtherActionSheet = o}
                    options={[
                        'キャンセル',
                        'コメントをコピー',
                        '問題を報告'
                    ]}
                    cancelButtonIndex={0}
                    onPress={this.otherActionSheetPress}
                />
            </View>
        )
    }
}
