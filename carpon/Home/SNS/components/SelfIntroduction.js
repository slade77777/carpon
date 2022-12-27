import React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {navigationService} from "../../../services";

function SelfIntroduction({isSelf = true, text, me}) {

    function handleNavigateProfile() {
        navigationService.navigate('ProfileStatement')
    }

    return (
        <View style={styles.wrapSelf}>
            {
                isSelf ? <Text style={styles.selfIntroduction}>{text}</Text> :
                    <View>
                        { me && <TouchableOpacity style={styles.textWrapIntro} onPress={handleNavigateProfile}>
                                <Text style={styles.textIntro}>プロフィール文を設定してマイページを充実させましょう</Text>
                            </TouchableOpacity>
                        }
                    </View>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    textIntro: {
        fontSize: 14,
        color: '#4B9FA5',
        textDecorationLine: 'underline'
    },
    selfIntroduction: {
        fontSize: 14,
        color: '#333333',
        // alignItems: 'center',
        lineHeight : 18,
        marginTop : 10
    },
    wrapSelf: {
        // marginTop: 10,
        // alignItems: 'center'
    },
    textWrapIntro : {
        marginTop: 20,
        alignItems: 'center'
    }
});

export default SelfIntroduction;
