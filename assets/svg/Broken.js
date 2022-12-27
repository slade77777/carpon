
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

export default function Broken(props) {
  return (
    <Svg height="18" width="18" viewBox="0 0 18 18">
    	<Defs/>
    	<Path style={{fill: props.color || 'black'}} className="cls-1" id="ic_broken_image_24px" d="M21,5v6.59L18,8.58l-4,4.01-4-4-4,4L3,9.58V5A2.006,2.006,0,0,1,5,3H19A2.006,2.006,0,0,1,21,5Zm-3,6.42,3,3.01V19a2.006,2.006,0,0,1-2,2H5a2.006,2.006,0,0,1-2-2V12.42l3,2.99,4-4,4,4Z" transform="translate(-3 -3)"/>
    </Svg>
  );
}
