import {
    ADD_CAR_QR, COME_BACK_REGISTER_CAR, LOAD_CAR, LOAD_CAR_AFTER_SWITCH, LOAD_CAR_FOR_USER_LOGIN,
    LOAD_USER, LOADING_DATA, LOADING_SUCCESS, LOGIN_EMAIL, OUT_OF_WORKING_TIME, PENDING_SMALL_CAR,
    REGISTER_CAR_PROFILE_CONFIRMED, REGISTER_CAR_PROFILE_LOADED, REGISTER_CAR_PROFILE_UPDATED, REGISTER_CAR_TYPE,
    REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE, REGISTER_PLATFORM_NUMBER, REGISTER_USER_PROFILE,
    REGISTER_USER_PROFILE_CONFIRMED, REMOVE_CAR, RESET_LOADING, RESET_STATE, SKIP_CAR,
    SWITCH_CAR, VERIFY_EMAIL, VERIFY_PHONE_NUMBER, UPDATE_APP_VERSION, ACTIVE_LOADING, REGISTER_CAR_OUT_OF_WORKING_TIME,
    UPDATE_GRADE_LIST, CLEAR_CAR_DATA, UPDATE_HOYU_NOT_FOUND, HOYU_NOT_FOUND, HOYU_FOUND, UPDATE_USER_PROFILE
} from "../actions/registration";
import {GET_USER_PROFILE} from '../../Account/actions/accountAction';
import {UPDATE_MILEAGE} from "../../Home/MyCar/actions/myCarAction";
import {GET_LIST_STORES} from "../../Home/Inspection/actions/inspectionAction";
import {GET_CAR, GET_CAR_FAILED} from "../../Home/MyCar/actions/getCar";
import {LOAD_SCORE_HISTORY} from "../../Home/Score/actions/actions";
import {UPDATE_OPT_NEWS} from "../../Home/News/action/newsAction";

