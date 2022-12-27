
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

export default function Inspection(props) {
  return (
    <Svg height="17.892" width="18" viewBox="0 0 18 17.892">
    	<Defs/>
    	<Path style={{fill: props.color || 'black'}} className="cls-1" id="ic_build_24px" d="M18.72,15.724,11.286,8.289A5.243,5.243,0,0,0,10.06,2.652,5.4,5.4,0,0,0,4.015,1.59L7.528,5.1,5.077,7.554,1.482,4.041a5.265,5.265,0,0,0,1.062,6.046c1.552,1.552,5.637,1.225,5.637,1.225l7.434,7.434a.79.79,0,0,0,1.144,0l1.879-1.879a.736.736,0,0,0,.082-1.144Z" transform="translate(-0.956 -1.1)"/>
    </Svg>
  );
}
