export default class SurveyService {

    constructor(axios) {
        this.axios = axios;
    }

    getListSurvey() {
        return this.axios.get('/survey').then(response => response.data)
    }

    getDetailSurvey(idSurvey) {
        return this.axios.get(`/survey/${idSurvey}`).then(response => response.data)
    }

    getDetailQuestion(idSurvey, idQuestion) {
        return this.axios.get(`/survey/group/${idSurvey}/question/${idQuestion}`).then(response => response.data)
    }

    getScoreHistory(){
        return this.axios.get('/record/score').then(response => response.data);
    }

    getDataApiQuestion(url, make) {
        return this.axios.get(url).then(response => {
            return response.data.map(result => ({
                ...result,
                value: result[make],
                label: result[make],
            }))
        })
    }

    loadReward() {
        return this.axios.get('/user/reward').then(response => response.data)
    }

    answerSurvey(survey) {
        return this.axios.post('/answer-survey', {survey}).then(response => response.data)
    }

    answerQuestion(question) {
        return this.axios.post(`/survey/answer`, {
            question_id: question.id,
            answer: question
        }).then(response => response.data)
    }
}