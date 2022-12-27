import {GET_CAR, GET_RECALL, UPDATE_GRADE, GET_CAR_FAILED, GET_CAR_PRICE_ESTIMATE, GET_CAR_SELL_ESTIMATE} from "../actions/getCar";
import {
    UPDATE_OIL, UPDATE_MILEAGE, UPDATE_LICENSE, GET_CAMPAIGN,
    GET_MILEAGE, CONFIRM_RECALL, UPDATE_INSURANCE, UPDATE_CAR, UPDATE_TIRE, NAVIGATE_SUCCESS,
    UPDATE_CAR_IMAGE, UNCONFIRM_RECALL, UPDATE_CAR_LOOKUP, REMOVE_MILEAGE, UPDATE_ADVERTISING, GET_CAMPAIGN_FAIL
} from "../actions/myCarAction";
import {GET_LIST_STORES} from "../../Inspection/actions/inspectionAction";
import {REMOVE_CAR} from "../../../FirstLoginPhase/actions/registration";

const initialState = {
    myCarInformation: {
        PriceMin: 0
    },
    recall: [],
    getCar: false,
    updatedOil: false,
    updatedMileage: false,
    updatedLicense: false,
    confirmedRecall: false,
    updatedInsurance: false,
    updateInsuranceReady: true,
    updatedCar: false,
    totalUnConfirm: 0,
    updateTireReady: true,
    updatedTire: false,
    updateLicenseReady: true,
    updateMileageReady: true,
    updateOilReady: true,
    updateCarReady: true,
    removeMileageReady: true,
    updateGradeReady: true,
    oilRecordsHistory: [],
    carPriceEstimation: {},
    carSellEstimation: {},
    advertising: {
        loading: false,
        data: []
    },
    campaign: {
        campaigns: {},
        default: {
            campaign: {
                banner: "https://campaign.stg.carpon.jp/banner/default.png",
                'campaign-id': "campaign-default",
                end: "",
                entry: "https://campaign.stg.carpon.jp/default/",
                start: ""
            }
        }
    }
};

