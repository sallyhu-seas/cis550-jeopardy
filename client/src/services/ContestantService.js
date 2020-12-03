import Apis from "./apis";

export default {
    getTopWinnersByOccupation(parameters) {
        return Apis("GET", '/winners-occupation', {
            params: {
                take: parameters.take,
            }
        });
    },
    getTopWinnersByState(parameters) {
        return Apis("GET", '/winners-state', {
            params: {
                take: parameters.take,
            }
        });
    },
    getConfigurations() {
        return Apis("GET", '/configurations');
    },
    getTopWinnersByTopOccupation() {
        return Apis("GET", '/winners-top-occupations');
    },
    getDateDiffs() {
        return Apis("GET", '/days-first-loss-first-win');
    },
};
