import Apis from "./apis";

export default {
    getListAirDates(parameters) {
        return Apis("GET", '/airdates', {
            params: {
                season: parameters.season,
            }
        });
    },
    checkAnswer(body) {
        return Apis("POST", "/check-answers", body);
    },
    getQuestions(parameters) {
        return Apis("GET", "/questions", {
            params: {
                showNum: parameters.showNum,
                round: parameters.round
            }
        });
    }
};
