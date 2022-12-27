import React, {Component} from 'react';
import {Text} from 'react-native';
import moment from 'moment';
import {era} from '@ja-supports/era'

export default class Era extends Component{

    render() {
        const date      = moment(this.props.date, 'YYYY-MM-DD');
        const eraYear   = era(date.toDate());
        const momentDate = this.props.hiddenDay ? moment(date).format(' (YYYY) 年M月') : moment(date).format(' (YYYY) 年M月D日');
        return (
            <Text>
                {eraYear.format(':era:nth') +  momentDate}
            </Text>
        )

    }
}