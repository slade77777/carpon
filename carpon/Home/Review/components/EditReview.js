import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {SvgViews, SvgImage} from "../../../../components/Common/SvgImage";
import ActionSheet from 'react-native-actionsheet';
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import color from "../../../color";

export class EditReview extends Component {

    showActionSheet = () => {
        this.ActionSheet.show()
    };

    handleSelectReview(index) {
        this.props.handleSelectReview(index)
    }

    render() {
        return(
            <View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={['レビューを修正', 'レビューを削除', 'キャンセル']}
                    cancelButtonIndex={2}
                    onPress={(index) =>  this.handleSelectReview(index) }
                />
                <ButtonCarpon
                              onPress={()=> this.showActionSheet()}
                              style={{
                                  borderColor: color.inActive,
                                  borderWidth: 1,
                                  borderRadius: 2,
                                  width: 90,
                                  height: 30,
                                  padding: 0,
                                  alignItems: 'center',
                                  alignContent: 'center',
                                  backgroundColor: '#FFFFFF'
                              }}>
                    <SvgImage
                        source={() => SvgViews.IconEdit({fill: color.inActive, height: 10, width: 10})}
                        style={{bottom: 1}}
                    />
                    <Text
                        style={{
                            color: '#E5E5E5',
                            padding: 0,
                            margin: 0,
                            paddingLeft: 10,
                            flex: 0,
                            fontSize: 10,
                            fontWeight: 'bold'
                        }}>編集する
                    </Text>
                </ButtonCarpon>
            </View>
        )
    }
}
