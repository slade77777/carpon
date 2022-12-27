import React, {Component} from 'react';
import {Alert, StyleSheet, Text,} from 'react-native';
import {viewPage} from "../../Tracker";
import {ModelCarList} from "../../../components/ModelCarList";
import HeaderOnPress from "../../../components/HeaderOnPress";
import { screen } from '../../../navigation';
import {carInformationService, myCarService, navigationService} from "../../services";
import lodash from "lodash";
import {connect} from "react-redux";
import {updateGradeList} from "../actions/registration";

@screen('ConfirmCarModel', () => {
    return {
        header: <HeaderOnPress title={'モデル選択'}/>
    }
})
@connect(state => ({
        carProfile: state.registration.carProfile.profile,
        registration: state.registration,
    }),
    dispatch => ({
        updateGradeList: gradeList => dispatch(updateGradeList(gradeList))
    })
)

export class ConfirmCarModel extends Component {

    componentDidMount() {
        // viewPage('list_newstab_cars', 'ニュース_タブ追加_車名リスト');
    }

    onPressView(data) {
        carInformationService.getCarGradeList(data.maker_code, data.name_code).then(result => {
            const currentForm = this.props.carProfile.form;
            let gradeList = [];
            result.grade_list.map(item => {
                if (item.form.split('-').length <= 1) {
                    if (item.form === currentForm) {
                        gradeList.push(item)
                    }
                } else {
                    if ((item.form.split('-')[1]).replace(/[^0-9a-z]/gi, '') === (currentForm.split('-')[1]).replace(/[^0-9a-z]/gi, '')) {
                        gradeList.push(item)
                    }
                }
            })
            if (gradeList.length === 0) {
                navigationService.clear('CarModeWrong');
            } else {
                this.props.updateGradeList({
                    grade_list: gradeList, car_name_list: result.car_name_list
                });
            }
        }).catch(error => {
            navigationService.clear('CarModeWrong');
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

