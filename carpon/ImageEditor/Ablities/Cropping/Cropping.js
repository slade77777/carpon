import React, {useState, useEffect, useRef} from "react";
import {View, TouchableOpacity, Animated, Easing} from "react-native";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {HeaderEditTool} from "../../HeaderEditTool";
import {imageEditorAction} from "../../ImageEditorAction";
import {CalculateImageSize, CalculateLimit, ScaleChecker, transitionChecker} from "../../CalculateImageSize";
import ViewShot from "react-native-view-shot";
import PanZoomInput from "./PanZoomInput";

export function Cropping({renderImage, activated, width, height, saveImage}) {

    let ScreenHeight = height - 110;
    const DEFAULT_SIZE = 'DefaultSize';
    const SIZE_11 = 'DisplaySize_11';
    const SIZE_34 = 'DisplaySize_34';
    const SIZE_916 = 'DisplaySize_916';
    const Color = '#000';
    const opacity = 0.3;
    const animationTime = 300;

    const [{imageSize, ability, croppingParam, actionInfo}, {changeAbility, changeImageSize, panZoomTo, panLimit, handleImageAction}] = imageEditorAction();
    const [defaultImageSize, setDefaultImageSize] = useState(0);
    const [rotateCorner, setRotateCorner] = useState(0);
    const [abilityState, setAbilityState] = useState(DEFAULT_SIZE);
    const [FrameImageSize, setFrameImageSize] = useState({
        ...CalculateImageSize(imageSize, {width: width - 30, height: ScreenHeight})
    });

    this.penToolRef = React.createRef();
    const translate = croppingParam.translate;
    const captureImage = () => {
        this.penToolRef.current.capture().then(uri => {
            saveImage(uri);
            changeAbility(null);
        });
    };

    // animation
    const animatedRotateValue = useRef(new Animated.Value(rotateCorner)).current;
    const animatedScale = new Animated.Value(croppingParam.scale);
    const DefaultFrame = CalculateImageSize(calculateImageSize(handleRotate()), {
        width: width - 30,
        height: ScreenHeight
    });

    function AnimationScale() {
        let Frame = abilityState === DEFAULT_SIZE ? DefaultFrame : FrameImageSize;
        Animated.timing(
            animatedScale,
            {
                toValue: ScaleChecker(calculateImageSize(handleRotate()), Frame),
                duration: animationTime,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start()
    }

    function AnimationRotate(Corner, actionActive) {
        Animated.timing(
            animatedRotateValue,
            {
                toValue: Corner,
                duration: animationTime,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => {
            actionActive && handleImageRotate()
        })
    }

    function handleRotateImage() {
        AnimationScale();
        AnimationRotate(rotateCorner - 90, true);
    }

    function handleRatioAnimation(ratioName, scale) {
        Animated.timing(
            animatedScale,
            {
                toValue: scale,
                duration: animationTime,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(() => {
            changeRatioFrame(ratioName);
        })
    }

    function handleRatio(ratioName) {
        let scale = ratioName === 'DefaultSize' ? 1 : ScaleChecker(calculateImageSize(rotateCorner), rations[ratioName]);
        handleRatioAnimation(ratioName, scale);
        ratioName === 'DefaultSize' && AnimationRotate(0, false);
    }

    const spin = animatedRotateValue.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    });

    // logic

    function resetSize (){
        handleRatio(DEFAULT_SIZE);
        changeImageSize({
            ...CalculateImageSize(imageSize, {width: width, height: ScreenHeight})
        });
    }

    useEffect(() => {
        changeImageSize({
            ...CalculateImageSize(imageSize, {width: width - 30, height: ScreenHeight})
        });
        setDefaultImageSize(imageSize)
    }, [ability]);

    useEffect(() => {
        let ImgSize = (rotateCorner === -270 || rotateCorner === -90) ? oppositionImage(imageSize) : imageSize;
        if (actionInfo.panInput) {
            panLimit({
                limit: CalculateLimit(ImgSize, FrameImageSize, actionInfo.imageScale),
                translation: transitionChecker(ImgSize, FrameImageSize, actionInfo.imageScale)
            });
        }
    }, [actionInfo]);

    const rations = {
        DefaultSize: {
            ...CalculateImageSize(defaultImageSize, {
                width: width - 30,
                height: ScreenHeight
            }),
        },
        DisplaySize_11: {
            width: width - 30,
            height: width - 30
        },
        DisplaySize_34: {
            width: width - 30,
            height: (width - 30) * 4 / 3
        },
        DisplaySize_916: {
            width: 9 * ScreenHeight / 16,
            height: ScreenHeight
        },
    };

    function calculateImageSize(RCorner) {
        return (RCorner === -270 || RCorner === -90) ? oppositionImage(imageSize) : imageSize;
    }

    function oppositionImage(image) {
        return {width: image.height, height: image.width}
    }

    function changeRatioFrame(ratioName) {
        let FSize = rations[ratioName];
        let scale = ScaleChecker(calculateImageSize(rotateCorner), FSize);
        if (ratioName === 'DefaultSize') {
            setRotateCorner(0);
            panZoomTo({x: 0, y: 0}, 1, 1);
            panLimit({
                limit: 0,
                translation: null
            });
        } else {
            panZoomTo({x: 0, y: 0}, scale, scale);
            panLimit({
                limit: CalculateLimit(calculateImageSize(rotateCorner), FSize, scale),
                translation: transitionChecker(calculateImageSize(rotateCorner), FSize, scale)
            });
        }
        let actionInfo = {
            rotate: rotateCorner,
            frameSize: {...FSize},
            ImageSize: {...calculateImageSize(rotateCorner)},
            imageScale: scale,
            panInput: false
        };
        setAbilityState(ratioName);
        setFrameImageSize(FSize);
        handleImageAction(actionInfo);
    }

    function handleImageRotate() {
        let scale = ScaleChecker(calculateImageSize(handleRotate()), FrameImageSize);
        let actionInfo = {
            rotate: handleRotate(),
            frameSize: {...FrameImageSize},
            ImageSize: {...calculateImageSize(handleRotate())},
            imageScale: scale,
            panInput: false
        };
        setRotateCorner(handleRotate());
        handleRotate() === 0 && animatedRotateValue.setValue(0);
        handleImageAction(actionInfo);
        if (abilityState === DEFAULT_SIZE) {
            return handleDefaultImageRotate(calculateImageSize(handleRotate()));
        } else {
            panZoomTo({x: 0, y: 0}, scale, scale);
            panLimit({
                limit: CalculateLimit(calculateImageSize(handleRotate()), FrameImageSize, scale),
                translation: transitionChecker(calculateImageSize(handleRotate()), FrameImageSize, scale)
            });
        }
    }

    function handleDefaultImageRotate(ImgSize) {
        setFrameImageSize(DefaultFrame);
        let scale = ScaleChecker(ImgSize, DefaultFrame);
        panZoomTo({x: 0, y: 0}, scale, scale);
        panLimit({
            limit: CalculateLimit(ImgSize, DefaultFrame, scale),
            translation: transitionChecker(ImgSize, DefaultFrame, scale)
        });
    }

    function handleRotate() {
        return rotateCorner === -270 ? 0 : rotateCorner - 90
    }

    function handleChangeColorAbilityButton(ability) {
        return (ability === abilityState) ? ability + 'Activated' : ability
    }

    const CroppingAbilities = [
        {
            name: 'rotate',
            icon: <SvgImage source={SvgViews.IconRotation}/>,
            onPress: () => handleRotateImage()
        },
        {
            name: 'default',
            icon: <SvgImage source={SvgViews[handleChangeColorAbilityButton(DEFAULT_SIZE)]}/>,
            onPress: () => {
                (abilityState !== 'DefaultSize' || rotateCorner !== 0) && handleRatio(DEFAULT_SIZE);
            }
        },
        {
            name: 'ratio11Size',
            icon: <SvgImage
                source={SvgViews[handleChangeColorAbilityButton(SIZE_11)]}/>,
            onPress: () => {
                handleRatio(SIZE_11)
            },
        },
        {
            name: 'ratio34Size',
            icon: <SvgImage
                source={SvgViews[handleChangeColorAbilityButton(SIZE_34)]}/>,
            onPress: () => {
                handleRatio(SIZE_34)
            }
        },
        {
            name: 'ratio916Size',
            icon: <SvgImage
                source={SvgViews[handleChangeColorAbilityButton(SIZE_916)]}/>,
            onPress: () => {
                handleRatio(SIZE_916);
            }
        }
    ];

    return (
        <View
            style={{backgroundColor: Color}}
        >
            {
                activated && <View style={{zIndex: 5}}>
                    <View style={{backgroundColor: Color, opacity: opacity, width: width, height: 40}}/>
                    <View style={{zIndex: 6,width: width, height: 40, position: 'absolute'}}>
                        {HeaderEditTool({
                            changeAbility,
                            resetSize,
                            saveImage: () => {
                                captureImage()
                            },
                        })}
                    </View>
                </View>
            }
            <View style={{justifyContent: 'space-between', height: height - 110}}>
                <View style={{width, height: ScreenHeight, justifyContent: 'center', alignItems: 'center'}}>
                    <ViewShot ref={this.penToolRef} options={{format: "jpg", quality: 0.9}}
                              style={{
                                  backgroundColor: '#000',
                                  width: FrameImageSize.width,
                                  height: FrameImageSize.height,
                                  justifyContent: 'center',
                                  alignItems: 'center'
                              }}>
                        <Animated.View
                            style={[
                                {
                                    transform: [
                                        {translateX: translate.x}, {translateY: translate.y},
                                        {scale: animatedScale},
                                        {rotate: spin}
                                    ]
                                }]}
                        >
                            {renderImage}
                        </Animated.View>
                    </ViewShot>
                </View>

                <View style={{
                    width: width,
                    height: ScreenHeight,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <View style={{width: width, height: ScreenHeight}}>
                        <View style={{flexDirection: 'row', width: width, height: ScreenHeight,}}>
                            <View style={{
                                width: (width - FrameImageSize.width) / 2,
                                backgroundColor: Color,
                                height: ScreenHeight,
                                opacity: opacity
                            }}/>
                            <View style={{width: FrameImageSize.width, height: ScreenHeight}}>
                                <View style={{
                                    height: (ScreenHeight - FrameImageSize.height) / 2,
                                    backgroundColor: Color,
                                    width: FrameImageSize.width,
                                    opacity: opacity
                                }}/>
                                <PanZoomInput>
                                    <View style={{
                                        width: width,
                                        height: ScreenHeight,
                                        position: 'absolute',
                                        zIndex: 9,
                                    }}/>
                                </PanZoomInput>
                                <View style={{
                                    ...FrameImageSize,
                                    borderWidth: 1,
                                    borderColor: '#4b9fa5'
                                }}>
                                    <SvgImage style={{position: 'absolute', top: -0.1, left: -0.1}}
                                              source={SvgViews.TopLeft}/>
                                    <SvgImage style={{position: 'absolute', bottom: 0, left: 0}}
                                              source={SvgViews.BottomLeft}/>
                                    <SvgImage style={{position: 'absolute', top: -0.1, right: -0.2}}
                                              source={SvgViews.TopRight}/>
                                    <SvgImage style={{position: 'absolute', bottom: -0.1, right: -0.2}}
                                              source={SvgViews.BottomRight}/>
                                </View>
                                <View style={{
                                    height: (ScreenHeight - FrameImageSize.height) / 2,
                                    backgroundColor: Color,
                                    width: FrameImageSize.width,
                                    opacity: opacity
                                }}/>
                            </View>
                            <View style={{
                                width: (width - FrameImageSize.width) / 2,
                                backgroundColor: Color,
                                height: ScreenHeight,
                                opacity: opacity
                            }}/>
                        </View>
                    </View>
                </View>
            </View>
            {
                activated &&
                <View style={{width, zIndex: 5}}>
                    <View style={{width, height: 110, backgroundColor: Color, opacity: opacity}}/>
                    <View style={{
                        width, height: 110,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        position: 'absolute'
                    }}>
                        {
                            CroppingAbilities.map((ability) =>
                                (
                                    <TouchableOpacity
                                        onPress={ability.onPress}
                                        key={ability.name}
                                    >
                                        {ability.icon}
                                    </TouchableOpacity>
                                )
                            )
                        }
                    </View>
                </View>
            }
        </View>
    )
}
