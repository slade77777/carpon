import React, {Component} from 'react';
import {
    Text,
    Dimensions,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    ImageBackground,
    Clipboard,
    Alert
} from 'react-native';
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
import color from "../../../color";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const {width, height} = Dimensions.get('window');
@connect((state) => ({
        userProfile: state.registration.userProfile.myProfile,
    }),
    dispatch => ({
        like: () => dispatch(Like()),
    }))
export default class PostItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.data,
            imageHeight: 300,
            imageWidth: 0,
            actualHeight: 0,
            actualWidth: 0,
            maxSpaceWidth: 0,
            maxSpaceHeight: 0,
            likeLoading: false,
            loadingImage: true
        };
    }

    componentDidMount() {
        this.updateImageSize(this.state.image_thumb);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({...nextProps.data});
    }

    updateImageSize(imageUrl) {
        imageUrl && Image.getSize(imageUrl, (actualWidth, actualHeight) => {
            this.setState({
                imageHeight: actualHeight / actualWidth < 2 / 3 ? ((width - 30) * 2 / 3) : ((width - 30) * actualHeight / actualWidth),
                imageWidth: actualHeight / actualWidth < 2 / 3 ? ((width - 30) * 2 / 3 * actualWidth / actualHeight) : (width - 30),
                maxSpaceWidth: actualHeight / actualWidth < 2 / 3 ? ((width - 30) * (2 / 3 * actualWidth / actualHeight - 1)) : 0,
                maxSpaceHeight: actualHeight / actualWidth > 2 / 3 ? ((width - 30) * (actualHeight / actualWidth - 2 / 3)) : 0,
                actualHeight,
                actualWidth
            })
        });
    }

    handleLike = () => {
        let post = this.props.data;
        this.setState({likeLoading: true});
        if (!post.liked) {
            postService.likePost(post.id)
                .then(() => {
                    post.liked = true;
                    post.total_like_post += 1;
                    const navigation = this.props.navigation;
                    if (navigation) {
                        const changePost = navigation.getParam('changePost');
                        changePost && changePost(post);
                    }
                    this.setState({likeLoading: false});
                })
                .catch(() => {
                    this.setState({likeLoading: false});
                })
        } else {
            postService.unlikePost(post.id)
                .then(() => {
                    post.liked = false;
                    post.total_like_post -= 1;
                    const navigation = this.props.navigation;
                    if (navigation) {
                        const changePost = navigation.getParam('changePost');
                        changePost && changePost(post);
                    }
                    this.setState({likeLoading: false});
                })
                .catch(() => {
                    this.setState({likeLoading: false});
                })
        }
    };

    render() {
        const {position_x, position_y, imageWidth, imageHeight, maxSpaceWidth, maxSpaceHeight, loadingImage} = this.state;
        const {sender, create_date, image_thumb, content, liked, total_like_post, total_comment, tag, has_comment} = this.props.data;
        const isMainPost = this.props.isMainPost;
        let x = 0;
        if (position_x) {
            x = ((position_x - 0.5) * (width - 30));
            if (x > maxSpaceWidth) {
                x = maxSpaceWidth;
            }
        }
        let y = 0;
        if (position_y) {
            y = (position_y * imageHeight - (width - 30) / 3);
            if (y > maxSpaceHeight) {
                y = maxSpaceHeight;
            }
        }
        return (
            <View style={{
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderColor: '#4b9fa5',
                paddingHorizontal: 15,
                paddingVertical: 25
            }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    {
                        loadingImage ? <SkeletonPlaceholder backgroundColor={'#CCCCCC'} speed={1000}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <View style={{
                                        width: isMainPost ? 60 : 40,
                                        height: isMainPost ? 60 : 40,
                                        borderRadius: 50
                                    }}/>
                                    <View style={{marginLeft: 20}}>
                                        <View style={{width: 120, height: isMainPost ? 20 : 15, borderRadius: 4}}/>
                                        <View
                                            style={{marginTop: 6, width: 80, height: isMainPost ? 20 : 15, borderRadius: 4}}
                                        />
                                    </View>
                                </View>
                            </SkeletonPlaceholder> :
                            <UserPostInformation isMainPost={this.props.isMainPost || false} profile={sender}/>
                    }
                    <TouchableOpacity
                        style={{
                            padding: 5,
                            width: 40,
                            height: 30,
                            borderWidth: 1,
                            borderColor: '#E5E5E5',
                            alignSelf: 'stretch'
                        }}
                        onPress={() => this.showActionSheet()}>
                        <SvgImage source={SvgViews.Anything}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{zIndex: 0}} onPress={() => this.goToDetail()}>
                    {
                        <ImageBackground
                            // onLoadStart={() => this.setState({loadingImage: true})}
                            onLoadEnd={() => this.setState({loadingImage: false})}
                            source={{uri: image_thumb}}
                            imageStyle={{
                                top: -y,
                                left: -x,
                                height: imageHeight,
                                width: imageWidth
                            }} style={{
                            backgroundColor: '#CCCCCC',
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: 'hidden',
                            resizeMode: 'cover',
                            width: width - 30,
                            height: (width - 30) * 2 / 3,
                            marginVertical: 15,
                            position: 'relative'
                        }}
                        >
                            {
                                loadingImage && <View style={{
                                    backgroundColor: '#CCCCCC',
                                    width: width - 30,
                                    height: (width - 30) * 2 / 3
                                }}/>
                            }
                        </ImageBackground>
                    }
                </TouchableOpacity>
                {
                    loadingImage ? <SkeletonPlaceholder backgroundColor={'#CCCCCC'} speed={1000}>
                        <View style={{width: 100, height: 15}}/>
                        <View style={{width: width - 30, height: 15, marginTop: 5}}/>
                        <View style={{width: width - 30, height: 15, marginTop: 5}}/>
                    </SkeletonPlaceholder> : <View style={{zIndex: 2}}>
                        <Text style={{fontSize: 14, color: 'black'}}>{momentJA(create_date).fromNow()}</Text>
                        <ContentPostText content={content} tags={tag} style={{fontSize: 17, marginTop: 15}}/>
                    </View>
                }
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 15,
                    zIndex: 2
                }}>
                    <ButtonLike handleLike={() => this.handleLike()} liked={liked}
                                total_like={total_like_post} loading={this.state.likeLoading}/>
                    {sender.id !== this.props.userProfile.id && <FollowComponent profile={sender}/>}
                </View>
                {
                    !this.props.isCommenting &&
                    <TouchableOpacity
                        onPress={() => this.goToDetail()}
                        style={{flexDirection: 'row', marginTop: 17, zIndex: 2, marginBottom: 2}}>
                        <SvgImage source={SvgViews.CommentIcon}/>
                        {
                            loadingImage ? <SkeletonPlaceholder backgroundColor={'#CCCCCC'} speed={1000}>
                                <View style={{width: 100, height: 15, marginLeft: 5}}/>
                            </SkeletonPlaceholder> : <Text style={{fontSize: 13, lineHeight: 17, marginLeft: 5}}>
                                {has_comment ? (total_comment > 0 ? `コメントを見る(${total_comment}件)` : 'コメントを書く') : '投稿を見る'}
                            </Text>
                        }

                    </TouchableOpacity>
                }
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={
                        sender.id === this.props.userProfile.id ?
                            ['投稿を編集', '投稿を削除', '投稿をコピー', 'キャンセル']
                            : ['投稿をコピー', '問題を報告', 'キャンセル']
                    }
                    cancelButtonIndex={sender.id === this.props.userProfile.id ? 3 : 2}
                    destructiveButtonIndex={sender.id !== this.props.userProfile.id ? 1 : 10}
                    onPress={(index) => sender.id === this.props.userProfile.id ? this.handleSelectPost(index) : this.handleSelectOtherPost(index)}
                />
            </View>
        )
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    };

    goToDetail() {
        navigationService.navigate('CommentPost', {
            postId: this.props.data.id, changePost: (post) => {
                let data = this.props.data;
                Object.assign(data, post)
                this.setState({});
            }
        })
    }

    handleSelectPost(index) {
        const {id, content} = this.state;
        switch (index) {
            case 0:
                navigationService.navigate('EditPostForm', {post_id: id})
                break;
            case 1:
                Alert.alert(
                    '投稿の削除',
                    '本当に削除してよろしいでしょうか？',
                    [
                        {
                            text: 'いいえ',
                            style: "cancel"
                        },
                        {
                            text: 'はい',
                            onPress: () => {
                                postService.deletePost(id).then(() => {
                                    this.props.handleRefresh();
                                })
                            }
                        }
                    ]);
                break;
            case 2:
                Clipboard.setString(content);
                break;
            default:
                return true;
        }
    }

    handleSelectOtherPost(index) {
        const {id, content} = this.state;
        switch (index) {
            case 0:
                Clipboard.setString(content);
                break;
            case 1:
                navigationService.navigate('ClaimPost', {post_id: id})
                break;
            default:
                return true;
        }
    }
}
