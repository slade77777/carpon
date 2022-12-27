import React, { Component } from 'react';
import { SvgImage, SvgViews } from '../components/Common/SvgImage'

export default class TitleHeader extends Component {
    render() {
        return (
            <SvgImage
                source={SvgViews.CarponLogoWhite} />
        )
    }
}
