import React, {Component} from 'react';
import {
    Dimensions,
    View,
    StatusBar,
    Image,
    Platform,
    Alert,
    Linking,
    TouchableOpacity,
    Text,
    Modal,
    SafeAreaView
} from "react-native";
import {isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');

export default class CarImageList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            carEdit: [],
            pickImage: false
        };
    }

    chooseMyCar(uri) {
        let carEdit = this.state.carEdit;
        if (carEdit.includes(uri)) {
            const index = carEdit.indexOf(uri);
            carEdit.splice(index, 1);
            this.setState({carEdit});
        } else {
            if (carEdit.length < 3) {
                carEdit.push(uri)
                this.setState({carEdit});
            }
        }
    }

    saveChoice() {
        const carEdit = this.state.carEdit;
        const carList = [];
        if (carEdit.length > 0) {
            carEdit.map(item => {
                carList.push({uri: item})
            })
        }
        this.props.saveCar(carList);
    }

    render() {
        const carPhotos = this.props.carPhotos;
        const carEdit = this.state.carEdit;
        return (
            <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
                <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: 0,
                    marginHorizontal: 20,
                    marginTop: isIphoneX() ? 40 : 20,
                }}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.props.onClose()}>
                        <Text style={{fontSize: 14, textAlign: 'left'}}>キャンセル</Text>
                    </TouchableOpacity>
                    <View style={{flex: 3}}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                            カメラロール
                        </Text>
                        <Text style={{textAlign: 'center'}}>
                            ここをタップして変更▼
                        </Text>
                    </View>

                            <TouchableOpacity onPress={() => this.state.carEdit.length > 0 && this.saveChoice()} style={{flex: 1}}>
                                <Text style={{fontSize: 14, textAlign: 'right', color: this.state.carEdit.length > 0 ?'#000' : '#e5e5e5'}}>完了</Text>
                            </TouchableOpacity>


                </View>
                <View style={{
                    marginHorizontal: 20,
                    width: width,
                    height: height - 20,
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                }}>
                    {
                        carPhotos &&
                        carPhotos.map((photo, index) => {
                            return (
                                <TouchableOpacity onPress={
                                    () => this.chooseMyCar(photo.url)}
                                                  style={{
                                                      width: (width - 100) / 3,
                                                      height: (width - 100) / 3,
                                                      margin: 10,
                                                      }} key={index}>
                                    <Image source={{uri: photo.url}} style={{
                                        height: (width - 100) / 3,
                                        borderWidth: carEdit.includes(photo.url) ? 3 : 0,
                                        borderColor: 'red'}}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </SafeAreaView>
        )

    }
}
