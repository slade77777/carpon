import React, {Component} from 'react';
import {TouchableOpacity, Text, View, Dimensions, Image, SafeAreaView, StyleSheet} from 'react-native';
import {SvgImage, SvgViews} from "./Common/SvgImage";
import CropPicker from 'react-native-image-crop-picker';
import CarImageMaskEditor from './CarImageMaskEditor';
import Icon from 'react-native-vector-icons/EvilIcons';
import Config from 'react-native-config';
import Spinner from 'react-native-loading-spinner-overlay';
import {isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');

export default class CarImageEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carEdit: props.carSource,
            isCensored: false,
            mode: null,
            hideMasking: false,
            isCrop: false,
            coordinates: [],
            img_width: width,
            img_height: height,
            loading: false
        };
    }

    chooseCar() {
        // alert(this.state.carEdit);
        this.props.updateCar(this.state.carEdit);
    }

    onCloseEdit() {
        this.props.closeModal();
    }

    allowCrop() {
        this.setState({mode: 'crop'});
        CropPicker.openCropper({
            path: this.state.carEdit,
            width: width * 2,
            height: height * 2/3,
            cropping: true,
            loadingLabelText: 'saving...',
            cropperToolbarTitle: '写真を編集する',
            cropperChooseText: '確定',
            cropperCancelText: 'クリア'
        }).then(image => {
            this.setState({ carEdit: image.path, mode: null, isCrop: true})
        }).finally(
            this.setState({ mode: null})
        );
    }

    renderCloseButton() {
        if (this.state.mode) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({mode: null})}>
                    <Text style={{ fontSize: 14, textAlign: 'left', color: 'white', fontWeight: 'bold'}}>クリア</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => this.onCloseEdit()}>
                    <Icon name="close" size={30} color="#FFFFFF"/>
                </TouchableOpacity>
            )
        }
    }

    renderUpdateButton() {
        if (this.state.mode) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => this.chooseCar()}>
                    <Text style={{ fontSize: 14, textAlign: 'right', color: 'white', fontWeight: 'bold'}}>
                        確定
                    </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => this.chooseCar()}>
                    <Text style={{ fontSize: 14, textAlign: 'right', color: 'white', fontWeight: 'bold'}}>
                        決定
                    </Text>
                </TouchableOpacity>
            )
        }
    }

    openDrag() {
        this.setState({loading: true});
        const data = new FormData();
        data.append('image', {
            uri: this.state.carEdit,
            type: 'image/jpeg',
            name: 'avatar'
        });
        fetch(Config.OPENALPR_LINK, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            timeout: 10000,
            body: data
        })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.results && responseData.results[0]) {
                    const result = responseData.results[0];
                    if (result && result.confidence > 0.7) {
                        this.setState({
                            img_width: responseData.img_width,
                            img_height: responseData.img_height,
                            coordinates: result.coordinates,
                        });
                    }
                }
            })
            .finally(() => this.setState({mode:'drag', loading: false}));
    }

    render() {
        if (this.state.mode === 'drag')  {
            return (
                <SafeAreaView style={{ backgroundColor: '#262525', width, height}}>
                    <CarImageMaskEditor image={this.state.carEdit} isCrop={this.state.isCrop} onSave={(uri) => {
                        this.setState({carEdit: uri, mode: null})
                    }} onCloseEdit={() => this.setState({mode: null})} coordinates={this.state.coordinates} img_width={this.state.img_width} img_height={this.state.img_height} />
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={{ backgroundColor: '#262525', width, height}}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={null}
                        textStyle={{color: 'white'}}
                    />
                    <View
                        style={{
                            ...StyleSheet.absoluteFill
                        }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 20, height: height/3, paddingTop: isIphoneX() ? 50 : 30}}>
                        {this.renderCloseButton()}
                        {this.renderUpdateButton()}
                    </View>
                    <View style={{height: height/3}}>
                        {
                            this.state.carEdit && <Image source={{ uri: this.state.carEdit}} style={{ width: width, height: height/3}}/>
                        }
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column',justifyContent: 'space-between', marginVertical: 10, height: height/3 }}>
                        <View/>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 100, paddingBottom: 30}}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.allowCrop()}>
                                    <View>
                                        <SvgImage
                                            source={() => SvgViews.Crop('white')}
                                        />
                                        <Text style={{ color: 'white', fontSize: 10, marginTop: 5}}>トリミング</Text>
                                    </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.openDrag()}>
                                <View>
                                    <SvgImage
                                        source={() => SvgViews.Hover('white')}
                                    />
                                    <Text style={{ color: 'white', fontSize: 10, marginTop: 8}}>ナンバーマスク</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </View>
                </SafeAreaView>
            )
        }
    }
}
