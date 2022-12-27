
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

export default function Clip(props) {
  const color = props.color ? props.color : 'white';
  const size = props.size ? props.size : {h: 22, w: 11};
  return (
    <Svg height={size.h} width={size.w} viewBox="0 0 11 22">
    	<Defs/>
    	<Path style={{ fill: color}} className="cls-1" id="ic_attach_file_24px" d="M16.5,6V17.5a4,4,0,0,1-8,0V5a2.5,2.5,0,0,1,5,0V15.5a1,1,0,0,1-2,0V6H10v9.5a2.5,2.5,0,0,0,5,0V5A4,4,0,0,0,7,5V17.5a5.5,5.5,0,0,0,11,0V6Z" transform="translate(-7 -1)"/>
    </Svg>
  );
}
