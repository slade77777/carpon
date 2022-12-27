import React, {Component} from 'react';
import {View, TouchableOpacity, Platform, Modal, Dimensions, Text, Image, SafeAreaView} from 'react-native';
import {SvgImage, SvgViews} from "./Common/SvgImage";
import {isIphoneX, getBottomSpace} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');

export default class ImageDetailModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageHeight: 1,
            imageWidth: 1,
            isLandScape: false
        }
    }

    componentWillReceiveProps(newProps) {
        const _ImageHeight = height - (getBottomSpace() * 2) - 80;

        if (newProps.imageDetail && newProps.imageDetail !== this.props.imageDetail) {
            Image.getSize(newProps.imageDetail, (actualWidth, actualHeight) => {
                this.setState({
                    imageHeight: actualHeight * width / actualWidth,
                    imageWidth: actualWidth * _ImageHeight / actualHeight,
                    isLandScape: actualWidth > actualHeight
                })
            });
        }
    }

    handlePositionTextMainY(_ImageHeight, imageHeight) {
        if(_ImageHeight <= imageHeight) {
            return 90
        }else {
            return 90 + (_ImageHeight - imageHeight)/2;
        }
    }

    handlePositionTextMainX(_ImageHeight, imageHeight) {
        const {imageWidth} = this.state;

        if(_ImageHeight <= imageHeight) {
            return 20 + (width - imageWidth)/2
        } else {
            return 20
        }
    }

    render() {

        const _ScreenHeight = height - (getBottomSpace() * 2);
        const _ImageHeight = height - (getBottomSpace() * 2) - 80;
        const {imageHeight} = this.state;

        return (
            <Modal visible={this.props.imageDetailOpen} transparent={false}>
                <SafeAreaView style={{backgroundColor: '#212121', height : height, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{height : _ScreenHeight, width: width}}>
                        {
                            this.props.isMainImage &&
                            <View style={{
                                position: 'absolute',
                                right: this.handlePositionTextMainX(_ImageHeight, imageHeight),
                                borderWidth: 1,
                                borderColor: 'white',
                                borderRadius: 5,
                                top: this.handlePositionTextMainY(_ImageHeight, imageHeight),
                                padding: 5,
                                zIndex: 10
                            }}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>
                                    メイン画像
                                </Text>
                            </View>
                        }
                        <View style={{
                            backgroundColor: '#212121',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 5,
                            height: 60,
                            marginTop: isIphoneX ? 5 : 10,
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                onPress={() => this.props.closeModal()}>
                                <View style={{padding: 10, alignItems: 'flex-start'}}>
                                    <SvgImage source={SvgViews.ActionBarBack}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.openEditor()
                                }}
                                style={{padding: 10}}
                            >
                                <View style={{alignItems: 'flex-end'}}>
                                    <SvgImage source={() => SvgViews.IconEdit({fill: 'white'})}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                            <Image
                                source={{uri: this.props.imageDetail}} resizeMode={'contain'}
                                style={{height: _ImageHeight}}
                            />

                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}
