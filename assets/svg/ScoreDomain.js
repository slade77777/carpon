
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

export default function ScoreDomain(props) {
  return (
    <Svg height="27" width="30" viewBox="0 0 30 27" fill={'#CCCCCC'}>
    	<Defs/>
    	<Path className="cls-1" id="ic_domain_24px" d="M17,9V3H2V30H32V9ZM8,27H5V24H8Zm0-6H5V18H8Zm0-6H5V12H8ZM8,9H5V6H8Zm6,18H11V24h3Zm0-6H11V18h3Zm0-6H11V12h3Zm0-6H11V6h3ZM29,27H17V24h3V21H17V18h3V15H17V12H29ZM26,15H23v3h3Zm0,6H23v3h3Z" transform="translate(-2 -3)"/>
    </Svg>
  );
}
