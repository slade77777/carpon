import React, {Component} from 'react';
import {Text, View, Keyboard, TouchableOpacity, ScrollView, SafeAreaView, Alert} from "react-native";
import {screen} from "../../../../navigation";
import {TireFormFields} from "../components";
import {connect} from 'react-redux'
import ButtonText from "../../../../components/ButtonText";
import {navigateSuccess, updateTire} from "../actions/myCarAction";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {navigationService} from "../../../services";
import TirePattern from "../components/TirePattern";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {SingleColumnLayout} from "../../../layouts";
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('UpdateTire', {header: <HeaderOnPress title={'タイヤ情報の変更'} leftComponent={<Icon name="md-close" size={30} color="#FFFFFF" />}/>})
@connect(state => ({
    carProfile: state.getCar.myCarInformation,
    updateTireReady: state.getCar.updateTireReady,
    updatedTire: state.getCar.updatedTire,
}),
    dispatch => ({
        updateTire: (tireInfo, id) => dispatch(updateTire(tireInfo, id)),
        navigateSuccess: ()=> dispatch(navigateSuccess('updatedTire'))
    })
)
export class UpdateTire extends Component {

    state = {
        TireRearInfo: false
    };

    handleCompare(TireFront, TireRear) {
         return (TireFront.TireString === TireRear.TireString) && (TireFront.manufacturer === TireRear.manufacturer)
    }

    componentWillMount() {
        viewPage('edit_tire', 'タイヤ情報の変更');
        const TireFrontRaw = this.props.carProfile.tire_front_json ? this.props.carProfile.tire_front_json : {};
        const TireRearRaw = this.props.carProfile.tire_rear_json ? this.props.carProfile.tire_rear_json: {};
        let tireFront = this.handleTireRaw(TireFrontRaw);
        let tireRear = this.handleTireRaw(TireRearRaw);
        this.setState({tire_size_front: {...tireFront}});
        this.setState({tire_size_rear: {...tireRear}});
        if(TireFrontRaw.TireString) {
            this.setState({TireRearInfo: !this.handleCompare(TireFrontRaw, TireRearRaw)})
        }else {
            this.setState({TireRearInfo: false})
        }
    }

    handleBuildObjectTireInformation(tire) {
        const {selectedTireWidth, selectedOblateness, selectedRadialStructure, selectedManufacturer,
            selectedSize, loadIndex, selectedSpeedSymbol} = this.state[tire];

        if(selectedRadialStructure === 'R') {
            return {
                tire_width: selectedTireWidth,
                oblateness: selectedOblateness,
                radial_structure: selectedRadialStructure,
                size: selectedSize,
                load_index: loadIndex,
                speed_symbol: selectedSpeedSymbol,
                manufacturer: selectedManufacturer,
                TireString: this.handleBuildStringTireInformation(tire)
            }
        } else {
            return {
                tire_width: selectedTireWidth,
                oblateness: selectedOblateness,
                radial_structure: selectedRadialStructure,
                size: selectedSize,
                manufacturer: selectedManufacturer,
                TireString: this.handleBuildStringTireInformation(tire)
            }
        }
    }

    handleBuildStringTireInformation(tire) {
        const {selectedTireWidth, selectedOblateness, selectedRadialStructure,
            selectedSize, loadIndex, selectedSpeedSymbol} = this.state[tire];
        if(selectedRadialStructure === 'R') {
            return selectedTireWidth + '/' + selectedOblateness + selectedRadialStructure + selectedSize + ' ' + loadIndex + selectedSpeedSymbol ;
        } else {
            return selectedTireWidth + '/' + selectedOblateness + selectedRadialStructure + selectedSize;
        }
    }

    handleOnSelected(value, fields, tire) {
        // fields === 'selectedRadialStructure' && (value ==='ZR' || value ==='SR') && this.setState({
        //     [tire]: {
        //         ...this.state[tire],
        //         selectedOblateness: 80
        //     }
        // });
        this.setState({
            [tire]: {
                ...this.state[tire],
                [fields]: value
            }
        });

    }

    handleChangeText(number, tire) {
        this.setState({
            [tire]: {
                ...this.state[tire],
                loadIndex: number
            }
        });
    }

    handleFormFields() {
        const {TireRearInfo} = this.state;
        if(!TireRearInfo) {
            this.setState({TireRearInfo: true})
        }else {
            this.setState({TireRearInfo: false})

        }
    }

