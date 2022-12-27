import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from "react-native";
import {SvgImage, SvgViews} from "../Common/SvgImage";


export default class Vehicle extends Component {

    onActionSheet() {
        this.props.showActionSheet();
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={1} style={styles.body} onPress={this.onActionSheet.bind(this)}>
                <View style={styles.center}>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={{fontSize: 9}}>{this.props.vehicle['maker_name']}</Text>
                        <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                            {this.props.vehicle['car_name']}
                        </Text>
                    </View>
                </View>
                <SvgImage style={{padding: 15}} source={SvgViews.Anything}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        height: 75,
        justifyContent: 'space-between'
    },
    center: {
        justifyContent: 'center',
        paddingLeft: 15,
    },
    icon: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        textAlign: 'right',
        justifyContent: 'flex-end',
        marginRight: 0,
    },
});
