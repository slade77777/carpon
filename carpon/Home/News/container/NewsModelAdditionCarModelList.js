import React, {Component} from 'react';
import {Alert, StyleSheet, Text,} from 'react-native';
import {screen} from '../../../../navigation';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {ModelCarList} from "../../../../components/ModelCarList/index";
import {connect} from "react-redux";
import {viewPage} from "../../../Tracker";

@screen('NewsModelAdditionCarModelList', ({navigation}) => {
    return {
        header: <HeaderOnPress title={navigation.getParam('maker_name')}/>
    }
})
@connect(() => ({}), dispatch => ({
    updateNewsTab: (data) => dispatch(({
        type: 'POST_NEWS_TAB',
        data
    })),
}))
export class NewsModelAdditionCarModelList extends Component {

    componentDidMount() {
        viewPage('list_newstab_cars', 'ニュース_タブ追加_車名リスト');
    }

    onPressView(data) {
        const maker_code = this.props.navigation.getParam('maker_code');
        this.props.updateNewsTab({
                "maker_code": maker_code,
                "car_name_code": data['name_code']
        })
    }

    render() {
        const maker_name = this.props.navigation.getParam('maker_name');
        const maker_code = this.props.navigation.getParam('maker_code');
        return (
            <ModelCarList onPress={this.onPressView.bind(this)} maker_name={maker_name} maker_code={maker_code}/>
        )
    }
}

