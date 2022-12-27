import {ANSWER_QUESTION, CHANGE_QUESTION, LOAD_SCORE_HISTORY} from "../actions/actions";

const innitState = {
    listQuestion: [],
    dataSurvey : {
        isLoading : false,
        groups : [],
        groups_question : 0,
        groups_answer : 0,
        score : 0
    },
    loading: false,
    update: false,
    answer: {},
    checked: false,
    answerSuccess: false,
    submit: true,
    updateDataCar: false,
    rawDataSelectCarInfo: null
};

function handleValidateAnswerTypeListQuestion(data) {
    let newData = data.map(question => {
        return handleValidateQuestion(question)
    });
    return !newData.filter(checked => checked === false).length
}


function validateAnswerTypeSingle(answer) {
    switch (answer.type) {
        case 'input' :
            return !!answer.value.length;
        case 'selectBox_group':
            return !answer.data.filter(result => !result.value).length;
        case 'list_question' :
            return handleValidateAnswerTypeListQuestion(answer.data);
        default :
            return true
    }
}

function validateAnswerTypeSelectCar(answer) {
    if(answer.type === 'select_car') {
        return answer.maker.value && answer.maker.name && answer.car_name.value && answer.car_name.name
    }
    return true
}

function validateAnswerTypeInputGroup(answer) {
    if(answer.type === 'input_group') {
        return !answer.options.filter(result => !result.value && !result.notRequired).length;
    }
    return true
}

function handleValidateQuestion(question) {
    const answer = question.answers.find(answer => answer.checked);
    if (answer) {
        if (question.type === 'single_choice') {
            return validateAnswerTypeSingle(answer);
        }

        if(question.type === 'single_choice_select_car') {
            return validateAnswerTypeSelectCar(answer);
        }

        if(question.type === 'single_singleInputField') {
            return validateAnswerTypeSingle(answer)
        }

        if(question.type === 'single_choice_input_group') {
            return validateAnswerTypeInputGroup(answer)
        }

        return true
    } else {
        if(question.type === 'input_text' || question.type === 'select_date') {
            return !question.answers.filter(result => !result.value).length;
        }
        return false
    }
}

export default function answerSurveyReducer(state = innitState, action) {
    switch (action.type) {
        case "LOAD_LIST_QUESTION" :
            return {
                ...state,
                listQuestion: action.listQuestion,
                updated: true,
                loading: false
            };

        case 'LOADED_LIST_QUESTION' :
            return {
                ...state,
                updated: true,
            };

        case  'LOAD_LIST_QUESTION_PROCESS' :
            return {
                ...state,
                updated: false,
                loading: true
            };

        case CHANGE_QUESTION :
            return {
                ...state,
                answer: action.answer,
                checked: handleValidateQuestion(action.answer),
                answerSuccess: false,
                updateDataCar: false,
                rawDataSelectCarInfo: null
            };

        case 'ANSWER_QUESTION_PROCESS':
            return {
                ...state,
                loading:true
            };

        case ANSWER_QUESTION :
            return {
                ...state,
                listQuestion: [...action.listQuestion],
                answerSuccess: true,
                submit: true,
                loading: false
            };

        case "RESET_STATE_LIST_QUESTION" :
            return {
                ...state,
                updated: false,
                answer: {},
                checked: false,
                loading: false
            };

        case 'GET_SURVEY_CAR_INFO':
            return {
                ...state,
                rawDataSelectCarInfo: {
                    ...action.carInfo,
                    questionId : action.questionId
                },
                updateDataCar: true
            };

        case 'ANSWERING':
            return {
                ...state,
                answering: {
                    surveyId: action.surveyId,
                    status: true
                }
            };

        case 'ANSWER_SUCCESS':
            return {
                ...state,
                answering: {
                    ...state.answering,
                    status: false,
                }
            };

        case "LOAD_LIST_SURVEY" :
            return {
                ...state,
                dataSurvey: {
                    isLoading : true,
                    ...action.data
                }
            };

        case LOAD_SCORE_HISTORY:
            return {
                ...state,
                scoreHistory: action.scoreHistory
            };

        default :
            return state
    }
}
