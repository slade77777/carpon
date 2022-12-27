
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
  TSpan
} from 'react-native-svg';

export default function CompanyText(props) {
  return (
    <Svg height="48" width="287" viewBox="0 0 287 48">
    	<G id="Group_6030" transform="translate(-13 -902)" data-name="Group 6030">
    		<Text id="最大8社に見積依頼" fill="red" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="30" stroke="#fff" strokeLinecap="round" strokeWidth="3" transform="translate(297 937)">
    			<TSpan x="-280.685" y="0">最大</TSpan>
    			<TSpan fontFamily="Helvetica" y="0">8</TSpan>
    			<TSpan y="0">社に見積依頼</TSpan>
    		</Text>
    		<G id="Group_6029" data-name="Group 6029">
    			<Text id="最大8社に見積依頼-2" fill="red" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="30" transform="translate(297 937)" data-name="最大8社に見積依頼">
    				<TSpan x="-280.685" y="0">最大</TSpan>
    				<TSpan fontFamily="Helvetica" y="0">8</TSpan>
    				<TSpan y="0">社に見積依頼</TSpan>
    			</Text>
    		</G>
    	</G>
    </Svg>
  );
}
