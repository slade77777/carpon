import {surveyService}                       from "../../../services";
import {ANSWER_QUESTION, LOAD_SCORE_HISTORY} from "../actions/actions";
import { submitAppFlyer }                    from "../../../../App";

const answerSurveyMiddleware = store => next => action => {

    switch (action.type) {

        case 'LOAD_LIST_QUESTION' :
            store.dispatch({
                type: 'LOAD_LIST_QUESTION_PROCESS'
            });
            return surveyService.getDetailSurvey(action.idSurvey).then(listQuestion => {
                next({
                    ...action,
                    listQuestion: listQuestion.map(question => {
                        if (question.key_value === 'insurance_car_owner') {
                            console.log(question);
                            question.answer_data.answers = question.answer_data.answers.filter(answer => answer.label !== '純新・複新');
                        }
                        return {
                            ...question,
                            key: `question${question.id}`,
                        }
                    })
                })
            }).finally(() => {
                store.dispatch({
                    type: 'LOADED_LIST_QUESTION'
                })
            });

        case ANSWER_QUESTION:

            store.dispatch({
                type: 'ANSWER_QUESTION_PROCESS'
            });
            let listQuestion = store.getState().answerSurvey.listQuestion;
            listQuestion[action.index] = action.question;
            return surveyService.answerSurvey(listQuestion)
                .then(() => {
                    return next({...action, listQuestion: listQuestion});
                })
                .catch(() => {
                    return next({...action, listQuestion: listQuestion});
                });

        case "LOAD_LIST_SURVEY" :
            const currentUser = store.getState().registration.userProfile.myProfile;
            const surveyData = store.getState().answerSurvey.dataSurvey;
            return surveyService.getListSurvey().then(listSurvey => {
                const previousAnswerNumber = surveyData.groups_answer;
                if (previousAnswerNumber < 30 && listSurvey.groups_answer >= 30) {
                    submitAppFlyer('ENQ_30_UP',
                        {
                            id: currentUser.id,
                            email: currentUser.email,
                            answer_number: listSurvey.groups_answer
                        },
                        currentUser.id
                    );
                }
                next({
                    data: listSurvey,
                    ...action
                });
            });


        case 'ANSWER_SUCCESS' :
            store.dispatch({
                type: 'LOAD_LIST_QUESTION',
                idSurvey: action.surveyId
            });
            return next({...action});

        case LOAD_SCORE_HISTORY :
            return surveyService.getScoreHistory()
                .then(response => {
                    next({...action, scoreHistory: response})
                })
                .catch(error => console.log(error));
        default :
            next(action)
    }

};

export default answerSurveyMiddleware;
