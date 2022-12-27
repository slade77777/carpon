import Config from 'react-native-config';

const nakedFlow = [
    {
        doneAction: 'VERIFY_CODE_SUCCESS',
        nextScreen: () => 'CarType',
        action: 'navigate'
    },
    {
        doneAction: 'REGISTER_CAR_OUT_OF_WORKING_TIME',
        nextScreen: () => 'AuthenticationScreen',
        action: 'clear'
    },
    {
        doneAction: 'REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE',
        nextScreen: () => 'UpdateCarInfo',
        action: 'clear',
        params: () => {
            return {switchCar: true}
        }
    },
    {
        doneAction: 'REGISTER_CAR_PROFILE_LOADED',
        nextScreen: () => 'LoadingCarPlate',
        action: 'clear'
    },
    {
        doneAction: 'REGISTER_CAR_PROFILE_UPDATED',
        nextScreen: (profile) => {
            return profile.isScanByQr ? 'LoadedCarAnimation' : 'ConfirmCarInfo'
        },
        action: 'clear'
    },
    {
        doneAction: 'PENDING_SMALL_CAR',
        nextScreen: () => 'LoadingCarPlate',
        action: 'clear'
    },
    {
        doneAction: 'REGISTER_CAR_PROFILE_CONFIRMED',
        nextScreen: (profile) => {
            return profile.userProfile.confirmed ? 'SplashScreen' : 'AuthenticationScreen'
        },
        action: 'clear'
    },
    {
        doneAction: 'REGISTER_USER_PROFILE',
        nextScreen: () => 'EmailConfirmation',
        action: 'navigate'
    },
    {
        doneAction: 'REGISTER_USER_PROFILE_CONFIRMED',
        nextScreen: (profile) => {
            return 'ConfirmedAccountInfo'
            // return profile.carProfile.confirmed ? 'ConfirmedAccountInfo': 'ConfirmedAccountSkipCar'
        },
        action: 'navigate'
    },
    {
        doneAction: 'LOADING_DATA',
        nextScreen: () => 'MainTab',
        action: 'clear',
        params: (profile) => {
            return profile.carProfile.confirmed ? '' : {tabNumber: 2};

        }
    },
    {
        doneAction: 'LOAD_CAR_AFTER_SWITCH',
        nextScreen: () => 'UpdateCarInfoAfterSwitch',
        action: 'navigate',
        params: () => {
            return {switchCar: true}
        }
    },
    {
        doneAction: 'UPDATE_GRADE',
        nextScreen: () => 2,
        action: 'pop'
    },
    // {
    //     doneAction: 'POST_REVIEW',
    //     nextScreen: () => 'MainTab',
    //     action: 'clear',
    //     params: () => {
    //         return {tabNumber: 3}
    //     }
    // },
    {
        doneAction: 'EDIT_REVIEW',
        nextScreen: () => 1,
        action: 'pop'
    },
    {
        doneAction: 'DELETE_REVIEW',
        nextScreen: () => 1,
        action: 'pop'
    },
    {
        doneAction: 'SKIP_CAR',
        nextScreen: () => 'AuthenticationScreen',
        action: 'clear'
    },
    {
        doneAction: 'ADD_CAR_QR',
        nextScreen: () => 'ConfirmCarQRInfo',
        action: 'clear',
        params: () => {
            return {isAddQR: true}
        }
    },
    {
        doneAction: 'OUT_OF_WORKING_TIME',
        nextScreen: () => 'OutOfWorkingTime',
        action: 'clear'
    },
    {
        doneAction: 'LOADING_SUCCESS',
        nextScreen: () => 'UpdateCarInfo',
        params: () => {
            return {action: 'loadingCarOfPlateNumber'}
        },
        action: 'clear'
    },
    {
        doneAction: 'UPDATE_GRADE_LIST',
        nextScreen: () => 'UpdateCarInfo',
        params: () => {
            return {action: 'loadingCarOfPlateNumber'}
        },
        action: 'clear'
    },
    {
        doneAction: 'UPDATE_HOYU_NOT_FOUND',
        nextScreen: () => 'ConfirmCarWrong',
        action: 'clear'
    },
    {
        doneAction: 'LOGIN_EMAIL',
        nextScreen: () => 'VerifyLoginCode',
        action: 'navigate'
    },
    {
        doneAction: 'VERIFY_EMAIL',
        nextScreen: (profile) => {
            return profile.credential.verifyUser ? 'LoginSuccess' : 'ConfirmPhone'
        },
        action: 'navigate'
    },
    {
        doneAction: 'VERIFY_PHONE_NUMBER',
        nextScreen: () => 'LoginSuccess',
        action: 'clear'
    },
];

