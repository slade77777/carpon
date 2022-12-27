import React, {Component} from 'react';
import {Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageZoom from 'react-native-image-pan-zoom';
import ViewShot from "react-native-view-shot";
import color from "../../color";
import MaskedView from '@react-native-community/masked-view';

const {width, height} = Dimensions.get('window');

export default class EditAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carEdit: props.carSource,
            isCensored: false,
            mode: null,
            hideMasking: false,
            isCrop: false
        };
        this.imageRef = React.createRef();
    }

    chooseCar() {
        this.imageRef.current.capture().then(uri => {
            this.props.updateCar(uri);
        });
    }

    onCloseEdit() {
        this.props.closeModal();
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: '#262525', width, height}}>
                <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 20, height: height/3 - 50,  paddingTop: 10}}>
                    <TouchableOpacity style={{ flex: 1, marginLeft: 0}} onPress={() => this.onCloseEdit()}>
                        <Icon name="md-close" size={30} color="#FFFFFF"/>
                    </TouchableOpacity>
                    <View style={{flex: 3}}/>
                    <TouchableOpacity style={{ flex: 1, marginLeft: 0, marginTop: 10}}
                                      onPress={() => this.chooseCar()}>
                        <Text style={{ fontSize: 14, textAlign: 'right', color: 'white', fontWeight: 'bold'}}>
                            決定
                        </Text>
                    </TouchableOpacity>
                </View>
                <ViewShot options={{ format: "jpg", quality: 0.9 }} ref={this.imageRef} style={{justifyContent: 'center', alignItems: 'center', height: height/3, width}}>
                    <MaskedView
                        style={{ height: height/3, width}}
                        maskElement={
                            <View
                                style={{
                                    backgroundColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <View style={{width: height/3,height: height/3,borderWidth: 3, borderRadius: height/6,
                                    backgroundColor: color.active, borderColor: color.active}}/>
                            </View>
                        }>
                            {
                                this.state.carEdit && <ImageZoom cropWidth={width}
                                                                 cropHeight={width}
                                                                 imageWidth={height/3}
                                                                 imageHeight={height/3 + 160}>
                                    <Image style={{width:height/3, height:height/3 + 120}}
                                           source={{uri: this.state.carEdit}}/>
                                </ImageZoom>
                            }
                    </MaskedView>
                </ViewShot>
                <View style={{ marginTop: 130}}>
                    <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', marginHorizontal: 30, lineHeight: 20}}>ピンチイン・ピンチアウトで拡大・縮小した後、
                        ドラッグで適切な位置に配置してください</Text>
                </View>
            </SafeAreaView>
        )
    }
}
