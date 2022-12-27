import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, SafeAreaView, PermissionsAndroid, Image, ScrollView, Dimensions, Platform, Alert} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import color from "../../../color";
import openMap from 'react-native-open-maps';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {getShopType} from "./GasStation";
import MapView , { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import {myCarService} from "../../../services";
import Spinner from 'react-native-loading-spinner-overlay';
import {viewPage} from "../../../Tracker";
import Geolocation from '@react-native-community/geolocation';
import {isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');
@screen('DetailGas', {header: <HeaderOnPress title='  '/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
    })
)
export class DetailGas extends Component {

    state = {
        distance: '',
        loading: false,
        showInsuranceModal: false,
        showOtherModal: false,
        store: null
    };

    componentDidMount() {
        this.setState({loading: true});
        const store = this.props.navigation.getParam('store');
        if (store) {
            viewPage('gasoline_detail', `ガソリンスタンド詳細-${store.Id} (${store.ShopName})`);
            myCarService.getGasStationDetail(store.Id).then(data => {
                this.setState({store: data, loading: false});
            }).catch(
                () => this.setState({loading: false})
            );
        }
    }

    async openLocation(store) {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (!granted) {
                openMap(Platform.OS === 'ios'
                    ? { latitude: parseFloat(store.Latitude), longitude: parseFloat(store.Longitude), query: store.ShopName }
                    : { query: store.Latitude + ',' + store.Longitude});
            } else {
                Geolocation.getCurrentPosition (
                    (position) => {
                        const cor = position.coords;
                        Geocoder.geocodePosition({
                            lat: cor.latitude,
                            lng: cor.longitude
                        }).then(res => {
                            if (res[0]) {
                                openMap({ start: res[0].formattedAddress, end: store.Address });
                            }
                        });
                    }, () => {},
                    {
                        enableHighAccuracy: false, timeout: 3000, maximumAge: 3600000
                    }
                );
            }
        } else {
            Geolocation.getCurrentPosition (
                (position) => {
                    const cor = position.coords;
                    Geocoder.geocodePosition({
                        lat: cor.latitude,
                        lng: cor.longitude
                    }).then(res => {
                        if (res[0]) {
                            openMap({ start: res[0].formattedAddress, end: store.Address });
                        }
                    });
                },
                () =>
                {
                    openMap(Platform.OS === 'ios'
                        ? { latitude: parseFloat(store.Latitude), longitude: parseFloat(store.Longitude), query: store.ShopName }
                        : { query: store.Latitude + ',' + store.Longitude});
                },
                {
                    enableHighAccuracy: true, timeout: 3000, maximumAge: 3600000
                }
            );
        }
    }

    render() {
        const store = this.state.store;
        return (
            <View style={{ flex: 1}}>
                <ScrollView contentInset={{ bottom: isIphoneX() ? 25 : 0 }}
                            scrollIndicatorInsets={{right: 1}} style={styles.body}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={''}
                        textStyle={{color: 'white'}}
                    />
                    {
                        store && <View>
                            <View>
                                {
                                    store.PhotoL ? <Image source={{uri: store.PhotoL}}
                                                          style={{width: width, height: 230}}/>
                                        : <View style={{ width: width, height: 230, backgroundColor: 'grey'}}/>
                                }
                            </View>
                            <View style={{ padding: 15 }}>
                                <View style={{ marginLeft: 5 }}>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>{store.ShopName || ''}</Text>
                                    <Text style={{fontSize: 14, color: '#666666', marginTop: 5}}>{store.Address}</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 10}}>
                                        {
                                            store.shop_type_name && <View style={styles.labelBorder}>
                                                <Text style={styles.labelText}>{store.shop_type_name}</Text>
                                            </View>
                                        }
                                        {
                                            store.Open24H === '1' && <View style={styles.labelBorder}>
                                                <Text style={styles.labelText}>24H</Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <ButtonCarpon disabled={false}
                                                  style={{ backgroundColor: '#007FEB', height: 50, display: 'flex' }}
                                                  onPress={() => this.openLocation(store)}>
                                        <View style={{flex: 1}}/>
                                        <View style={{ flex: 5}}>
                                            <Text style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                                color: '#FFFFFF'
                                            }}>地図アプリでルートを見る</Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <SvgImage source={() => SvgViews.MoveNext({fill: 'white'})}/>
                                        </View>
                                    </ButtonCarpon>
                                </View>
                            </View>
                            <View style={styles.g2}>
                                <Text style={{fontWeight: 'bold'}}>現金価格</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: '#F37B7D', fontWeight: 'bold', fontSize: 14}}>レギュラー</Text>
                                <Text style={{ fontSize: 16, color: '#F37B7D'}}>{store.Price1 ? store.Price1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'ー'}円</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>ハイオク</Text>
                                <Text style={{ fontSize: 16, color: '#666666'}}>{store.Price2 ? store.Price2.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'ー'}円</Text>
                            </View>
                            {
                                store.Price3 ? <View style={styles.labelInformation}>
                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>軽油</Text>
                                    <Text style={{ fontSize: 16, color: '#666666'}}>{store.Price3.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}円</Text>
                                </View> : <View/>
                            }
                            <View style={styles.g2}>
                                <Text style={{fontWeight: 'bold'}}>会員価格</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: '#F37B7D', fontWeight: 'bold', fontSize: 14}}>レギュラー</Text>
                                <Text style={{ fontSize: 16, color: '#F37B7D'}}>{store.MemberPrice1 ? store.MemberPrice1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'ー'}円</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>ハイオク</Text>
                                <Text style={{ fontSize: 16, color: '#666666'}}>{store.MemberPrice2 ? store.MemberPrice2.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'ー'}円</Text>
                            </View>
                            {
                                store.MemberPrice3 ? <View style={styles.labelInformation}>
                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>軽油</Text>
                                    <Text style={{ fontSize: 16, color: '#666666'}}>{store.MemberPrice3.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}円</Text>
                                </View> : <View/>
                            }
                            <View style={styles.g2}>
                                <Text style={{fontWeight: 'bold'}}>店舗情報</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>系列</Text>
                                <Text style={{ fontSize: 16, color: '#666666'}}>{store.maker_name}</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>店舗タイプ</Text>
                                <Text style={{ fontSize: 16, color: '#666666'}}>{store.shop_type_name}</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>営業時間</Text>
                                <Text style={{ fontSize: 16, color: '#666666'}}>{store.OpenTime || 'ー'}</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>定休時間</Text>
                                <Text style={{ fontSize: 16, color: '#666666'}}>{store.OpenClose || 'ー'}</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>営業時間補足</Text>
                                <Text style={{ fontSize: 16, color: '#666666'}}>{store.OtherOpenTime || 'ー'}</Text>
                            </View>
                            <View style={styles.labelInformation}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>サービス</Text>
                                <View style={{ alignItems: 'flex-end'}}>
                                    {store.Service1 === '1' && <Text style={{ fontSize: 16, color: '#666666'}}>洗車</Text>}
                                    {store.Service2 === '1' && <Text style={{ fontSize: 16, color: '#666666', marginTop: 3}}>車検</Text>}
                                    {store.Service3 === '1' && <Text style={{ fontSize: 16, color: '#666666', marginTop: 3}}>板金</Text>}
                                    {store.Service4 === '1' && <Text style={{ fontSize: 16, color: '#666666', marginTop: 3}}>オイル交換</Text>}
                                    {store.Service5 === '1' && <Text style={{ fontSize: 16, color: '#666666', marginTop: 3}}>タイヤ交換</Text>}
                                    {store.Service6 === '1' && <Text style={{ fontSize: 16, color: '#666666', marginTop: 3}}>レンタカー</Text>}
                                    {store.Service7 === '1' && <Text style={{ fontSize: 16, color: '#666666', marginTop: 3}}>カフェ併設</Text>}
                                    {store.Service8 === '1' && <Text style={{ fontSize: 16, color: '#666666', marginTop: 3}}>コンビニ併設</Text>}
                                </View>
                            </View>
                            <View style={styles.container}>
                                <MapView
                                    style={styles.map}
                                    region={{
                                        latitude: parseFloat(store.Latitude),
                                        longitude: parseFloat(store.Longitude),
                                        longitudeDelta:0.01,
                                        latitudeDelta:0.01
                                    }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(store.Latitude),
                                            longitude: parseFloat(store.Longitude),
                                        }}
                                        title={store.Address}
                                        description={store.ShopName}
                                    />
                                </MapView>
                            </View>
                        </View>
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        marginHorizontal: 15,
        height: width*2/3,
        width: width - 30,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        textAlign: 'center',
    },
    g2: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderBottomColor: color.active
    },
    button: {
        height: 60,
        backgroundColor: '#CCCCCC',
        borderRadius: 3
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
    textHeader: {color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'},
    labelInformation: { borderBottomWidth: 1, padding: 15, borderColor: '#E5E5E5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    labelText: {color: 'white', fontSize: 10, fontWeight: 'bold'},
    labelBorder: {backgroundColor: '#F37B7D', marginRight: 5, borderRadius: 1, paddingVertical: 2, paddingHorizontal: 5, marginTop: 6, justifyContent: 'center', alignItems: 'center'}
});
