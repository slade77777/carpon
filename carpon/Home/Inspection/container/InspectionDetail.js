import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import HTMLView from 'react-native-htmlview';
import color from "../../../color";
import CarInspectionCost from "../components/CarInspectionCost";
import ButtonText from "../../../../components/ButtonText";
import openMap from 'react-native-open-maps';
import {images as imageLibrary} from "../../../../assets/index";
import {myCarService, navigationService} from "../../../services/index";
import Overlay from 'react-native-modal-overlay';
import {getUserProfile} from "../../../Account/actions/accountAction";
import ImageSlider from 'react-native-image-slider';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {viewPage} from "../../../Tracker";

const {width} = Dimensions.get('window');
const serviceList = [
    {
        key: 'one_hour_inspect',
        value: '車検60分以内 有り'
    },
    {
        key: 'duty_inspect',
        value: '法定24ヶ月点検 有り'
    },
    {
        key: 'face2face_estimate',
        value: '立会い点検見積もり 有り'
    },
    {
        key: 'holiday_inspect',
        value: '日曜・祝日車検対応 有り'
    },
    {
        key: 'import_car',
        value: '輸入車対応 有り'
    },
    {
        key: 'pick_up_n_drop',
        value: '引き取り納車 有り'
    },
    {
        key: 'morning_night_accept',
        value: '夜間早朝対応 有り'
    },
    {
        key: 'one_day_inspect',
        value: '朝預かり夕方渡し車検 有り'
    },
    {
        key: 'two_year_warrant',
        value: '整備保証2年付き'
    },
    {
        key: 'delivery_estimate',
        value: '出張見積もり 有り'
    },
    {
        key: 'big_car_inspect',
        value: '大型車車検 有り'
    },
    {
        key: 'special_car_inspect',
        value: '特殊車車検 有り'
    },
    {
        key: 'bike_inspect',
        value: 'バイク車検 有り'
    }
];

const discountList = [
    {
        key: 'morning_service',
        value: '早朝予約特典 有り'
    },
    {
        key: 'credit_payment',
        value: '全額カード払い可能'
    },
    {
        key: 'road_service',
        value: 'ロードサービス特典 有り'
    },
    {
        key: 'weekday_discount',
        value: '平日割引 有り'
    },
    {
        key: 'present',
        value: 'プレゼント 有り'
    },
    {
        key: 'gasoline_discount',
        value: 'ガソリン割引 有り'
    },
    {
        key: 'play_area',
        value: 'キッズスペース 有り'
    },
    {
        key: 'first_time_discount',
        value: '新車初回割引 有り'
    },
    {
        key: 'hybrid_discount',
        value: 'ハイブリッド割引 有り'
    },
];

