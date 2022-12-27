import React , {Component} from 'react';
import {SvgImage, SvgViews} from "./SvgImage";

export default class LabelCertification extends Component {
    render() {
        return (
            <SvgImage source={SvgViews.IconStatusCertificate}/>
            )
    }
}
