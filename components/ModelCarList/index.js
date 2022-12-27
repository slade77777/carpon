import React, {Component} from 'react';
import {Register} from '../../components';
import stylesGeneral from '../../style';
import {carInformationService} from "../../carpon/services";
import {RefreshControl, StyleSheet, SectionList, View, Text, TouchableOpacity, Dimensions, PixelRatio, SafeAreaView} from 'react-native';
import _ from 'lodash';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';


const carFirstLetters = {
    '英数': [],
    'ア': ['ア', 'イ', 'ウ', 'ヴ', 'エ', 'オ'],
    'カ': ['カ','ガ','キ','ギ','ク','グ','ケ','ゲ','コ', 'ゴ'],
    'サ': ['サ', 'ザ', 'シ','ジ','ス','ズ','セ','ゼ','ソ','ゾ'],
    'タ': ['タ','ダ', 'チ','ヂ','ツ','ヅ','テ','デ','ト','ド'],
    'ナ': ['ナ', 'ニ','ヌ','ネ','ノ'],
    'ハ': ['ハ','バ','パ', 'ヒ','ビ','ピ','フ','ブ','プ','ヘ','ベ','ペ','ホ','ボ','ポ'],
    'マ': ['マ', 'ミ','ム','メ','モ'],
    'ヤ': ['ヤ', 'ユ','ヨ'],
    'ラ': ['ラ', 'リ','ル','レ','ロ'],
    'ワ': ['ワ', 'ヲ'],
};

const allJapaneseLetters = ['ア', 'イ', 'ウ', 'ヴ', 'エ', 'オ',
    'カ','ガ','キ','ギ','ク','グ','ケ','ゲ','コ', 'ゴ',
    'サ', 'ザ', 'シ','ジ','ス','ズ','セ','ゼ','ソ','ゾ',
    'タ','ダ', 'チ','ヂ','ツ','ヅ','テ','デ','ト','ド',
    'ナ', 'ニ','ヌ','ネ','ノ', 'ハ','バ','パ', 'ヒ','ビ','ピ','フ','ブ','プ','ヘ','ベ','ペ','ホ','ボ','ポ',
    'マ', 'ミ','ム','メ','モ', 'ヤ', 'ユ','ヨ', 'ラ', 'リ','ル','レ','ロ', 'ワ', 'ヲ'
];


const sortableTitle = title => {
    return title.split("").map(character => {
        if (carFirstLetters["ア"].includes(character)) {
            return carFirstLetters["ア"].indexOf(character);
        }
        return character;
    }).join("");
};


export class ModelCarList extends Component {

    state = {
        models: [],
        refresh: false,
    };

    componentDidMount() {
        this.loadModel()
    }

    loadModel() {
        this.setState({refresh: true});
        const maker_code = this.props.maker_code;
        let models = [];
        carInformationService.getCarModel(maker_code).then(response => {
            const carList = response.data.map(model => {
                return {
                    ...model,
                    title: model['car_name']
                }
            });
            Object.keys(carFirstLetters).map(function (key, index) {
                models[index] = {};
                let data = [];
                if (key === '英数') {
                    data = carList.filter(car => {
                        return !allJapaneseLetters.includes(car.title[0])
                    });
                    models[index].title = key;
                } else {
                    data = carList.filter(car => {
                        return carFirstLetters[key].includes(car.title[0])
                    });
                    models[index].title = key + '行';
                }
                models[index].data = _.orderBy(data, car => {
                    return sortableTitle(car.title.toLowerCase());
                }, ['asc']);
            });
            this.setState({models, refresh: false})
        });
    }

    onPressView(data) {
        this.props.onPress(data)
    }

    renderItem({item, index}) {
        return (
            <View key={index}>
                <Register data={item} onPressView={this.onPressView.bind(this, item)}/>
            </View>
        )
    }

    scrollToSection = (section) => {
        this.sectionListRef.scrollToLocation({
            animated: true,
            sectionIndex: section,
            itemIndex: 0,
            viewPosition: 0,
            viewOffset: 0,
        });
    };

    calculateItemLayout() {
        return sectionListGetItemLayout({
            // The height of the row with rowData at the given sectionIndex and rowIndex
            getItemHeight: (rowData, sectionIndex, rowIndex) => 70,

            // These three properties are optional
            getSeparatorHeight: () => 2, // The height of your separators
            getSectionHeaderHeight: () => 50, // The height of your section headers
            getSectionFooterHeight: () => 0, // The height of your section footers
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={Styles.g1}>
                    {
                        Object.keys(carFirstLetters).map((key, index) => {
                            return (
                                <TouchableOpacity onPress={() => this.scrollToSection(index)} style={Styles.letter} key={index}>
                                    <Text style={{ textAlign: 'center', color: '#999999'}}>
                                        {key}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={{ flex: 1}}>
                    <SectionList
                        scrollIndicatorInsets={{right: 1}}
                        ref={ref => (this.sectionListRef = ref)}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={this.loadModel.bind(this)}
                            />
                        }
                        renderSectionHeader={({section: {title}}) => (
                            <View style={Styles.g2}>
                                <Text style={{fontWeight: 'bold'}}>{title}</Text>
                            </View>
                        )}
                        pagingEnabled={false}
                        sections={this.state.models}
                        renderItem={this.renderItem.bind(this)}
                        onEndReachedThreshold={0.8}
                        extraData={this.state}
                        getItemLayout={this.calculateItemLayout()}
                        removeClippedSubviews={true}
                        style={{height: Dimensions.get('window').height, backgroundColor: '#FFF'}}
                    />
                </View>
            </View>
        )
    }
}


const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
        height: '100%'
    },
    border: {
        borderColor: '#707070'
    },
    g2: {
        paddingLeft: 20,
        justifyContent: 'center',
        borderBottomWidth:1,
        borderBottomColor: '#707070',
        backgroundColor: '#EFEFEF',
        height: 50
    },
    g1: {
        height: 40,
        backgroundColor: '#333333',
        flexDirection: 'row',
        borderBottomWidth:1,
        borderBottomColor: '#E5E5E5',
    },
    letter: {
        justifyContent: 'center',
        width: '9.1%',
        alignItems: 'center',
        borderRightColor: '#000000',
        borderRightWidth: 1,
        backgroundColor: '#333333'
    }
});
