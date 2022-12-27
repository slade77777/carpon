import {Platform} from 'react-native';

export default {
    fontStyle: {
        fontFamily: Platform.OS === 'ios' ? 'SF-Pro-Text-Regular' : 'NotoSansCJKjp-Regular'
    },
    backgroundColor : '#FFFFFF',
    backgroundHeader : {
        backgroundColor: '#707070',
        height : 60
    },
    bodyScreen : {
        backgroundColor: '#FFFFFF',
        padding: 30,
        height: '100%',
        justifyContent: 'space-between',
    }
};