export default {
    axios: {
        baseURL: Config.API_BASE_URL || 'http://api-carpon-dev.ap-southeast-1.elasticbeanstalk.com/api/v1',
        timeout: 20000,
    },
    auth: {
        asyncStorageKey: 'token'
    },

    registrationFlow: {
        steps: {
            REGISTER_INITIALIZE: 'REGISTER_INITIALIZE',
            REGISTER_PHONE_NUMBER: 'REGISTER_PHONE_NUMBER',
            REGISTER_PHONE_NUMBER_CONFIRM: 'REGISTER_PHONE_NUMBER_CONFIRM',
            REGISTER_CAR_TYPE: 'REGISTER_CAR_TYPE',
            REGISTER_CAR_PROFILE_LOADED: 'REGISTER_CAR_PROFILE_LOADED',
            REGISTER_CAR_PROFILE_UPDATED: 'REGISTER_CAR_PROFILE_UPDATED',
            REGISTER_CAR_PROFILE_CONFIRMED: 'REGISTER_CAR_PROFILE_CONFIRMED',
            REGISTER_USER_PROFILE: 'REGISTER_USER_PROFILE',
            REGISTER_USER_PROFILE_CONFIRMED: 'REGISTER_USER_PROFILE_CONFIRMED',
            REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE: 'REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE',
            LOADING_DATA: 'LOADING_DATA',
            OUT_OF_WORKING_TIME: 'OUT_OF_WORKING_TIME',
            LOADING_SUCCESS: 'LOADING_SUCCESS',
            UPDATE_GRADE_LIST: 'UPDATE_GRADE_LIST',
            SKIP_CAR: 'SKIP_CAR',
            PENDING_SMALL_CAR: 'PENDING_SMALL_CAR',
            UPDATE_GRADE: 'UPDATE_GRADE',
            POST_REVIEW: 'POST_REVIEW',
            EDIT_REVIEW: 'EDIT_REVIEW',
            DELETE_REVIEW: 'DELETE_REVIEW',
            LOGIN_EMAIL: 'LOGIN_EMAIL',
            VERIFY_EMAIL: 'VERIFY_EMAIL',
            VERIFY_PHONE_NUMBER: 'VERIFY_PHONE_NUMBER',
            REGISTER_CAR_OUT_OF_WORKING_TIME: 'REGISTER_CAR_OUT_OF_WORKING_TIME',
        },
        flow: [
            {
                doneAction: 'REGISTER_INITIALIZE',
                nextScreen: (registrationState) => {
                    if (!registrationState.currentStep) {
                        return 'Login'
                    }

                    const step = nakedFlow.find(step => step.doneAction === registrationState.currentStep);

                    return step.nextScreen(registrationState);
                },
                action: 'clear'
            },
            ...nakedFlow
        ]
    },

    interactWithRankActions: [
        'POST_FOLLOW', 'POST_UN_FOLLOW', 'COMMENT', 'LIKE', 'POST_REVIEW', 'DELETE_REVIEW', 'EDIT_REVIEW', 'DELETE_REVIEW_IN_MY_PAGE'
    ],

    debug: process.env.NODE_ENV !== 'production'
}
