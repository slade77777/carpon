import React, { Component } from 'react';
import { Text, Alert, BackHandler, StyleSheet } from 'react-native';
import { screen } from '../../../../navigation';
import HeaderIconPlus from "../../../../components/ScreenHeader/HeaderIconPlus";
import {ManufacturerList} from "../../../../components/ManufacturerList/index";
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";

@screen('NewsAddModelManufacturerList', { header: <HeaderIconPlus title={'メーカー'}/> })
export class NewsAddModelManufacturerList extends Component {

    componentDidMount() {
        viewPage('list_newstab_makers', 'ニュース_タブ追加_メーカーリスト');
    }

    onPressView(data) {
        return navigationService.navigate('NewsModelAdditionCarModelList', { maker_code: data['maker_code'], maker_name: data['maker_name'] });
        // Alert.alert(
        //     'リスト追加',
        //     data.title + 'をニュースリストに追加しました。',
        //     [
        //         {
        //             text: 'OK',
        //             onPress: () => {
        //                 this.props.navigation.navigate('NewsModelAdditionCarModelList', { maker_code: data['maker_code'], maker_name: data['maker_name'] });
        //             }, style: 'cancel',
        //         },
        //     ],
        //     {cancelable: false}
        // );
    }

    render() {
        return (
            <ManufacturerList onPress={this.onPressView.bind(this)}/>
        )
    }
}

