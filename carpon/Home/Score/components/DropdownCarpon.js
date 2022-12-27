import React, {Component} from 'react';
import {Modal, Text, TouchableOpacity, View, FlatList, Dimensions, SafeAreaView} from 'react-native';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import Icon from 'react-native-vector-icons/FontAwesome';

const {height, width} = Dimensions.get('window');

export default class DropdownCarpon extends Component {
    constructor(props) {
        super(props);
        this.onChangeItem = this.props.onPress ? this.props.onPress.bind(this) : () => ({});
        this.state = {
            modalVisible: false,
            value: this.props.value
        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    onSelectItem(item) {
        this.setState({
            modalVisible: !this.state.modalVisible,
            value: item.label
        }, () => this.onChangeItem(item, this.props.index))
    }

    _renderItem({item, index}) {
        return (
            <TouchableOpacity activeOpacity={1}
                onPress={this.onSelectItem.bind(this, item)}
                style={{height: 50, justifyContent: 'center', width: width, alignItems: 'center'}}
                key={index}
            >
                <Text style={{fontSize: 14, color: '#000000', fontWeight: 'bold'}}>{item.label}</Text>
            </TouchableOpacity>
        )
    }


    render() {
        const {value} = this.state;
        const {placeholder, options} = this.props;
        const heightFlatList = (options.length * 50 > (height - 40)) ? (height - 40) : options.length * 50;
        return (
            <View>
                <TouchableOpacity activeOpacity={1}
                    onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}
                    style={{
                        borderWidth: 0.5,
                        borderColor: '#CCCCCC',
                        height: 40,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <View style={{
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems : 'center'
                    }}>
                        <View style={{flex: 1}}>
                            <Text>{value ? value : placeholder}</Text>
                        </View>
                        <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
                            {this.props.customIcon || <Icon name="caret-down" size={20} color="#000000"/>}
                        </View>
                    </View>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <View style={{
                        flex: 1,
                        height: '100%',
                        alignItems: 'center',
                        flexDirection: 'column',
                        paddingVertical: 20
                    }}>
                        <SafeAreaView style={{backgroundColor: '#FFFFFF'}}>
                            <TouchableOpacity activeOpacity={1}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                                style={{justifyContent: 'center', alignItems: 'center'}}
                            >
                                <SvgImage source={SvgViews.RemoveBlack}/>
                            </TouchableOpacity>
                            <View style={{
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <View style={{height: heightFlatList, width: '100%'}}>
                                    <FlatList
                                        data={options}
                                        renderItem={this._renderItem.bind(this)}
                                        onEndReachedThreshold={0.8}
                                    />
                                </View>
                            </View>
                        </SafeAreaView>
                    </View>
                </Modal>
            </View>
        )
            ;
    }
}