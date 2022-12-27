import React , {Component} from 'react';
import {View, Text, SafeAreaView, Image} from 'react-native';
import {screen} from "../../../navigation";
import {images} from "../../../assets/index";
import ImageLoader from "../../../components/ImageLoader";
import {SingleColumnLayout} from "../../layouts";
import ButtonText from "../../../components/ButtonText";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {navigationService} from "../../services/index";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {viewPage} from "../../Tracker";

@screen('PrepareCarVerificationQR', {header: <HeaderOnPress title={'車検証情報の登録'}/>})
export class PrepareCarVerificationQR extends Component {

    componentDidMount() {
        viewPage('guide_adding_certification', '車検証情報の登録説明');
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: '#FFFFFF'
            }}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{backgroundColor: 'white', paddingLeft: 15, paddingRight: 15}}>
                            <View style={{paddingTop: 25, marginBottom: 15}}>
                                <Text style={{fontSize: 16, lineHeight: 24}}>
                                    車検証情報を登録すると、あなたがこの車の正式なオーナーであることが確認でき、リコール情報など車両固有の機能がご利用いただけるようになります。
                                </Text>
                            </View>
                            <Image source={images.prepareCarVerificationNew} style={{height : 260, width : '100%'}}/>
                            <View>
                                <View style={{padding: 30, paddingBottom: 40}}>
                                </View>
                            </View>
                        </View>
                    }
                    bottomContent={
                        <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                            <ButtonText onPress={() => navigationService.navigate('PrepareCameraQR')}  title={'次へ'}/>
                            {/*<ButtonCarpon*/}
                                {/*onPress={() => navigationService.clear('AuthenticationScreen')}*/}
                                {/*style={{marginBottom: 20, marginTop: 20, backgroundColor: '#EFEFEF'}}>*/}
                                {/*<Text style={{textAlign: 'center', fontSize: 14, color: '#999999'}}>スキップ</Text>*/}
                            {/*</ButtonCarpon>*/}
                        </View>
                    }
                />
            </SafeAreaView>
        );
    }
}
