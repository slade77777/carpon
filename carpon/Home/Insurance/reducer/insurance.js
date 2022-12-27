import {
    UPDATE_INSURANCE_PROFILE, GET_INSURANCE_PROFILE, UPDATE_INSURANCE_INDIVIDUAL_FAIL
} from "../action/InsuranceAction";
import {images} from "../../../../assets/index";

const companyImages = [ images.sbiCompany, images.mitsuiCompany, images.adultCompany];

const initialState = {
    insuranceInfo: [],
    lowestInsuranceCompany: {},
    createDate: null,
    bodyRequest: {},
    individualResult: true,
    isLoadingInsurance: false
};

function getLowestCompany(insuranceList) {
    let tripCompanyCost = 100000000;
    let lowestInsuranceCompany = {};
    if (insuranceList && insuranceList.length > 0) {
        for (let i = 0; i < insuranceList.length; i++) {
            if (insuranceList[i].response_data && insuranceList[i].response_data.estimation_cost && parseInt(insuranceList[i].response_data.estimation_cost) < tripCompanyCost) {
                tripCompanyCost = parseInt(insuranceList[i].response_data.estimation_cost);
                lowestInsuranceCompany = insuranceList[i].response_data;
                lowestInsuranceCompany.image = companyImages[i];
            }
        }
    }
    return lowestInsuranceCompany;
}

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_INSURANCE_PROFILE  :
            const lowestInsuranceCompany = getLowestCompany(action.result);
            return {
                ...state,
                lowestInsuranceCompany,
                insuranceInfo: action.result,
                createDate: action.createDate,
                individualResult: true,
                isLoadingInsurance: false
            };

        case UPDATE_INSURANCE_INDIVIDUAL_FAIL  :
            return {
                ...state,
                individualResult: false,
                isLoadingInsurance: false
            };

        case GET_INSURANCE_PROFILE  :
            const lowestInsurance = getLowestCompany(action.result);
            return {
                ...state,
                lowestInsuranceCompany : lowestInsurance,
                insuranceInfo: action.result,
                createDate: action.createDate,
                bodyRequest: action.bodyRequest
            };

        case 'SET_LOADING_INSURANCE':
            return {
                ...state,
                isLoadingInsurance: true
            };

        default :
            return state
    }
}
