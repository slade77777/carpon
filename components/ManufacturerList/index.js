import React, {Component} from 'react';
import {View, SectionList, StyleSheet, Text, RefreshControl, SafeAreaView} from 'react-native';
import {Register} from '../../components';
import {carInformationService} from "../../carpon/services";
import _ from "lodash";

export class ManufacturerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            refresh: false,
            domesticBranch: [],
            internationalBranch: []
        }
    }

    componentDidMount() {
        this.loadCarBranches()
    }

    loadCarBranches() {
        this.setState({refresh: true});
        let branches = [];
        let domesticBranch = [];
        let internationalBranch = [];
        carInformationService.getCarBranches().then(response => {
            branches = _.map(response, (item, index) => {
                return {...item, title: item['maker_name'], key : index}
            });
            domesticBranch = branches.filter(branch => branch.is_japan);
            internationalBranch = branches.filter(branch => !branch.is_japan);
            this.setState({
                branches, domesticBranch, internationalBranch, refresh: false
            })
        });

    }

    renderItem({item}) {
        return (
            <Register isManufacturer={true} data={item} onPressView={() => this.props.onPress(item)}/>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <SectionList
                    scrollIndicatorInsets={{right: 1}}
                    style={{height: '100%', backgroundColor: '#FFF'}}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.loadCarBranches.bind(this)}
                        />
                    }
                    renderSectionHeader={({section: {title}}) => (
                        <View style={Styles.g2}>
                            <Text style={{fontWeight: 'bold'}}>{title}</Text>
                        </View>
                    )}
                    sections={[
                        {title: '国産', data: this.state.domesticBranch},
                        {title: '輸入', data: this.state.internationalBranch}
                    ]}
                    renderItem={this.renderItem.bind(this)}
                    onEndReachedThreshold={0.8}
                />
            </View>
        )
    }
}


const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    border: {
        borderColor: '#707070'
    },
    g2: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        backgroundColor: '#EFEFEF',
        borderBottomWidth: 1,
        borderBottomColor: '#707070',
    },
    g1: {
        paddingTop: 20,
        paddingBottom: 25,
        marginLeft: 20,
    }
});
