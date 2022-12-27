import React, {Component} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, ImageBackground, Alert} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import color from "../../../color";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import Dropdown from "../../../common/Dropdown";
import {images} from "../../../../assets/index";
import ButtonCarpon                                                   from "../../../../components/Common/ButtonCarpon";
import CheckBoxCarpon                                                 from "../../Score/components/CheckBoxCarpon";
import CarPrice                                                       from "../components/CarPrice";
import Icon                                                           from 'react-native-vector-icons/Entypo';
import {getUserProfile}                                               from "../../../Account/actions/accountAction";
import {getCarPriceEstimate, getCarSellEstimate}                      from "../actions/getCar";
import {navigationService, carInformationService, userProfileService} from "../../../../carpon/services";
import call                                                           from 'react-native-phone-call'
import LoadingComponent                                               from "../../../../components/Common/LoadingComponent";
import CarLabel                                                       from "../../../../components/CarLabel";
import {addTrackerEvent, viewPage}                                    from "../../../Tracker";
import { submitAppFlyer }                                             from "../../../../App";

const {width, height} = Dimensions.get('window');
@screen('Sale', {
    header: <HeaderOnPress title='マイカー相場'/>
})
@connect(state => ({
    carInfo: state.getCar ? state.getCar.myCarInformation : null,
    carPrice: state.getCar ? state.getCar.carPriceEstimation : null,
    carSell: state.getCar ? state.getCar.carSellEstimation : null,
    userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
}),
    dispatch => ({
        getUserProfile: () => dispatch(getUserProfile()),
        getCarPriceEstimate: () => dispatch(getCarPriceEstimate()),
        getCarSellEstimate: () => dispatch(getCarSellEstimate()),
    })
)
export class Sale extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mileages: [],
            stores: [],
            mileage: '',
            store: [],
            loading: false
        }
    }

    componentDidMount() {
        viewPage('car_price', 'マイカー相場');
        carInformationService.getListMileages().then(mileages => {
            this.setState({mileages, mileage: mileages[0].value});
            carInformationService.getListStores({mileage: mileages[0].value}).then(stores => {
                let defaultStore = [];
                if (stores.length > 0) {
                    stores.map((item) => {
                        defaultStore.push(item.assid)
                    })
                }
                this.setState({stores, store: defaultStore});
            });
            const carMileage = this.props.carInfo.mileage_kiro;
            let defaultMileage = '';
            mileages.length > 0 && mileages.map(item => {
                if (item.value - 5000 < carMileage && carMileage <= item.value) {
                    defaultMileage = item.value;
                    carInformationService.getListStores({mileage: defaultMileage}).then(stores => {
                        let chosenStore = [];
                        if (stores.length > 0) {
                            stores.map((item) => {
                                chosenStore.push(item.assid)
                            })
                        }
                        this.setState({mileage: defaultMileage, stores, store: chosenStore});
                    });
                    return;
                }
            });
        });

    }

    handleChangeMileage(value) {
        this.setState({mileage: value});
        carInformationService.getListStores({mileage: value}).then(stores => {
            let chosenStore = [];
            if (stores.length > 0) {
                stores.map((item) => {
                    chosenStore.push(item.assid)
                })
            }
            this.setState({stores, store: chosenStore})
        });
    }

    saveStore(value) {
        const stores = this.state.store;
        if (stores.includes(value)) {
            const index = stores.indexOf(value);
            stores.splice(index, 1);
        } else {
            stores.push(value);
        }
        this.setState({store: stores});
    }

    handleNextScreen() {
        if (this.state.store.length > 0 && this.state.mileage) {
            const storeIDs = [];
            this.state.stores.map(store => {
                storeIDs.push(store.assid);
            });
            navigationService.navigate('CarPriceAssessment', {
                mileage: this.state.mileage,
                aList: this.state.store.join(),
                showAss: storeIDs.join()
            })
        }
    }

    handleUpdate() {
        this.setState({loading: true});
        const storeIDs = [];
        this.state.stores.map(store => {
            storeIDs.push(store.assid);
        });
        const data = {
            mileage: this.state.mileage,
            aList: this.state.store.join(),
            showAss: storeIDs.join()
        }
        userProfileService.updateCarSelling(data).then((response) => {
            const user = this.props.userProfile;
            if (user && user.id) {
                const id = user.id;
                submitAppFlyer('KAITORI_ASSESS',
                    {
                        user_id: id,
                        car_id: this.props.carInfo.id,
                    },
                    id
                )
                addTrackerEvent('kaitori_submit', data)
            }
            if (response.data && response.data.status === 'failed') {
                this.setState({loading: false});
                Alert.alert('エラー', response.data.message);
            } else {
                this.props.getCarPriceEstimate();
                this.props.getCarSellEstimate();
                this.setState({loading: false});
                Alert.alert(
                    '査定申し込み完了',
                    'ありがとうございます。\n' +
                    '店舗よりメールまたは電話でご連絡がありますのでご対応ください。',
                    [
                        {
                            text: 'OK'
                        }
                    ])
            }
        }).catch(() => {
            this.setState({loading: false});
            alert('エラー');
        })
    }

    confirmSend() {
        Alert.alert(
            '査定を申し込む',
            '登録されているユーザー情報とマイカー情報を査定店舗に送信します。',
            [
                {
                    text: 'キャンセル',
                },
                {
                    text: '送信する',
                    onPress: () => this.handleUpdate()
                }
            ])
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={{ backgroundColor: 'white'}}>
                    {this.state.loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                    <View style={{padding: 15}}>
                        <View style={{ height: 15}}/>
                        <CarLabel/>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 22, marginTop: 20, marginBottom: 10}}>{(this.props.carSell.this_weeks && this.props.carSell.this_weeks.data) ? this.props.carSell.this_weeks.data.comment.title : ''}</Text>
                        <View style={{marginLeft: 20, marginBottom: 20, flexDirection: 'row'}}>
                            {
                                (this.props.carSell.this_weeks && this.props.carSell.this_weeks.success) ?
                                    <View style={{marginTop: 10, flexDirection: 'row'}}>
                                        <View style={{
                                            width: '20%',
                                            height: 75,
                                            alignItems: 'flex-end',
                                            justifyContent: 'center'
                                        }}>
                                            <SvgImage source={SvgViews[this.getWeather()]}/>
                                        </View>
                                        <View style={{alignItems: 'flex-end', justifyContent: 'center', borderRightWidth: 1, borderColor: '#E5E5E5', marginLeft: 10}}>
                                            <Text style={{
                                                color: 'black',
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontWeight: 'bold', marginRight: 15, marginTop: 1
                                            }}>今週の売り時指数</Text>
                                            <View style={{flexDirection: 'row', marginRight: 20}}>
                                                <Text style={{
                                                    fontSize: 45,
                                                    color: '#F37B7D'
                                                }}>{Math.round(this.props.carSell.this_weeks.data.comment.score)}</Text>
                                                <Text style={{fontSize: 12, marginTop: 30, color: '#666666'}}>／100</Text>
                                            </View>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <Text style={{fontSize: 12, color: '#666666', textAlign: 'center', marginLeft: 15}}>先週の売り時指数</Text>
                                            {
                                                (this.props.carSell.last_weeks && this.props.carSell.last_weeks.success) &&
                                                <View style={{flexDirection: 'row'}}>
                                                    <Text style={{
                                                        fontSize: 45,
                                                        fontWeight: '400',
                                                        color: '#999999', marginLeft: 20
                                                    }}>{Math.round(this.props.carSell.last_weeks.data.comment.score)}</Text>
                                                    <Text style={{fontSize: 12, marginTop: 30, color: '#999999'}}>／100</Text>
                                                </View>
                                            }

                                        </View>
                                    </View>
                                    :
                                    <View style={{marginTop: 10, flexDirection: 'row'}}>
                                        <View style={{width: '30%', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{
                                                color: 'black',
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontWeight: 'bold'
                                            }}>今週の売り時指数</Text>
                                            <View style={{flexDirection: 'row', marginLeft: 10}}>
                                                <Text style={{
                                                    fontSize: 20,
                                                    fontWeight: 'bold',
                                                    color: '#666666',
                                                    marginRight: 3
                                                }}>___</Text>
                                                <Text style={{fontSize: 12, marginTop: 20, color: '#666666'}}>／100</Text>
                                            </View>
                                        </View>
                                        <View style={{
                                            width: '25%',
                                            height: 75,
                                            alignItems: 'center',
                                            borderRightWidth: 1,
                                            borderColor: '#E5E5E5',
                                            paddingTop: 20, justifyContent: 'center'
                                        }}>
                                            <Image
                                                style={{width: 28, height: 7}}
                                                source={images.loadingDot}
                                            />
                                        </View>
                                        <View style={{width: '40%', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{color: '#999999', fontSize: 12, textAlign: 'center'}}>先週の売り時指数</Text>
                                            <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 5}}>
                                                <Text style={{
                                                    fontSize: 18,
                                                    fontWeight: '400',
                                                    color: '#999999',
                                                    marginRight: 3
                                                }}>__</Text>
                                                <Text style={{fontSize: 12, color: '#999999', marginTop: 13}}>／100</Text>
                                            </View>
                                        </View>
                                    </View>
                            }
                        </View>
                        <TouchableOpacity onPress={() => navigationService.navigate('WeatherInformation')} style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <SvgImage source={SvgViews.IconHelp}/>
                            <Text style={{fontSize: 14, marginLeft: 5, textDecorationLine: 'underline', color: '#666666'}}>売り時指数について</Text>
                        </TouchableOpacity>
                        {
                            (this.props.carSell.this_weeks && this.props.carSell.this_weeks.success) &&
                                <View style={{marginTop: 20}}>
                                    <Text style={{lineHeight: 20, fontSize: 17, color: '#666666'}}>
                                        {(this.props.carSell.this_weeks && this.props.carSell.this_weeks.success) ? this.props.carSell.this_weeks.data.comment.message : ''}
                                    </Text>
                                </View>
                        }
                    </View>
                    <View>
                        <View style={{
                            flexDirection: 'column',
                            borderTopWidth: 1,
                            borderColor: '#E5E5E5',
                            marginVertical: 20,
                        }}>
                            {this.props.carPrice.kaitori_suggest ?
                                <View style={{marginBottom: 10}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        height: 61,
                                        borderBottomWidth: 1,
                                        borderColor: '#E5E5E5',
                                        paddingHorizontal: 15,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(75, 159, 165, 0.05)',
                                    }}>
                                        <Text style={{fontWeight: 'bold', fontSize: 20}}>査定相場予想</Text>
                                        <View style={styles.width60}>
                                            <Text style={{fontSize: 34, color: '#008833'}}>
                                                <CarPrice value={this.props.carPrice.kaitori_suggest > 50000 ? this.props.carPrice.kaitori_suggest : 50000}/>
                                            </Text>
                                            {
                                                this.props.carPrice.kaitori_suggest && <Text
                                                    style={{fontSize: 14, color: '#008833', marginTop: 20}}>円
                                                </Text>
                                            }
                                        </View>
                                    </View>
                                    <View style={styles.cost}>
                                        <Text style={{fontWeight: 'bold', fontSize: 16}}>最高売却予想</Text>
                                        <Text style={{fontSize: 16, color: '#666666'}}>
                                            {this.props.carPrice.kaitori_suggest_high > 50000 ? <CarPrice value={this.props.carPrice.kaitori_suggest_high}/> : ' - '}
                                            円
                                        </Text>
                                    </View>
                                    <View style={styles.cost}>
                                        <Text style={{fontWeight: 'bold', fontSize: 16}}>最安売却予想</Text>
                                        <Text style={{fontSize: 16, color: '#666666'}}>
                                            {this.props.carPrice.kaitori_suggest_low > 50000 ? <CarPrice value={this.props.carPrice.kaitori_suggest_low}/> : ' - '}
                                            円
                                        </Text>
                                    </View>
                                </View>
                                :
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginVertical: 15,
                                    paddingHorizontal: 15,
                                    alignItems: 'center'
                                }}>
                                    <View>
                                        <Text style={{fontWeight: 'bold'}}>査定相場予想</Text>
                                    </View>
                                    <View>
                                        <Text style={{color: '#666666', marginBottom: 3, textAlign: 'right'}}>データ不足のため</Text>
                                        <Text style={{color: '#666666', textAlign: 'right'}}>算定出来ません</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                    <View style={styles.g2}>
                        <Text style={styles.title}>
                            なるべく高く売るなら一括査定がオススメ
                        </Text>
                    </View>
                    <View style={{ marginTop: 15, backgroundColor: color.active, height: 58, alignItems:'center', justifyContent: 'center'}}>
                        <SvgImage source={() => SvgViews.RecommendText()} />
                    </View>
                    <Image style={{ width, height: width*276/414}} source={images.SaleBackground}/>
                    <View style={{...styles.g2,marginTop: 15}}>
                        <Text style={styles.titleGreen}>
                            おおよその走行距離を選択してください
                        </Text>
                    </View>
                    <View style={{padding: 15}}>
                        <Dropdown
                            label={'走行距離'}
                            fontSize={16}
                            value={this.state.mileage}
                            data={this.state.mileages}
                            containerStyle={{ height: 60}}
                            onChangeText={(value) => this.handleChangeMileage(value)}
                        />
                    </View>
                    <View style={{...styles.g2,marginTop: 15}}>
                        <Text style={styles.titleGreen}>
                            査定を申し込む店舗を選択してください
                        </Text>
                    </View>
                    <View style={{ marginVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E5E5E5'}}>
                    {
                        this.state.stores.map((item, index) => (
                            <TouchableOpacity onPress={() => this.saveStore(item.assid)}  key={index}
                                              style={{height: 72, paddingHorizontal: 15, borderTopWidth: 1, borderTopColor: '#E5E5E5', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                <Text style={{fontSize: 18, color: '#262626', fontWeight: 'bold'}}>{item.name}</Text>
                                <CheckBoxCarpon onPress={() => ({})} checked={this.state.store.includes(item.assid)}/>
                            </TouchableOpacity>
                        ))
                    }
                    </View>
                    <TouchableOpacity onPress={() => this.handleNextScreen()} style={{justifyContent: 'flex-end', alignItems: 'flex-end', margin: 15}}>
                        <Text style={{
                            textDecorationLine: "underline",
                            textAlign: 'center',
                            fontSize: 18,
                            color: '#666666'
                        }}>お申し込み情報を確認する</Text>
                    </TouchableOpacity>
                    {this.renderButton()}
                    <View style={{...styles.g2,marginTop: 15}}>
                        <Text style={styles.title}>
                            一括査定の流れ
                        </Text>
                    </View>
                    <View style={{margin: 15, flexDirection: 'row'}}>
                        <View style={styles.step}>
                            <Text style={styles.stepTitle}>STEP1</Text>
                            <Text style={styles.stepContent}>まとめて見積依頼</Text>
                        </View>
                        <View style={styles.next}>
                            <Icon name="triangle-right" size={40} color={color.active}/>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepTitle}>STEP2</Text>
                            <Text style={styles.stepContent}>複数社からご連絡※</Text>
                        </View>
                        <View style={styles.next}>
                            <Icon name="triangle-right" size={40} color={color.active}/>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepTitle}>STEP3</Text>
                            <Text style={styles.stepContent}>見積を比較して売却</Text>
                        </View>
                    </View>
                    <View style={{marginHorizontal: 15, marginBottom: 15}}>
                        <Text style={styles.textInfo}>
                            ※買取店より、メールまたはお電話にてご連絡差し上げます。
                        </Text>
                        <Text style={styles.textInfo}>
                            ※カーポンはYahoo! Japanグループ「株式会社カービュー」と業務提携を行っております
                        </Text>
                        <Text style={styles.textInfo}>
                            お客様の情報はカーポンから、株式会社カービューを通じて車買取業者へと配信され、それぞれ安全に管理されます。
                        </Text>
                        <Text style={styles.textInfo}>
                            お客様の情報が許可なく公開されることは一切ございません。
                        </Text>
                    </View>

                    <View style={{...styles.g2,marginTop: 15}}>
                        <Text style={styles.titleGreen}>
                            実績ある買取専門店に見積依頼
                        </Text>
                    </View>
                    <View style={{ margin: 15}}>
                        <Image source={images.Sponsors} style={{width: width - 30, height: 230 * (width - 30)/380}}/>
                    </View>
                    <View style={{...styles.g2,marginTop: 15}}>
                        <Text style={styles.titleGreen}>
                            サポートも充実
                        </Text>
                    </View>
                    <View style={{ margin: 15}}>
                        <Text style={{ fontSize: 17, color: '#666666', lineHeight: 24}}>
                            中古車買取において、何かお困りの事、相談したいことがございましたら「一般社団法人日本自動車購入協会 車売却消費者相談室」へご連絡ください。
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => call({
                        number: '0120934595',
                        prompt: false
                    }).catch(console.error)} style={{ margin: 15, marginTop: 0, borderWidth: 1 , borderColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#333333', fontSize: 14, marginTop: 15, lineHeight: 22}}>JPUC 車売却消費者相談室</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 15}}>
                            <SvgImage
                                source={SvgViews.Phone}/>
                            <Text style={{color: '#666666', fontSize: 24, textAlign: 'center', marginLeft: 10, lineHeight: 28}}>
                                0120-93-4595
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ margin: 15}}>
                        <Text style={{ fontSize: 17, color: '#666666', lineHeight: 24}}>
                            キャンセル、アポイント変更などのご依頼は以下「サポートセンター」にご連絡ください。
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => call({
                        number: '0120532710',
                        prompt: false
                    }).catch(console.error)} style={{ margin: 15, marginTop: 0, borderWidth: 1 , borderColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#333333', fontSize: 14, marginTop: 15, lineHeight: 22}}>サポートセンター</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 15}}>
                            <SvgImage
                                source={SvgViews.Phone}/>
                            <Text style={{color: '#666666', fontSize: 24, textAlign: 'center', marginLeft: 10, lineHeight: 28}}>
                                0120-532-710
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {this.renderButton()}
                    <View style={{height: 75}}/>
                </ScrollView>
            </View>
        )
    }

    renderButton() {
        return (
            <View style={{margin: 15}}>
                <ButtonCarpon disabled={this.state.store.length === 0 || !this.state.mileage}
                              style={{backgroundColor: '#DC3545', height: 50}}
                              onPress={() => this.confirmSend()}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: '#FFFFFF'
                    }}>一括査定を申し込む</Text>
                </ButtonCarpon>
            </View>
        )
    }

    getWeather() {
        const suggest = this.props.carSell.this_weeks.data.comment.score;
        if (suggest < 60) {
            return 'Rain';
        } else if (60 <= suggest && suggest < 70) {
            return 'Cloudy';
        } else if (70 <= suggest && suggest < 80) {
            return 'SunnyCloudy';
        } else if (80 <= suggest) {
            return 'Sun';
        }
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        height: '100%',
        textAlign: 'center',
    },
    g2: {
        height: 45,
        justifyContent: 'center',
        paddingLeft: 15,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderBottomColor: color.active
    },
    width40: {
        width: '40%',
        justifyContent: 'center',
    },
    width60: {
        width: '60%',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    title: { fontSize: 17, fontWeight: 'bold', color: '#262525'},
    titleGreen: { fontSize: 17, fontWeight: 'bold', color: color.active},
    value: {
        paddingLeft: 10,
        marginVertical: 10
    },
    step: {
        padding: 10,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 5,
        width: (width - 120)/3,
        height: (width - 120)/3,
    },
    stepTitle: {
        fontSize: 10,
        color: '#333333',
        textAlign: 'center'
    },
    stepContent: {
        fontSize: 13,
        color: '#333333',
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '400'
    },
    next: { alignItems: 'center', justifyContent: 'center', width: 45, height: (width - 120)/3},
    header: {backgroundColor: '#F2F8F9', height: 45, justifyContent: 'center'},
    textHeader: {color: '#4B9FA5', fontSize: 15, fontWeight: 'bold', paddingLeft: 15, marginTop: 5},
    cost: {
        flexDirection: 'row',
        height: 44,
        borderBottomWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textInfo: {fontSize: 12, lineHeight: 18, color: '#333333'}
});
