import React, { Component }                       from 'react';
import { screen }                                 from "../../navigation";
import Icon                                       from 'react-native-vector-icons/Ionicons';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
    Image
}                                                 from 'react-native';
import { SvgImage, SvgViews }                     from "../../components/Common/SvgImage";
import { navigationService, notificationService } from "../services/index";
import moment                                     from 'moment';
import HeaderOnPress                              from "../../components/HeaderOnPress";
import { connect }                                from "react-redux";
import {_turnOffRefresh, getAllNotification} from "../common/actions/notification";
import { viewPage }                               from "../Tracker";
import { getBottomSpace, isIphoneX } from "react-native-iphone-x-helper";
import ReadAllNotification                 from "./components/ReadAllNotification";

const { width } = Dimensions.get('window');

@screen('Notification', {
    header: <HeaderOnPress title={ 'お知らせ' } leftComponent={ <Icon name="md-close" size={ 30 } color="#FFFFFF"/> }
                           rightComponent={ <ReadAllNotification name={'すべて既読'} color={'#fff'} bold={'bold'}/> }/>
})
@connect(state => ({
    _refresh: state.notification ? state.notification.refresh : false,
    unreadNotificationNumber: state.notification ? state.notification.unreadNumber : 0

}), dispatch => ({
    getAllNotification: () => dispatch(getAllNotification()),
    _turnOffRefresh: ()=> dispatch(_turnOffRefresh()),
    setOpenState: state => {
        dispatch({
            type: 'SIDE_MENU_STATE',
            state
        })
    },
}))

export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mails: [],
            refresh: false,
            has_next: false,
            page: 1,
            isRender: false
        };
    }

    componentDidMount() {
        viewPage('notifications_list', 'お知らせ一覧');
        this.getNotification(1);
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        nextProps._refresh && this.handleRefresh();
    }

    getNotification(page) {
        this.setState({
            refresh: true
        });
        notificationService.getAllNotifications({ page }).then(response => {
            this.setState({
                mails: page === 1 ? response.data : this.state.mails.concat(response.data),
                has_next: response.has_next,
                page: page,
                refresh: false,
                isRender: true
            })
        });
    }

    renderFooter(ready) {
        if (!ready) {
            return null;
        }
        return (
            <View
                style={ {
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                } }
            >
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };

    handleRefresh() {
        this.props._turnOffRefresh();
        if (!this.state.refresh) {
            this.getNotification(1)
        }
    }

    handleLoadMore() {
        let page = this.state.page + 1;
        if (!this.state.refresh && this.state.has_next) {
            this.getNotification(page)
        }
    }

    goToDetail(mail) {
        this.props.setOpenState(false);
        if (mail.destination === 'carpon.MyPageScreen') {
            notificationService.updateReadNotification(mail.id).then(() => {
                this.props.getAllNotification();
                this.handleRefresh()
            });
            navigationService.navigate('MyPageScreen', { profile_id: mail.params.user_trigger })
        } else {
            navigationService.navigate('DetailNotification', { id: mail.id, refresh: () => this.handleRefresh() })
        }
    }

    handleTagColor(labelType) {
        switch (labelType) {
            case 'Normal':
                return '#4B9FA5';
            case 'Strong':
                return '#F37B7D';
            default:
                return '#4B9FA5'
        }
    }

    _renderNotification({ item, index }) {
        const mail = item;
        return (
            <TouchableOpacity activeOpacity={ 1 } key={ index } style={ {
                borderWidth: 0.5,
                borderColor: '#CCC',
                backgroundColor: mail.isRead ? '#EFEFEF' : '#FFF'
            } } onPress={ () => this.goToDetail(mail) }>
                {
                    mail.destination === 'carpon.MyPageScreen' ?
                        <View style={ { margin: 20, flexDirection: 'row', justifyContent: 'space-between' } }>
                            <View style={ { flexDirection: 'row' } }>
                                <View style={ {
                                    width: width / 5, justifyContent: 'center'
                                } }>
                                    <Image source={ { uri: mail.avatar } } style={ {
                                        width: width / 5,
                                        height: width / 5,
                                        borderRadius: width / 10,
                                        borderColor: '#E5E5E5',
                                        borderWidth: 1
                                    } }/>
                                </View>
                                <View style={ { width: (width * 4 / 5) - 60, marginLeft: 20 } }>
                                    <Text style={ { fontSize: 12, textAlign: 'right' } }>
                                        { moment(mail.createDate).format('YYYY年M月D日') }
                                    </Text>
                                    <Text style={ {
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: '#666666', marginTop: 5
                                    } }>
                                        { mail.title }
                                    </Text>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={ { margin: 20, flexDirection: 'row', justifyContent: 'space-between' } }>
                            <View style={ { width: '95%' } }>
                                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                                    <View style={ {
                                        backgroundColor: this.handleTagColor(mail.labelType),
                                        borderRadius: 2,
                                        height: 14,
                                        width: 80,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    } }>
                                        <Text numberOfLines={ 1 }
                                              style={ { color: '#fff', fontSize: 8, fontWeight: 'bold' } }>
                                            { mail.tag }
                                        </Text>
                                    </View>
                                    <View style={ { height: 14, alignItems: 'center', justifyContent: 'center' } }>
                                        <Text style={ { fontSize: 12 } }>
                                            { moment(mail.createDate).format('YYYY年M月D日') }
                                        </Text>
                                    </View>
                                </View>
                                <View style={ { marginTop: 10 } }>
                                    <View>
                                        { mail.title.length < 18 ?
                                            <Text style={ {
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                                marginBottom: 5,
                                                color: '#666666'
                                            } }>{ mail.title }</Text>
                                            : <Text style={ {
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                                marginBottom: 5,
                                                color: '#666666'
                                            } }>{ mail.title.substring(0, 22) }...</Text>
                                        }
                                        { mail.content.length < 20 ?
                                            <Text style={ { fontSize: 12, color: '#666666' } }>{ mail.content }</Text>
                                            : <Text
                                                style={ {
                                                    fontSize: 12,
                                                    color: '#666666'
                                                } }>{ mail.content.substring(0, 40) }</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={ { justifyContent: 'center', alignItems: 'center', width: '5%' } }>
                                <SvgImage source={ SvgViews.ArrowLeft }/>
                            </View>
                        </View>
                }
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={ { backgroundColor: '#FFFFFF', height: '100%' } }>
                {
                    this.state.mails.length > 0 ? <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={ this.state.refresh }
                                    onRefresh={ this.handleRefresh.bind(this) }
                                />
                            }
                            scrollIndicatorInsets={ { right: 1 } }
                            contentInset={ { bottom: isIphoneX() ? getBottomSpace() : 0 } }
                            data={ this.state.mails }
                            renderItem={ this._renderNotification.bind(this) }
                            onEndReachedThreshold={ 0.8 }
                            onEndReached={ this.handleLoadMore.bind(this) }
                            ListFooterComponent={ this.renderFooter.bind(this, this.state.has_next) }
                        />
                        : <View>
                            {
                                this.state.isRender &&
                                <View style={ { height: '100%', alignItems: 'center', justifyContent: 'center' } }>
                                    <Text>通知はありません</Text>
                                </View>
                            }
                        </View>


                }

            </View>
        )
    }
}
