import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import {SvgImage} from "../../../../components/Common/SvgImage";
import SvgViews from "../../../../assets/svg/index";
import color from "../../../color";
import {Dropdown} from 'react-native-material-dropdown';
import {getListStores} from "../actions/inspectionAction";
import Overlay from 'react-native-modal-overlay';
import ButtonText from "../../../../components/ButtonText";
import {navigationService} from "../../../services/index";
import CarInspectionTop from "../components/CarInspectionTop";
import Icon from 'react-native-vector-icons/FontAwesome';
import {images} from "../../../../assets/index";
import {viewPage} from "../../../Tracker";

const {width, height} = Dimensions.get('window');
@screen('CarInspection', {header: <HeaderOnPress title='お住まい周辺の車検工場'/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
        listRange: state.inspectionReducer.listRange,
        range: state.inspectionReducer.range,
        stores: state.inspectionReducer.listStore,
        loading: state.inspectionReducer.loading
    }),
    dispatch => ({
        getListStores: (range)=> dispatch(getListStores(range))
}))
export class CarInspection extends Component {

    state = {
        distance: '30',
        showInsuranceModal: false,
        showOtherModal: false,
    };

    getListStores(distance) {
        this.setState({distance});
        this.props.getListStores(distance);
    }

    componentDidMount() {
        viewPage('car_inspection', '車検')
    }

    _renderItem = ({item, index}) => {
        let price = 0;
        if (item.detail.total && (item.detail.total - item.detail.tax_discount > 0)) {
            price = item.detail.total - item.detail.tax_discount;
        }
        return (
            <TouchableOpacity onPress={() => navigationService.navigate('InspectionDetail', {store: item})}
                              style={{ borderBottomWidth: 1, padding: 15, borderColor: '#E5E5E5', flexDirection: 'row', alignItems: 'center'}} key={index}>
                <View style={{ width: width - 150}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.name}</Text>
                    <Text style={{fontSize: 13, color: '#333333', marginTop: 10}}>自宅からの距離: {item.distance && Math.round(item.distance * 10)/10}km</Text>
                    <View style={{ flexDirection: 'row', marginTop: 3}}>
                        <Text style={{ fontSize: price !== 0 ? 25 : 12 , color: price !== 0 ? '#333333' : '#F37B7D'}}>{price !== 0 ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'この車の車検に対応していません'}</Text>
                        {price !== 0 && <Text style={{ fontSize: 14, color: '#333333', marginTop: 11, marginLeft: 3}}>円</Text>}
                    </View>
                </View>
                <View style={{ width: 100, alignItems: 'flex-end'}}>
                    {
                        item.image_url1 ? <View style={{width: 77, height: 77, borderWidth: 1, borderColor: color.active}}><Image
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
                <View style={{justifyContent: 'center', alignItems : 'flex-end', width : 25, marginRight: 5}}>
                    <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                </View>
            </TouchableOpacity>
        )
    };

    render() {
        const IndexPriceMini = this.props.carInfo.IndexPriceMin ? this.props.carInfo.IndexPriceMin : 0;
        const storeDetail = this.props.stores.length > 0 ? this.props.stores[IndexPriceMini] : {};
        return (
            <View style={{ flex: 1}}>
                <Overlay visible={this.state.showInsuranceModal} onClose={() => this.setState({ showInsuranceModal: false})} childrenWrapperStyle={{ borderRadius: 5,  backgroundColor: '#F8F8F8'}} closeOnTouchOutside={true}>
                    <View>
                        <Text style={{ color: 'black', fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>法定費用とは</Text>
                        <Text style={{ color: 'black', marginVertical: 10, fontSize: 17, lineHeight: 24}}>
                            車検には、点検・整備料金だけではなく、国等に納める税金等の法定費用が必要です。法定費用には「自賠責保険料」「重量税」「検査手数料」が含まれています。「自賠責保険」とは、「自動車損害賠償保障法」という法律で加入が義務付けられている自動車やバイクの保険で、正式名称を「自動車損害賠償責任保険」といいます。
                        </Text>
                        <ButtonText title={'OK'} onPress={() => this.setState({showInsuranceModal: false})}/>
                    </View>
                </Overlay>
                <Overlay visible={this.state.showOtherModal} onClose={() => this.setState({ showOtherModal: false})} childrenWrapperStyle={{ borderRadius: 5, backgroundColor: '#F8F8F8'}} closeOnTouchOutside={true}>
                    <View>
                        <Text style={{ color: 'black', fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>車検基本料、その他とは</Text>
                        <Text style={{ color: 'black', marginVertical: 10, fontSize: 17, lineHeight: 24}}>
                            車検には、法定費用以外に、24カ月定期点検料、測定検査料、車検代行手数料が必要です。車検基本料または手数料には人件費が含まれているため、車検工場によって金額に差があります。
                        </Text>
                        <ButtonText title={'OK'} onPress={() => this.setState({showOtherModal: false})}/>
                    </View>
                </Overlay>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={styles.body}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        paddingTop: 25,
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderColor: '#E5E5E5',
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
                    <CarInspectionTop storeDetail={storeDetail} onPressFirst={() => this.setState({showInsuranceModal: true})}  onPressSecond={() => this.setState({showOtherModal: true})}/>
                    <View>
                        {
                            this.props.loading ? <View style={{
                                    borderRadius: 3,
                                    width : width,
                                    height : 300,
                                    opacity : 0.5,
                                    justifyContent : 'center',
                                    alignItems : 'center'}}>
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
});
