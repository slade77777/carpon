
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
  TSpan,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

export default function CheckMark(props) {
  return (
    <Svg height="16" width="32" viewBox="0 0 32 16">
    	<Text id="次へ" fill="#fff" fontFamily="HiraginoSans-W6, Hiragino Sans" fontSize="16" transform="translate(32 14)">
    		<TSpan x="-32" y="0">次へ</TSpan>
    	</Text>
    </Svg>
  );
}
