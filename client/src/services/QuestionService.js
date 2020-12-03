import Apis from "./apis";

export default {
    getTopQuestionsByCategory(parameters) {
        return Apis("GET", '/questions-category', {
            params: {
                take: parameters.take,
            }
        });
    },
    getTopQuestionsByAnswer(parameters) {
        return Apis("GET", '/questions-answer', {
            params: {
                take: parameters.take,
            }
        });
    },
    getConfigurations() {
        return Apis("GET", '/configurations');
    },
};
