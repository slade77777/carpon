
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

export default function Hover(props) {
  return (
    <Svg height="18" width="22" viewBox="0 0 22 18">
    	<Defs/>
    	<Path style={{fill: props}} className="cls-1" id="ic_vignette_24px" d="M21,3H3A2.006,2.006,0,0,0,1,5V19a2.006,2.006,0,0,0,2,2H21a2.006,2.006,0,0,0,2-2V5A2.006,2.006,0,0,0,21,3ZM12,18c-4.42,0-8-2.69-8-6s3.58-6,8-6,8,2.69,8,6S16.42,18,12,18Z" transform="translate(-1 -3)"/>
    </Svg>
  );
}
