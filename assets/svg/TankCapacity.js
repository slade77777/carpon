
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

export default function TankCapacity(props) {
  return (
    <Svg height="16.5" width="15" viewBox="0 0 15 16.5">
    	<Defs/>
    	<Path style={{fill: props.color || 'black'}} className="cls-1" id="ic_filter_frames_24px" d="M15.5,3h-3l-3-3-3,3h-3A1.5,1.5,0,0,0,2,4.5V15a1.5,1.5,0,0,0,1.5,1.5h12A1.5,1.5,0,0,0,17,15V4.5A1.5,1.5,0,0,0,15.5,3Zm0,12H3.5V4.5H6.89L9.53,1.875,12.14,4.5H15.5ZM14,6H5v7.5h9" transform="translate(-2)"/>
    </Svg>
  );
}
