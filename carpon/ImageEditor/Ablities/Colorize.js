import {TouchableOpacity, View, Text, StyleSheet, Image, ScrollView} from "react-native";
import React, {useState, useRef} from 'react';
import {HeaderEditTool} from "../HeaderEditTool";
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import color from "../../color";
import {
    Grayscale,
    RGBA,
    Cool, Warm, Brightness, Contrast
} from 'react-native-color-matrix-image-filters';
import {imageEditorAction} from "../ImageEditorAction";
import ViewShot from "react-native-view-shot";

const listAction = [
    {
        name: 'Clear',
        style: {},
        wrapComponent: Brightness,
        colorAttribute: {amount: 1.2}
    },
    {
        name: 'Hot',
        style: {},
        wrapComponent: Warm
    },
    {
        name: 'Cool',
        style: {},
        wrapComponent: Cool
    },
    {
        name: 'Cyan',
        style: {},
        wrapComponent: RGBA,
        colorAttribute: {red: 0, green: 0.95, blue: 0.95, alpha: 0.7}
    },
    {
        name: 'Grayscale',
        style: {},
        wrapComponent: Grayscale
    },
    {
        name: 'Brightness',
        style: {},
        wrapComponent: Brightness,
        colorAttribute: {amount: 1.5}
    },
    {
        name: 'Contrast',
        style: {},
        wrapComponent: Contrast,
        colorAttribute: {amount: 1.5}
    },
];

export function Colorize({renderImage, activated, width, height, originalImage, saveImage, imageSize}) {

    const [status, setStatus] = useState({
        component: View,
        colorParams: {},
        name: null
    });
    const coloringRef = useRef(null);

    const setDefaultImage = () => setStatus({
        component: View,
        colorParams: {},
        name: null
    });

    const [editorState, {changeImageSie, changeAbility}] = imageEditorAction();
    const ThemeComponent = status.component;
    const colorParams = status.colorParams;

    const captureImage = () => {
        coloringRef.current.capture().then(uri => {
            saveImage(uri);
            changeAbility(null);
            setDefaultImage()
        });
    }

    return (
        <View style={{width, height}}>
            {
                HeaderEditTool({
                    resetAction: () => setDefaultImage(),
                    saveImage: () => captureImage(),
                    changeAbility
                })
            }
            <View style={{ width, height: height - 40, alignItems: 'center', justifyContent: 'center'}}>
                <ViewShot ref={coloringRef} options={{ format: "jpg", quality: 0.9 }}
                          style={{ backgroundColor: 'white'}}>
                    <ThemeComponent {...colorParams} style={{width: imageSize.width, height: imageSize.height}}>
                        {renderImage}
                    </ThemeComponent>
                </ViewShot>
            </View>
            <ScrollView style={{
                    flexDirection: 'row',
                    paddingHorizontal: 5,
                    position: 'absolute', bottom: 50, zIndex: 10,
                    width
                }} contentContainerStyle={{paddingBottom: 20}} horizontal={true}
                >
                    <TouchableOpacity onPress={() => setDefaultImage()} style={styles.iconTool}>
                        <SvgImage source={() => SvgViews.OriginalColor({fill: color.active})}/>
                        <Text style={{...styles.colorName, color: !status.name ? color.active : 'white'}}>Original</Text>
                    </TouchableOpacity>
                    {
                        listAction.map((action, index) => {
                            const WrapComponent = action.wrapComponent;
                            return (
                                <TouchableOpacity onPress={() => setStatus({
                                    component: action.wrapComponent,
                                    colorParams: action.colorAttribute || {},
                                    name: action.name
                                })} style={{...styles.iconTool}} key={index}>
                                    <WrapComponent {...action.colorAttribute}>
                                        <Image source={originalImage} style={{ width: 24, height: 24, borderRadius: 12,
                                            borderWidth: action.name === status.name ? 1 : 0,
                                            borderColor: action.name === status.name ? color.active : 'white', ...action.style}}/>
                                    </WrapComponent>
                                    <Text style={{...styles.colorName, color: action.name === status.name ? color.active : 'white'}}>{action.name}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    colorName: {
        fontSize: 12,
        lineHeight: 14,
        color: 'white',
        marginTop: 3
    },
    iconTool: {flexGrow: 1, flexShrink: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 70},
})
