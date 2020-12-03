import Apis from "./apis";

export default {
    getList(parameters) {
        return Apis("GET", '/database', {
            params: {
                state: parameters.state,
                season: parameters.season,
                airDate: parameters.airDate,
                isWinner: parameters.isWinner,
                skip: parameters.skip,
                take: parameters.take,
            }
        });
    },
    getListAirDates(parameters) {
        return Apis("GET", '/airdates', {
            params: {
                season: parameters.season,
            }
        });
    },
};
