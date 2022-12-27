
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

export default function IconCamera(props) {
  const size = props ? (props.size ? props.size: {h: 45, w: 50}) : {h: 45, w: 50};
  const color = props ? (props.color ? props.color : '#fff') : '#fff';
  return (
    <Svg height={size.h} width={size.w} viewBox="0 0 50 45">
    	<Defs/>
    	<Path style={{ fill: color}} className="cls-1" id="Path_1159" d="M19.5,2,14.925,7H7a5.015,5.015,0,0,0-5,5V42a5.015,5.015,0,0,0,5,5H47a5.015,5.015,0,0,0,5-5V12a5.015,5.015,0,0,0-5-5H39.075L34.5,2ZM27,39.5A12.5,12.5,0,1,1,39.5,27,12.5,12.5,0,0,1,27,39.5Z" transform="translate(-2 -2)" data-name="Path 1159"/>
    </Svg>
  );
}
