import React, {Component} from 'react';
import {StyleSheet, View, PanResponder, Dimensions, Text, TouchableOpacity, Image as Img}from 'react-native';
import Svg,{
    Circle,
    G,
    Path,
    Image,
} from 'react-native-svg';
import color from "../carpon/color";
import ViewShot from "react-native-view-shot";
import {SvgImage, SvgViews} from "./Common/SvgImage";
import {isIphoneX} from "react-native-iphone-x-helper";
const {width, height} = Dimensions.get('window');

export default class CarImageMaskEditor extends Component {

    ratioWidth = this.props.img_width/width;

    initial = this.props.coordinates[0] ? {
        p1: this.props.coordinates[0],
        p2: this.props.coordinates[1],
        p3: this.props.coordinates[2],
        p4: this.props.coordinates[3],
        opacity: 1
    } : {
        p1: {x: 100, y: height/3 + 100 },
        p2: {x: 250, y: height/3 + 100 },
        p3: {x: 250, y: height/3 + 200 },
        p4: {x: 100, y: height/3 + 200 },
        opacity: 1
    };

    state = {
        ...this.initial
    };

    constructor(props) {
        super(props);

        this.panResponder1 = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                const p1 = {
                    x: this.initial.p1.x + gesture.dx,
                    y: this.initial.p1.y + gesture.dy
                };
                this.setState({p1: {...p1}});
            },
            onPanResponderGrant:() => {
                this.initial = {...this.state};
            }
        });
        this.panResponder2 = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                const p2 = {
                    x: this.initial.p2.x + gesture.dx,
                    y: this.initial.p2.y + gesture.dy
                };
                this.setState({p2: {...p2}});
            },

            onPanResponderGrant:() => {
                this.initial = {...this.state};
            }
        });
        this.panResponder3 = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                const p3 = {
                    x: this.initial.p3.x + gesture.dx,
                    y: this.initial.p3.y + gesture.dy
                };
                this.setState({p3: {...p3}});
            },
            onPanResponderGrant:() => {
                this.initial = {...this.state};
            }
        });
        this.panResponder4 = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                const p4 = {
                    x: this.initial.p4.x + gesture.dx,
                    y: this.initial.p4.y + gesture.dy
                };
                this.setState({p4: {...p4}});
            },
            onPanResponderGrant: () => {
                this.initial = {...this.state};
            }
        });


        this.shapeResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                this.setState({
                    p1: {
                        x: this.initial.p1.x + gesture.dx,
                        y: this.initial.p1.y + gesture.dy
                    },
                    p2: {
                        x: this.initial.p2.x + gesture.dx,
                        y: this.initial.p2.y + gesture.dy
                    },
                    p3: {
                        x: this.initial.p3.x + gesture.dx,
                        y: this.initial.p3.y + gesture.dy
                    },
                    p4: {
                        x: this.initial.p4.x + gesture.dx,
                        y: this.initial.p4.y + gesture.dy
                    },

                });
            },
            onPanResponderGrant: () => {
                this.initial = {...this.state};
            }
        });

        this.imageRef = React.createRef();
    }

    handleSave() {
        this.setState({opacity: 0});
        this.imageRef.current.capture().then(uri => {
            this.props.onSave(uri);
        });
    }

    render() {
        const viewBox         = `0 0 ${this.props.img_width} ${this.props.img_height}`;

        const {p1, p2, p3, p4} = this.state;

        const path = `M${p1.x} ${p1.y} L${p2.x} ${p2.y} L${p3.x} ${p3.y} L${p4.x} ${p4.y} Z`;

        return (
            <View
                style={{
                    ...StyleSheet.absoluteFill
                }}>
                <View style={{  flexDirection: 'row',justifyContent: 'space-between',
                    paddingHorizontal: 20, paddingTop: isIphoneX() ? 50 : 30,
                    backgroundColor: '#262525', height: height/3, zIndex: 10}}>
                    <TouchableOpacity activeOpacity={1} style={{ marginLeft: 0}} onPress={() => this.props.onCloseEdit()}>
                        <Text style={{ fontSize: 14, textAlign: 'right', color: 'white', fontWeight: 'bold'}}>
                            クリア
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.handleSave()}>
                        <Text style={{ fontSize: 14, textAlign: 'right', color: 'white', fontWeight: 'bold'}}>
                            確定
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: '#262525', height: height/3, marginTop: height/3, flexDirection: 'column', justifyContent: 'space-between', zIndex: 10}}>
                    <View style={{ marginTop: 40}}>
                        <View style={{ marginHorizontal: 50}}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 14}}>マスクの四隅をドラッグし</Text>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 14, marginTop: 3}}>適切な位置に調整し確定してください</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 100, marginBottom: 40}}>
                        <View/>
                        <View>
                            <View>
                                <SvgImage
                                    source={() => SvgViews.Hover(color.active)}
                                />
                                <Text style={{ color: color.active, fontSize: 10, marginTop: 8}}>ナンバーマスク</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ViewShot ref={this.imageRef} options={{ format: "jpg", quality: 0.9 }} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Svg width={width} height={height} viewBox={viewBox} fill={'white'} preserveAspectRatio="xMidYMid meet">

                        <G>
                            <Image href={{uri: this.props.image}} x={0} y={0} width={this.props.img_width} height={this.props.img_height}/>

                            <Path {...this.shapeResponder.panHandlers} d={path} fillOpacity={'1'}/>
                            {
                                <G>
                                    <Circle {...this.panResponder1.panHandlers} cx={p1.x} cy={p1.y} r={10 * this.ratioWidth} fill={color.active} opacity={this.state.opacity}/>
                                    <Circle {...this.panResponder2.panHandlers} cx={p2.x} cy={p2.y} r={10 * this.ratioWidth} fill={color.active} opacity={this.state.opacity}/>
                                    <Circle {...this.panResponder3.panHandlers} cx={p3.x} cy={p3.y} r={10 * this.ratioWidth} fill={color.active} opacity={this.state.opacity}/>
                                    <Circle {...this.panResponder4.panHandlers} cx={p4.x} cy={p4.y} r={10 * this.ratioWidth} fill={color.active} opacity={this.state.opacity}/>
                                </G>
                            }
                        </G>
                    </Svg>
                </ViewShot>
            </View>
        );
    }
}