@screen('InspectionDetail', {header: <HeaderOnPress title='店舗情報'/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
    }),
    dispatch => ({
        getUserProfile: () => dispatch(getUserProfile()),
    })
)
export class InspectionDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            available: true,
            loading: false,
            distance: '',
            showInsuranceModal: false,
            showOtherModal: false,
            service: ['車検60分以内', '法定24ヶ月点検', '立ち会い点検見積', '日曜・祝日OK', '輸入車OK', '引き取り納車'],
            images: [],
            store: {
                detail: {}
            },
        };
    }

    componentWillMount() {
        const store = this.props.navigation.getParam('store');
        if (store) {
            this.setState({store: store});
            this.handleImages(store.end_point, store.detail);
        } else {
            const groupId = this.props.navigation.getParam('group_id');
            const storeId = this.props.navigation.getParam('store_id');
            this.handleLoadStore(storeId, groupId)
        }
    }

    handleLoadStore(storeId, groupId) {
        this.setState({loading: true});
        myCarService.getInspectionStoreBy(storeId, groupId)
            .then(response => {
                if (response.detail.status) {
                    viewPage('car_inpection_store_detail', `車検店舗_詳細： ${response.detail.store_id} (${response.detail.name})`)
                    this.setState({loading: false, store: response});
                    this.handleImages(response.end_point, response.detail);
                } else {
                    this.setState({loading: false, available: false});
                }
            })
    }

    handleImages(end_point, store) {
        let images = [];
        for (let i = 1; i <= 3; i++) {
            if (store['image_url' + i]) {
                images.push({
                    url: end_point + store['image_url' + i]
                });
            } else {
                break;
            }
        }
        this.setState({images});
    }

    componentDidMount() {
        if (this.state.store.detail && this.state.store.detail.store_id) {
            viewPage('car_inpection_store_detail', `車検店舗_詳細： ${this.state.store.detail.store_id} (${this.state.store.detail.name})`)
        }
    }

    openMap() {
        const {store} = this.state;
        openMap(Platform.OS === 'ios'
            ? {latitude: parseFloat(store.lat), longitude: parseFloat(store.lng), query: store.name}
            : {query: store.lat + ',' + store.lng});
    }

    render() {
        const {store} = this.state;
        const images = this.state.images;
        const detailStore = store.detail;
        return (
            <View style={{flex: 1}}>
                {
                    this.state.loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>
                }
                <ScrollView scrollIndicatorInsets={{right: 1}} style={styles.body}>
                    <Overlay visible={this.state.showInsuranceModal}
                             onClose={() => this.setState({showInsuranceModal: false})}
                             childrenWrapperStyle={{borderRadius: 5, backgroundColor: '#F8F8F8'}}
                             closeOnTouchOutside={true}>
                        <View>
                            <Text style={{
                                color: 'black',
                                fontSize: 18,
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>法定費用とは</Text>
                            <Text style={{color: 'black', marginVertical: 10, fontSize: 17, lineHeight: 24}}>
                                自賠責保険は、俗に「強制保険」とも呼ばれ、自動車やバイクを運転する時に、法律で加入することが義務付けられている（強制されている）保険です。
                                自賠責保険は、「自動車損害賠償保障法」という法律で加入が義務付けられている自動車やバイクの保険で、正式名称を「自動車損害賠償責任保険」といいます。
                            </Text>
                            <ButtonText title={'OK'} onPress={() => this.setState({showInsuranceModal: false})}/>
                        </View>
                    </Overlay>
                    <Overlay visible={this.state.showOtherModal} onClose={() => this.setState({showOtherModal: false})}
                             childrenWrapperStyle={{borderRadius: 5, backgroundColor: '#F8F8F8'}}
                             closeOnTouchOutside={true}>
                        <View>
                            <Text style={{
                                color: 'black',
                                fontSize: 18,
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>車検基本料、手数料とは</Text>
                            <Text style={{color: 'black', marginVertical: 10, fontSize: 17, lineHeight: 24}}>
                                車検には、法定費用以外に、24カ月定期点検料、測定検査料、車検代行手数料が必要です。車検基本料または手数料には人件費が含まれているため、車検工場によって金額に差があります。
                            </Text>
                            <ButtonText title={'OK'} onPress={() => this.setState({showOtherModal: false})}/>
                        </View>
                    </Overlay>
                    {
                        images.length > 1 ?
                            <ImageSlider
                                loopBothSides
                                autoPlayWithInterval={0}
                                style={{height: 250}}
                                loop={true}
                                images={images}
                                customSlide={({index, item}) => (
                                    <View style={{width}} key={index}>
                                        {images[index + 1] &&
                                        <Image source={{uri: images[index + 1].url}}
                                               style={{
                                                   width,
                                                   height: 250,
                                                   padding: 0,
                                                   margin: 0
                                               }}/>}
                                    </View>
                                )}
                                customButtons={(position, move) => (
                                    <View style={styles.buttons}>
                                        {images.map((image, index) => {
                                            return (
                                                <View
                                                    key={index}
                                                    underlayColor="#ccc"
                                                    style={[
                                                        styles.button,
                                                        position === index && styles.buttonSelected,
                                                    ]}
                                                />
                                            );
                                        })}
                                    </View>
                                )}
                            /> : <View style={{width}}>
                                {images[0] ? <Image source={{uri: images[0].url}}
                                                    style={{
                                                        width,
                                                        height: 250,
                                                        padding: 0,
                                                        margin: 0
                                                    }}/>
                                    : <Image source={imageLibrary.noImage}
                                             style={{
                                                 width,
                                                 height: 250,
                                                 padding: 0,
                                                 margin: 0
                                             }}/>
                                }
                            </View>
                    }
                    <View style={{borderBottomWidth: 1, padding: 15, borderColor: '#E5E5E5'}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{detailStore.name || ''}</Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#333333',
                            marginTop: 5
                        }}>{detailStore.post ? '〒' + detailStore.post : ''}{(detailStore.address1 || '') + (detailStore.address2 || '') + (detailStore.address3 || '') + (detailStore.address4 || '')}</Text>
                        <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'space-between'}}>
                            <ButtonCarpon disabled={!this.state.available}
                                          style={{
                                              backgroundColor: '#007FEB',
                                              height: 50,
                                              justifyContent: 'center',
                                              width: width / 2 - 20
                                          }}
                                          onPress={() => this.openMap()}>
                                <View>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        color: '#FFFFFF'
                                    }}>地図アプリで開く</Text>
                                </View>
                                <View>
                                    <SvgImage source={() => SvgViews.MoveNext({fill: 'white'})}/>
                                </View>
                            </ButtonCarpon>
                            <ButtonCarpon disabled={!this.state.available}
                                          style={{backgroundColor: '#F37B7D', height: 50, width: width / 2 - 20}}
                                          onPress={() => navigationService.navigate('RegisterInspection', {store})}>
                                <View>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        color: '#FFFFFF'
                                    }}>来店予約</Text>
                                </View>
                            </ButtonCarpon>
                        </View>
                        <View style={{
                            borderColor: '#FF9900',
                            borderWidth: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 30
                        }}>
                            <SvgImage style={{marginVertical: 15, marginLeft: '5%'}}
                                      source={SvgViews.InspectionAdvertise}/>
                        </View>
                    </View>
                    <View style={{
                        borderBottomWidth: 1,
                        padding: 15,
                        borderColor: '#E5E5E5',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 14}}>営業時間</Text>
                        <Text style={{
                            fontSize: 15,
                            color: '#666666',
                            lineHeight: 20
                        }}>{detailStore.business_hours || ''}</Text>
                    </View>
                    <View style={{
                        borderBottomWidth: 1,
                        padding: 15,
                        borderColor: '#E5E5E5',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 14}}>定休日</Text>
                        <Text style={{
                            fontSize: 15,
                            color: '#666666',
                            width: '70%',
                            textAlign: 'right', lineHeight: 20
                        }}>{detailStore.regular_holiday}</Text>
                    </View>
                    <View style={{borderBottomWidth: 1, borderColor: '#E5E5E5', paddingBottom: 10}}>
                        <Text style={{
                            color: 'black',
                            fontSize: 14,
                            fontWeight: 'bold',
                            marginLeft: 15,
                            marginTop: 20
                        }}>メッセージ</Text>
                        <View style={{marginHorizontal: 15, marginTop: 10}}>
                            {
                                detailStore.comment ? <HTMLView
                                    value={detailStore.comment}
                                    stylesheet={{fontSize: 26, fontWeight: 'bold'}}
                                /> : <View/>
                            }
                        </View>
                    </View>
                    <View style={styles.g2}>
                        <Text style={{fontWeight: 'bold'}}>料金</Text>
                    </View>
                    <CarInspectionCost storeDetail={detailStore}
                                       onPressFirst={() => this.setState({showInsuranceModal: true})}
                                       onPressSecond={() => this.setState({showOtherModal: true})}/>
                    <View style={{margin: 15}}>
                        {
                            detailStore.service_comment ? <HTMLView
                                value={detailStore.service_comment}
                                stylesheet={{fontSize: 26, fontWeight: 'bold'}}
                            /> : <View/>
                        }
                    </View>
                    <View style={styles.g2}>
                        <Text style={{fontWeight: 'bold'}}>取り扱いサービス</Text>
                    </View>
                    <View style={{margin: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                        {
                            serviceList && serviceList.map((service, index) => {
                                return <View style={{
                                    borderColor: (detailStore.services && detailStore.services[service.key]) ? '#4B9FA5' : '#E5E5E5',
                                    backgroundColor: (detailStore.services && detailStore.services[service.key]) ? '#B1DBDE' : '#F8F8F8',
                                    borderWidth: 1,
                                    margin: 5,
                                    padding: 8,
                                    borderRadius: 5
                                }} key={index}>
                                    <Text
                                        style={{color: (detailStore.services && detailStore.services[service.key]) ? '#333333' : '#CCCCCC'}}>{service.value}</Text>
                                </View>
                            })
                        }
                    </View>
                    <View style={styles.g2}>
                        <Text style={{fontWeight: 'bold'}}>その他（割引・特典）</Text>
                    </View>
                    <View style={{margin: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                        {
                            discountList && discountList.map((discount, index) => {
                                return <View style={{
                                    borderColor: (detailStore.services && detailStore.services[discount.key]) ? '#4B9FA5' : '#E5E5E5',
                                    backgroundColor: (detailStore.services && detailStore.services[discount.key]) ? '#B1DBDE' : '#F8F8F8',
                                    borderWidth: 1,
                                    margin: 5,
                                    padding: 8,
                                    borderRadius: 5
                                }} key={index}>
                                    <Text
                                        style={{color: (detailStore.services && detailStore.services[discount.key]) ? '#333333' : '#CCCCCC'}}>{discount.value}</Text>
                                </View>
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        textAlign: 'center',
    },
    g2: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        backgroundColor: '#F8F8F8',
        borderTopWidth: 1,
        borderBottomWidth: 2,
        borderTopColor: '#CCCCCC',
        borderBottomColor: color.active
    },
    content: {
        fontSize: 13,
        lineHeight: 17,
        color: '#6F7579'
    },
    buttons: {
        height: 15,
        marginTop: -25,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    button: {
        margin: 8,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#CCCCCC',
        opacity: 0.9,
    },
    buttonSelected: {
        opacity: 1,
        backgroundColor: '#F37B7D',
    }
});
