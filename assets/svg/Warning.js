
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

export default function Warning(props) {
  return (
    <Svg height="20" width="20" viewBox="0 0 22 19">
    	<Defs/>
    	<Path style={{fill: props.color || 'black'}} className="cls-1" id="ic_warning_24px" d="M1,21H23L12,2Zm12-3H11V16h2Zm0-4H11V10h2Z" transform="translate(-1 -2)"/>
    </Svg>
  );
}
