import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native';
import {SvgImage, SvgViews} from "./Common/SvgImage";
import ImageLoader from "./ImageLoader";

export default class Register extends Component {

    render() {
        return (
            <TouchableOpacity activeOpacity={1} style={styles.body} onPress={() => this.props.onPressView()}>
                {
                    this.props.isManufacturer && <View style={styles.iconLeft}>
                        <ImageLoader
                            style={{width: 45, height: 45, resizeMode: 'contain'}}
                            source={this.props.data.icon ? this.props.data.icon : {uri: this.props.data.maker_logo_url}}
                        />
                    </View>
                }
                <View style={{justifyContent: 'center', width: this.props.isManufacturer ? '70%' : '90%'}}>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 14}}>{this.props.data.title}</Text>
                        {this.props.data.content &&
                        <Text style={{fontSize: 13}}>
                            {this.props.data.content}
                        </Text>
                        }
                    </View>
                </View>
                <View style={styles.icon}>
                    <SvgImage source={SvgViews.ArrowLeft}/>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderColor: '#E5E5E5',
        borderWidth: 0.5,
        height: 75,
        paddingHorizontal: 15
    },
    iconLeft: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        width: '20%',
        alignItems: 'flex-start'
    },
    icon: {
        width: '10%',
        alignItems: 'flex-end',
        justifyContent: 'center'
    }
});
