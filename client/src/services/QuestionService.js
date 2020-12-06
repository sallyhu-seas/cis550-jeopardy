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

    getQuestionsFromTopCategoriesOfTopAnswers() {
        return Apis("GET", '/get-question-top-category-top-answer');
    },

    getConfigurations() {
        return Apis("GET", '/configurations');
    },
};