    handleTireRaw(tire) {
        const tireRaw = tire ? tire : {};
        return  {
            selectedTireWidth: tireRaw.tire_width ,
            selectedOblateness: tireRaw.oblateness,
            selectedRadialStructure: tireRaw.radial_structure,
            selectedSize: tireRaw.size,
            loadIndex: tireRaw.load_index,
            selectedSpeedSymbol: tireRaw.speed_symbol,
            selectedManufacturer: tireRaw.manufacturer,
        };
    }

    handleUpdateTire() {
        const {carProfile} = this.props;
        const {TireRearInfo} = this.state;
        const tireSize = TireRearInfo ? 'tire_size_rear': 'tire_size_front';
        const tire = {
            tire_front_json: this.handleBuildObjectTireInformation('tire_size_front'),
            tire_rear_json: this.handleBuildObjectTireInformation(tireSize),
        };
        this.props.updateTire(tire, carProfile.id);
    }

    handleValidate(tire) {
        const {selectedTireWidth, selectedOblateness, selectedRadialStructure, selectedSize, loadIndex, selectedSpeedSymbol} = this.state[tire];
        if(selectedRadialStructure === 'R') {
            return selectedTireWidth && selectedOblateness && selectedRadialStructure && selectedSize && loadIndex && selectedSpeedSymbol
        }else {
            return selectedTireWidth && selectedOblateness && selectedRadialStructure && selectedSize
        }
    }

    handleOnPress() {
        if(this.state.TireRearInfo) {
            (this.handleValidate('tire_size_front') && this.handleValidate('tire_size_rear')) ? this.handleUpdateTire() : Alert.alert('全てのフィールドを入力してください')
        }else {
            this.handleValidate('tire_size_front') ? this.handleUpdateTire(): Alert.alert('全てのフィールドを入力してください')
        }
    }

    componentWillReceiveProps(props) {
        props.updatedTire && navigationService.goBack();
        props.updatedTire && this.props.navigateSuccess()
    }

    render() {
        const {TireRearInfo} = this.state;
        const color = TireRearInfo ? {color: '#4b9fa5'} : {color: '#CCCCCC'};
        return (
            <View
                style={{flex:1}}
            >
            {!this.props.updateTireReady && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                    <ScrollView scrollIndicatorInsets={{right: 1}} style={{height: '100%', backgroundColor: '#fff'}} onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                        <View style={{backgroundColor: '#FFF',flexDirection: 'column', justifyContent: 'space-between', marginTop: 20}}>
                            { TireRearInfo && <View style={{backgroundColor: '#F2F8F9'}}>
                                <Text style={{color: '#4B9FA5',marginLeft:15, marginTop: 10, marginBottom: 10, fontSize: 18, fontWeight: 'bold'}}>前輪</Text>
                            </View>}
                            <View style={{margin: 15}}>
                                <View style={{borderWidth: 0.5, borderColor: '#4B9FA5'}}>
                                    <TirePattern
                                        tireInformation={this.state.tire_size_front}
                                    />
                                </View>
                                <TireFormFields
                                    handleOnSelected={(value, fields) => this.handleOnSelected(value, fields, 'tire_size_front')}
                                    handleChangeText={(text) => this.handleChangeText(text, 'tire_size_front')}
                                    tireInformation={this.state.tire_size_front}
                                />
                            </View>

                        </View>
                        {
                            TireRearInfo &&
                            <View style={{backgroundColor: '#FFF',marginTOp: 20, flexDirection: 'column', justifyContent: 'space-between'}}>
                                <View style={{backgroundColor: '#F2F8F9'}}>
                                    <Text style={{color: '#4B9FA5',marginLeft: 15, marginTop: 10, marginBottom: 10, fontSize: 18, fontWeight: 'bold'}}>後輪</Text>
                                </View>
                                <View style={{margin: 15}}>
                                    <View style={{borderWidth: 1, borderColor: '#4B9FA5'}}>
                                        <TirePattern
                                            tireInformation={this.state.tire_size_rear}
                                        />
                                    </View>
                                    <TireFormFields
                                        handleOnSelected={(value, fields) => this.handleOnSelected(value, fields, 'tire_size_rear')}
                                        handleChangeText={(text) => this.handleChangeText(text, 'tire_size_rear')}
                                        tireInformation={this.state.tire_size_rear}
                                    />
                                </View>
                            </View>

                        }
                        <TouchableOpacity
                            onPress={() => this.handleFormFields()}
                            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 95}}
                        >
                            <SvgImage
                                style={{margin: 10}}
                                source={()=> SvgViews.IconCB(color)}
                            />
                            <Text>前後輪に分けて登録する</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    }
                    bottomContent={
                        <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%'}}>
                            <ButtonText title={'保存する'} onPress={() => this.handleOnPress()}/>
                        </View>
                    }
                />
            </View>

        )
    }
}
