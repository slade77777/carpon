import React, {Component} from 'react';
import {HeaderHome} from '../../../../components/index'
import {StyleSheet, View} from 'react-native'
import stylesGeneral from '../../../../style';
import {screen} from "../../../../navigation";
import StatusNews from "../../../../components/News/StatusNews/StatusNews";
import News from "../../../../components/News/News";
import {newsService} from "../../../../carpon/services/index";

@screen('MyClipScreen', {
    header: <HeaderHome/>
})
export class MyClipScreen extends Component {

    state = {
        allNews: []
    };

    componentDidMount() {
        newsService.getAllNews({type: 'my'}).then(res => {
            this.setState({
                allNews: res.data,
            })
        })
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <View style={Styles.body}>
                <StatusNews navigation={navigation} screen={'MyClipScreen'}/>
                <News navigation={navigation} allNews={this.state.allNews}/>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    header: {
        backgroundColor: '#F3D625',
        fontSize: 14,
        flexDirection: 'row',
    },
    titleHeader: {
        fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', ...stylesGeneral.fontStyle
    }
});

