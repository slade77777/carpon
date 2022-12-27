
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

export default function OtherIconBuild(props) {
  return (
    <Svg height={props.height || 24.849} width={props.width || 25} viewBox="0 0 25 24.849" fill={props.fill}>
    	<Defs/>
    	<Path className="cls-1" id="ic_build_24px" d="M25.628,21.411,15.3,11.085a7.282,7.282,0,0,0-1.7-7.829A7.5,7.5,0,0,0,5.2,1.781L10.083,6.66l-3.4,3.4L1.687,5.185a7.313,7.313,0,0,0,1.475,8.4,7.282,7.282,0,0,0,7.829,1.7L21.316,25.609a1.1,1.1,0,0,0,1.589,0L25.515,23A1.022,1.022,0,0,0,25.628,21.411Z" transform="translate(-0.956 -1.1)"/>
    </Svg>
  );
}
