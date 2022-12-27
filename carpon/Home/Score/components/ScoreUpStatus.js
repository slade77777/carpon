import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';
const {width} = Dimensions.get('window');


export class ScoreUpStatus extends Component{

    formatLabel(percentage) {
        const format = this.props.label || ':percentage';

        return format.replace(/:percentage/g, percentage + '%');
    }

    render() {
        const progress = Math.round(this.props.progress * 100) || 0;

        return (
            <View style={{width: '100%'}}>
                <View style={{margin: 15}}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            height: 40
                        }}>
                        <Text style={{color: '#4B9FA5', fontSize: 15}}>{this.formatLabel(progress)}</Text>
                    </View>
                </View>
                <Progress.Bar
                    progress={this.props.progress || 0.01}
                    width={width}
                    color='#4B9FA5'
                    backgroundColor={'#E5E5E5'}
                    borderWidth={0}
                    borderRadius={0}
                    height={1}
                />
            </View>
        )
    }
}