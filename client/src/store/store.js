import Vue from "vue";
import Vuex from "vuex";
import app from "../main";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    dtLanguages: {},
    isLoading: false,
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.isLoading = payload;
    },
    SET_LANG(state, payload) {
      app.$i18n.locale = payload;
      state.dtLanguages = app.$i18n.t("datatables");
    },
  },
  actions: {
    setLoading({ commit }, payload) {
      commit("SET_LOADING", payload);
    },
    setLang({ commit }, payload) {
      commit("SET_LANG", payload);
    },
  },
});

export default store;
