import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {SvgViews, SvgImage} from "../../../../components/Common/SvgImage";
import ActionSheet from 'react-native-actionsheet';

export class ThreeDots extends Component {

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
                <TouchableOpacity style={{padding: 5}} onPress={()=> this.showActionSheet()}>
                    <SvgImage source={SvgViews.Anything}/>
                </TouchableOpacity>
            </View>
        )
    }
}