export default function carInformationReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_OIL_RECORDS':
            return {
                ...state,
                oilRecordsData: action.records,
                oilRecordsHistory: [action.records, ...state.oilRecordsHistory]
            };

        case GET_CAR :
            return {
                ...state,
                myCarInformation: {
                    ...state.myCarInformation,
                    ...action.myCarInformation,
                },
                getCar: true
            };

        case GET_CAR_FAILED:
            return {
                ...state,
                myCarInformation: []
            };

        case UPDATE_GRADE:
            return {
                ...state,
                updateGradeReady: true,
                myCarInformation: {
                    ...state.myCarInformation,
                    ...action.grade,
                }
            };
        case 'UPDATE_GRADE_$PROGRESS':
            return {
                ...state,
                updateGradeReady: false
            };

        case 'UPDATE_GRADE_FAILED':
            return {
                ...state,
                updateGradeReady: true
            };

        case 'UPDATE_TIRE_$PROGRESS':
            return {
                ...state,
                updateTireReady: false,
            };

        case 'UPDATE_TIRE_FAILED':
            return {
                ...state,
                updateTireReady: true,
            };

        case UPDATE_TIRE:
            return {
                ...state,
                myCarInformation: {...state.myCarInformation, ...action.tire},
                updateTireReady: true,
                updatedTire: true
            };

        case NAVIGATE_SUCCESS:
            return {
                ...state,
                [action.key]: false
            };

        case GET_RECALL:
            return {
                ...state,
                recall: action.recall,
                totalUnConfirm: action.recall.length - action.totalConfirm
            };

        case GET_CAR_PRICE_ESTIMATE:
            return {
                ...state,
                carPriceEstimation: action.carPriceEstimation
            };

        case GET_CAR_SELL_ESTIMATE:
            return {
                ...state,
                carSellEstimation: action.carSellEstimation
            };

        case GET_MILEAGE:
            return {
                ...state,
                mileageChangeHistory: action.mileageHistory
            };

        case CONFIRM_RECALL:
            return {
                ...state,
                confirmedRecall: true
            };

        case UNCONFIRM_RECALL:
            return {
                ...state,
                confirmedRecall: true
            };

        case UPDATE_INSURANCE:
            return {
                ...state,
                updateInsuranceReady: true,
                updatedInsurance: true
            };

        case 'UPDATE_INSURANCE_$PROGRESS':
            return {
                ...state,
                updateInsuranceReady: false
            };

        case 'UPDATE_INSURANCE_FAILED':
            return {
                ...state,
                updateInsuranceReady: true,
            };

        case UPDATE_LICENSE:
            return {
                ...state,
                updatedLicense: true,
                updateLicenseReady: true
            };

        case 'UPDATE_LICENSE_$PROGRESS':
            return {
                ...state,
                updateLicenseReady: false
            };

        case 'UPDATE_LICENSE_FAILED':
            return {
                ...state,
                updateLicenseReady: true,
            };

        case UPDATE_MILEAGE:
            return {
                ...state,
                updatedMileage: true,
                updateMileageReady: true
            };

        case 'UPDATE_MILEAGE_$PROGRESS':
            return {
                ...state,
                updateMileageReady: false
            };

        case 'UPDATE_MILEAGE_FAILED':
            return {
                ...state,
                updateMileageReady: true,
            };

        case REMOVE_MILEAGE:
            return {
                ...state,
                removeMileageReady: true,
            };

        case 'REMOVE_MILEAGE_$PROGRESS':
            return {
                ...state,
                removeMileageReady: false
            };

        case 'REMOVE_MILEAGE_FAILED':
            return {
                ...state,
                removeMileageReady: true
            };

        case UPDATE_OIL:
            return {
                ...state,
                updatedOil: true,
                updateOilReady: true
            };

        case 'UPDATE_OIL_$PROGRESS':
            return {
                ...state,
                updateOilReady: false
            };

        case 'UPDATE_OIL_FAILED':
            return {
                ...state,
                updateOilReady: true
            };

        case UPDATE_CAR:
            return {
                ...state,
                updatedCar: true,
                updateCarReady: true
            };

        case 'UPDATE_CAR_$PROGRESS':
            return {
                ...state,
                updateCarReady: false
            };

        case 'UPDATE_CAR_FAILED':
            return {
                ...state,
                updateCarReady: true
            };

        case UPDATE_CAR_IMAGE:
            return {
                ...state,
            };

        case UPDATE_CAR_LOOKUP:
            return {
                ...state,
                myCarInformation: {
                    ...state.myCarInformation,
                    ...action.myCarInformation
                }
            };
        case 'UPDATE_ADVERTISING_$PROGRESS':
            return {
                ...state,
                advertising: {
                    ...state.advertising,
                    loading: true
                }
            };
        case 'UPDATE_ADVERTISING_FAILED':
            return {
                ...state,
                advertising: {
                    ...state.advertising,
                    loading: false
                }
            };
        case UPDATE_ADVERTISING:
            return {
                ...state,
                advertising: {
                    loading: false,
                    data: action.advertising
                }
            };

        case GET_LIST_STORES:
            return {
                ...state,
                myCarInformation: {
                    ...state.myCarInformation,
                    PriceMin: action.PriceMin,
                    IndexPriceMin: action.IndexPriceMin
                },
            };

        case REMOVE_CAR:
            return {
                ...state,
                myCarInformation: {
                    maker_name: '',
                    car_name: '',
                    carType: NaN,
                    grade_name: '',
                    status: null
                },
            };

        case GET_CAMPAIGN:
            return {
                ...state,
                campaign: action.response
            };

        case GET_CAMPAIGN_FAIL:
            return {
                ...state,
                campaign: initialState.campaign
            };

        default :
            return state
    }
}
