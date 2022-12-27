
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

export default function OriginalColor(props) {
  return (
    <Svg height="24" width="24" viewBox="0 0 24 24">
    	<Path id="iconmonstr-forbidden-thin" d="M12,24A12,12,0,1,0,0,12,12.006,12.006,0,0,0,12,24ZM3.878,19.415A11,11,0,0,1,19.415,3.878L3.878,19.415ZM20.122,4.585A11,11,0,0,1,4.585,20.122Z" fill={props.fill || "#4b9fa5"} fillRule="evenodd"/>
    </Svg>
  );
}