const initialState = {
    currentStep: null,
    isScanByQr: false,
    shouldResetQR: false,
    turnOffCamera: false,
    loadingFinish: true,
    isCarLimited: false,
    isSubmitScoreAppFlyer: false,
    isHoyuNotFound: false,
    credential: {
        email: null,
        confirmSMSReady: true,
        RegisterPhoneReady: true,
        token: '',
        phoneNumber: '',
        confirmed: false,
        has_car: false
    },
    userProfile: {
        updateUserReady: true,
        updatedSuccess: false,
        confirmEmailReady: true,
        myProfile: {},
        isFirstTimeOpenNews: true,
        confirmed: false
    },
    carProfile: {
        loading: false,
        carType: NaN,
        waitingCarHOUY: false,
        waitingCarCertification: false,
        profile: {
            maker_name: '',
            car_name: '',
            grade_name: '',
            PriceMin: 0,
            number:'',
            status: null,
            grade_list: [],
            car_name_list: [],
        },
        confirmed: false
    },
    appVersion: '1.0.0'
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'VERIFY_CODE_SUCCESS' :
            return {
                ...state,
                modalStatus: true,
                currentStep: action.type,
                credential: action.credential,
            };

        case REGISTER_CAR_TYPE:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    carType: action.carType
                }
            };

        case REGISTER_CAR_PROFILE_LOADED:
            return {
                ...state,
                isScanByQr: false,
                isCarLimited: action.profile.count_update_car >= 3,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        ...state.carProfile.profile,
                        ...action.profile,
                        status: null
                    }
                },
            };

        case LOADING_SUCCESS:
            return {
                ...state,
                currentStep: action.type,
            };

        case PENDING_SMALL_CAR:
            return {
                ...state,
                currentStep: action.type,
                isScanByQr: false,
                carProfile: {
                    ...state.carProfile,
                    waitingCarHOUY: true,
                    profile: {
                        ...state.carProfile.profile,
                        ...action.profile,
                        status: 'pending'
                    }
                },
            };

        case REGISTER_LOAD_CAR_PROFILE_FROM_CERTIFICATE: {
            return {
                ...state,
                currentStep: action.type,
                isScanByQr: true,
                turnOffCamera: true,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        ...state.carProfile.profile,
                        ...action.profile,
                        status: null
                    },
                },
            }
        }

        case REGISTER_CAR_PROFILE_UPDATED:
            return {
                ...state,
                awaitingCar: false,
                carProfile: {
                    ...state.carProfile,
                    loading: false,
                    confirmed: false,
                    profile: {
                        ...state.carProfile.profile,
                        ...action.carProfile,
                        status: null
                    },
                },
                userProfile: {
                    ...state.userProfile,
                    confirmed: action.carProfile.user_confirm
                }
            };

        case 'REGISTER_CAR_PROFILE_UPDATED_FAILED' :
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    loading: false
                }
            };
        case 'REGISTER_CAR_PROFILE_UPDATED_$PROGRESS' :
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    loading: true
                }
            };

        case REGISTER_CAR_PROFILE_CONFIRMED:
            return {
                ...state,
                currentStep: action.type,
                awaitingCar: false,
                carProfile: {
                    ...state.carProfile,
                    profile: action.profile,
                    confirmed: true
                }
            };

        case 'REGISTER_USER_PROFILE_$PROGRESS':
            return {
                ...state,
                loadingFinish: false,
                userProfile: {
                    ...state.userProfile,
                    updateUserReady: false,
                    updatedSuccess: false,
                }
            };

        case 'REGISTER_USER_PROFILE_FAILED':
            return {
                ...state,
                loadingFinish: true,
                userProfile: {
                    ...state.userProfile,
                    updateUserReady: true,
                    confirmed: false,
                }
            };

        case REGISTER_USER_PROFILE:
            return {
                ...state,
                loadingFinish: true,
                userProfile: {
                    ...state.userProfile,
                    updatedSuccess: true,
                    updateUserReady: true,
                    confirmed: false,
                    myProfile: action.profile
                }
            };

        case 'LOAD_PROFILE__$PROGRESS':
            return {
                ...state,
                ready: false
            };

        case REGISTER_USER_PROFILE_CONFIRMED:
            return {
                ...state,
                completed: true,
                currentStep: action.type,
                credential: {
                    ...state.credential,
                    token: action.token,
                    loading: false
                },
                userProfile: {
                    ...state.userProfile,
                    confirmed: true,
                }
            };

        case LOADING_DATA:
            return {
                ...state,
                currentStep: action.type,
            };

        case OUT_OF_WORKING_TIME:
            return {
                ...state,
                currentStep: action.type,
                carProfile: {
                    ...state.carProfile,
                }
            };

        case REGISTER_CAR_OUT_OF_WORKING_TIME:
            return {
                ...state,
                currentStep: action.type,
            };

        case REGISTER_PLATFORM_NUMBER:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    profile: action.carProfile,
                    confirmed: true
                }
            };

        case GET_USER_PROFILE:
            return {
                ...state,
                loadingFinish: true,
                userProfile: {
                    ...state.userProfile,
                    updatedSuccess: true,
                    updateUserReady: true,
                    confirmed: true,
                    isFirstTimeOpenNews: !((action.userProfile.optin_news === 0) || (action.userProfile.optin_news === 1)),
                    myProfile: action.userProfile
                },
                carProfile: {
                    ...state.carProfile,
                    waitingCarHOUY: action.userProfile.waiting_catalog,
                    waitingCarCertification: action.userProfile.waiting_certification
                }
            };

        case UPDATE_USER_PROFILE:
            return {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    myProfile: {
                        ...state.userProfile.myProfile,
                        [action.field]: action.value
                    }
                }
            };

        case VERIFY_EMAIL:
            return {
                ...state,
                credential: {
                    ...state.credential,
                    token: action.token,
                    verifyUser: action.verifyUser,
                    loading: false
                }
            };

        case VERIFY_PHONE_NUMBER:
            return {
                ...state,
                credential: {
                    ...state.credential,
                    token: action.token,
                    verifyUser: true,
                    loading: false
                }
            };

        case LOGIN_EMAIL:
            return {
                ...state,
                credential: {
                    ...state.credential,
                    email: action.loginInformation.email,
                    loading: false
                }
            };

        case 'LOGIN_ACTION_$PROGRESS':
            return {
                ...state,
                credential: {
                    ...state.credential,
                    loading: true
                }
            };

        case 'LOGIN_ACTION_DONE':
            return {
                ...state,
                credential: {
                    ...state.credential,
                    loading: false
                }
            };

        case RESET_STATE:
            return {
                ...state,
                credential: {
                    ...state.credential,
                    loading: false,
                }
            };

        case LOAD_USER:
            return {
                ...state,
                isSubmitScoreAppFlyer: action.isSubmitScoreAppFlyer,
                userProfile: {
                    ...state.userProfile,
                    updatedSuccess: true,
                    updateUserReady: true,
                    confirmed: true,
                    myProfile: action.profile
                }
            };
        case LOAD_CAR:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    profile: action.carProfile,
                    confirmed: true
                }
            };
        case RESET_LOADING:
            return {
                ...state,
                loadingFinish: true
            };

        case ACTIVE_LOADING:
            return {
                ...state,
                loadingFinish: false
            };

        case COME_BACK_REGISTER_CAR :
            return {
                ...state,
                currentStep: 'VERIFY_CODE_SUCCESS',
                carProfile: {
                    ...initialState.carProfile,
                },
            };
        case UPDATE_MILEAGE :
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        ...state.carProfile.profile,
                        mileage_kiro: action.params.mileage
                    }
                }
            };
        case SWITCH_CAR:
            return {
                ...state,
                isScanByQr: true,
                carProfile: {
                    ...state.carProfile,
                    switchCar: true
                },
            };

        case LOAD_CAR_AFTER_SWITCH:
            return {
                ...state,
                turnOffCamera: true,
                carProfile: {
                    ...state.carProfile,
                    profile: action.profile
                },
            };

        case ADD_CAR_QR:
            return {
                ...state,
                turnOffCamera: true,
                carProfile: {
                    ...state.carProfile,
                    profile: action.carProfile
                },
            };

        case SKIP_CAR:
            return {
                ...state,
                currentStep: action.type
            };

        case REMOVE_CAR:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        maker_name: '',
                        car_name: '',
                        carType: NaN,
                        grade_name: '',
                        status: null
                    },
                },
            };

        case CLEAR_CAR_DATA:
            return {
                ...state,
                carProfile: initialState.carProfile
            }

        case LOAD_CAR_FOR_USER_LOGIN:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    carType: action.carProfile ? action.carProfile.type : NaN,
                    confirmed: true,
                    profile: {
                        ...action.carProfile,
                        status: null
                    }
                }
            };

        case 'VERIFY_DEVICE_SUCCESS' :
            return {
                ...state,
                credential: action.data
            };

        case 'SKIP_CAR_WHEN_LIMIT':
            return {
                ...state,
                currentStep: 'SKIP_CAR',
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        maker_name: '',
                        car_name: '',
                        carType: NaN,
                        grade_name: '',
                        status: null
                    },
                },
            };

        case GET_CAR:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        ...state.carProfile.profile,
                        ...action.myCarInformation
                    }
                },
            };

        case GET_CAR_FAILED:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        maker_name: '',
                        car_name: '',
                        carType: NaN,
                        grade_name: '',
                        status: null
                    },
                },
            };

        case 'IVR_TIMEOUT':
            return {
                ...state
            };
        case 'IVR_FAILED':
            return {
                ...state
            };

        //CarInspection

        case GET_LIST_STORES:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        ...state.carProfile.profile,
                        PriceMin: action.PriceMin,
                        IndexPriceMin: action.IndexPriceMin,
                    }
                },

            };

        //score

        case LOAD_SCORE_HISTORY:
            return {
                ...state,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        ...state.carProfile.profile,
                        total_score: action.scoreHistory[0] ? action.scoreHistory[0].score : 0
                    }
                },
            };

        case UPDATE_OPT_NEWS:
            return {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    isFirstTimeOpenNews: false
                }
            };

        case 'RESET_CAMERA_STATE':
            return {
                ...state,
                turnOffCamera: false
            };

        case 'RESET_QR_CODE':
            return {
                ...state,
                shouldResetQR: true
            };

        case 'RESET_QR_STATE':
            return {
                ...state,
                shouldResetQR: false
            };

        case 'RESET_MODAL_STATUS':
            return {
                ...state,
                modalStatus: false
            };

        case UPDATE_APP_VERSION:
            return {
                ...state,
                appVersion: action.version
            };

        case UPDATE_GRADE_LIST: {
            return {
                ...state,
                currentStep: action.type,
                carProfile: {
                    ...state.carProfile,
                    profile: {
                        ...state.carProfile.profile,
                        grade_list: action.data.grade_list,
                        car_name_list: action.data.car_name_list
                    }
                }
            }
        }

        case UPDATE_HOYU_NOT_FOUND: {
            return {
                ...state,
                isHoyuNotFound: false,
                currentStep: action.type,
                carProfile: {
                    ...state.carProfile,
                    profile: action.carProfile
                }
            }
        }

        case HOYU_NOT_FOUND: {
            console.log(345);
            return {
                ...state,
                isHoyuNotFound: true
            }
        }

        case HOYU_FOUND: {
            return {
                ...state,
                isHoyuNotFound: false
            }
        }

        default:
            return state
    }
};
