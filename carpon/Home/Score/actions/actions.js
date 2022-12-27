export const LOAD_SCORE_HISTORY = 'LOAD_SCORE_HISTORY';
export const ANSWER_QUESTION = 'ANSWER_QUESTION';
export const CHANGE_QUESTION = 'CHANGE_QUESTION';

export function loadScoreHistory() {
    return {
        type: LOAD_SCORE_HISTORY
    }
}

export function answerQuestion(question, index) {
    return {
        type: ANSWER_QUESTION,
        question,
        index
    }
}

export function onChangeQuestion(answer) {
    return {
        type: CHANGE_QUESTION,
        answer
    }
}