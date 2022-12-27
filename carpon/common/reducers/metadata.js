import {
    ANSWER_PROFILE_OPTIONS, CHANGE_SCREEN_NUMBER, CHANGE_TAB,
    LOAD_REWARD,
    NOTIFY_METADATA_BEFORE_LOAD,
    RESET_ANSWER, RESET_TAB, SET_CURRENT_SCREEN,
    UPDATE_METADATA
} from "../actions/metadata";
import {GET_INSURANCE_PROFILE} from "../../Home/Insurance/action/InsuranceAction";

const defaultAnswer = {
    "accident_coefficient_applied_term": null,
    "guaranteed_drivers": '0',
    "spouse_living": null,
    "spouse_birthday": null,
    "color_of_driver_license": null,
    "number_of_children_driver": null,
    "first_child_driver_gender": null,
    "second_child_driver_gender": null,
    "third_child_driver_gender": null,
    "fourth_child_driver_gender": null,
    "first_child_driver_marital_status": null,
    "second_child_driver_marital_status": null,
    "third_child_driver_marital_status": null,
    "fourth_child_driver_marital_status": null,
    "first_child_driver_living": null,
    "second_child_driver_living": null,
    "third_child_driver_living": null,
    "fourth_child_driver_living": null,
    "first_child_driver_livinghood": null,
    "second_child_driver_livinghood": null,
    "third_child_driver_livinghood": null,
    "fourth_child_driver_livinghood": null,
    "first_child_driver_birthday": null,
    "second_child_driver_birthday": null,
    "third_child_driver_birthday": null,
    "fourth_child_driver_birthday": null,
    "number_of_familiy_driver": null,
    "first_family_driver_gender": null,
    "second_family_driver_gender": null,
    "third_family_driver_gender": null,
    "fourth_family_driver_gender": null,
    "first_family_driver_type": null,
    "second_family_driver_type": null,
    "third_family_driver_type": null,
    "fourth_family_driver_type": null,
    "first_family_driver_birthday": null,
    "second_family_driver_birthday": null,
    "third_family_driver_birthday": null,
    "fourth_family_driver_birthday": null,
    "youngest_driver_age": null,
    "insurance_company": null,
    "insurance_nonfleet_grade": null,
    "insurance_expiration_date": null,
    "insurance_car_owner_change": null,
    "insurance_car_owner": null,
    "purpose_of_use": null,
    "driving_area": null,
    "yearly_mileage_plan": null,
    "対人賠償保険": null,
    "対物賠償保険": null,
    "人身傷害保険": null,
    "車両保険": null,
    "弁護士費用補償特約": null,
    "estimation_type": null
};

const defaultMetadata = {
    branches: [],
    ready: true,
    profileOptions: {},
    answers: {
        ...defaultAnswer
    },
    reward: {
        regular: [],
        gold: [],
        platinum: []
    },
    scoreScreenTabNumber: 0,
    rank: 0,
    screenNumber: 0,
    currentScreen: null
};

export default (state = defaultMetadata, action) => {

    switch (action.type) {
        case UPDATE_METADATA:
            let profileOptions = action.metadata.profileOptions;
            if (profileOptions.accident_coefficient_applied_term) {
                profileOptions.accident_coefficient_applied_term = profileOptions.accident_coefficient_applied_term.filter(answer => !!answer.nttif_code)
            }
            return {
                ...state,
                branches: action.metadata.branches,
                profileOptions: {
                    ...state.profileOptions,
                    ...profileOptions,
                },

                ready: true
            };

        case NOTIFY_METADATA_BEFORE_LOAD:
            return {
                ...state,
                ready: false
            };

        case ANSWER_PROFILE_OPTIONS:
            return {
                ...state,
                answers: {
                    ...state.answers,
                    ...action.answer
                }
            };
        case RESET_ANSWER:
            return {
                ...state,
                answers: {
                    ...defaultAnswer
                }
            };

        case GET_INSURANCE_PROFILE :
            return {
                ...state,
                answers: {
                    ...state.answers,
                    ...action.bodyRequest
                }
            };

        case LOAD_REWARD:
            return {
                ...state,
                reward: action.reward
            };

        case RESET_TAB:
            return {
                ...state,
                scoreScreenTabNumber: 0,
                rank: 0
            };

        case CHANGE_TAB:
            return {
                ...state,
                scoreScreenTabNumber: action.tab,
                rank: action.rank ? action.rank : 0
            };

        case CHANGE_SCREEN_NUMBER:
            return {
                ...state,
                screenNumber: action.number
            };

        case SET_CURRENT_SCREEN:
            return {
                ...state,
                currentScreen: action.currentScreen
            };

        default:
            return state
    }
};
