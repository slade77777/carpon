
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

export default function IconOtherAccount(props) {
  return (
    <Svg height="25" width="25" viewBox="0 0 25 25" fill={props.fill}>
    	<Defs/>
    	<Path className="cls-1" id="ic_account_circle_24px" d="M14.5,2A12.5,12.5,0,1,0,27,14.5,12.5,12.5,0,0,0,14.5,2Zm0,3.75A3.75,3.75,0,1,1,10.75,9.5,3.745,3.745,0,0,1,14.5,5.75Zm0,17.75A9,9,0,0,1,7,19.475c.037-2.488,5-3.85,7.5-3.85s7.462,1.362,7.5,3.85A9,9,0,0,1,14.5,23.5Z" transform="translate(-2 -2)"/>
    </Svg>
  );
}
