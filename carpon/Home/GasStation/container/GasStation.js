import React, {Component} from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity, Image,
    ScrollView, Dimensions, ActivityIndicator, Platform, Alert, Linking, PermissionsAndroid, RefreshControl
} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import color from "../../../color";
import {Dropdown} from 'react-native-material-dropdown';
import {getListGasStations} from "../actions/gasAction";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import openMap from 'react-native-open-maps';
import Geocoder from 'react-native-geocoder';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";
import Geolocation from '@react-native-community/geolocation';
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";
import SingleBanner                from "../../../../components/SingleBanner/SingleBanner";

const {width, height} = Dimensions.get('window');

@screen('GasStation', {header: <HeaderOnPress title='ガソリンスタンド'/>})
@connect(state => ({
        listRange: state.inspectionReducer.listRange,
        range: state.gasReducer.range,
        stores: state.gasReducer.listGasStation,
        ItemPriceMin: state.gasReducer.ItemPriceMin,
        lowestThreeStation: state.gasReducer.lowestThreeStation || [],
        loading: state.gasReducer.loading
    }),
    dispatch => ({
        getListGasStations: (range) => dispatch(getListGasStations(range)),
    }))
export class GasStation extends Component {

    state = {
        distance: '5',
        showInsuranceModal: false,
        showOtherModal: false,
        isShow: false,
        refreshing: false
    };

    getListStores(distance) {
        this.setState({distance});
        this.props.getListGasStations(distance);
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.props.getListGasStations(this.state.distance);
        setTimeout(() => {
            this.setState({refreshing: false});
        }, 5000)
    }

    componentDidMount() {
        viewPage('gasoline_list', 'ガソリンスタンド一覧');
        setTimeout(() => {
            this.setState({isShow: true})
        }, 100);
    }

    componentWillMount() {
        this.checkLocationPermission();
    }

