
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

export default function Filter(props) {
  return (
    <Svg height="12" width="18" viewBox="0 0 18 12">
    	<Path id="ic_filter_list_24px" d="M10,18h4V16H10ZM3,6V8H21V6Zm3,7H18V11H6Z" fill="#999" transform="translate(-3 -6)"/>
    </Svg>
  );
}
