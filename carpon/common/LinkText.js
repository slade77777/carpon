import React, { Component } from 'react';
import { Text } from 'react-native';
import { navigationService } from "../services";

export default class LinkText extends Component {

    handleOnNavigate() {

        const { navigatedTo, navigateParams } = this.props;

        navigationService.navigate(navigatedTo, navigateParams)
    }

    render() {
        return (
            <Text onPress={() => this.handleOnNavigate()} {...this.props}>{this.props.children}</Text>
        )
    }
}
