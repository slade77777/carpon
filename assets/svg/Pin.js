
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

export default function Pin(props) {
  return (
    <Svg height="20" id="icon_pin" width="18" viewBox="0 0 18 20">
    	<Path id="Path_4650" d="M67.3-1651.448l-1.165,2.5a.3.3,0,0,0,.445.371l2.277-1.575,3.919-4.642-1.556-1.3Zm11.135-1.1-.572-3.912,3.62-4.287.12.1a1.531,1.531,0,0,0,2.147-.187,1.509,1.509,0,0,0-.188-2.135l-6.226-5.193a1.531,1.531,0,0,0-2.148.187,1.508,1.508,0,0,0,.188,2.134l.12.1-3.62,4.288-3.975.118a.813.813,0,0,0-.5,1.437l9.7,8.091A.818.818,0,0,0,78.43-1652.551Z" fill={props.fill} transform="translate(-66.101 1668.519)" data-name="Path 4650"/>
    </Svg>
  );
}
