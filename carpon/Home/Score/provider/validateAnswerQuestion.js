export default class validateAnswerQuestion {

    constructor(question) {
        this.question = question
    }

    get validate() {
        const listAnswer = this.question.answers.filter(answer => answer.checked);
        if (listAnswer.length) {
            const answer = listAnswer[0];
            switch (this.question.type) {
                case 'single_choice' :
                    return this.questionSingleChoice(answer);
                case  'single_singleInputField' :
                    return this.questionTypeSingleInputField(answer);
                case 'single_selectBox' :
                    return this.questionTypeSingleSelectBox(answer);
                default :
                    return this.questionDefault(answer)
            }
        } else {
            return false;
        }
    }

    questionTypeSingleSelectBox(answer) {
        return answer.type === 'selectBox_group' ? !answer.data.filter(result => !result.value).length : true;
    }

    questionTypeSingleInputField(answer) {
        return answer.type === 'input' ? !!answer.value.length : true;
    }

    questionDefault() {
        return true;
    }

    questionSingleChoice() {
        return true;
    }
}