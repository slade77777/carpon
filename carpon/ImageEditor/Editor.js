import React, {useState, useReducer, useEffect, useRef} from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Animated, PermissionsAndroid, Alert, Platform} from "react-native";
import {SvgImage, SvgViews} from "../../components/Common/SvgImage";
import color from './../color';
import {ImageEditorReducer} from "./ImageEditorReducer";
import {imageEditorAction} from "./ImageEditorAction";
import CameraRoll, {save} from "@react-native-community/cameraroll";
import AndroidOpenSettings from "react-native-android-open-settings";

export function WrapperEditor({abilities, width, height, imageSources, updateCar, goBack}) {

    const [{ability, imageSize}, {changeImageSize, changeAbility, setImageUri}] = imageEditorAction();

    const defaultImageList = imageSources.slice();
    const [imageChoice, setImageChoice] = useState(0);
    const [imageList, setImageList] = useState(defaultImageList);
    const [imageUrl, setImageUrl] = useState(imageSources[0]);

    useEffect(() => {
        if (imageSources.length > 0) {
            if (!prevURL || (imageUrl.uri !== prevURL.uri)) {
                setImageSize();
            }
        }
    }, [imageUrl]);

    useEffect(() => {
        if (imageSources.length > 0) {
            saveImage(imageSources[0].uri);
            setImageList(defaultImageList)
        }
    }, [imageSources]);

    const prevURLRef = useRef();
    useEffect(() => {
        prevURLRef.current = imageUrl;
    });
    const prevURL = prevURLRef.current;

    // useEffect(() => {
    //     imageSources.length > 0 && setCarPlateCoordinates();
    // }, [imageSize]);

    const saveImage = (uri) => {
        let currentImageList = imageList;
        currentImageList[imageChoice] = {uri};
        setImageList(currentImageList);
        setImageUrl({uri});
        setImageUri(uri)
    };

    const resetImage = () => {
        saveImage(imageSources[imageChoice].uri);
    };


    const setImageSize = () => {
        Image.getSize(imageUrl.uri, (imgWidth, imgHeight) => {
            let imageRatio = imgWidth / imgHeight;
            let paddingTop = 0;
            let imageHeight = 0;
            let imageWidth = 0;
            let paddingLeft = 0;
            if (imageRatio < width / (height - 40)) {
                imageWidth = (height - 40) * imageRatio;
                paddingLeft = (width - imageWidth) / 2;
                imageHeight = height - 40;
                paddingTop = 40;
            } else {
                imageWidth = width;
                paddingLeft = 0;
                imageHeight = width / (imageRatio);
                paddingTop = (height - imageHeight) / 2 + 20;
            }
            changeImageSize({
                width: imageWidth,
                height: imageHeight,
                actualPaddingLeft: paddingLeft,
                actualPaddingTop: paddingTop,
            })
        });
    };

    const checkAndroidPermission = async () => {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (!granted) {
                Alert.alert(
                    'カメラへのアクセスを許可',
                    'カメラの利用が許可されていません。「設定」アプリでCarponのアクセスを許可してください。',
                    [
                        {
                            text: 'いいえ',
                        },
                        {
                            text: 'はい',
                            onPress: () => AndroidOpenSettings.appDetailsSettings()
                        }
                    ])
            }
        } catch (error) {
            console.log(error)
        }
    };

    const downloadImage = async () => {
        if (Platform.OS === 'android') {
            await checkAndroidPermission();
        }
        CameraRoll.save(imageUrl.uri, {type: 'photo', album: 'Carpon'}).then(result => {
            Alert.alert('完了', '写真を保存しました');
        }).catch(error => console.log(error))
    };

    let imageRenderer = (<Image
        style={{
            resizeMode: 'cover',
            width: imageSize.width,
            height: imageSize.height,
        }}
        source={imageUrl}
    />);

    abilities.map(({component: Ability, name, icon}, index) => {
        if (ability && ability === name) {
            imageRenderer = (<Ability saveImage={(uri) => saveImage(uri)}
                                      originalImage={imageUrl} width={width} height={height} imageSize={imageSize}
                                      activated={ability === name} renderImage={imageRenderer}/>);
        }
    });

    const changeDefaultImage = (index) => {
        setImageChoice(index);
        setImageUrl(imageList[index]);
    };

    const handleRemind = (back) => {
        Alert.alert(
            "編集内容を破棄します",
            "編集内容を破棄します。よろしいですか？",
            [
                {
                    text: "いいえ",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "はい",
                    onPress: () => back === 'goBack' ? goBack() : resetImage()
                }
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={{
            zIndex: 1
        }}>
            <View style={{width, height, zIndex: 8}}>
                {
                    !ability && <View style={{
                        flexDirection: 'row',
                        height: 40,
                        paddingHorizontal: 15,
                        justifyContent: 'space-between',
                        paddingTop: 10
                    }}>
                        <TouchableOpacity onPress={() => handleRemind('goBack')} style={styles.iconTool}>
                            <SvgImage source={SvgViews.ActionBarBack}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemind()} style={styles.iconTool}>
                            <SvgImage source={SvgViews.ButtonTrash}/>
                        </TouchableOpacity>
                        {
                            abilities.map(({name, icon: renderIcon}) => (
                                <TouchableOpacity
                                    key={name}
                                    style={styles.iconTool}
                                    activeOpacity={1}
                                    onPress={() => changeAbility(name)}
                                >
                                    {renderIcon()}
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                }
                {
                    imageSize.width !== 1 ? <View>
                        {
                            ability ? imageRenderer
                                : <Animated.View
                                    style={{width, height: height - 40, alignItems: 'center', justifyContent: 'center'}}>
                                    {imageRenderer}
                                </Animated.View>
                        }
                    </View> : <View/>
                }
            </View>
            {
                !ability && <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'absolute', bottom: 50, zIndex: 10,
                    width
                }}
                >
                    <TouchableOpacity onPress={() => downloadImage()}>
                        <SvgImage source={SvgViews.Download}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        updateCar(imageUrl.uri);
                    }}
                                      style={{
                                          width: 60,
                                          height: 60,
                                          borderRadius: 30,
                                          backgroundColor: color.active,
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                      }}>
                        <SvgImage source={SvgViews.CheckMark}/>
                        {/*<Icon name='md-checkmark' color='white' size={30}/>*/}
                    </TouchableOpacity>
                </View>
            }
            {
                !ability && imageSources.length > 1 && <View style={{
                    position: 'absolute',
                    width,
                    bottom: 120,
                    height: 30,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    {
                        imageList.map((image, index) => (
                            <TouchableOpacity onPress={() => changeDefaultImage(index)} key={index}>
                                <Image source={image} style={{
                                    borderWidth: 1, borderColor: imageChoice === index ? color.active : 'white',
                                    width: 30, height: 30, marginRight: 10
                                }}/>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            }
        </View>
    )
}


export const EditorContext = React.createContext({
    activatedAbility: null
});

const defaultEditorState = {
    imageSize: {
        width: 1,
        height: 1
    },
    screenSize: {
        width: 1,
        height: 1
    },
    activatedAbility: null,
    ability: null,
    croppingParam: {
        scale: 1,
        FrameScale: 1,
        translate: {
            x: 0, y: 0
        },
    },
    hoveringParam: {
        scale: 1,
        translate: {
            x: 0, y: 0
        },
    },
    limitParam: {
        limit: 0,
        translation: null
    },
    actionInfo: {
        rotate: 0,
        frameSize: {},
        ImageSize: {},
        imageScale: 1
    }
};

export function Editor({abilities, width, height, imageSources, updateCar, goBack}) {

    const [state, dispatch] = useReducer(ImageEditorReducer, defaultEditorState);

    return (
        <EditorContext.Provider value={[state, dispatch]}>
            <WrapperEditor abilities={abilities} width={width} height={height} imageSources={imageSources}
                           updateCar={(url) => updateCar(url)}
                           goBack={() => goBack()}
            />
        </EditorContext.Provider>
    );
}

const styles = StyleSheet.create({
    iconTool: {flexGrow: 1, flexShrink: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'},
});
