import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, Keyboard, View, Platform, InputAccessoryView, Alert, SafeAreaView} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../../layouts";
import {updateMileage, navigateSuccess} from '../actions/myCarAction';
import {navigationService} from "../../../../carpon/services";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {viewPage} from "../../../Tracker";

@screen('UpdateMileageChange', {header: <HeaderOnPress title={'走行距離の更新'}/>})
@connect(
    state => ({
        carInfo: state.getCar,
        updateMileageReady: state.getCar.updateMileageReady
    }),
    dispatch => ({
        updateMileage: (data) => {
            dispatch(updateMileage(data))
        },
        navigateSuccess: (key) => {
            dispatch(navigateSuccess(key))
        }
    })
)
export class UpdateMileageChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mileage: null,
        };
    }

    componentDidMount() {
        viewPage('edit_mileage', '走行距離の変更');
    }

    handleUpdateMileage() {
        const {mileage} = this.state;
        this.props.updateMileage({mileage});
    }

    componentWillReceiveProps(props) {
        props.carInfo.updatedMileage && navigationService.goBack();
        props.carInfo.updatedMileage && props.navigateSuccess('updatedMileage')

    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <View style={{flex: 1}}>
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <View style={{height: '100%', backgroundColor: 'white'}}>
                        {!this.props.updateMileageReady && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}

                        <View style={{paddingHorizontal: 15, marginVertical: 20}}>
                            <InputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='現在の走行距離(km)'
                                keyboardType={'numeric'}
                                value={this.state.mileage}
                                onChangeText={(val) => this.setState({ mileage: val})}
                                maxLength={11}
                            />
                        </View>
                    </View>
                }
                bottomContent={
                    Platform.OS === 'ios' ? <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={{backgroundColor:!this.state.mileage ? 'transparent' : 'rgba(112, 112, 112, 0.5)', padding: 10}}>
                        <ButtonText disabled={!this.state.mileage} title={'更新する'} onPress={() => this.handleUpdateMileage()}/>
                    </View>
                </InputAccessoryView>
                    :  <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)' , padding: 15, position: 'absolute', bottom: 0, width: '100%'}}>
                            <ButtonText disabled={false} title={'更新する'} onPress={() => this.handleUpdateMileage()}/>
                        </View>
                }
            />
            </View>
        )
    }
}

