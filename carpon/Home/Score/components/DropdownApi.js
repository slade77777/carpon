import React, {Component} from "react";
import {FlatList, Text, TouchableOpacity, View, TextInput} from "react-native";
import DropdownCarpon from "./DropdownCarpon";
import {surveyService} from "../../../services";

export default class DropdownApi extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }


    componentDidMount() {
        const {item} = this.props;
        surveyService.getDataApiQuestion(item.api_url, item.key_display).then(result => {
            this.setState({
                options: result
            })
        })
    };

    render() {
        const {options} = this.state;
        const {onPress, index} = this.props;
        return (
            <View style={{marginTop: 15}}>
                <DropdownCarpon options={options} onPress={onPress.bind(this)} index={index}/>
            </View>
        )
    }
}