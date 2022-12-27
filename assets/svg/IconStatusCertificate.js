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

export default function IconStatusCertificate(props) {
    return (
        <Svg height="14" width="40" viewBox="0 0 40 14">
            <Defs/>
            <G id="icon_status_認定" clipPath="url(#clip-path)">
                <G id="グループ_365" data-name="グループ 365">
                    <Rect height="14" id="長方形_1602" width="40" fill="#4b9fa5" rx="1" transform="translate(0)"
                          data-name="長方形 1602"/>
                </G>
                <Text id="認定" fill="#fff" fontFamily="HiraginoSans-W6, Hiragino Sans" fontSize="8"
                      transform="translate(20 10)">
                    <TSpan fontWeight="bold" x="-8" y="0">認定</TSpan>
                </Text>
            </G>
        </Svg>
    );
}
