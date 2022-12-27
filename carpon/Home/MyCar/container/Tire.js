import React, {Component} from 'react';
import {Linking, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {screen} from "../../../../navigation";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {connect} from 'react-redux'
import {HeaderOnPress} from "../../../../components";
import {TireAdvertising} from "./TireAdvertising";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {navigationService} from "../../../services";
import Icon from 'react-native-vector-icons/Ionicons';
import {viewPage} from "../../../Tracker";

export class TireInformation extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {tire} = this.props;
        return (
            <View>
                <View style={{
                    backgroundColor: '#F2F8F9',
                    borderBottomWidth: 1,
                    borderColor: '#4b9fa5'
                }}>
                    <Text style={{
                        color: '#4B9FA5',
                        marginLeft: 15,
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 15,
                        fontWeight: 'bold',
                    }}>{tire.title}</Text>
                </View>
                <View style={{
                    borderTopWidth: 1,
                    borderColor: '#E5E5E5',
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 20,
                    paddingBottom: 20,
                    marginTop: 15
                }}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#262626'}}>タイヤサイズ</Text>
                        <Text style={{fontSize: 17, color: '#333333'}}>{tire.tireSizeUser}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, alignItems: 'center'}}>
                        <Text style={{fontSize: 12, color: '#666666'}}>カタログ標準タイヤサイズ</Text>
                        <Text style={{fontSize: 14, color: '#666666'}}>{tire.tireSizeCatalog}</Text>
                    </View>
                </View>
                <View style={{
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 25,
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 20
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#262626'
                    }}>メーカー</Text>
                    <Text style={{
                        fontSize: 17, color: '#333333'
                    }}>{tire.manufacturer}</Text>
                </View>
            </View>
        )
    }
}

@screen('Tire', {
    header: <HeaderOnPress title={'タイヤ情報'} rightContent={{icon: 'IconEdit', color: '#FFF', nextScreen: 'UpdateTire'}}/>
})
@connect(state => ({
        myCarInformation: state.getCar.myCarInformation,
        tireAdvertising: state.getCar.advertising
    }),
    () => ({})
)
export class Tire extends Component {

    componentDidMount() {
        viewPage('edit_tire', 'タイヤ情報の変更');
    }

    handleBuildStringTireInformation(tireInformation, search) {

        const speed_symbol = tireInformation ? tireInformation.speed_symbol : '';
        const tire_width = tireInformation ? tireInformation.tire_width : '';
        const oblateness = tireInformation ? tireInformation.oblateness : '';
        const radial_structure = tireInformation ? tireInformation.radial_structure : '';
        const size = tireInformation ? tireInformation.size : '';
        const load_index = tireInformation ? tireInformation.load_index : '';

        if (radial_structure === 'R' && !search) {
            return tire_width + '/' + oblateness + radial_structure + size + ' ' + load_index + speed_symbol;
        } else if (!tireInformation) {
            return ''
        }
        else {
            return tire_width + '/' + oblateness + radial_structure + size;
        }
    }

    handleLink() {
        Linking.openURL('https://carpon.jp/app/tire-sizecheck.php')
            .catch((err) => console.error('エラーが発生しました', err));
    }

    render() {
        const {myCarInformation} = this.props;
        const tire_front_json = myCarInformation.tire_front_json ? myCarInformation.tire_front_json : {};
        const tire_rear_json = myCarInformation.tire_rear_json ? myCarInformation.tire_rear_json : {};
        const tireFront = {
            title: '前輪',
            tireSizeUser: this.handleBuildStringTireInformation(myCarInformation ? myCarInformation.tire_front_json : {}),
            tireSizeCatalog: myCarInformation.tire_size_front,
            manufacturer: tire_front_json ? tire_front_json.manufacturer : ''
        };
        const tireRear = {
            title: '後輪',
            tireSizeUser: this.handleBuildStringTireInformation(myCarInformation ? myCarInformation.tire_rear_json : {}),
            tireSizeCatalog: myCarInformation.tire_size_rear,
            manufacturer: tire_rear_json ? tire_rear_json.manufacturer : ''
        };
        const tire = {
            title: '両輪',
            tireSizeUser: this.handleBuildStringTireInformation(myCarInformation ? myCarInformation.tire_front_json : {}),
            tireSizeCatalog: myCarInformation.tire_size_front,
            manufacturer: tire_front_json ? tire_front_json.manufacturer : ''
        };
        return (
            <View>
                {this.props.tireAdvertising.loading &&
                <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFF', height: '100%'}}>
                    <View style={{marginTop: 25}}>
                        {
                            ((tire_front_json.TireString === tire_rear_json.TireString) && (tire_front_json.manufacturer === tire_rear_json.manufacturer)) ?
                                <TireInformation tire={tire}/> :
                                <View>
                                    <TireInformation tire={tireFront}/>
                                    <TireInformation tire={tireRear}/>
                                </View>
                        }
                        {/*<TouchableOpacity*/}
                            {/*onPress={() => navigationService.navigate('TireHelpWebView')}*/}
                            {/*style={{*/}
                                {/*flexDirection: 'row',*/}
                                {/*alignItems: 'center',*/}
                                {/*justifyContent: 'flex-end',*/}
                                {/*paddingBottom: 25,*/}
                                {/*paddingRight: 15*/}
                            {/*}}>*/}
                            {/*<SvgImage*/}
                                {/*source={SvgViews.IconHelp}*/}
                            {/*/>*/}
                            {/*<Text style={{fontSize: 14, color: '#999999',}}> タイヤサイズの見方</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    <TireAdvertising
                        tire={this.handleBuildStringTireInformation(myCarInformation ? myCarInformation.tire_front_json : {}, true)}/>
                </ScrollView>
            </View>
        )
    }
}
