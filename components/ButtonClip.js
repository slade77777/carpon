import React, {Component}   from 'react';
import {Text}               from "react-native";
import color                from "../carpon/color";
import {SvgImage, SvgViews} from "./Common/SvgImage";
import ButtonCarpon         from "./Common/ButtonCarpon";
import LoadingComponent     from "./Common/LoadingComponent";

export class ButtonClip extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonClip: {
                color: '#CCCCCC',
                size : {h: 12, w: 6}
            }
        }
    }

    handleClip() {
        const {news} = this.props;
        news.is_saved ? this.props.handleUnclip(news.id) : this.props.handleClip(news.id)
    }

    render() {
        const buttonClipColor = this.props.news.is_saved ? color.active : color.inActive;

        return (
            <ButtonCarpon style={{
                borderColor    : buttonClipColor,
                backgroundColor: 'white',
                borderWidth    : 1,
                borderRadius   : 3,
                width          : 70,
                height         : 30,
            }} onPress={this.handleClip.bind(this)}
            >
                {
                    this.props.loading && <LoadingComponent size={{w: 70, h: 30}}/>
                }
                <SvgImage source={() => SvgViews.Clip({...this.state.buttonClip, color: buttonClipColor})}/>
                <Text style={{fontWeight: 'bold', color: buttonClipColor, fontSize: 14}}> Clip</Text>
            </ButtonCarpon>
        )
    }
}
