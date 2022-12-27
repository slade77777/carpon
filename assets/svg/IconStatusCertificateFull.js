import React from 'react';
import {
    Svg,
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop,
    TSpan
} from 'react-native-svg';

export default function IconStatusCertificateFull(props) {
    const colorActive = {
        backgroundColor: '#4b9fa5',
        textColor: '#fff'
    };
    const colorUnActive = {
        backgroundColor: '#EFEFEF',
        textColor: '#CCCCCC'
    };
    let color = props.active ? colorActive : colorUnActive;
    return (
        <Svg height="20" width="80" viewBox="0 0 80 20">
            <Defs/>
            <G id="マーク_認定オーナー_ON" clipPath="url(#clip-path)">
                <Rect height="20" id="長方形_1602" width="80" fill={color.backgroundColor} rx="1" data-name="長方形 1602"/>
                <Text id="認定オーナー" fill={color.textColor} fontFamily="HiraginoSans-W6, Hiragino Sans" fontSize="10"
                      transform="translate(40 14)">
                    <TSpan fontWeight="bold" x="-30" y="0">認定オーナー</TSpan>
                </Text>
            </G>
        </Svg>
    );
}
