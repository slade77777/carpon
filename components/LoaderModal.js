import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, Modal } from 'react-native';
import { connect } from 'react-redux';

@connect(state => ({
    loading: state.loading
}))
export default class LoaderModal extends Component {
    state = {
        loading: false
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            loading: nextProps.loading
        })
    }

    onRequestClose() { }

    render() {
        return (
            this.state.loading ? <Modal
                transparent={true}
                animationType={'none'}
                visible={this.state.loading}
                onRequestClose={this.onRequestClose}>
                <View style={Styles.modalBackground}>
                    <View style={Styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            animating={this.state.loading} />
                    </View>
                </View>
            </Modal> : null
        )
    }
}

const Styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});