
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

export default function JapanFlag(props) {
  let height = props.height || 30;
  let width = props.width || 45;
  let ratio = Math.min(height / 30, width / 45);

  return (
    <Svg height={30 * ratio} width={45 * ratio}>
      <Rect height={30 * ratio} width={45 * ratio} fill="#fff" />
      <Circle x={22.5 * ratio} y={15 * ratio} fill="#bc002d" r={45 * ratio / 5} />
    </Svg>
  );
}
