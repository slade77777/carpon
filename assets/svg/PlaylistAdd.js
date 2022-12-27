
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

export default function PlaylistAdd(props) {
  return (
    <Svg height="14" width="20" viewBox="0 0 20 14" fill={'#999999'}>
    	<Defs/>
    	<Path className="cls-1" id="ic_playlist_add_24px" d="M14,10H2v2H14Zm0-4H2V8H14Zm4,8V10H16v4H12v2h4v4h2V16h4V14ZM2,16h8V14H2Z" transform="translate(-2 -6)"/>
    </Svg>
  );
}
