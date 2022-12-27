import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View, Platform
} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import color from "../../../color";
import Icon from 'react-native-vector-icons/Ionicons';
import ButtonText from "../../../../components/ButtonText";
import {SingleColumnLayout} from "../../../layouts";
import openMap from 'react-native-open-maps';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import {myCarService, navigationService} from "../../../services/index";
import HTMLView from 'react-native-htmlview';
import ImageSlider from 'react-native-image-slider';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {images as imageLibrary} from "../../../../assets/index";
import CarLabel from "../../../../components/CarLabel";
import {viewPage} from "../../../Tracker";

const {width, height} = Dimensions.get('window');
@screen('DetailOilStore', {header: <HeaderOnPress title='オイル交換予約'/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    })
)
export class DetailOilStore extends Component {

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
        myCarService.getOilStoreDetail(storeId, groupId)
            .then(response => {
                if (response.detail.status) {
                    viewPage('oil_exchange_store_detail', `オイル交換店舗詳細： ${response.detail.store_id} (${response.detail.name})`)
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
            viewPage('oil_exchange_store_detail', `オイル交換店舗詳細： ${this.state.store.detail.store_id} (${this.state.store.detail.name})`)
        }
    }

    openMap() {
        const store = this.state.store;
        openMap(Platform.OS === 'ios'
            ? {latitude: parseFloat(store.lat), longitude: parseFloat(store.lng), query: store.name}
            : {query: store.lat + ',' + store.lng});
    }

    render() {
        const store = this.state.store;
        const images = this.state.images;
        const detail = store.detail;
        let domestic = '';
        let abroad = '';
        if (detail.length > 0) {
            if (detail.domestic_flg == 0) {
                domestic = '対応していません';
            } else {
                domestic += 'オイル代';
                if (detail.oil_charges_domestic !== null) {
                    domestic += detail.oil_charges_domestic == 0 ? '無料' : detail.oil_charges_domestic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '円';
                    if (detail.oil_charges_domestic != 0) {
                        domestic += detail.per_domestic == 1 ? '/台' : '/L';
                    }
                }
                domestic += '、工賃';
                if (detail.work_wages !== null) {
                    domestic += detail.work_wages == 0 ? '無料' : detail.work_wages.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '円';
                }
            }
            if (detail.import_flg == 0) {
                abroad = '対応していません';
            } else {
                abroad += 'オイル代';
                if (detail.oil_charges_import !== null) {
                    abroad += detail.oil_charges_import == 0 ? '無料' : detail.oil_charges_import.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '円';
                    if (detail.oil_charges_import != 0) {
                        abroad += detail.per_import == 1 ? '/台' : '/L';
                    }
                }
                abroad += '、工賃';
                if (detail.work_wages_import !== null) {
                    abroad += detail.work_wages_import == 0 ? '無料' : detail.work_wages_import.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '円';
                }
            }
        }
        return (
            <View style={{ flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={styles.body}>
                    {
                        images.length > 1 ? <ImageSlider loopBothSides
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
                                         }} />
                            }
                        </View>
                    }
                    <View style={{borderBottomWidth: 1, padding: 15, borderColor: '#E5E5E5'}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{store.name || ''}</Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#333333',
                            marginTop: 5
                        }}>{store.post ? '〒' + store.post : ''}{(store.address1 || '') + (store.address2 || '') + (store.address3 || '') + (store.address4 || '')}</Text>
                        <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'space-between'}}>
                            <ButtonCarpon disabled={false}
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
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D', height: 50, width: width / 2 - 20}}
                                          onPress={() => navigationService.navigate('RegisterOilUser', {store})}>
                                <View>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        color: '#FFFFFF'
                                    }}>オイル交換予約</Text>
                                </View>
                            </ButtonCarpon>
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
                        <Text style={{fontSize: 15, color: '#666666',lineHeight: 20}}>{store.detail.business_hours || ''}</Text>
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
                            textAlign: 'right',lineHeight: 20
                        }}>{store.detail.regular_holiday}</Text>
                    </View>
                    <View style={{borderBottomWidth: 1, borderColor: '#E5E5E5', paddingBottom: 10}}>
                        <Text style={{color: 'black', fontSize: 14, fontWeight: 'bold', marginLeft: 15, marginTop: 20}}>メッセージ</Text>
                        <View style={{marginHorizontal: 15, marginTop: 10}}>
                            {
                                store.detail.comment ? <HTMLView
                                    value={store.detail.comment}
                                    stylesheet={{fontSize: 26, fontWeight: 'bold'}}
                                /> : <View/>
                            }
                        </View>
                    </View>
                    <View style={styles.g2}>
                        <Text style={{fontWeight: 'bold'}}>料金</Text>
                    </View>
                    <View style={{backgroundColor: '#F6FAFB', borderBottomWidth: 1, borderColor: '#CCCCCC'}}>
                        <TouchableOpacity style={{
                            flexDirection: 'column',
                            margin: 15
                        }}>
                            <CarLabel/>
                            <View style={{ marginTop: 10}}>
                                <View style={{ marginTop: 5}}>
                                    <View style={styles.textHeader}>
                                        <Text style={{fontSize: 15}}>国産車</Text>
                                        <View>
                                            <Text style={styles.textOil}>
                                                {domestic}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.border}/>
                                    <View style={styles.textHeader}>
                                        <Text style={{fontSize: 15}}>輸入車</Text>
                                        <View>
                                            <Text style={styles.textOil}>
                                                {abroad}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.border}/>
                                    <View style={styles.textHeader}>
                                        <Text style={{fontSize: 15}}>オイルグレード</Text>
                                        <View>
                                            <Text style={{fontSize: 18, color: 'black'}}>
                                                {store.detail.oil_gradde || ''}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.border}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginHorizontal: 15, marginTop: 10}}>
                        {
                            store.detail.service_comment ? <HTMLView
                                value={store.detail.service_comment}
                                stylesheet={{fontSize: 26, fontWeight: 'bold'}}
                            /> : <View/>
                        }
                    </View>
                    <View style={{ margin: 15 }}>
                        <ButtonCarpon disabled={false}
                                      style={{backgroundColor: '#F37B7D', height: 50, width: '100%'}}
                                      onPress={() => navigationService.navigate('RegisterOilUser', {store})}>
                            <View>
                                <Text style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    color: '#FFFFFF'
                                }}>オイル交換予約</Text>
                            </View>
                        </ButtonCarpon>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    g2: {
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderBottomColor: color.active
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
    },
    width40: {
        width: '50%',
        justifyContent: 'center',
    },
    width60: {
        width: '50%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12,
        paddingLeft: 10
    },
    value: {
        paddingLeft: 10,
        marginVertical: 10
    },
    step: {
        padding: 10,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {backgroundColor: '#F2F8F9', padding: 20, marginTop: 10},
    textHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50},
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        textAlign: 'center',
    },
    textOil: {
        fontSize: 17, color: '#008833'
    },
    border: {borderWidth: 1, borderColor: '#E5E5E5',borderStyle: 'dotted', height: 1, width: '100%', borderRadius: Platform.OS === 'ios' ? 0 : 1},
});