    async checkLocationPermission() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (!granted) {
                Alert.alert(
                    '位置情報へのアクセスを許可',
                    '位置情報の利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                    [
                        {
                            text: 'いいえ',
                        },
                        {
                            text: 'はい',
                            onPress: () => AndroidOpenSettings.appDetailsSettings()
                        }
                    ])
            }
        } else {
            Geolocation.getCurrentPosition(() => {
            }, () => {
                Alert.alert(
                    '位置情報へのアクセスを許可',
                    '位置情報の利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                    [
                        {
                            text: 'いいえ',
                        },
                        {
                            text: 'はい',
                            onPress: () => Linking.openURL('app-settings:')
                        }
                    ])
            }, {enableHighAccuracy: false, timeout: 3000, maximumAge: 3600000});
        }
    }

    async openLocation(store) {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (!granted) {
                openMap(Platform.OS === 'ios' ?
                    {
                        latitude: parseFloat(store.Latitude),
                        longitude: parseFloat(store.Longitude),
                        query: store.ShopName
                    }
                    : {query: store.Latitude + ',' + store.Longitude});
            } else {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const cor = position.coords;
                        Geocoder.geocodePosition({
                            lat: cor.latitude,
                            lng: cor.longitude
                        }).then(res => {
                            if (res[0]) {
                                openMap({start: res[0].formattedAddress, end: store.Address});
                            }
                        });
                    }, () => {
                    },
                    {
                        enableHighAccuracy: false, timeout: 3000, maximumAge: 3600000
                    }
                );
            }
        } else {
            Geolocation.getCurrentPosition(
                (position) => {
                    const cor = position.coords;
                    Geocoder.geocodePosition({
                        lat: cor.latitude,
                        lng: cor.longitude
                    }).then(res => {
                        if (res[0]) {
                            openMap({start: res[0].formattedAddress, end: store.Address});
                        }
                    });
                },
                () => {
                    openMap(Platform.OS === 'ios' ?
                        {
                            latitude: parseFloat(store.Latitude),
                            longitude: parseFloat(store.Longitude),
                            query: store.ShopName
                        }
                        : {query: store.Latitude + ',' + store.Longitude});
                },
                {
                    enableHighAccuracy: true, timeout: 3000, maximumAge: 3600000
                }
            );
        }
    }

    _renderItem = ({item, index, topPrice}) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('DetailGas', {store: item})}
                              style={{
                                  borderBottomWidth: 1,
                                  padding: 15,
                                  borderColor: '#E5E5E5',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  width,
                                  justifyContent: 'space-between'
                              }} key={index}>
                {
                    topPrice && <View style={{position: 'absolute', top: 0, right: 0}}>
                        <View style={{
                            width: 0,
                            height: 0,
                            backgroundColor: 'transparent',
                            borderStyle: 'solid',
                            borderRightWidth: 40,
                            borderTopWidth: 40,
                            borderRightColor: 'transparent',
                            borderTopColor: index === 2 ? '#999999' : '#BF6B3C',
                            transform: [
                                {rotate: '90deg'}
                            ]
                        }}/>
                        <Text style={{
                            position: 'absolute',
                            zIndex: 10,
                            top: 0,
                            right: 3,
                            color: 'white',
                            fontSize: 17,
                            lineHeight: 24
                        }}>{index}</Text>
                    </View>
                }
                <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', width: width - 50}}>
                    <View>
                        <View style={{flexDirection: 'row', width: width - 50}}>
                            {
                                item.logo_url &&
                                <Image source={{uri: item.logo_url}} style={{width: 16, height: 16, marginTop: 3}}/>
                            }
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginLeft: 5,
                                color: '#333333'
                            }}>{item.ShopName}</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            width: width - 50,
                            justifyContent: 'space-between',
                            marginTop: 10
                        }}>
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: '#333333', fontSize: 13, marginTop: 5}}>現在地からの距離：</Text>
                                    <Text style={{
                                        color: '#333333',
                                        fontSize: 18
                                    }}>{item.Distance ? Math.round(parseInt(item.Distance) / 100) / 10 : ''}</Text>
                                    <Text style={{color: '#333333', fontSize: 12, marginTop: 6}}> km</Text>
                                </View>
                                <View style={{flexDirection: 'row', width: width - 150, flexWrap: 'wrap'}}>
                                    <Text style={{color: '#333333', fontSize: 10, marginTop: 14}}>レギュラー </Text>
                                    <Text style={{color: '#333333', fontSize: 25}}>{item.Price}</Text>
                                    <Text style={{color: '#333333', fontSize: 14, marginTop: 10}}> 円／L</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        item.shop_type_name && <View style={styles.labelBorder}>
                                            <Text style={styles.labelText}>{item.shop_type_name}</Text>
                                        </View>
                                    }
                                    {
                                        item.Open24H === '1' && <View style={styles.labelBorder}>
                                            <Text style={styles.labelText}>24H</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                            <View>
                                <View style={{borderColor: color.active, borderWidth: 1, borderBottomWidth: 0}}>
                                    <Image style={{width: 75, height: 59}}
                                           source={{uri: item.PhotoS}}/>
                                </View>
                                <View style={{width: 75, height: 16, flexDirection: 'row'}}>
                                    <View style={{
                                        width: 39,
                                        backgroundColor: item.Price ? '#0075C2' : '#E5E5E5',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            fontSize: 9
                                        }}>現金</Text>
                                    </View>
                                    <View style={{
                                        width: 38,
                                        backgroundColor: item.MemberPrice ? '#DC3545' : '#E5E5E5',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            fontSize: 9
                                        }}>会 員</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{width: width - 50, marginTop: 10}}>
                            <Text style={{fontSize: 15, lineHeight: 22, color: '#333333'}}>
                                営業時間：{item.OpenTime} {item.OtherOpenTime}／定休日：{item.OpenClose}
                            </Text>
                        </View>
                    </View>

                </View>
                <View style={{justifyContent: 'center', alignItems: 'flex-end', width: 20}}>
                    <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                </View>
            </TouchableOpacity>
        )
    };

    renderTopPrice(ItemPriceMin) {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigationService.navigate('DetailGas', {store: ItemPriceMin})}
                style={{
                    borderBottomWidth: 1,
                    padding: 15,
                    borderColor: '#E5E5E5',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between'
                }}>
                <View style={{position: 'absolute', top: 0, right: 0}}>
                    <View style={{
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        borderRightWidth: 40,
                        borderTopWidth: 40,
                        borderRightColor: 'transparent',
                        borderTopColor: '#D6B04F',
                        transform: [
                            {rotate: '90deg'}
                        ]
                    }}/>
                    <Text style={{
                        position: 'absolute',
                        zIndex: 10,
                        top: 0,
                        right: 3,
                        color: 'white',
                        fontSize: 17,
                        lineHeight: 24
                    }}>1</Text>
                </View>
                <View style={{width: width - 50}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{width: 50}}>
                            {
                                (ItemPriceMin && ItemPriceMin.logo_url) ?
                                    <Image source={{uri: ItemPriceMin.logo_url}} style={{width: 40, height: 40}}/>
                                    : <View style={{width: 40, height: 40, backgroundColor: 'grey'}}/>
                            }
                        </View>
                        <View style={{width: width - 140, justifyContent: 'center'}}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#333333'
                            }}>{ItemPriceMin.ShopName}</Text>
                            <Text style={{fontSize: 13, color: '#333333'}}>{ItemPriceMin.Address}</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent: 'space-between',
                        width: width - 50
                    }}>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: '#333333', fontSize: 13, marginTop: 5}}>現在地からの距離：</Text>
                                <Text style={{
                                    color: '#333333',
                                    fontSize: 18
                                }}>{ItemPriceMin.Distance ? Math.round(parseInt(ItemPriceMin.Distance) / 100) / 10 : ''}</Text>
                                <Text style={{color: '#333333', fontSize: 12, marginTop: 6}}> km</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: '#333333', fontSize: 10, marginTop: 14}}>レギュラー </Text>
                                <Text style={{color: '#333333', fontSize: 25}}>{ItemPriceMin.Price}</Text>
                                <Text style={{color: '#333333', fontSize: 14, marginTop: 10}}> 円／L</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                {
                                    ItemPriceMin && ItemPriceMin.shop_type_name && <View style={styles.labelBorder}>
                                        <Text style={styles.labelText}>{ItemPriceMin.shop_type_name}</Text>
                                    </View>
                                }
                                {
                                    ItemPriceMin.Open24H === '1' && <View style={styles.labelBorder}>
                                        <Text style={styles.labelText}>24H</Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View>
                            <View style={{borderColor: color.active, borderWidth: 1, borderBottomWidth: 0}}>
                                <Image style={{width: 75, height: 59}}
                                       source={{uri: ItemPriceMin.PhotoS}}/>
                            </View>
                            <View style={{width: 75, height: 16, flexDirection: 'row'}}>
                                <View style={{
                                    width: 39,
                                    backgroundColor: ItemPriceMin.Price ? '#0075C2' : '#E5E5E5',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        fontSize: 9
                                    }}>現金</Text>
                                </View>
                                <View style={{
                                    width: 38,
                                    backgroundColor: ItemPriceMin.MemberPrice ? '#DC3545' : '#E5E5E5',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text
                                        style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 9}}>会
                                        員</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{width: width - 50, marginTop: 10}}>
                        <Text style={{fontSize: 15, lineHeight: 22, color: '#333333'}}>
                            営業時間：{ItemPriceMin.OpenTime} {ItemPriceMin.OtherOpenTime}／定休日：{ItemPriceMin.OpenClose}
                        </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                        <ButtonCarpon disabled={false}
                                      style={{backgroundColor: '#007FEB', height: 50, display: 'flex'}}
                                      onPress={() => this.openLocation(ItemPriceMin)}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 5}}>
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
                <View style={{justifyContent: 'center', alignItems: 'flex-end', width: 20}}>
                    <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const ItemPriceMin = this.props.ItemPriceMin;
        const lowestThreeStation = [];
        if (this.props.lowestThreeStation && this.props.lowestThreeStation.length > 0) {
            for (let i = 1; i < this.props.lowestThreeStation.length; i++) {
                lowestThreeStation.push(this._renderItem({
                    item: this.props.lowestThreeStation[i],
                    index: i + 1,
                    topPrice: true
                }))
            }
        }
        const listRange = this.props.listRange.filter(item => item.value !== '100' && item.label !== 'すべて');

        return (
            <ScrollView
                contentInset={{ bottom: isIphoneX() ? getBottomSpace() : 0 }}
                scrollIndicatorInsets={{right: 1}}
                style={styles.body}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this._onRefresh()}
                    />
                }>
                <View>
                    <SingleBanner/>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingTop: 25,
                    alignItems: 'center',
                    borderBottomWidth: (ItemPriceMin && ItemPriceMin.Price) ? 1 : 0,
                    borderColor: '#CCCCCC',
                    paddingBottom: 10
                }}>
                    <Text style={{fontSize: 14, color: '#333333'}}>現在地からの距離</Text>
                    <View style={{
                        width: 100,
                        borderWidth: 1,
                        borderColor: '#E5E5E5',
                        borderRadius: 5,
                        marginRight: 20,
                        marginLeft: 10
                    }}>
                        <Dropdown
                            baseColor={color.active}
                            value={this.props.range ? `${this.props.range}km` : this.state.distance}
                            fontSize={14}
                            containerStyle={{paddingHorizontal: 10, height: 40}}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            dropdownOffset={{top: 10, left: 0}}
                            renderAccessory={(() =>
                                <View style={{paddingTop: 5, paddingRight: 5}}>
                                    <SvgImage source={SvgViews.Filter}/>
                                </View>)}
                            data={listRange}
                            onChangeText={(value) => this.getListStores(value)}
                        />
                    </View>
                </View>
                <View style={styles.g2}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 17,
                        lineHeight: 24,
                        color: '#262525'
                    }}>現在地周辺のガソリン最安ランキング</Text>
                </View>
                <View>
                    {
                        (this.state.isShow && !this.props.loading) ? <View>
                                <View>
                                    {
                                        (this.props.lowestThreeStation && this.props.lowestThreeStation.length > 0) && this.renderTopPrice(ItemPriceMin)
                                    }
                                    {lowestThreeStation}
                                    <View style={{...styles.g2, marginTop: 25}}>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            fontSize: 17,
                                            lineHeight: 24,
                                            color: '#262525'
                                        }}>現在地周辺のガソリンスタンド </Text>
                                    </View>
                                    <View>
                                        <FlatList
                                            style={{marginTop: 10}}
                                            data={this.props.stores}
                                            renderItem={this._renderItem.bind(this)}
                                            onEndReachedThreshold={0.8}
                                        />
                                    </View>
                                </View>
                            </View>
                            :
                            <View>
                                {
                                    (this.props.loading || !this.state.isShow) ? <View style={{
                                            borderRadius: 3,
                                            width: width,
                                            height: 300,
                                            opacity: 0.5,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {
                                                this.state.refreshing ? <View/> :
                                                    <ActivityIndicator size={'large'} color={'grey'}/>
                                            }
                                        </View>
                                        : <View style={{marginLeft: 15, marginTop: 15}}>
                                            <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>見つかりません</Text>
                                            <Text
                                                style={{fontSize: 17, color: '#333333', marginTop: 10}}>対象範囲を広げてください。</Text>
                                        </View>
                                }
                            </View>
                    }
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        textAlign: 'center'
    },
    g2: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
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
    labelText: {color: 'white', fontSize: 10, fontWeight: 'bold'},
    labelBorder: {
        backgroundColor: '#F37B7D',
        marginRight: 5,
        borderRadius: 1,
        paddingVertical: 2,
        paddingHorizontal: 5,
        marginTop: 6,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
