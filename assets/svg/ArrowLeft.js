
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

export default function ArrowLeft(props) {
  return (
    <Svg height="20" width="10" viewBox="0 0 11 20" fill={props.fill || '#CCCCCC'}>
    	<Defs/>
    	<Path className="cls-1" id="icon_arrow_gray" d="M10.013,0,0,10.071,10.013,20,11,19.007,1.974,10.071,11,.993Z" transform="translate(11 20) rotate(180)"/>
    </Svg>
  );
}
