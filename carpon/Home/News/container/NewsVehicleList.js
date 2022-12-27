import React, {Component} from 'react';
import {View, ScrollView, FlatList, Text, SafeAreaView} from 'react-native';
import {screen} from '../../../../navigation';
import Vehicle from "../../../../components/News/Vehicle";
import HeaderNewsVehicleList from "../../../../components/ScreenHeader/HeaderNewsVehicleList";
import ActionSheet from 'react-native-actionsheet'
import {removeTab, updateTab} from "../action/newsAction";
import {connect} from 'react-redux';
import Divider from "../../../../components/Common/Divider";
import {viewPage} from "../../../Tracker";


@screen('NewsVehicleList', {header: <HeaderNewsVehicleList/>})
@connect((state) => ({
        tab: state.news.tab,
        carProfile: state.registration.carProfile.profile
    }),
    dispatch => ({
        removeTab: (id) => dispatch(removeTab(id)),
        updateTab: () => dispatch(updateTab())
    })
)
export class NewsVehicleList extends Component {
    componentDidMount() {
        viewPage('list_news_tabs', 'ニュース_タブ一覧');
        this.props.updateTab()
    }

    onPressView() {
        const navigate = this.props.navigation.navigate;
        return navigate('NewsAddModelManufacturerList')
    }

    handleRemoveNewsTab(buttonIndex) {
        if (buttonIndex === 1) {
            const vehicle = this.selectedVehicle;
            this.props.removeTab(vehicle.id);
        }
    }

    showActionSheet(vehicle) {
        this.selectedVehicle = vehicle;
        this.ActionSheet.show();
    }

    _renderItem = ({item, index}) => (
        <Vehicle vehicle={item} showActionSheet={this.showActionSheet.bind(this, item, index)}/>
    );

    render() {
        const newsTab = this.props.tab.filter(tab => !(tab.maker_name === this.props.carProfile.maker_name && tab.car_name === this.props.carProfile.car_name));
        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}}  contentInset={{top: 20}} style={{backgroundColor: '#FFF' }}>
                    {
                        this.props.carProfile.maker_name ?
                            <View style={{
                                flexDirection: 'row',
                                height: 75,
                                alignItems: 'center',
                                paddingHorizontal: 15,
                                borderTopWidth: 1,
                                borderBottomWidth: 1,
                                borderColor: '#e5e5e5'
                            }}>
                                <View>
                                    <Text style={{fontSize: 9}}>{this.props.carProfile.maker_name}</Text>
                                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                                        {`${this.props.carProfile.car_name}（マイカー）`}
                                    </Text>
                                </View>

                            </View> : <View/>
                    }
                    <FlatList
                        data={newsTab}
                        renderItem={this._renderItem}
                        onEndReachedThreshold={0.8}
                    />
                </ScrollView>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={[
                        'キャンセル',
                        '削除'
                    ]}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={1}
                    onPress={this.handleRemoveNewsTab.bind(this)}
                />
            </View>
        )
    }
}
