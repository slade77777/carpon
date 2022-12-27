
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
  Stop
} from 'react-native-svg';

export default function IcInfo(props) {
  return (
    <Svg height="16" width="16" viewBox="0 0 16 16">
    	<Path id="ic_info_24px" d="M10,2a8,8,0,1,0,8,8A8,8,0,0,0,10,2Zm.8,12H9.2V9.2h1.6Zm0-6.4H9.2V6h1.6Z" fill="#c00" transform="translate(-2 -2)"/>
    </Svg>
  );
}
