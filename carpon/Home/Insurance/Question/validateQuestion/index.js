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


export function handleValidateQuestion(question) {
    const listAnswer = question.answers.filter(answer => answer.checked);
    if (listAnswer.length) {
        if (question.type === 'single_choice') {
            const answer = listAnswer[0];
            return validateAnswerTypeSingle(answer);
        } else {
            return true
        }
    } else {
        return false
    }
}