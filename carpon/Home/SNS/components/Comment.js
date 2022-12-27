import React, {Component} from 'react';
import {Text, Dimensions, View, TouchableOpacity, Alert, Image, Clipboard} from 'react-native';
import {connect} from "react-redux";
import {Like} from "../../MyCar/actions/myCarAction";
import {listReviewService, navigationService, postService} from "../../../services";
import momentJA from "../../../services/momentJA";
import {UserPostInformation} from "./UserPostInformation";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import ContentPostText from "./ContentPostText";
import ButtonLike from "../../../../components/Common/ButtonLike";
import {FollowComponent} from "../../../../components/Common/FollowComponent";
import ActionSheet from "react-native-actionsheet";

const {width, height} = Dimensions.get('window');
@connect((state) => ({
        userProfile: state.registration.userProfile,
    }),
    dispatch => ({
        like: () => dispatch(Like()),
    }))
export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageHeight: 0,
            likeLoading: false
        };
    }

    componentDidMount() {
        this.updateImageSize(this.state.image_thumb);
    }

    updateImageSize(imageUrl) {
        imageUrl && Image.getSize(imageUrl, (actualWidth, actualHeight) => {
            this.setState({imageHeight : (width - 30) * actualHeight/actualWidth})
        });
    }

    handleLike = () => {
        let {id, liked} = this.props.data;
        this.setState({likeLoading: true});
        if (!liked) {
            postService.likePostComment(id)
                .then(() => {
                    this.props.refreshList().then(() => {
                        this.setState({likeLoading: false});
                    });
                })
                .catch(() => {
                    this.setState({likeLoading: false});
                })
        } else {
            postService.unlikePostComment(id)
                .then(() => {
                    this.props.refreshList().then(() => {
                        this.setState({likeLoading: false});
                    });
                })
                .catch(() => {
                    this.setState({likeLoading: false});
                })
        }
    };

    render() {
        const {sender, create_date, comment, liked, total_like, tag} = this.props.data;
        return (
            <View style={{backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#E5E5E5', paddingHorizontal: 15}}>
                <View style={{paddingVertical: 25}}>
                    <TouchableOpacity
                        // onPress={this.actionNavigate.bind(this)}
                        style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <UserPostInformation isMainPost={false} profile={sender}/>
                        <TouchableOpacity style={{padding: 5, width: 40, height: 30, borderWidth: 1, borderColor: '#E5E5E5', alignSelf: 'stretch'}} onPress={()=> this.showActionSheet()}>
                            <SvgImage source={SvgViews.Anything}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <View style={{marginTop: 15}}>
                        <Text style={{fontSize: 14, color: '#999', paddingBottom: 14}}>{momentJA(create_date).fromNow()}</Text>
                        <ContentPostText content={comment} tags={tag} style={{ fontSize: 17}}/>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15}}>
                        <ButtonLike handleLike={() => this.handleLike()} liked={liked}
                                    total_like={total_like} loading={this.state.likeLoading}/>
                        {sender.id !== this.props.userProfile.myProfile.id && <FollowComponent profile={sender}/>}
                    </View>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={
                        sender.id === this.props.userProfile.myProfile.id ?
                            ['コメントを編集', 'コメントを削除', 'コメントをコピー', 'キャンセル']
                            : ['コメントをコピー', '問題を報告', 'キャンセル']
                    }
                    cancelButtonIndex={sender.id === this.props.userProfile.myProfile.id ? 3 : 2}
                    destructiveButtonIndex={sender.id !== this.props.userProfile.myProfile.id ? 1 : 10}
                    onPress={(index) => sender.id === this.props.userProfile.myProfile.id ? this.handleSelectOwnPost(index) : this.handleSelectOtherPost(index) }
                />
            </View>
        )
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    };

    handleSelectOwnPost(index) {
        const {id, comment} = this.props.data;
        switch (index) {
            case 0:
                this.props.editComment(id, comment);
                break;
            case 1:
                Alert.alert(
                    'コメントの削除',
                    '本当に削除してよろしいでしょうか？',
                    [
                        {
                            text: 'いいえ',
                            style: "cancel"
                        },
                        {
                            text: 'はい',
                            onPress: () => {
                                postService.deleteComment(id).then(response => {
                                    this.props.refreshList();
                                })
                            }
                        }
                    ])

                break;
            case 2:
                Clipboard.setString(comment);
                break;
            default:
                return true;
        }
    }

    handleSelectOtherPost(index) {
        const {comment, id} = this.props.data;
        switch (index) {
            case 0:
                Clipboard.setString(comment);
                break;
            case 1:
                navigationService.navigate('ClaimPost', {comment_id: id})
                break;
            default:
                return true;
        }
    }
}
