
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

export default function Crop(props) {
  return (
    <Svg height="22" width="22" viewBox="0 0 22 22">
    	<Defs/>
    	<Path style={{fill: props}} className="cls-1" id="ic_crop_24px" d="M17,15h2V7a2.006,2.006,0,0,0-2-2H9V7h8ZM7,17V1H5V5H1V7H5V17a2.006,2.006,0,0,0,2,2H17v4h2V19h4V17Z" transform="translate(-1 -1)"/>
    </Svg>
  );
}
