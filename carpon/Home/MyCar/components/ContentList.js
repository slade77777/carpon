import React, {Component} from 'react';
import {Text, FlatList, View, TouchableOpacity} from 'react-native';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import MyCarProfileField from '../MyCarProfileField';

export class ContentList extends Component {

    state = {
        showContent: false
    };

    handleSpecialValue(value) {
        return MyCarProfileField.specialValueConfig[value] || ''
    }

    handleRawData() {
        let contentList = this.props.CarField.contentList;
        const key = this.props.CarField.key;
        return Object.keys(MyCarProfileField[key]).map((element) => {
            return {
                FieldName: this.props.CarField.key,
                label: MyCarProfileField[key][element],
                value: contentList[element] ? contentList[element] : this.handleSpecialValue(element),
                key: element
            };
        })
    }

    renderContent(element) {
        return (
            <View style={{
                paddingHorizontal: 15,
                paddingVertical: 22,
                borderColor: '#e5e5e5',
                borderBottomWidth: 0.5,
                borderTopWidth: element.index === 0 ? 0.5 : 0,
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'

            }}>
                <View>
                    <Text style={{fontSize: 14, fontWeight: 'bold', color: '#333'}}>{element.item.label}</Text>
                </View>
                <View style={{ flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Text textAlign={'right'} style={{
                        fontSize: 14,
                        color: '#333'
                    }}>
                        {element.item.value}
                    </Text>
                </View>
            </View>
        )
    };

    render() {
        const title = this.props.CarField.title;
        return (
            <View style={{backgroundColor: '#FFF'}}>
                <TouchableOpacity
                    style={{
                        height: 45,
                        backgroundColor: '#F2F8F9',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: 15,
                        borderBottomWidth: 1,
                        borderColor: '#4B9FA5',
                        ...this.props.style
                    }}
                    onPress={() => this.setState({showContent: !this.state.showContent})}
                >
                    <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'}}>{title}</Text>
                    <SvgImage source={this.state.showContent ? SvgViews.ArrowDown : SvgViews.ArrowUp}/>
                </TouchableOpacity>
                {
                    this.state.showContent &&
                    <FlatList
                        data={this.handleRawData()}
                        renderItem={(element) => this.renderContent(element)}
                    />
                }
            </View>
        );
    }
}
