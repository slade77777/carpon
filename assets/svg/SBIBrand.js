
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

export default function SBIBrand(props) {
  return (
    <Svg height="75" width="75" viewBox="0 0 75 75">
    	<Defs>
    		<pattern height="100%" id="pattern" width="100%" preserveAspectRatio="none" viewBox="0 0 272 50">
    			<Image height="50" width="272" xlinkHref="data:image/png;base64,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"/>
    		</pattern>
    	</Defs>
    	<G id="Repeat_Grid_143" clipPath="url(#clip-path)" data-name="Repeat Grid 143">
    		<G id="Group_2625" transform="translate(-15 -422)" data-name="Group 2625">
    			<G id="Rectangle_2047" fill="#fff" stroke="#efefef" strokeWidth="1" transform="translate(15 422)" data-name="Rectangle 2047">
    				<Rect height="75" width="75" stroke="none"/>
    				<Rect height="74" width="74" fill="none" x="0.5" y="0.5"/>
    			</G>
    			<Rect height="12" id="Image_78" width="60" fill="url(#pattern)" transform="translate(23 454)" data-name="Image 78"/>
    		</G>
    	</G>
    </Svg>
  );
}
