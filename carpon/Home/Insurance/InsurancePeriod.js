import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, StyleSheet, View, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import Spinner from 'react-native-loading-spinner-overlay';
import color from "../../color";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {navigationService} from "../../services/index";
import {viewPage} from "../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');
@screen('InsurancePeriod', {header: <HeaderOnPress title={'任意保険簡易見積'}/>})
@connect(
    state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    })
)
export class InsurancePeriod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            month: -1,
            loading: false,
        };
    }

    handleUpdate() {
        navigationService.navigate('InsuranceType', {month: this.state.month === -1 ? null : this.state.month});
    }

    componentDidMount() {
        viewPage('insurance_rough_update_date', '任意保険簡易見積_更新月')
    }

    render() {
        let months = [];
        for(let i = 1; i <= 12; i++){
            months.push(
                <TouchableOpacity activeOpacity={1} key = {i} style={{ width: (width - 70)/4, marginRight: 10, backgroundColor: i === this.state.month ? color.active : '#EFEFEF',
                    height: (width - 70)/4, alignItems: 'center', justifyContent: 'center', marginVertical: 5, borderRadius: 5}}
                    onPress={() => this.setState({month: i})}>
                    <Text style={{ fontSize: 18, color: i === this.state.month ? 'white' : 'black'}}>
                        {i}月
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{flex : 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{height: '100%', backgroundColor: 'white'}}>
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            <View style={{paddingHorizontal: 20, marginTop: 20}}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                    次の保険満期は何月ですか？
                                </Text>
                            </View>
                            <View style={{marginLeft: 20,marginRight: 10, flexDirection: 'row', flexWrap: 'wrap'}}>
                                {months}
                            </View>
                            <TouchableOpacity activeOpacity={1} style={{marginHorizontal: 20, backgroundColor: !this.state.month ? color.active : '#EFEFEF',
                                height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 10}}
                                onPress={() => this.setState({month: null})}
                            >
                                <Text style={{ fontSize: 18, color: !this.state.month ? 'white' : 'black'}}>
                                    わからない
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                    bottomContent={
                        <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%',

                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D'}}
                                          onPress={() => this.handleUpdate()}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>次へ</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </View>
        )
    }
}


const Styles = StyleSheet.create({
    radio: {
        width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#CDD6DD', alignItems: 'center', justifyContent: 'center'
    },
    inline: {
        paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', borderTopWidth: 1, borderColor: '#CDD6DD', paddingTop: 15, alignItems: 'center'
    },
    checked: {
        width: 15, height: 15, borderRadius: 10, borderWidth: 1, borderColor: color.active, backgroundColor: color.active
    }
});
