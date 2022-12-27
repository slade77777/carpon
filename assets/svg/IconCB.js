
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

export default function IconCBActive(props) {
    const size = props ? (props.size ? props.size: {h: 18, w: 18}) : {h: 18, w: 18};
    const color = props ? (props.color ? props.color : '#CCCCCC') : '#CCCCCC';
  return (
    <Svg height={size.h} width={size.w} viewBox="0 0 18 18">
    	<Defs/>
    	<Path style={{fill: color}} className="cls-1" id="ic_check_box_24px" d="M19,3H5A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V5A2,2,0,0,0,19,3ZM10,17,5,12l1.41-1.41L10,14.17l7.59-7.59L19,8Z" transform="translate(-3 -3)"/>
    </Svg>
  );
}
