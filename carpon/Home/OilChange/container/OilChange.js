import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import color from "../../../color";
import moment from 'moment';
import {Dropdown} from "react-native-material-dropdown";
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import {myCarService, navigationService} from "../../../services/index";
import Spinner from 'react-native-loading-spinner-overlay';
import {getListOilStores} from "../actions/oilAction";
import Icon from 'react-native-vector-icons/FontAwesome';
import {images} from "../../../../assets/index";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');

@screen('OilChange', {
    header: <HeaderOnPress title='オイル交換' rightContent={{
        icon: 'IconEdit',
        color: '#FFF',
        nextScreen: 'UpdateOilChange'
    }}/>
})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
        listRange: state.inspectionReducer.listRange,
        range: state.oilReducer.range,
        stores: state.oilReducer.listStore,
        loading: state.oilReducer.loading
    }),
    dispatch => ({
        getListOilStores: (range) => dispatch(getListOilStores(range))
    }))
export class OilChange extends Component {
    state = {
        distance: '30',
    };

    componentDidMount() {
        viewPage('oil_exchange', 'オイル交換');
    }

    getListStores(distance) {
        this.setState({distance});
        this.props.getListOilStores(distance);
    }

    _renderItem({item, index}) {
        let detail = item.detail;
        let domestic = '';
        let abroad = '';
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
        return (
            <TouchableOpacity onPress={() => navigationService.navigate('DetailOilStore', {store: item})} style={{
                flexDirection: 'row',
                paddingLeft: 20,
                borderColor: '#E5E5E5',
                borderTopWidth: 1,
                paddingBottom: 10
            }} key={index}>
                <View style={{flexDirection: 'column', width: width - 60}}>
                    <View style={{borderColor: '#E5E5E5', flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
                        <View style={{width: width - 160}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.name}</Text>
                            <Text style={{
                                fontSize: 13,
                                color: '#333333',
                                marginTop: 10
                            }}>自宅からの距離: {item.distance && Math.round(item.distance * 10) / 10}km</Text>
                        </View>
                        <View style={{width: 100, alignItems: 'flex-end'}}>
                            {
                                item.image_url1 ? <View
                                    style={{width: 77, height: 77, borderWidth: 1, borderColor: color.active}}><Image
                                    style={{width: 75, height: 75}}
                                    source={{uri: item.end_point + item.image_url1}}
                                    key={index}
                                    resizeMode={'cover'}
                                /></View> : <Image
                                    style={{width: 75, height: 75, borderWidth: 1, borderColor: color.active}}
                                    source={images.noImage}
                                    key={index}
                                    resizeMode={'cover'}
                                />
                            }

                        </View>
                    </View>
                    <View style={{flexDirection: 'column', marginTop: 10, marginBottom: 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.cell1}>
                                <Text
                                    style={{
                                        paddingLeft: 10,
                                        color: "#262626",
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                    }}>国産車</Text>
                            </View>
                            <View style={styles.cell2}>
                                <Text style={{paddingLeft: 10, color: "#666666", fontSize: 14, lineHeight: 17}}>
                                    {domestic}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.cell1}>
                                <Text
                                    style={{
                                        paddingLeft: 10,
                                        color: "#262626",
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                    }}>輸入車</Text>
                            </View>
                            <View style={styles.cell2}>
                                <Text
                                    style={{paddingLeft: 10, color: "#666666", fontSize: 14}}>
                                    {abroad}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.cell1}>
                                <Text
                                    style={{
                                        paddingLeft: 10,
                                        color: "#262626",
                                        fontSize: 14,
                                        fontWeight: 'bold'
                                    }}>オイルグレード</Text>
                            </View>
                            <View style={styles.cell2}>
                                <Text
                                    style={{
                                        paddingLeft: 10,
                                        color: "#666666",
                                        fontSize: 14
                                    }}>{detail.oil_gradde || ''}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{justifyContent: 'center', width: '10%'}}>
                    <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const carInfo = this.props.carInfo;
        const date = !carInfo.turbo ?
            moment(new Date(carInfo.oil_last_change_date).setFullYear(new Date(carInfo.oil_last_change_date).getFullYear() + 1)).format('YYYY年MM月DD日')
            : moment(new Date(carInfo.oil_last_change_date).setMonth(new Date(carInfo.oil_last_change_date).getMonth() + 6)).format('YYYY年MM月DD日');
        return (
            <ScrollView
                scrollIndicatorInsets={{right: 1}}
                contentInset={{ bottom: isIphoneX() ? getBottomSpace() : 0 }}
                style={{backgroundColor: '#FFF'}}
            >
                <Spinner
                    visible={this.state.loading}
                    textContent={null}
                    textStyle={{color: 'white'}}
                />
                <View style={styles.body}>
                    <View style={{flexDirection: 'row', marginTop: 15, borderColor: '#E5E5E5', borderTopWidth: 1}}>
                        <View style={styles.width30}>
                            <Text style={styles.title}>前回交換日</Text>
                        </View>
                        <View style={styles.width70}>
                            <Text
                                style={styles.value}>{carInfo.oil_last_change_date && moment(carInfo.oil_last_change_date).format('YYYY年M月D日')}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.width30}>
                            <Text style={styles.title}>交換時走行距離</Text>
                        </View>
                        <View style={styles.width70}>
                            <Text
                                style={styles.value}>{carInfo.oil_last_change_km && `${carInfo.oil_last_change_km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}km`}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.width30}>
                            <Text style={styles.title}>フィルター交換</Text>
                        </View>
                        <View style={styles.width70}>
                            <Text
                                style={styles.value}>{carInfo.oil_last_km_with_filter && `${carInfo.oil_last_km_with_filter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}km`}</Text>
                        </View>
                    </View>
                    <View style={{marginHorizontal: 15, marginVertical: 10}}>
                        <Text style={{
                            fontSize: 13,
                            lineHeight: 17,
                            color: '#6F7579'
                        }}>※ご利用状況に基づいたメンテナンス情報をお届けします。定期的な更新をお願いします。</Text>
                    </View>
                    <View style={{
                        marginVertical: 10,
                        backgroundColor: '#F6FAFB',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#E5E5E5',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 15
                    }}>
                        <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>オイル交換目安</Text>
                        <View>
                            {carInfo.oil_need_change_date && <View style={{flexDirection: 'row', textAlign: 'right'}}>
                                <Text style={{fontSize: 27, color: '#008833'}}>{date.slice(0, 4)}</Text>
                                <Text style={{fontSize: 17, color: '#008833', marginTop: 11}}>{date.slice(4, 5)}</Text>
                                <Text style={{fontSize: 27, color: '#008833'}}>{parseInt(date.slice(5, 7))}</Text>
                                <Text style={{fontSize: 17, color: '#008833', marginTop: 11}}>{date.slice(7, 8)}</Text>
                                <Text style={{fontSize: 27, color: '#008833'}}>{parseInt(date.slice(8, 10))}</Text>
                                <Text
                                    style={{fontSize: 17, color: '#008833', marginTop: 11}}>{date.slice(10, 11)}</Text>
                            </View>
                            }
                            {
                                carInfo.oil_last_change_km !== null ?
                                    <Text style={{color: '#008833', textAlign: 'right'}}>
                                        <Text style={{fontSize: 17}}>または</Text>
                                        <Text style={{fontSize: 27}}>{
                                            !carInfo.turbo
                                                ? (carInfo.oil_last_change_km + 10000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : (carInfo.oil_last_change_km + 5000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

                                        }
                                        </Text>
                                        <Text style={{fontSize: 17}}>km</Text>
                                    </Text> : <View/>
                            }
                        </View>
                    </View>
                    <View style={{marginHorizontal: 15, marginBottom: 5}}>
                        <Text style={{
                            fontSize: 13, color: '#6F7579', lineHeight: 17
                        }}>※オイル交換時期は一般的な目安です。メーカーや車種、走行状態により異なりますので詳しくはメーカーHP等で確認ください。</Text>
                    </View>
                    <View style={styles.g2}>
                        <Text style={{fontWeight: 'bold'}}>お住まい周辺の格安オイル交換店舗</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        paddingTop: 25,
                        alignItems: 'center',
                        paddingBottom: 15
                    }}>
                        <Text style={{fontSize: 14, color: '#333333', marginRight: 10}}>検索範囲</Text>
                        <View style={{
                            width: 90,
                            borderWidth: 1,
                            borderColor: '#E5E5E5',
                            borderRadius: 5,
                            marginRight: 20,
                            marginLeft: 5
                        }}>
                            <Dropdown
                                baseColor={color.active}
                                value={this.props.range ? `${this.props.range}km` : this.state.distance}
                                fontSize={14}
                                containerStyle={{paddingHorizontal: 10}}
                                inputContainerStyle={{borderBottomWidth: 0}}
                                dropdownOffset={{top: 10, left: 0}}
                                renderAccessory={(() =>
                                        <Icon
                                            name="angle-down"
                                            size={23}
                                            color={'#CCCCCC'}
                                        />
                                )}
                                data={this.props.listRange}
                                onChangeText={(value) => this.getListStores(value)}
                            />
                        </View>
                    </View>
                    <View>
                        {
                            this.props.loading ? <View style={{
                                    borderRadius: 3,
                                    width: width,
                                    height: 300,
                                    opacity: 0.5,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <ActivityIndicator size={'large'} color={'grey'}/>
                                </View>
                                : <FlatList
                                    style={{marginTop: 10}}
                                    data={this.props.stores}
                                    renderItem={this._renderItem.bind(this)}
                                    onEndReachedThreshold={0.8}
                                />
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        height: '100%',
        textAlign: 'center',
        minHeight: height
    },
    g2: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 2,
        borderBottomColor: color.active
    },
    button: {
        height: 60,
        backgroundColor: '#CCCCCC',
        borderRadius: 3
    },
    width30: {
        width: '30%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        height: 45,
        justifyContent: 'center',
    },
    width70: {
        width: '70%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        height: 45,
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 14,
        paddingLeft: 10
    },
    value: {
        textAlign: 'right',
        paddingRight: 10
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    cell1: {
        backgroundColor: "#F8F8F8",
        borderColor: '#e5e5e5',
        borderWidth: 1,
        height: 40,
        width: '35%',
        justifyContent: 'center'
    },
    cell2: {
        borderColor: '#E5E5E5',
        borderWidth: 1,
        height: 40,
        width: '65%',
        justifyContent: 'center',
    },
});
