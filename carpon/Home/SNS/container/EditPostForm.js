import React, { Component }                                              from 'react';
import { ButtonText }                                                    from '../../../../components/index'
import {
    Text,
    Platform,
    SafeAreaView,
    StyleSheet,
    TextInput, ScrollView,
    View, Dimensions, TouchableOpacity, Image, Alert, ImageBackground, InputAccessoryView
}                                                                        from 'react-native'
import { screen }                                                        from "../../../../navigation";
import { navigationService, newsService, postService, uploadingService } from "../../../../carpon/services/index";
import Icon                                                              from 'react-native-vector-icons/Ionicons';
import { SingleColumnLayout }                                            from "../../../layouts";
import HeaderOnPress                                                     from "../../../../components/HeaderOnPress";
import { connect }                                                       from "react-redux";
import Spinner                                                           from "react-native-loading-spinner-overlay";
import { UserPostInformation }                                           from "../components/UserPostInformation";
import { extractHashTagFromText, extractTag }                            from "./NewPostForm";
import { SvgImage, SvgViews }                                            from "../../../../components/Common/SvgImage";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const { height, width } = Dimensions.get('window');

@screen('EditPostForm', {
    header: <HeaderOnPress leftComponent={ <Icon name="md-close" size={ 30 } color="#FFFFFF"/> } title={ '編集' }/>
})
@connect(state => ({
    userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
}))

export class EditPostForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            content: null,
            has_comment: true,
            image_thumb: null,
            id: null,
            imageHeight: 0,
            imageWidth: 0,
            maxSpaceWidth: 0,
            maxSpaceHeight: 0,
            actualHeight: 0,
            actualWidth: 0,
            position_x: null,
            position_y: null,
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        postService.getDetailPost(this.props.navigation.getParam('post_id'))
            .then(response => {
                this.setState({
                    content: response.content,
                    has_comment: response.has_comment,
                    image_thumb: response.image_thumb,
                    position_x: response.position_x,
                    position_y: response.position_y,
                    id: response.id,
                    loading: false
                });
                this.updateImageSize(response.image_thumb);
            }).catch(error => {
                this.setState({loading: false});
            console.log(error);
        })
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

    handleUpdate() {
        const { content, id, has_comment } = this.state;
        const tag_content                  = extractTag(content, []);
        const data                         = { content, tag_content, has_comment };
        this.setState({ loading: true });
        postService.editPost(id, data).then(result => {
            navigationService.clear('MainTab', { tabNumber: 2 });
        }).catch(error => {
            Alert.alert(
                'エラー',
                'エラー',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.setState({ loading: false });
                        }
                    },
                ],
                { cancelable: false }
            );
        })
    }

    onChangeText(text) {
        this.setState({ content: text });
    }

    render() {
        const { content, image_thumb, has_comment, position_x, position_y, actualHeight, imageWidth, imageHeight, maxSpaceWidth, maxSpaceHeight,  loading } = this.state;
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
        const inputText            = content ? extractHashTagFromText(content) : '';
        const inputAccessoryViewID = 'inputAccessoryViewID';

        return (
            <View style={ { flex: 1, backgroundColor: 'white' } }>
                {/*<Spinner*/}
                {/*    visible={ this.state.loading }*/}
                {/*    textContent={ null }*/}
                {/*    textStyle={ { color: 'white' } }*/}
                {/*/>*/}
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <ScrollView scrollIndicatorInsets={ { right: 1 } } style={ Styles.body }>
                            <View style={ { margin: 15, paddingTop: 15 } }>
                                <UserPostInformation isMainPost={ true } profile={ this.props.userProfile }/>
                                <View style={ Styles.input }>
                                    <TextInput
                                        inputAccessoryViewID={ inputAccessoryViewID }
                                        multiline={ true }
                                        autoFocus={ true }
                                        style={ Styles.initHeightInput }
                                        onSelectionChange={ ({ nativeEvent: { selection } }) => {
                                            if (Platform.OS === 'ios') {
                                                this.setState({textPosition: selection.start - 1})
                                            } else {
                                                this.setState({textPosition: selection.start})
                                            }
                                        } }
                                        placeholder={ '#ハッシュタグ を付けて写真を投稿しよう' }
                                        onChangeText={ this.onChangeText.bind(this) }>
                                        <Text>{ inputText }</Text>
                                    </TextInput>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={ 1 }
                                    onPress={ () => {
                                        this.setState({ has_comment: !has_comment })
                                    } }
                                    style={ { flexDirection: 'row', paddingVertical: 20, alignItems: 'center' } }>
                                    <View style={ {
                                        width: 18,
                                        height: 18,
                                        borderRadius: 2,
                                        paddingBottom: 4,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: this.state.has_comment ? '#4B9FA5' : '#EFEFEF',
                                    } }>
                                        <SvgImage source={ SvgViews.IconDoneWhite }/>
                                    </View>
                                    <Text style={ { marginLeft: 10, fontSize: 17, color: '#333333' } }>コメントを受け付ける</Text>
                                </TouchableOpacity>
                                {
                                    loading ?
                                        <SkeletonPlaceholder backgroundColor={'#EAEAEA'} speed={1000}>
                                            <View style={{width: width - 30, height: (width - 30) * 2 / 3}}/>
                                        </SkeletonPlaceholder>  :
                                        <ImageBackground
                                            source={ { uri: image_thumb } }
                                            imageStyle={{
                                                top: position_y ? position_y : 0,
                                                left: position_x ? position_x : 0,
                                                height: imageHeight,
                                                width: imageWidth
                                            }}
                                            style={ {
                                            overflow: 'hidden',
                                            resizeMode: 'cover',
                                            width: width - 30,
                                            height: (width - 30) * 2 / 3,
                                            marginBottom: 15,
                                            position: 'relative'
                                        } }/>
                                }

                            </View>
                        </ScrollView>
                    }
                    bottomContent={
                        <View>
                            {
                                Platform.OS === 'ios' &&
                                <InputAccessoryView nativeID={ inputAccessoryViewID }>
                                    <View style={ {
                                        backgroundColor: 'rgba(112, 112, 112, 0.5)',
                                        padding: 15,
                                    } }>
                                        <ButtonText
                                            activeOpacity={loading ? 1 : 0.5}
                                            style={{backgroundColor: loading ? '#CCC' : '#F37B7D'}}
                                            title={ '投稿する' }
                                            onPress={ () => !loading && this.handleUpdate() }/>
                                    </View>
                                </InputAccessoryView>
                            }
                            <View style={ {
                                backgroundColor: 'rgba(112, 112, 112, 0.5)',
                                paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15,
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                        } }>
                            <ButtonText
                                activeOpacity={loading ? 1 : 0.5}
                                style={{backgroundColor: loading ? '#CCC' : '#F37B7D'}}
                                title={ '投稿する' }
                                onPress={ () => !loading && this.handleUpdate() }/>
                        </View>
                        </View>

                    }
                />

            </View>
        );
    }
}

const Styles = StyleSheet.create({
    body: {
        height: '100%',
        backgroundColor: 'white',
    },
    input: {
        paddingTop: 10,
        height: 120,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#CCCCCC',
        marginTop: 45,
        paddingVertical: 5
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
        height: 110,
        color: '#262626',
        width: '100%',
        borderWidth: 0,
        textAlignVertical: 'top',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif'
    }
});

