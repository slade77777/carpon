import { Dimensions, View } from "react-native";
import SkeletonPlaceholder  from "react-native-skeleton-placeholder";
import React               from "react";

const {width} = Dimensions.get('window');

export default () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', paddingVertical: 20, backgroundColor: '#FFF'}}>
            <SkeletonPlaceholder backgroundColor={'#EAEAEA'}>
                <View style={{flexDirection:"row", alignItems:"center"}} >
                    <View style={{marginLeft: 15, width: 40, height: 40, borderRadius: 50}} />
                    <View style={{flex: 1, flexDirection:'row', justifyContent:'space-between', marginHorizontal: 10}}>
                        <View>
                            <View style={{width: 60, height: 20, borderRadius: 4}} />
                            <View style={{width: 40, height: 10, borderRadius: 4, marginTop: 8}} />
                        </View>
                        <View style={{width: 45, height: 35, borderRadius: 4, marginRight:5, marginVertical:4}} />
                    </View>
                </View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder backgroundColor={'#EAEAEA'}>
                <View style={{ height: (width * 2) / 3, width: '92.5%', marginRight: 5, marginHorizontal: 15, marginVertical: 18 }} />
            </SkeletonPlaceholder>
        </View>
    )
}
