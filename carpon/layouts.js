import React, {Component} from 'react';
import {View, Text, ScrollView} from "react-native";

export class SingleColumnLayout extends Component {

    render() {
        const {topContent, bottomContent, backgroundColor, title} = this.props;

        return (
            <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'space-between',
                    backgroundColor
                }}>
                <View style={{
                    flex: 1,
                    width: '100%'
                }}>
                    {
                        title &&
                        <View style={{paddingHorizontal: 20, marginTop: 20}}>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17, lineHeight: 20}}>
                                {title}
                            </Text>
                        </View>
                    }
                    {topContent}
                </View>
                <View style ={{
                    flex: 0,
                    width: '100%',
                    marginBottom: 0
                }}>
                    {bottomContent}
                </View>
            </View>
        )
    }
}

