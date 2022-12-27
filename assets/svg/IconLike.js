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

export default function IconLike(props) {

    const color = props ? props.color: false;
    const iconColor= color ? color : '#CCCCCC';

    return (
    <Svg height="10.909" width="12" viewBox="0 0 12 10.909">
    	<Defs/>
    	<Path style={{fill: iconColor}} className="cls-1" id="ic_thumb_up_24px" d="M1,11.909H3.182V5.364H1Zm12-6a1.094,1.094,0,0,0-1.091-1.091H8.467l.518-2.493L9,2.151a.821.821,0,0,0-.24-.578L8.184,1,4.595,4.595a1.067,1.067,0,0,0-.322.769v5.455a1.094,1.094,0,0,0,1.091,1.091h4.909a1.084,1.084,0,0,0,1-.665L12.924,7.4A1.078,1.078,0,0,0,13,7V5.958l-.005-.005Z" transform="translate(-1 -1)"/>
    </Svg>
  );
}
