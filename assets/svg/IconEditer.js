
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

export default function IconEditer(props) {
  return (
    <Svg height="18.002" width="18.003" viewBox="0 0 18.003 18.002">
    	<Path id="ic_create_24px" d="M3,17.25V21H6.75L17.81,9.94,14.06,6.19ZM20.71,7.04a1,1,0,0,0,0-1.41L18.37,3.29a1,1,0,0,0-1.41,0L15.13,5.12l3.75,3.75,1.83-1.83Z" fill={props.fill ? props.fill : '#ccc'} transform="translate(-3 -2.998)"/>
    </Svg>
  );
}
