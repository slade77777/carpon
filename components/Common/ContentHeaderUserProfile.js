import React , {Component} from 'react';
import {Text, View} from "react-native";
import LabelCertification from "./LabelCertification";
import momentJA from "../../carpon/services/momentJA";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {MemberRank} from "./UserProfileComponent";

export default class ContentHeaderUserProfile extends Component {

    getUserLabel() {
        const {nick_name, first_name, last_name, email} = this.props.sender;
        if (nick_name) {
            return nick_name;
        } else if (first_name && last_name) {
            return last_name + ' ' + first_name;
        } else {
            return email;
        }
    }

    render() {
        const {car_name, maker_name, certificate} = this.props.sender;
        const userLabel = this.getUserLabel();
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/*<MemberRank/>*/}
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginRight: wp('3%'),
                        marginLeft: wp('3%'),
                    }}>{userLabel}
                    </Text>
                    {
                        certificate && <LabelCertification/>
                    }
                    {/*{*/}
                        {/*!this.props.isComment && <Text style={{fontSize: 12}}>{momentJA(this.props.date).fromNow()}</Text>*/}
                    {/*}*/}
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 12}}>
                        {`${(maker_name ? ((car_name && car_name.substring(0 ,maker_name.length) === maker_name) ? '' : maker_name) : '')}${car_name ? car_name : ''} + ''オーナー'`}
                    </Text>
                </View>
            </View>
        )
    }
}
