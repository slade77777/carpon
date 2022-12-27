
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
  Stop,
  TSpan
} from 'react-native-svg';

export default function ChooseMileageText(props) {
  return (
    <Svg height="31" width="236" viewBox="0 0 236 31">
    	<G id="Group_6031" transform="translate(-1077.5 -1017.5)" data-name="Group 6031">
    		<Text id="走行距離と店舗を選ぶだけ" fill="#262626" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="18" stroke="#fff" strokeLinecap="round" strokeWidth="3" transform="translate(1310.5 1039.5)">
    			<TSpan x="-229.2" y="0">走行距離</TSpan>
    			<TSpan fontSize="15" y="0">と</TSpan>
    			<TSpan y="0">店舗</TSpan>
    			<TSpan fontSize="15" y="0">を</TSpan>
    			<TSpan y="0">選ぶだけ</TSpan>
    		</Text>
    		<Text id="走行距離と店舗を選ぶだけ-2" fill="#083" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="18" transform="translate(1310 1040)" data-name="走行距離と店舗を選ぶだけ">
    			<TSpan x="-229.2" y="0">走行距離</TSpan>
    			<TSpan fill="#262626" fontSize="15" y="0">と</TSpan>
    			<TSpan y="0">店舗</TSpan>
    			<TSpan fill="#262626" fontSize="15" y="0">を</TSpan>
    			<TSpan fill="#262626" y="0">選ぶだけ</TSpan>
    		</Text>
    	</G>
    </Svg>
  );
}
